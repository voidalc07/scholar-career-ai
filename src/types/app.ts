export type RecommendationMode = "recommended" | "universal";
export type RecommendationStyle = "safe" | "balanced" | "ambitious";
export type CountryFlexibility = "strict" | "similar" | "global";
export type SubjectFlexibility = "exact" | "related" | "open";
export type FundingPreference = "full" | "tuition" | "partial" | "any";
export type EligibilityRange =
  | "Eligible now"
  | "Almost eligible"
  | "Eligible after improvement"
  | "Long-term targets";
export type MaxEffort = "low" | "medium" | "high";
export type DeadlinePreference = "safe" | "urgent" | "longterm";

export type StudentLevel =
  | "Finished high school"
  | "Undergraduate student"
  | "Final year undergraduate"
  | "Graduate applicant"
  | "Master’s applicant"
  | "PhD applicant"
  | "Career switcher"
  | "International student"
  | "Low-income applicant"
  | "First-generation student";

export type EligibilityStatus =
  | "Eligible now"
  | "Almost eligible"
  | "Needs improvement"
  | "Not eligible yet";

export type ApplicationStage =
  | "Discovered"
  | "Eligible"
  | "Improving eligibility"
  | "Preparing documents"
  | "Ready to apply"
  | "Submitted"
  | "Interview"
  | "Accepted"
  | "Rejected";

export type DocumentStatus = "Uploaded" | "Missing" | "Needs improvement" | "Expired";

export interface StudentPreferences {
  opportunityTypes: string[];
  preferredCountries: string[];
  countryFlexibility: CountryFlexibility;
  preferredSubjects: string[];
  subjectFlexibility: SubjectFlexibility;
  fundingType: FundingPreference;
  minimumFunding: number;
  needBased: boolean | "unsure";
  eligibilityRange: EligibilityRange[];
  recommendationStyle: RecommendationStyle;
  willingToImprove: string[];
  maxEffort: MaxEffort;
  deadlinePreference: DeadlinePreference;
  intakes: string[];
  careerGoals: string[];
  weights: {
    funding: number;
    eligibility: number;
    country: number;
    ranking: number;
    career: number;
    effort: number;
    deadline: number;
  };
}

export interface UploadedDocument {
  id: string;
  label: string;
  status: DocumentStatus;
  score?: number;
  reusable: boolean;
  updatedAt: string;
}

export interface ScholarshipRequirement {
  studentLevels: string[];
  minGpa?: number;
  acceptedNationalities?: string[];
  targetCountries?: string[];
  preferredSubjects: string[];
  requiredTests?: Array<{ name: string; minimum: number }>;
  requiredDocuments: string[];
  needBased?: boolean;
  openToInternational?: boolean;
  womenInStem?: boolean;
  firstGenerationFriendly?: boolean;
  lowIncomeFriendly?: boolean;
  careerSwitcherFriendly?: boolean;
}

export interface ScholarshipRecord {
  id: string;
  slug: string;
  name: string;
  country: string;
  provider: string;
  university?: string;
  amountLabel: string;
  amountValue: number;
  deadline: string;
  degreeLevel: string;
  summary: string;
  description: string;
  fields: string[];
  tags: string[];
  fundingType: string;
  timeline: string[];
  documents: string[];
  essayPrompts: string[];
  requirements: ScholarshipRequirement;
}

export interface CountryStrategyRecord {
  id: string;
  country: string;
  livingCost: string;
  visaDifficulty: string;
  workOpportunity: string;
  fundingAvailability: string;
  scholarshipStrength: string;
  bestFor: string;
}

export interface PlanItem {
  id: string;
  scholarshipId: string;
  title: string;
  description: string;
  impact: string;
  done: boolean;
}

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  stage: ApplicationStage;
  updatedAt: string;
  checklist: string[];
}

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  type: "deadline" | "document" | "match" | "task";
  read: boolean;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface StudentProfile {
  id: string;
  seedLabel: string;
  selectedLevels: StudentLevel[];
  personal: {
    name: string;
    age: number;
    nationality: string;
    currentCountry: string;
    targetCountry: string;
    preferredIntakeYear: string;
  };
  education: {
    highSchoolCompleted: boolean;
    currentQualification: string;
    boardOrCurriculum: string;
    gpaScale: string;
    gpaValue: number;
    subjects: string[];
    graduationYear: string;
  };
  courseGoals: {
    preferredDegreeLevel: string;
    preferredSubject: string;
    preferredCountries: string[];
    preferredUniversities: string[];
    budgetRange: string;
  };
  financial: {
    familyIncomeRange: string;
    needBasedFundingInterest: boolean;
    governmentAidEligibility: boolean;
    workStudyInterest: boolean;
  };
  testScores: {
    ielts?: number | null;
    toefl?: number | null;
    sat?: number | null;
    act?: number | null;
    gre?: number | null;
    gmat?: number | null;
    other?: string;
  };
  achievements: string[];
  documents: UploadedDocument[];
  preferences: StudentPreferences;
  savedScholarshipIds: string[];
  planItems: PlanItem[];
  applications: ApplicationRecord[];
  notifications: NotificationRecord[];
  assistantMessages: AssistantMessage[];
}

export interface ScoreBreakdown {
  eligibilityFit: number;
  academicFit: number;
  fieldFit: number;
  countryFit: number;
  fundingFit: number;
  effortFit: number;
  deadlineFit: number;
}

export interface MatchResult {
  scholarship: ScholarshipRecord;
  score: number;
  status: EligibilityStatus;
  breakdown: ScoreBreakdown;
  missingCriteria: string[];
  unlockActions: string[];
  improvedScore: number;
  difficulty: "Low" | "Medium" | "High";
  timeToUnlock: string;
  costEstimate: string;
  nextBestAction: string;
}

export interface PreferenceSummary {
  label: string;
  body: string;
}

export interface WorkspaceSettings {
  compactMode: boolean;
  notificationsEnabled: boolean;
  assistantTone: "mentor" | "direct" | "encouraging";
}

export interface WorkspaceState {
  profiles: StudentProfile[];
  activeProfileId: string;
  mode: RecommendationMode;
  focusedScholarshipId?: string;
  settings: WorkspaceSettings;
  isPremium?: boolean;
  pendingWelcome?: boolean;
}

export interface NextBestAction {
  label: string;
  description: string;
  href: string;
}
