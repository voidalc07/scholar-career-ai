import type { StudentProfile } from "../types/app";
import { buildDefaultPreferences } from "./preferences";

const baseDocuments = (overrides: Partial<Record<string, Partial<StudentProfile["documents"][number]>>> = {}) => {
  const docs = [
    { id: "passport", label: "Passport", status: "Uploaded", score: 92, reusable: true, updatedAt: "2026-03-10" },
    { id: "transcript", label: "Transcript", status: "Uploaded", score: 94, reusable: true, updatedAt: "2026-03-14" },
    { id: "cv", label: "CV", status: "Needs improvement", score: 72, reusable: true, updatedAt: "2026-04-02" },
    { id: "sop", label: "Statement of Purpose", status: "Missing", reusable: true, updatedAt: "2026-04-02" },
    { id: "recommendation", label: "Recommendation letters", status: "Missing", reusable: false, updatedAt: "2026-04-02" },
    { id: "offer", label: "Offer letter", status: "Missing", reusable: false, updatedAt: "2026-04-02" },
    { id: "certificates", label: "Certificates", status: "Uploaded", score: 88, reusable: true, updatedAt: "2026-03-29" }
  ] as StudentProfile["documents"];

  return docs.map((doc) => ({ ...doc, ...overrides[doc.id] }));
};

