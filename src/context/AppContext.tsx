import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { buildMatches } from "../utils/matching";
import { sampleProfiles } from "../data/mockProfiles";
import type {
  MatchResult,
  NextBestAction,
  PreferenceSummary,
  RecommendationMode,
  StudentLevel,
  StudentPreferences,
  StudentProfile,
  WorkspaceSettings,
  WorkspaceState
} from "../types/app";
import {
  getMatchmakingStrength,
  getPreferenceCompletion,
  getPreferenceSummary,
  mapStatusToEligibilityRange
} from "../utils/preferences";

const STORAGE_KEY = "scholarship-connect-ai.workspace.v1";

const defaultSettings: WorkspaceSettings = {
  compactMode: false,
  notificationsEnabled: true,
  assistantTone: "encouraging"
};

const defaultState: WorkspaceState = {
  profiles: sampleProfiles,
  activeProfileId: sampleProfiles[0].id,
  mode: "recommended",
  focusedScholarshipId: sampleProfiles[0].savedScholarshipIds[0],
  settings: defaultSettings,
  isPremium: false
};

interface AppContextValue {
  state: WorkspaceState;
  currentProfile: StudentProfile;
  currentPreferences: StudentPreferences;
  allMatches: MatchResult[];
  visibleMatches: MatchResult[];
  savedMatches: MatchResult[];
  profileCompletion: number;
  preferenceCompletion: number;
  matchmakingStrength: number;
  preferenceSummary: PreferenceSummary;
  nextBestAction: NextBestAction;
  isPremium: boolean;
  pendingWelcome: boolean;
  dismissWelcome: () => void;
  triggerWelcome: () => void;
  setMode: (mode: RecommendationMode) => void;
  switchProfile: (id: string) => void;
  setFocusedScholarshipId: (id: string) => void;
  updateProfile: (updater: (profile: StudentProfile) => StudentProfile) => void;
  updatePreferences: (updater: (preferences: StudentPreferences) => StudentPreferences) => void;
  updateSelectedLevels: (levels: StudentLevel[]) => void;
  toggleSaveScholarship: (scholarshipId: string) => void;
  togglePlanItem: (itemId: string) => void;
  addPlanItem: (scholarshipId: string, title: string, description: string, impact: string) => void;
  updateDocumentStatus: (documentId: string, status: StudentProfile["documents"][number]["status"], score?: number) => void;
  addApplication: (scholarshipId: string, checklist: string[]) => void;
  updateApplicationStage: (applicationId: string, stage: StudentProfile["applications"][number]["stage"]) => void;
  addAssistantMessage: (message: StudentProfile["assistantMessages"][number]) => void;
  markNotificationRead: (notificationId: string) => void;
  updateSettings: (updates: Partial<WorkspaceSettings>) => void;
  upgradeToPremium: () => void;
  resetWorkspace: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const getProfileCompletion = (profile: StudentProfile) => {
  const checks = [
    profile.personal.name,
    profile.personal.nationality,
    profile.personal.currentCountry,
    profile.personal.targetCountry,
    profile.personal.preferredIntakeYear,
    profile.education.currentQualification,
    profile.education.boardOrCurriculum,
    profile.education.subjects.length > 0,
    profile.courseGoals.preferredDegreeLevel,
    profile.courseGoals.preferredSubject,
    profile.courseGoals.preferredCountries.length > 0,
    profile.financial.familyIncomeRange,
    profile.achievements.length > 0,
    profile.documents.some((doc) => doc.status === "Uploaded"),
    profile.testScores.ielts || profile.testScores.toefl || profile.testScores.sat || profile.testScores.gre
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const getNextBestAction = (
  profile: StudentProfile,
  matches: MatchResult[],
  preferenceCompletion: number
): NextBestAction => {
  const completion = getProfileCompletion(profile);
  if (completion < 70) {
    return {
      label: "Complete profile builder",
      description: "Your match engine gets better when your course goals, funding needs, and test scores are complete.",
      href: "/profile-builder"
    };
  }

  if (preferenceCompletion < 70) {
    return {
      label: "Tune preference builder",
      description: "Refine goals, funding limits, flexibility, and weights so the matchmaking engine can rank better-fit scholarships.",
      href: "/profile-builder"
    };
  }

  const missingDoc = profile.documents.find((doc) => doc.status !== "Uploaded");
  if (missingDoc) {
    return {
      label: `Fix ${missingDoc.label}`,
      description: "Document readiness is one of the fastest ways to unlock higher-fit scholarships.",
      href: "/document-vault"
    };
  }

  const almostEligible = matches.find((item) => item.status === "Almost eligible");
  if (almostEligible) {
    return {
      label: `Improve ${almostEligible.scholarship.name}`,
      description: almostEligible.nextBestAction,
      href: "/improve-plan"
    };
  }

  return {
    label: "Start an application",
    description: "You have scholarships you qualify for now. Move one into your application workflow.",
    href: "/application-builder"
  };
};

const mergePreferences = (
  seedPreferences: StudentPreferences,
  storedPreferences?: Partial<StudentPreferences>
): StudentPreferences => ({
  ...seedPreferences,
  ...storedPreferences,
  weights: {
    ...seedPreferences.weights,
    ...storedPreferences?.weights
  }
});

const mergeProfile = (
  seedProfile: StudentProfile,
  storedProfile?: Partial<StudentProfile>
): StudentProfile => ({
  ...seedProfile,
  ...storedProfile,
  personal: { ...seedProfile.personal, ...storedProfile?.personal },
  education: { ...seedProfile.education, ...storedProfile?.education },
  courseGoals: { ...seedProfile.courseGoals, ...storedProfile?.courseGoals },
  financial: { ...seedProfile.financial, ...storedProfile?.financial },
  testScores: { ...seedProfile.testScores, ...storedProfile?.testScores },
  documents: storedProfile?.documents?.length
    ? (storedProfile.documents as StudentProfile["documents"])
    : seedProfile.documents,
  preferences: mergePreferences(seedProfile.preferences, storedProfile?.preferences),
  savedScholarshipIds: storedProfile?.savedScholarshipIds ?? seedProfile.savedScholarshipIds,
  planItems: storedProfile?.planItems ?? seedProfile.planItems,
  applications: storedProfile?.applications ?? seedProfile.applications,
  notifications: storedProfile?.notifications ?? seedProfile.notifications,
  assistantMessages: storedProfile?.assistantMessages ?? seedProfile.assistantMessages
});

const readStorage = (): WorkspaceState => {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as WorkspaceState;
    const storedProfiles = parsed.profiles ?? [];
    const mergedProfiles = storedProfiles.length
      ? storedProfiles.map((storedProfile) => {
          const seedProfile =
            sampleProfiles.find((profile) => profile.id === storedProfile.id) ?? sampleProfiles[0];
          return mergeProfile(seedProfile, storedProfile);
        })
      : defaultState.profiles;
    const missingSeedProfiles = sampleProfiles.filter(
      (seedProfile) => !mergedProfiles.some((profile) => profile.id === seedProfile.id)
    );

    return {
      ...defaultState,
      ...parsed,
      profiles: [...mergedProfiles, ...missingSeedProfiles],
      settings: { ...defaultSettings, ...parsed.settings }
    };
  } catch {
    return defaultState;
  }
};

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<WorkspaceState>(readStorage);

  useEffect(() => {
    // Future backend integration: replace localStorage persistence with profile sync APIs.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentProfile = useMemo(
    () => state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0],
    [state.activeProfileId, state.profiles]
  );
  const currentPreferences = currentProfile.preferences;

  const allMatches = useMemo(
    () => buildMatches(currentProfile, currentPreferences),
    [currentPreferences, currentProfile]
  );
  const visibleMatches = useMemo(
    () => {
      if (state.mode === "universal") return allMatches;

      const allowedRanges = new Set(currentPreferences.eligibilityRange);
      const minScore =
        currentPreferences.recommendationStyle === "safe"
          ? 56
          : currentPreferences.recommendationStyle === "balanced"
            ? 44
            : 0;

      return allMatches
        .filter((item) => allowedRanges.has(mapStatusToEligibilityRange(item.status)))
        .filter((item) => item.score >= minScore)
        .slice(0, currentPreferences.recommendationStyle === "ambitious" ? 24 : 18);
    },
    [allMatches, currentPreferences, state.mode]
  );

  const savedMatches = useMemo(
    () => allMatches.filter((item) => currentProfile.savedScholarshipIds.includes(item.scholarship.id)),
    [allMatches, currentProfile.savedScholarshipIds]
  );

  const profileCompletion = useMemo(() => getProfileCompletion(currentProfile), [currentProfile]);
  const preferenceCompletion = useMemo(
    () => getPreferenceCompletion(currentPreferences),
    [currentPreferences]
  );
  const matchmakingStrength = useMemo(
    () =>
      getMatchmakingStrength({
        matches: allMatches,
        preferenceCompletion,
        profileCompletion
      }),
    [allMatches, preferenceCompletion, profileCompletion]
  );
  const preferenceSummary = useMemo(
    () => getPreferenceSummary(currentProfile, currentPreferences),
    [currentPreferences, currentProfile]
  );
  const nextBestAction = useMemo(
    () => getNextBestAction(currentProfile, allMatches, preferenceCompletion),
    [allMatches, currentProfile, preferenceCompletion]
  );

  const updateProfile = (updater: (profile: StudentProfile) => StudentProfile) => {
    setState((current) => ({
      ...current,
      profiles: current.profiles.map((profile) =>
        profile.id === current.activeProfileId ? updater(profile) : profile
      )
    }));
  };

  const value: AppContextValue = {
    state,
    currentProfile,
    currentPreferences,
    allMatches,
    visibleMatches,
    savedMatches,
    profileCompletion,
    preferenceCompletion,
    matchmakingStrength,
    preferenceSummary,
    nextBestAction,
    isPremium: state.isPremium ?? false,
    pendingWelcome: state.pendingWelcome ?? false,
    dismissWelcome: () => setState((current) => ({ ...current, pendingWelcome: false })),
    triggerWelcome: () => setState((current) => ({ ...current, pendingWelcome: true })),
    setMode: (mode) => setState((current) => ({ ...current, mode })),
    switchProfile: (id) => setState((current) => ({ ...current, activeProfileId: id })),
    setFocusedScholarshipId: (id) => setState((current) => ({ ...current, focusedScholarshipId: id })),
    updateProfile,
    updatePreferences: (updater) =>
      updateProfile((profile) => ({
        ...profile,
        preferences: updater(profile.preferences)
      })),
    updateSelectedLevels: (levels) =>
      updateProfile((profile) => ({
        ...profile,
        selectedLevels: levels
      })),
    toggleSaveScholarship: (scholarshipId) =>
      updateProfile((profile) => ({
        ...profile,
        savedScholarshipIds: profile.savedScholarshipIds.includes(scholarshipId)
          ? profile.savedScholarshipIds.filter((id) => id !== scholarshipId)
          : [...profile.savedScholarshipIds, scholarshipId]
      })),
    togglePlanItem: (itemId) =>
      updateProfile((profile) => ({
        ...profile,
        planItems: profile.planItems.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        )
      })),
    addPlanItem: (scholarshipId, title, description, impact) =>
      updateProfile((profile) => ({
        ...profile,
        planItems: [
          ...profile.planItems,
          {
            id: `${scholarshipId}-${Date.now()}`,
            scholarshipId,
            title,
            description,
            impact,
            done: false
          }
        ]
      })),
    updateDocumentStatus: (documentId, status, score) =>
      updateProfile((profile) => ({
        ...profile,
        documents: profile.documents.map((document) =>
          document.id === documentId
            ? { ...document, status, score: score ?? document.score, updatedAt: new Date().toISOString().split("T")[0] }
            : document
        )
      })),
    addApplication: (scholarshipId, checklist) =>
      updateProfile((profile) => ({
        ...profile,
        applications: [
          ...profile.applications,
          {
            id: `${scholarshipId}-${Date.now()}`,
            scholarshipId,
            stage: "Preparing documents",
            updatedAt: new Date().toISOString().split("T")[0],
            checklist
          }
        ]
      })),
    updateApplicationStage: (applicationId, stage) =>
      updateProfile((profile) => ({
        ...profile,
        applications: profile.applications.map((application) =>
          application.id === applicationId
            ? { ...application, stage, updatedAt: new Date().toISOString().split("T")[0] }
            : application
        )
      })),
    addAssistantMessage: (message) =>
      updateProfile((profile) => ({
        ...profile,
        assistantMessages: [...profile.assistantMessages, message]
      })),
    markNotificationRead: (notificationId) =>
      updateProfile((profile) => ({
        ...profile,
        notifications: profile.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      })),
    updateSettings: (updates) =>
      setState((current) => ({ ...current, settings: { ...current.settings, ...updates } })),
    upgradeToPremium: () => setState((current) => ({ ...current, isPremium: true })),
    resetWorkspace: () => setState(defaultState)
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};
