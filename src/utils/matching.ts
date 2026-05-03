import { scholarships } from "../data/mockScholarships";
import type {
  MatchResult,
  ScholarshipRecord,
  ScoreBreakdown,
  StudentPreferences,
  StudentProfile
} from "../types/app";

const TODAY = new Date();

const countryRegions: Record<string, string> = {
  "United Kingdom": "anglophone",
  Canada: "anglophone",
  Australia: "anglophone",
  Ireland: "anglophone",
  "United States": "anglophone",
  Germany: "europe",
  Netherlands: "europe",
  Sweden: "europe"
};

const subjectFamilies: Record<string, string[]> = {
  "computer science": ["computer science", "artificial intelligence", "data science", "analytics"],
  engineering: ["engineering", "computer engineering", "electronics"],
  business: ["business", "economics", "business analytics", "analytics"],
  medicine: ["medicine", "public health", "biotechnology", "genomics"],
  law: ["law", "public policy"],
  "social sciences": ["social sciences", "economics", "public policy", "education"],
  arts: ["arts"],
  "data science / ai": ["data science", "artificial intelligence", "business analytics", "computer science"],
  "public policy": ["public policy", "economics", "education"],
  biotechnology: ["biotechnology", "genomics", "research methods", "public health"],
  "business analytics": ["business analytics", "business", "analytics", "economics"]
};

const prestigeSignals = [
  "Oxford",
  "Cambridge",
  "Imperial",
  "Gates",
  "UBC",
  "DAAD",
  "Melbourne",
  "Commonwealth"
];

// Maximum possible score per test type for above-minimum bonus calculation
const TEST_CEILINGS: Record<string, number> = {
  ielts: 9.0,
  toefl: 120,
  sat: 1600,
  act: 36,
  gre: 340,
  gmat: 800
};

const getTestCeiling = (testName: string): number => {
  const key = testName.toLowerCase();
  for (const [k, v] of Object.entries(TEST_CEILINGS)) {
    if (key.includes(k)) return v;
  }
  return 100;
};

// Rewards exceeding the minimum — IELTS 9.0 beats 7.0 when minimum is 7.0
const scoreTestPerformance = (score: number, minimum: number, ceiling: number): number => {
  if (score >= minimum) {
    const range = ceiling - minimum;
    const surplus = range > 0 ? (score - minimum) / range : 0;
    return clamp(0.85 + 0.15 * surplus, 0.85, 1.0);
  }
  return clamp(score / minimum, 0.15, 0.84);
};

// Rewards exceeding the GPA minimum — 4.0 beats 3.5 when minimum is 3.5
const scoreGPA = (gpa: number, requiredGpa: number): number => {
  if (gpa >= requiredGpa) {
    const maxGpa = 4.0;
    const range = maxGpa - requiredGpa;
    const surplus = range > 0 ? (gpa - requiredGpa) / range : 0;
    return clamp(0.80 + 0.20 * surplus, 0.80, 1.0);
  }
  return clamp((gpa / requiredGpa) * 0.72, 0.12, 0.79);
};

interface AchievementSignals {
  techCertBonus: number;
  researchBonus: number;
  leadershipBonus: number;
  competitionBonus: number;
  volunteerBonus: number;
  techDomains: string[];
}

