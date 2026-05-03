import type { StudentPreferences } from "../types/app";

export const preferenceSteps = [
  "Goals",
  "Countries & Courses",
  "Funding",
  "Eligibility Flexibility",
  "Effort & Timeline",
  "Career Outcomes",
  "Match Weights"
] as const;

export const opportunityTypeOptions = [
  "Undergraduate scholarships",
  "Master’s scholarships",
  "PhD scholarships",
  "Fellowships",
  "Exchange programs",
  "Research opportunities",
  "Internships with funding",
  "Career-switch programs"
] as const;

export const countryOptions = [
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Netherlands",
  "Sweden",
  "Ireland",
  "United States"
] as const;

export const subjectOptions = [
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Law",
  "Social Sciences",
  "Arts",
  "Data Science / AI",
  "Public Policy",
  "Biotechnology",
  "Business Analytics"
] as const;

export const eligibilityRangeOptions = [
  "Eligible now",
  "Almost eligible",
  "Eligible after improvement",
  "Long-term targets"
] as const;

export const improvementOptions = [
  "IELTS / TOEFL",
  "SAT / ACT",
  "GRE / GMAT",
  "SOP",
  "Recommendation letters",
  "Portfolio",
  "Research proposal",
  "Volunteering",
  "Improve grades"
] as const;

export const intakeOptions = [
  "Jan 2026",
  "Sep 2026",
  "Jan 2027",
  "Sep 2027",
  "Jan 2028",
  "Sep 2028"
] as const;

export const careerGoalOptions = [
  "High salary",
  "PR / immigration",
  "Research career",
  "Industry jobs",
  "Prestige universities",
  "Low cost of living",
  "Work while studying",
  "Family-friendly"
] as const;

export const weightLabels = [
  { key: "funding", label: "Funding importance" },
  { key: "eligibility", label: "Eligibility fit" },
  { key: "country", label: "Country preference" },
  { key: "ranking", label: "University ranking" },
  { key: "career", label: "Career outcome" },
  { key: "effort", label: "Low effort preference" },
  { key: "deadline", label: "Deadline safety" }
] as const satisfies Array<{ key: keyof StudentPreferences["weights"]; label: string }>;

export const buildDefaultPreferences = (
  overrides: Partial<StudentPreferences> = {}
): StudentPreferences => ({
  opportunityTypes: overrides.opportunityTypes ?? ["Master’s scholarships"],
  preferredCountries: overrides.preferredCountries ?? ["United Kingdom", "Canada"],
  countryFlexibility: overrides.countryFlexibility ?? "similar",
  preferredSubjects: overrides.preferredSubjects ?? ["Data Science / AI"],
  subjectFlexibility: overrides.subjectFlexibility ?? "related",
  fundingType: overrides.fundingType ?? "full",
  minimumFunding: overrides.minimumFunding ?? 20000,
  needBased: overrides.needBased ?? "unsure",
  eligibilityRange:
    overrides.eligibilityRange ?? ["Eligible now", "Almost eligible", "Eligible after improvement"],
  recommendationStyle: overrides.recommendationStyle ?? "balanced",
  willingToImprove:
    overrides.willingToImprove ?? ["IELTS / TOEFL", "SOP", "Recommendation letters"],
  maxEffort: overrides.maxEffort ?? "medium",
  deadlinePreference: overrides.deadlinePreference ?? "safe",
  intakes: overrides.intakes ?? ["Sep 2026", "Jan 2027"],
  careerGoals: overrides.careerGoals ?? ["Industry jobs", "High salary"],
  weights: {
    funding: overrides.weights?.funding ?? 80,
    eligibility: overrides.weights?.eligibility ?? 88,
    country: overrides.weights?.country ?? 70,
    ranking: overrides.weights?.ranking ?? 60,
    career: overrides.weights?.career ?? 72,
    effort: overrides.weights?.effort ?? 58,
    deadline: overrides.weights?.deadline ?? 64
  }
});