export const sampleProfiles: StudentProfile[] = [
  {
    id: "seed-high-school-india",
    seedLabel: "High school graduate from India",
    selectedLevels: [
      "Finished high school",
      "International student",
      "Low-income applicant",
      "First-generation student"
    ],
    personal: {
      name: "Aarav Mehta",
      age: 18,
      nationality: "Indian",
      currentCountry: "India",
      targetCountry: "United Kingdom",
      preferredIntakeYear: "2027"
    },
    education: {
      highSchoolCompleted: true,
      currentQualification: "CBSE Grade 12",
      boardOrCurriculum: "CBSE",
      gpaScale: "Percentage",
      gpaValue: 89,
      subjects: ["Computer Science", "Mathematics", "Physics"],
      graduationYear: "2026"
    },
    courseGoals: {
      preferredDegreeLevel: "Undergraduate",
      preferredSubject: "Computer Science",
      preferredCountries: ["United Kingdom", "Canada", "Netherlands"],
      preferredUniversities: ["University of Manchester", "Leeds", "Glasgow"],
      budgetRange: "Need full funding"
    },
    financial: {
      familyIncomeRange: "Under GBP20,000 / year",
      needBasedFundingInterest: true,
      governmentAidEligibility: true,
      workStudyInterest: true
    },
    testScores: {
      ielts: null,
      sat: 1380
    },
    achievements: ["Robotics team captain", "Hackathon finalist", "Volunteer coding mentor"],
    documents: baseDocuments(),
    preferences: buildDefaultPreferences({
      opportunityTypes: ["Undergraduate scholarships", "Research opportunities"],
      preferredCountries: ["United Kingdom", "Canada", "Netherlands"],
      countryFlexibility: "similar",
      preferredSubjects: ["Computer Science", "Engineering", "Data Science / AI"],
      subjectFlexibility: "related",
      fundingType: "full",
      minimumFunding: 26000,
      needBased: true,
      eligibilityRange: ["Eligible now", "Almost eligible", "Eligible after improvement"],
      recommendationStyle: "balanced",
      willingToImprove: ["IELTS / TOEFL", "SOP", "Recommendation letters", "Improve grades", "Volunteering"],
      maxEffort: "high",
      deadlinePreference: "safe",
      intakes: ["Sep 2026", "Jan 2027", "Sep 2027"],
      careerGoals: ["Prestige universities", "High salary", "Work while studying", "PR / immigration"],
      weights: {
        funding: 92,
        eligibility: 88,
        country: 76,
        ranking: 68,
        career: 78,
        effort: 56,
        deadline: 72
      }
    }),
    savedScholarshipIds: ["commonwealth-rising-ug", "leeds-south-asia-access"],
    planItems: [],
    applications: [],
    notifications: [
      {
        id: "seed1-alert-1",
        title: "Upload your SOP to unlock 9 scholarships",
        body: "The highest-impact change for Aarav right now is adding a first draft SOP.",
        type: "document",
        read: false
      }
    ],
    assistantMessages: []
  },
  {
    id: "seed-final-year-masters",
    seedLabel: "Final-year undergraduate for master’s",
    selectedLevels: ["Final year undergraduate", "Graduate applicant", "International student"],
    personal: {
      name: "Maya Ofori",
      age: 22,
      nationality: "Ghanaian",
      currentCountry: "Ghana",
      targetCountry: "Canada",
      preferredIntakeYear: "2026"
    },
    education: {
      highSchoolCompleted: true,
      currentQualification: "BSc Computer Engineering",
      boardOrCurriculum: "University credit system",
      gpaScale: "CGPA / 4",
      gpaValue: 3.72,
      subjects: ["Computer Engineering", "Data Science", "Electronics"],
      graduationYear: "2026"
    },
    courseGoals: {
      preferredDegreeLevel: "Master’s",
      preferredSubject: "Artificial Intelligence",
      preferredCountries: ["Canada", "United Kingdom", "Germany"],
      preferredUniversities: ["UBC", "Imperial College London", "TU Munich"],
      budgetRange: "Can contribute partially"
    },
    financial: {
      familyIncomeRange: "GBP20,000 - GBP50,000 / year",
      needBasedFundingInterest: true,
      governmentAidEligibility: false,
      workStudyInterest: true
    },
    testScores: {
      ielts: 7.5,
      gre: 320
    },
    achievements: ["AI research assistant", "Women in STEM ambassador", "Startup internship"],
    documents: baseDocuments({
      sop: { status: "Uploaded", score: 84 },
      recommendation: { status: "Uploaded", score: 80 },
      cv: { status: "Uploaded", score: 86 }
    }),
    preferences: buildDefaultPreferences({
      opportunityTypes: ["Master’s scholarships", "Fellowships", "Research opportunities"],
      preferredCountries: ["Canada", "United Kingdom", "Germany"],
      countryFlexibility: "global",
      preferredSubjects: ["Data Science / AI", "Engineering", "Computer Science"],
      subjectFlexibility: "related",
      fundingType: "tuition",
      minimumFunding: 18000,
      needBased: true,
      eligibilityRange: ["Eligible now", "Almost eligible", "Eligible after improvement", "Long-term targets"],
      recommendationStyle: "ambitious",
      willingToImprove: ["IELTS / TOEFL", "GRE / GMAT", "SOP", "Recommendation letters", "Research proposal"],
      maxEffort: "high",
      deadlinePreference: "urgent",
      intakes: ["Sep 2026", "Jan 2027", "Sep 2027"],
      careerGoals: ["Research career", "Prestige universities", "Industry jobs", "High salary"],
      weights: {
        funding: 70,
        eligibility: 84,
        country: 62,
        ranking: 86,
        career: 88,
        effort: 52,
        deadline: 40
      }
    }),
    savedScholarshipIds: ["imperial-merit-masters", "daad-applied-ai-excellence"],
    planItems: [
      {
        id: "seed2-plan-1",
        scholarshipId: "imperial-merit-masters",
        title: "Refine leadership section in CV",
        description: "Show clearer measurable outcomes from ambassador work.",
        impact: "+4 match score",
        done: false
      }
    ],
    applications: [
      {
        id: "seed2-app-1",
        scholarshipId: "imperial-merit-masters",
        stage: "Preparing documents",
        updatedAt: "2026-05-02",
        checklist: ["Update SOP", "Finalize transcript", "Request second recommendation"]
      }
    ],
    notifications: [
      {
        id: "seed2-alert-1",
        title: "Imperial deadline in 18 days",
        body: "You are 87% matched. Finishing the final recommendation letter could push that above 90.",
        type: "deadline",
        read: false
      }
    ],
    assistantMessages: []
  },
  {
    id: "seed-missing-ielts",
    seedLabel: "Student missing IELTS score",
    selectedLevels: ["Graduate applicant", "International student"],
    personal: {
      name: "Sofia Rahman",
      age: 24,
      nationality: "Bangladeshi",
      currentCountry: "Bangladesh",
      targetCountry: "Australia",
      preferredIntakeYear: "2027"
    },
    education: {
      highSchoolCompleted: true,
      currentQualification: "BBA",
      boardOrCurriculum: "University credit system",
      gpaScale: "CGPA / 4",
      gpaValue: 3.48,
      subjects: ["Business", "Economics", "Analytics"],
      graduationYear: "2025"
    },
    courseGoals: {
      preferredDegreeLevel: "Master’s",
      preferredSubject: "Business Analytics",
      preferredCountries: ["Australia", "United Kingdom", "Ireland"],
      preferredUniversities: ["Melbourne", "Warwick", "Trinity College Dublin"],
      budgetRange: "Need partial scholarship"
    },
    financial: {
      familyIncomeRange: "GBP20,000 - GBP50,000 / year",
      needBasedFundingInterest: true,
      governmentAidEligibility: true,
      workStudyInterest: true
    },
    testScores: {
      ielts: null,
      gmat: 650
    },
    achievements: ["Case competition winner", "Student society vice president", "Part-time analyst"],
    documents: baseDocuments({
      sop: { status: "Uploaded", score: 79 },
      cv: { status: "Uploaded", score: 82 }
    }),
    preferences: buildDefaultPreferences({
      opportunityTypes: ["Master’s scholarships", "Career-switch programs"],
      preferredCountries: ["Australia", "United Kingdom", "Ireland"],
      countryFlexibility: "similar",
      preferredSubjects: ["Business Analytics", "Business", "Public Policy"],
      subjectFlexibility: "related",
      fundingType: "partial",
      minimumFunding: 15000,
      needBased: true,
      eligibilityRange: ["Almost eligible", "Eligible after improvement", "Long-term targets"],
      recommendationStyle: "balanced",
      willingToImprove: ["IELTS / TOEFL", "SOP", "Recommendation letters", "Volunteering"],
      maxEffort: "medium",
      deadlinePreference: "safe",
      intakes: ["Sep 2026", "Jan 2027"],
      careerGoals: ["Industry jobs", "High salary", "Work while studying", "PR / immigration"],
      weights: {
        funding: 84,
        eligibility: 80,
        country: 74,
        ranking: 48,
        career: 76,
        effort: 64,
        deadline: 70
      }
    }),
    savedScholarshipIds: ["melbourne-access-bursary"],
    planItems: [],
    applications: [],
    notifications: [
      {
        id: "seed3-alert-1",
        title: "IELTS is blocking 11 scholarships",
        body: "A score of 7.0 would turn several business scholarships from almost eligible to eligible now.",
        type: "match",
        read: false
      }
    ],
    assistantMessages: []
  },
  {
    id: "seed-strong-grades-missing-docs",
    seedLabel: "Strong grades, missing documents",
    selectedLevels: ["Master’s applicant", "PhD applicant", "International student"],
    personal: {
      name: "Lina Petrova",
      age: 25,
      nationality: "Bulgarian",
      currentCountry: "Bulgaria",
      targetCountry: "Germany",
      preferredIntakeYear: "2026"
    },
    education: {
      highSchoolCompleted: true,
      currentQualification: "MSc Biotechnology",
      boardOrCurriculum: "Bologna",
      gpaScale: "CGPA / 4",
      gpaValue: 3.91,
      subjects: ["Biotechnology", "Genomics", "Research Methods"],
      graduationYear: "2025"
    },
    courseGoals: {
      preferredDegreeLevel: "PhD",
      preferredSubject: "Biotech Research",
      preferredCountries: ["Germany", "Sweden", "United Kingdom"],
      preferredUniversities: ["Heidelberg", "Karolinska", "Cambridge"],
      budgetRange: "Can self-fund living costs if tuition is covered"
    },
    financial: {
      familyIncomeRange: "GBP50,000 - GBP100,000 / year",
      needBasedFundingInterest: false,
      governmentAidEligibility: false,
      workStudyInterest: false
    },
    testScores: {
      ielts: 8,
      gre: 327
    },
    achievements: ["Published co-author", "Research lab mentor", "Biotech fellowship intern"],
    documents: baseDocuments({
      cv: { status: "Uploaded", score: 91 },
      sop: { status: "Missing" },
      recommendation: { status: "Missing" },
      offer: { status: "Missing" }
    }),
    preferences: buildDefaultPreferences({
      opportunityTypes: ["PhD scholarships", "Fellowships", "Research opportunities"],
      preferredCountries: ["Germany", "Sweden", "United Kingdom"],
      countryFlexibility: "global",
      preferredSubjects: ["Biotechnology", "Medicine", "Data Science / AI"],
      subjectFlexibility: "open",
      fundingType: "tuition",
      minimumFunding: 22000,
      needBased: false,
      eligibilityRange: ["Eligible now", "Almost eligible", "Eligible after improvement", "Long-term targets"],
      recommendationStyle: "ambitious",
      willingToImprove: ["SOP", "Recommendation letters", "Research proposal"],
      maxEffort: "high",
      deadlinePreference: "longterm",
      intakes: ["Sep 2026", "Jan 2027", "Sep 2027", "Jan 2028"],
      careerGoals: ["Research career", "Prestige universities", "Low cost of living", "Family-friendly"],
      weights: {
        funding: 58,
        eligibility: 82,
        country: 68,
        ranking: 82,
        career: 90,
        effort: 46,
        deadline: 76
      }
    }),
    savedScholarshipIds: ["horizon-phd-catalyst"],
    planItems: [],
    applications: [],
    notifications: [
      {
        id: "seed4-alert-1",
        title: "You have elite scores but missing letters",
        body: "Recommendation letters are the only blocker for your highest research match set.",
        type: "task",
        read: false
      }
    ],
    assistantMessages: []
  }
];