const parseAchievements = (achievements: string[]): AchievementSignals => {
  const text = achievements.join(" ").toLowerCase();

  const certPatterns = [
    /google.*cert|cert.*google/,
    /aws.*cert|cert.*aws|amazon.*web/,
    /microsoft.*cert|azure.*cert|cert.*azure/,
    /coursera.*cert|edx.*cert|cert.*coursera/,
    /comptia|cisco|pmp|prince2|agile|scrum/,
    /certif[ie]/
  ];
  const techCertCount = certPatterns.filter((p) => p.test(text)).length;

  const techDomains: string[] = [];
  if (/machine.?learning|deep.?learning|\bai\b|artificial.?intell|tensorflow|pytorch|nlp/.test(text))
    techDomains.push("ai");
  if (/\bcloud\b|aws|azure|gcp|devops|kubernetes|docker/.test(text)) techDomains.push("cloud");
  if (/data.?(science|analyt|engineer)|pandas|spark|\bsql\b|tableau/.test(text)) techDomains.push("data");
  if (/web.?dev|frontend|backend|fullstack|react|node\.?js/.test(text)) techDomains.push("web");
  if (/finance|cfa|acca|investment|banking/.test(text)) techDomains.push("finance");

  const hasResearch =
    /research|published|publication|paper|journal|\blab\b|thesis|fellow|intern.*research|research.*intern/.test(text);
  const hasLeadership =
    /captain|president|chair|founder|lead(?:er|ing)|head.?of|officer|director|organis|ambassador|representative/.test(
      text
    );
  const hasCompetition = /hackathon|competition|winner|finalist|award|prize|olympiad|champion/.test(text);
  const hasVolunteer = /volunteer|mentor|community|outreach|teach(?:ing)?|tutor|ngo|nonprofit/.test(text);

  return {
    techCertBonus: Math.min(0.12, techCertCount * 0.04),
    researchBonus: hasResearch ? 0.12 : 0,
    leadershipBonus: hasLeadership ? 0.08 : 0,
    competitionBonus: hasCompetition ? 0.08 : 0,
    volunteerBonus: hasVolunteer ? 0.04 : 0,
    techDomains
  };
};

// Returns a 0-0.20 bonus to field alignment based on certs/achievements relevant to the scholarship
const getAchievementFieldBonus = (
  scholarship: ScholarshipRecord,
  signals: AchievementSignals
): number => {
  const ctx = `${scholarship.fields.join(" ")} ${scholarship.tags.join(" ")}`.toLowerCase();
  let bonus = 0;

  // Tech certs for STEM/CS/data/engineering scholarships
  if (/computer|engineer|data|artificial|machine|software|technolog|digital/.test(ctx)) {
    if (signals.techDomains.some((d) => ["ai", "cloud", "data", "web"].includes(d))) {
      bonus += signals.techCertBonus;
    }
  }

  // Finance/business certs for economics/business scholarships
  if (/business|economics|finance|accounting/.test(ctx) && signals.techDomains.includes("finance")) {
    bonus += signals.techCertBonus * 0.8;
  }

  // Research evidence for PhD and research-oriented scholarships
  if (scholarship.degreeLevel === "PhD" || /research|doctoral|postgrad/.test(ctx)) {
    bonus += signals.researchBonus;
  }

  // Leadership/community work for social impact scholarships
  if (/leadership|community|social.?impact|service|women|diversity|inclusion/.test(ctx)) {
    bonus += signals.leadershipBonus;
    bonus += signals.volunteerBonus;
  }

  // Competition wins as a general merit signal (small boost everywhere)
  bonus += signals.competitionBonus * 0.4;

  return clamp(bonus, 0, 0.20);
};

// Average AI quality score of uploaded documents, 0.30 to 1.0
const getDocumentQualityRatio = (profile: StudentProfile): number => {
  const scoredDocs = profile.documents.filter((d) => d.status === "Uploaded" && d.score != null);
  if (scoredDocs.length === 0) return 0.65;
  const avg = scoredDocs.reduce((sum, d) => sum + (d.score ?? 0), 0) / scoredDocs.length;
  return clamp(avg / 100, 0.30, 1.0);
};

const parseDeadlineDiff = (deadline: string) =>
  Math.max(0, Math.ceil((new Date(deadline).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)));

const normalizeText = (value: string) => value.trim().toLowerCase();

const normalizeGpa = (profile: StudentProfile) => {
  const { gpaScale, gpaValue } = profile.education;
  if (gpaScale.includes("Percentage")) return Math.min(4, (gpaValue / 100) * 4);
  if (gpaScale.includes("/ 10")) return Math.min(4, (gpaValue / 10) * 4);
  return gpaValue;
};

