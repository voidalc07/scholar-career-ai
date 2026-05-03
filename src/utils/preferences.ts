import type {
  EligibilityRange,
  MatchResult,
  PreferenceSummary,
  RecommendationStyle,
  StudentPreferences,
  StudentProfile
} from "../types/app";

const styleLabels: Record<RecommendationStyle, string> = {
  safe: "Safe Fit Optimizer",
  balanced: "Balanced Opportunity Seeker",
  ambitious: "Ambitious Scholarship Climber"
};

const fundingCopy: Record<StudentPreferences["fundingType"], string> = {
  full: "fully funded scholarships",
  tuition: "tuition-covered scholarships",
  partial: "partial funding opportunities",
  any: "any scholarship support"
};

const effortCopy: Record<StudentPreferences["maxEffort"], string> = {
  low: "document-ready wins",
  medium: "moderate profile-building steps",
  high: "full profile upgrades"
};

export const mapStatusToEligibilityRange = (
  status: MatchResult["status"]
): EligibilityRange => {
  if (status === "Needs improvement") return "Eligible after improvement";
  if (status === "Not eligible yet") return "Long-term targets";
  return status;
};

export const getPreferenceCompletion = (preferences: StudentPreferences) => {
  const checks = [
    preferences.opportunityTypes.length > 0,
    preferences.preferredCountries.length > 0,
    preferences.preferredSubjects.length > 0,
    preferences.fundingType,
    Number.isFinite(preferences.minimumFunding),
    preferences.needBased !== undefined,
    preferences.eligibilityRange.length > 0,
    preferences.recommendationStyle,
    preferences.willingToImprove.length > 0,
    preferences.maxEffort,
    preferences.deadlinePreference,
    preferences.intakes.length > 0,
    preferences.careerGoals.length > 0,
    Object.values(preferences.weights).every((value) => value >= 0)
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

export const getPreferenceSummary = (
  profile: StudentProfile,
  preferences: StudentPreferences
): PreferenceSummary => {
  const countrySnippet = preferences.preferredCountries.slice(0, 2).join(" and ");
  const subjectSnippet = preferences.preferredSubjects.slice(0, 2).join(" and ");

  return {
    label: styleLabels[preferences.recommendationStyle],
    body: `You prefer ${fundingCopy[preferences.fundingType]} in ${countrySnippet || profile.personal.targetCountry}, lean toward ${subjectSnippet || profile.courseGoals.preferredSubject}, and are open to ${effortCopy[preferences.maxEffort]}.`
  };
};

export const getMatchmakingStrength = ({
  matches,
  preferenceCompletion,
  profileCompletion
}: {
  matches: MatchResult[];
  preferenceCompletion: number;
  profileCompletion: number;
}) => {
  const eligibleNow = matches.filter((item) => item.status === "Eligible now").length;
  const almostEligible = matches.filter((item) => item.status === "Almost eligible").length;
  const topScore = matches[0]?.score ?? 0;

  return Math.round(
    profileCompletion * 0.32 +
      preferenceCompletion * 0.33 +
      Math.min(20, topScore * 0.2) +
      Math.min(15, eligibleNow * 2 + almostEligible)
  );
};