const hasDocument = (profile: StudentProfile, id: string) => {
  const doc = profile.documents.find((item) => item.id === id);
  return doc && doc.status === "Uploaded";
};

const getDocumentLabel = (id: string) =>
  ({
    passport: "passport",
    transcript: "transcript",
    cv: "CV",
    sop: "statement of purpose",
    recommendation: "recommendation letters",
    offer: "offer letter",
    certificates: "certificates"
  })[id] ?? id;

const asCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toOpportunityTypes = (scholarship: ScholarshipRecord) => {
  const types = new Set<string>();

  if (scholarship.degreeLevel === "Undergraduate") types.add("Undergraduate scholarships");
  if (scholarship.degreeLevel === "Master's") types.add("Master's scholarships");
  if (scholarship.degreeLevel === "PhD") {
    types.add("PhD scholarships");
    types.add("Research opportunities");
  }
  if (scholarship.tags.some((tag) => /fellowship/i.test(tag)) || /fellowship/i.test(scholarship.name)) {
    types.add("Fellowships");
  }
  if (scholarship.tags.some((tag) => /research/i.test(tag))) {
    types.add("Research opportunities");
  }
  if (scholarship.tags.some((tag) => /exchange/i.test(tag))) {
    types.add("Exchange programs");
  }
  if (scholarship.tags.some((tag) => /intern/i.test(tag))) {
    types.add("Internships with funding");
  }
  if (scholarship.requirements.careerSwitcherFriendly) {
    types.add("Career-switch programs");
  }

  return types;
};

const getPreferenceSubjects = (preferences: StudentPreferences, profile: StudentProfile) =>
  [...preferences.preferredSubjects, profile.courseGoals.preferredSubject];

const subjectAliasesFor = (subject: string) => {
  const key = normalizeText(subject);
  return subjectFamilies[key] ?? [key];
};

const getScholarshipSubjects = (scholarship: ScholarshipRecord) =>
  scholarship.fields.map((field) => normalizeText(field));

const getCountryAlignment = (
  scholarship: ScholarshipRecord,
  preferences: StudentPreferences,
  profile: StudentProfile
) => {
  const directTargets = new Set([
    ...preferences.preferredCountries,
    ...profile.courseGoals.preferredCountries,
    profile.personal.targetCountry
  ]);
  if (directTargets.has(scholarship.country)) return 1;

  if (preferences.countryFlexibility === "strict") return 0.18;

  const scholarshipRegion = countryRegions[scholarship.country];
  const sharesRegion = [...directTargets].some((country) => countryRegions[country] === scholarshipRegion);
  if (sharesRegion) return preferences.countryFlexibility === "similar" ? 0.72 : 0.84;

  return preferences.countryFlexibility === "global" ? 0.6 : 0.35;
};

const getSubjectAlignment = (
  scholarship: ScholarshipRecord,
  preferences: StudentPreferences,
  profile: StudentProfile
) => {
  const scholarshipSubjects = getScholarshipSubjects(scholarship);
  if (scholarshipSubjects.includes("any") || scholarshipSubjects.includes("any research field")) return 1;

  const directMatches = getPreferenceSubjects(preferences, profile).some((subject) =>
    subjectAliasesFor(subject).some((alias) =>
      scholarshipSubjects.some((field) => field.includes(alias) || alias.includes(field))
    )
  );

  if (directMatches) return 1;
  if (preferences.subjectFlexibility === "exact") return 0.18;

  const relatedViaProfile = profile.education.subjects.some((subject) =>
    scholarshipSubjects.some((field) =>
      subjectAliasesFor(subject).some((alias) => field.includes(alias) || alias.includes(field))
    )
  );
  if (relatedViaProfile) return preferences.subjectFlexibility === "related" ? 0.68 : 0.82;

  return preferences.subjectFlexibility === "open" ? 0.56 : 0.3;
};

const getCareerAlignment = (scholarship: ScholarshipRecord, preferences: StudentPreferences) => {
  if (preferences.careerGoals.length === 0) return 0.65;

  const subjectText = scholarship.fields.join(" ").toLowerCase();
  const country = scholarship.country;
  const prestige = prestigeSignals.some((signal) =>
    `${scholarship.name} ${scholarship.provider} ${scholarship.university ?? ""}`.includes(signal)
  );

  const hits = preferences.careerGoals.filter((goal) => {
    switch (goal) {
      case "High salary":
        return /engineering|computer|artificial|data|business/.test(subjectText);
      case "PR / immigration":
        return ["Canada", "Australia", "Germany", "Netherlands"].includes(country);
      case "Research career":
        return scholarship.degreeLevel === "PhD" || scholarship.tags.some((tag) => /research/i.test(tag));
      case "Industry jobs":
        return /business|analytics|engineering|computer|data/.test(subjectText);
      case "Prestige universities":
        return prestige;
      case "Low cost of living":
        return ["Germany", "Netherlands", "Sweden"].includes(country);
      case "Work while studying":
        return ["Canada", "Australia", "United Kingdom", "Germany", "Netherlands"].includes(country);
      case "Family-friendly":
        return ["Canada", "Sweden", "Netherlands", "Germany"].includes(country);
      default:
        return false;
    }
  }).length;

  return clamp(hits / preferences.careerGoals.length, 0.18, 1);
};

const getRankingAlignment = (scholarship: ScholarshipRecord, preferences: StudentPreferences) => {
  const prestige = prestigeSignals.some((signal) =>
    `${scholarship.name} ${scholarship.provider} ${scholarship.university ?? ""}`.includes(signal)
  );
  const rankingWeight = preferences.weights.ranking / 100;

  if (!prestige) return 1 - rankingWeight * 0.55;
  return 0.7 + rankingWeight * 0.3;
};

const getFundingTypeAlignment = (scholarship: ScholarshipRecord, preferences: StudentPreferences) => {
  if (preferences.fundingType === "any") return 1;

  const fundingText = `${scholarship.fundingType} ${scholarship.amountLabel}`.toLowerCase();
  const lookup: Record<StudentPreferences["fundingType"], string[]> = {
    full: ["full", "full ride", "stipend", "allowance"],
    tuition: ["tuition", "stipend", "allowance"],
    partial: ["partial", "tuition", "bursary"],
    any: []
  };

  const matches = lookup[preferences.fundingType].some((needle) => fundingText.includes(needle));
  if (matches) return 1;
  return preferences.fundingType === "partial" ? 0.72 : 0.42;
};

const getNeedAlignment = (scholarship: ScholarshipRecord, preferences: StudentPreferences) => {
  if (preferences.needBased === "unsure") return 0.78;
  if (preferences.needBased === true) return scholarship.requirements.needBased ? 1 : 0.52;
  return scholarship.requirements.needBased ? 0.64 : 1;
};

const getRequiredEffortLevel = (
  missingTests: string[],
  missingDocuments: string[],
  gpaGap: boolean,
  researchGap: boolean
) => {
  const load = missingTests.length * 2 + missingDocuments.length + (gpaGap ? 2 : 0) + (researchGap ? 2 : 0);
  if (load >= 6) return "high";
  if (load >= 3) return "medium";
  return "low";
};

const getEffortAlignment = ({
  missingTests,
  missingDocuments,
  gpaGap,
  researchGap,
  preferences
}: {
  missingTests: string[];
  missingDocuments: string[];
  gpaGap: boolean;
  researchGap: boolean;
  preferences: StudentPreferences;
}) => {
  const improvementSet = new Set(preferences.willingToImprove);
  const coveredActions = [
    missingTests.some((test) => /ielts|toefl/i.test(test)) ? improvementSet.has("IELTS / TOEFL") : true,
    missingTests.some((test) => /sat|act/i.test(test)) ? improvementSet.has("SAT / ACT") : true,
    missingTests.some((test) => /gre|gmat/i.test(test)) ? improvementSet.has("GRE / GMAT") : true,
    missingDocuments.includes("sop") ? improvementSet.has("SOP") : true,
    missingDocuments.includes("recommendation") ? improvementSet.has("Recommendation letters") : true,
    researchGap ? improvementSet.has("Research proposal") : true,
    gpaGap ? improvementSet.has("Improve grades") : true
  ];

  const coverage = coveredActions.filter(Boolean).length / coveredActions.length;
  const effortLevels: Record<StudentPreferences["maxEffort"], number> = { low: 1, medium: 2, high: 3 };
  const required = getRequiredEffortLevel(missingTests, missingDocuments, gpaGap, researchGap);
  const headroom = effortLevels[preferences.maxEffort] - effortLevels[required];
  const effortTolerance = headroom >= 0 ? 1 : headroom === -1 ? 0.62 : 0.32;

  return clamp(coverage * 0.6 + effortTolerance * 0.4, 0.18, 1);
};

const getDeadlineAlignment = (daysToDeadline: number, preferences: StudentPreferences) => {
  if (preferences.deadlinePreference === "safe") {
    if (daysToDeadline >= 30) return 1;
    if (daysToDeadline >= 14) return 0.62;
    return 0.24;
  }

  if (preferences.deadlinePreference === "urgent") {
    if (daysToDeadline <= 30) return 1;
    if (daysToDeadline <= 90) return 0.72;
    return 0.45;
  }

  if (daysToDeadline >= 90) return 1;
  if (daysToDeadline >= 45) return 0.74;
  return 0.38;
};

const getTestScore = (profile: StudentProfile, name: string) => {
  const key = name.toLowerCase();
  if (key.includes("ielts")) return profile.testScores.ielts;
  if (key.includes("toefl")) return profile.testScores.toefl;
  if (key.includes("sat")) return profile.testScores.sat;
  if (key.includes("act")) return profile.testScores.act;
  if (key.includes("gre")) return profile.testScores.gre;
  if (key.includes("gmat")) return profile.testScores.gmat;
  return null;
};

const getDifficulty = (missingCriteria: string[]) => {
  if (missingCriteria.some((item) => item.includes("GPA") || item.includes("research"))) return "High";
  if (
    missingCriteria.some(
      (item) =>
        item.includes("IELTS") || item.includes("TOEFL") || item.includes("GRE") || item.includes("letters")
    )
  ) {
    return "Medium";
  }
  return "Low";
};

const getTimeToUnlock = (missingCriteria: string[]) => {
  if (missingCriteria.some((item) => item.includes("GPA"))) return "1-2 academic terms";
  if (missingCriteria.some((item) => item.includes("IELTS") || item.includes("TOEFL"))) return "4-8 weeks";
  if (missingCriteria.some((item) => item.includes("letters"))) return "2-3 weeks";
  if (missingCriteria.some((item) => item.includes("SOP") || item.includes("CV"))) return "1-2 weeks";
  return "A few days";
};

const getCostEstimate = (missingCriteria: string[]) => {
  if (
    missingCriteria.some(
      (item) =>
        item.includes("IELTS") ||
        item.includes("TOEFL") ||
        item.includes("SAT") ||
        item.includes("GRE")
    )
  ) {
    return "Medium";
  }
  if (missingCriteria.some((item) => item.includes("GPA") || item.includes("offer letter"))) return "High";
  return "Low";
};

type MatchComputation = {
  breakdown: ScoreBreakdown;
  missingRequirements: string[];
  improvementActions: string[];
};

const calculateBreakdown = (
  profile: StudentProfile,
  preferences: StudentPreferences,
  scholarship: ScholarshipRecord
): MatchComputation => {
  const missingRequirements: string[] = [];
  const improvementActions = new Set<string>();

  const achievementSignals = parseAchievements(profile.achievements);

  const gpa = normalizeGpa(profile);
  const requiredGpaRaw = scholarship.requirements.minGpa ?? 0;
  const requiredGpa = requiredGpaRaw > 4 ? (requiredGpaRaw / 100) * 4 : requiredGpaRaw;
  const gpaGap = requiredGpa > 0 && gpa < requiredGpa;

  const opportunityMatch = preferences.opportunityTypes.length
    ? [...toOpportunityTypes(scholarship)].some((type) => preferences.opportunityTypes.includes(type))
    : true;
  const levelMatch = scholarship.requirements.studentLevels.some((level) =>
    profile.selectedLevels.includes(level as never)
  );
  const nationalityRestricted =
    scholarship.requirements.acceptedNationalities &&
    !scholarship.requirements.acceptedNationalities.includes(profile.personal.nationality);

  if (!opportunityMatch) {
    missingRequirements.push("Opportunity type is outside your current goal mix.");
    improvementActions.add("Broaden opportunity goals if you want this program type included.");
  }
  if (!levelMatch) {
    missingRequirements.push("Your current student level does not fully align.");
  }
  if (nationalityRestricted) {
    missingRequirements.push("Nationality restriction blocks this scholarship.");
  }

  const eligibilityWeight = preferences.weights.eligibility / 100;
  let eligibilityRatio = 1;
  if (!opportunityMatch) eligibilityRatio -= 0.18 * eligibilityWeight + 0.08;
  if (!levelMatch) eligibilityRatio -= 0.28 * eligibilityWeight + 0.1;
  if (nationalityRestricted) eligibilityRatio -= 0.34;
  const eligibilityFit = Math.round(clamp(eligibilityRatio, 0, 1) * 35);

  // Test score evaluation — rewards scoring above the minimum
  const testRatios: number[] = [];
  const missingTests: string[] = [];
  scholarship.requirements.requiredTests?.forEach((test) => {
    const score = getTestScore(profile, test.name);
    if (!score) {
      testRatios.push(0.15);
      missingRequirements.push(`${test.name} is missing (target ${test.minimum}).`);
      improvementActions.add(`Add ${test.name} and aim for ${test.minimum} or higher.`);
      missingTests.push(test.name);
      return;
    }
    if (score < test.minimum) {
      testRatios.push(clamp(score / test.minimum, 0.15, 0.84));
      missingRequirements.push(`${test.name} is below the target (${test.minimum}).`);
      improvementActions.add(`Improve ${test.name} to at least ${test.minimum}.`);
      missingTests.push(test.name);
      return;
    }
    // Score at or above minimum — give bonus for how far above minimum it is
    testRatios.push(scoreTestPerformance(score, test.minimum, getTestCeiling(test.name)));
  });

  if (gpaGap) {
    missingRequirements.push(`GPA is below the target (${requiredGpaRaw}).`);
    improvementActions.add(`Strengthen grades or academic evidence toward ${requiredGpaRaw}.`);
  }

  // Academic fit — differentiates students who exceed minimums from borderline ones
  const gpaRatio = requiredGpa > 0 ? scoreGPA(gpa, requiredGpa) : 1.0;
  const testAvg = testRatios.length > 0
    ? testRatios.reduce((sum, v) => sum + v, 0) / testRatios.length
    : null;

  const academicRatio =
    requiredGpa > 0 && testAvg !== null
      ? clamp(gpaRatio * 0.60 + testAvg * 0.40, 0.12, 1)
      : requiredGpa > 0
        ? clamp(gpaRatio, 0.12, 1)
        : testAvg !== null
          ? clamp(testAvg, 0.12, 1)
          : 1;
  const academicFit = Math.round(academicRatio * 20);

  const subjectAlignment = getSubjectAlignment(scholarship, preferences, profile);
  const careerAlignment = getCareerAlignment(scholarship, preferences);
  const rankingAlignment = getRankingAlignment(scholarship, preferences);
  if (subjectAlignment < 0.6) {
    missingRequirements.push("Subject fit is weak for your preferred course path.");
    improvementActions.add("Open related subjects or switch focus to a closer-fit field.");
  }

  // Field fit includes achievement/certification bonus for relevant scholarships
  const achievementBonus = getAchievementFieldBonus(scholarship, achievementSignals);
  const fieldFit = Math.round(
    clamp(subjectAlignment * 0.72 + careerAlignment * 0.18 + rankingAlignment * 0.1 + achievementBonus, 0, 1) * 15
  );

  const countryAlignment = getCountryAlignment(scholarship, preferences, profile);
  if (countryAlignment < 0.6) {
    missingRequirements.push("Country fit is outside your current location strategy.");
    improvementActions.add(`Add ${scholarship.country} to preferred countries or widen country flexibility.`);
  }
  const countryFit = Math.round(
    clamp(countryAlignment * (0.6 + preferences.weights.country / 250), 0, 1) * 10
  );

  const fundingCoverage = preferences.minimumFunding
    ? clamp(scholarship.amountValue / preferences.minimumFunding, 0.2, 1)
    : 1;
  const fundingTypeAlignment = getFundingTypeAlignment(scholarship, preferences);
  const needAlignment = getNeedAlignment(scholarship, preferences);
  if (fundingCoverage < 1) {
    missingRequirements.push(`Funding is below your preferred minimum of ${asCurrency(preferences.minimumFunding)}.`);
  }
  if (preferences.needBased === true && !scholarship.requirements.needBased) {
    missingRequirements.push("This scholarship is less need-aware than your current preference.");
  }
  const fundingFit = Math.round(
    clamp(
      fundingCoverage * 0.45 +
        fundingTypeAlignment * 0.35 +
        needAlignment * 0.2 +
        preferences.weights.funding / 500,
      0,
      1
    ) * 10
  );

  const missingDocuments = scholarship.requirements.requiredDocuments.filter((docId) => !hasDocument(profile, docId));
  missingDocuments.forEach((docId) => {
    missingRequirements.push(`Missing ${getDocumentLabel(docId)}.`);
    improvementActions.add(`Upload ${getDocumentLabel(docId)}.`);
  });

  // Research gap — recognise research signals in achievements
  const researchGap =
    scholarship.degreeLevel === "PhD" && achievementSignals.researchBonus === 0;
  if (researchGap) {
    missingRequirements.push("Research track evidence is still light.");
    improvementActions.add("Add a research proposal or stronger research evidence.");
  }

  const effortAlignment = getEffortAlignment({
    missingTests,
    missingDocuments,
    gpaGap,
    researchGap,
    preferences
  });
  if (effortAlignment < 0.55) {
    missingRequirements.push("Required effort is higher than your current improvement preference.");
  }

  // Effort fit — document AI quality scores influence preparation signal
  const docQuality = getDocumentQualityRatio(profile);
  const effortFit = Math.round(
    clamp(
      effortAlignment * (0.7 + preferences.weights.effort / 333) * (0.75 + docQuality * 0.25),
      0,
      1
    ) * 5
  );

  const daysToDeadline = parseDeadlineDiff(scholarship.deadline);
  const deadlineAlignment = getDeadlineAlignment(daysToDeadline, preferences);
  if (deadlineAlignment < 0.55) {
    missingRequirements.push("Deadline timing is less aligned with your current planning style.");
  }
  const deadlineFit = Math.round(
    clamp(deadlineAlignment * (0.7 + preferences.weights.deadline / 333), 0, 1) * 5
  );

  return {
    breakdown: {
      eligibilityFit,
      academicFit,
      fieldFit,
      countryFit,
      fundingFit,
      effortFit,
      deadlineFit
    },
    missingRequirements: [...new Set(missingRequirements)],
    improvementActions: [...improvementActions]
  };
};

export const calculateMatchScore = (
  profile: StudentProfile,
  preferences: StudentPreferences,
  scholarship: ScholarshipRecord
): MatchResult => {
  const { breakdown, missingRequirements, improvementActions } = calculateBreakdown(
    profile,
    preferences,
    scholarship
  );

  const score = Math.round(
    breakdown.eligibilityFit +
      breakdown.academicFit +
      breakdown.fieldFit +
      breakdown.countryFit +
      breakdown.fundingFit +
      breakdown.effortFit +
      breakdown.deadlineFit
  );

  const blockers = missingRequirements.filter((item) =>
    /restriction|student level|GPA|missing|below the target/.test(item)
  ).length;
  const status =
    blockers === 0 && score >= 78
      ? "Eligible now"
      : score >= 64 && blockers <= 3
        ? "Almost eligible"
        : score >= 45
          ? "Needs improvement"
          : "Not eligible yet";

  const estimatedImprovedScore = Math.min(
    100,
    score +
      improvementActions.slice(0, 4).length * 5 +
      (missingRequirements.some((item) => item.includes("Missing")) ? 7 : 0) +
      (missingRequirements.some((item) => item.includes("below the target")) ? 5 : 0)
  );

  const difficulty = getDifficulty(missingRequirements);
  const timeToUnlock = getTimeToUnlock(missingRequirements);
  const costEstimate = getCostEstimate(missingRequirements);
  const nextBestAction =
    improvementActions[0] ?? "Save this scholarship and move it into your application flow.";

  return {
    scholarship,
    score,
    status,
    breakdown,
    missingCriteria: missingRequirements,
    unlockActions: improvementActions.slice(0, 5),
    improvedScore: estimatedImprovedScore,
    difficulty,
    timeToUnlock,
    costEstimate,
    nextBestAction
  };
};

export const evaluateScholarship = calculateMatchScore;

// Top positive insights that explain WHY this scholarship matched
export const getMatchInsights = (match: MatchResult): string[] => {
  const b = match.breakdown;
  const candidates: { weight: number; reason: string }[] = [];

  if (b.eligibilityFit >= 33) candidates.push({ weight: 100, reason: "Meets all eligibility criteria" });
  else if (b.eligibilityFit >= 28) candidates.push({ weight: 70, reason: "Meets most eligibility criteria" });

  if (b.academicFit >= 19) candidates.push({ weight: 90, reason: "Excellent academic fit" });
  else if (b.academicFit >= 16) candidates.push({ weight: 60, reason: "Strong academic profile" });

  if (b.fieldFit >= 14) candidates.push({ weight: 85, reason: "Perfect field alignment" });
  else if (b.fieldFit >= 11) candidates.push({ weight: 55, reason: "Strong field match" });

  if (b.countryFit === 10) candidates.push({ weight: 75, reason: "In your target country" });
  if (b.fundingFit >= 9) candidates.push({ weight: 65, reason: "Excellent funding fit" });
  if (b.deadlineFit >= 4) candidates.push({ weight: 35, reason: "Comfortable deadline window" });

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .map((c) => c.reason);
};

export const buildMatches = (profile: StudentProfile, preferences: StudentPreferences) =>
  scholarships
    .map((scholarship) => calculateMatchScore(profile, preferences, scholarship))
    .sort((a, b) => b.score - a.score);

export const findSimilarScholarships = (
  scholarshipId: string,
  profile: StudentProfile,
  preferences: StudentPreferences
) => {
  const allMatches = buildMatches(profile, preferences);
  const current = allMatches.find((item) => item.scholarship.id === scholarshipId);
  if (!current) return [];

  return allMatches
    .filter((item) => item.scholarship.id !== scholarshipId)
    .filter((item) => {
      const sharesField = item.scholarship.fields.some((field) =>
        current.scholarship.fields.includes(field)
      );
      return sharesField || item.scholarship.country === current.scholarship.country;
    })
    .slice(0, 4);
};
