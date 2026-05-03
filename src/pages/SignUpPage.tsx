import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type StudentType = "uk" | "international";
type CitizenshipStatus = "home" | "eu" | "international" | "other";

interface SignUpForm {
  // Step 1
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
  termsAccepted: boolean;

  // Step 2
  studentType: StudentType;
  countryOfResidence: string;
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  gpa: string;
  gpaScale: string;
  graduationYear: string;
  standard10: string;
  standard12: string;
  category: string;
  languagesSpoken: string;
  languageChips: string[];
  testScoresOpen: boolean;
  ieltsOverall: string;
  ieltsSpeaking: string;
  toefl: string;
  sat: string;
  gre: string;
  gmat: string;

  // Step 3
  nationality: string;
  citizenshipStatus: CitizenshipStatus;
  dateOfBirth: string;
  gender: string;
  householdIncome: string;
  backgroundOpen: boolean;
  backgroundFlags: string[];

  // Step 4
  targetDestinations: string[];
  studyLevel: string;
  fieldsOfInterest: string[];
  careerStage: string;
  fundingTypes: string[];
  notifWeeklyDigest: boolean;
  notifMatchAlerts: boolean;
  notifDeadlines: boolean;
}

const initialForm: SignUpForm = {
  fullName: "",
  email: "",
  password: "",
  showPassword: false,
  termsAccepted: false,
  studentType: "international",
  countryOfResidence: "",
  educationLevel: "",
  institution: "",
  fieldOfStudy: "",
  gpa: "",
  gpaScale: "/4.0",
  graduationYear: "",
  standard10: "",
  standard12: "",
  category: "",
  languagesSpoken: "",
  languageChips: [],
  testScoresOpen: false,
  ieltsOverall: "",
  ieltsSpeaking: "",
  toefl: "",
  sat: "",
  gre: "",
  gmat: "",
  nationality: "",
  citizenshipStatus: "international",
  dateOfBirth: "",
  gender: "",
  householdIncome: "",
  backgroundOpen: false,
  backgroundFlags: [],
  targetDestinations: [],
  studyLevel: "",
  fieldsOfInterest: [],
  careerStage: "",
  fundingTypes: [],
  notifWeeklyDigest: true,
  notifMatchAlerts: true,
  notifDeadlines: false
};

// ── Step progress metadata ─────────────────────────────────────────────────────

const STEPS = [
  { label: "Account", icon: "👤" },
  { label: "Academic", icon: "🎓" },
  { label: "Eligibility", icon: "✅" },
  { label: "Preferences", icon: "⚙️" }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toggleChip<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-on-surface mb-1.5">{children}</label>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text"
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-outline rounded-lg px-4 py-3 text-sm text-on-surface bg-white
        focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors
        placeholder:text-on-surface-2/50"
    />
  );
}

function SelectInput({
  value,
  onChange,
  children
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-outline rounded-lg px-4 py-3 text-sm text-on-surface bg-white
        focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors appearance-none"
    >
      {children}
    </select>
  );
}

function ChipButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-on-surface-2 border-outline hover:border-primary/40 hover:text-on-surface"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-primary" : "bg-surface-high"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Step Progress Bar ─────────────────────────────────────────────────────────

function StepProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const isCompleted = idx < step;
        const isActive = idx === step;

        return (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? "bg-success text-white"
                    : isActive
                    ? "bg-primary text-white"
                    : "bg-surface-high text-on-surface-2"
                }`}
              >
                {isCompleted ? "✓" : s.icon}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-primary" : isCompleted ? "text-success" : "text-on-surface-2"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                  isCompleted ? "bg-success" : "bg-outline"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Navigation Buttons ────────────────────────────────────────────────────────

function StepNav({
  step,
  totalSteps,
  onBack,
  onNext,
  onComplete
}: {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="flex gap-3 mt-8">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-outline text-on-surface rounded-lg py-3 font-semibold text-sm
            hover:bg-surface-low transition-colors"
        >
          Back
        </button>
      )}
      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-primary text-white rounded-lg py-3 font-semibold text-sm
            hover:bg-primary-dark transition-colors"
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 bg-primary text-white rounded-xl py-3.5 font-semibold text-sm
            hover:bg-primary-dark transition-colors"
        >
          Complete Profile
        </button>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const DESTINATION_MAP: Record<string, string> = {
  "🇺🇸 USA": "United States",
  "🇬🇧 UK": "United Kingdom",
  "🇨🇦 Canada": "Canada",
  "🇦🇺 Australia": "Australia",
  "🇩🇪 Germany": "Germany",
  "🇳🇱 Netherlands": "Netherlands"
};

export function SignUpPage() {
  const navigate = useNavigate();
  const { updateProfile, triggerWelcome } = useAppContext();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SignUpForm>(initialForm);

  const set = <K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const complete = () => {
    const mappedCountries = form.targetDestinations
      .map((d) => DESTINATION_MAP[d])
      .filter(Boolean);
    const firstCountry = mappedCountries[0] ?? "";

    updateProfile((profile) => ({
      ...profile,
      personal: {
        ...profile.personal,
        name: form.fullName || profile.personal.name,
        nationality: form.nationality || profile.personal.nationality,
        currentCountry: form.countryOfResidence || profile.personal.currentCountry,
        targetCountry: firstCountry || profile.personal.targetCountry
      },
      education: {
        ...profile.education,
        currentQualification: form.educationLevel || profile.education.currentQualification,
        gpaScale: form.gpaScale === "/4.0" ? "/ 4.0" : form.gpaScale === "/10.0" ? "/ 10" : form.gpaScale || profile.education.gpaScale,
        gpaValue: form.gpa ? parseFloat(form.gpa) : profile.education.gpaValue,
        subjects: form.fieldOfStudy ? [form.fieldOfStudy] : profile.education.subjects,
        graduationYear: form.graduationYear || profile.education.graduationYear
      },
      courseGoals: {
        ...profile.courseGoals,
        preferredDegreeLevel: form.studyLevel || profile.courseGoals.preferredDegreeLevel,
        preferredSubject: form.fieldsOfInterest[0] || form.fieldOfStudy || profile.courseGoals.preferredSubject,
        preferredCountries: mappedCountries.length > 0 ? mappedCountries : profile.courseGoals.preferredCountries
      },
      financial: {
        ...profile.financial,
        familyIncomeRange: form.householdIncome || profile.financial.familyIncomeRange,
        needBasedFundingInterest:
          form.backgroundFlags.includes("Low-income background") ||
          form.householdIncome.includes("25,000") ||
          profile.financial.needBasedFundingInterest
      },
      testScores: {
        ...profile.testScores,
        ielts: form.ieltsOverall ? parseFloat(form.ieltsOverall) : profile.testScores.ielts,
        toefl: form.toefl ? parseInt(form.toefl, 10) : profile.testScores.toefl,
        sat: form.sat ? parseInt(form.sat, 10) : profile.testScores.sat,
        gre: form.gre ? parseInt(form.gre, 10) : profile.testScores.gre,
        gmat: form.gmat ? parseInt(form.gmat, 10) : profile.testScores.gmat
      }
    }));
    triggerWelcome();
    navigate("/dashboard");
  };

  // Language chip helpers
  const addLanguageChip = () => {
    const trimmed = form.languagesSpoken.trim();
    if (trimmed && !form.languageChips.includes(trimmed)) {
      set("languageChips", [...form.languageChips, trimmed]);
      set("languagesSpoken", "");
    }
  };
  const removeLanguageChip = (lang: string) =>
    set("languageChips", form.languageChips.filter((l) => l !== lang));

  return (
    <div className="min-h-screen bg-surface flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <p className="text-center font-bold text-xl text-on-surface mb-8">Scholar Career</p>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 elevation-1 border border-outline">
          <StepProgressBar step={step} />

          {/* STEP 1: Create Account */}
          {step === 1 && (
            <div>
              <h2 className="text-on-surface font-semibold text-2xl mb-1">Create your account</h2>
              <p className="text-on-surface-2 text-sm mb-6">
                Find scholarships and fellowships built around who you are.
              </p>

              {/* Social buttons */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  className="w-full border border-outline rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-medium text-on-surface hover:bg-surface-low transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="w-full border border-outline rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-medium text-on-surface hover:bg-surface-low transition-colors"
                >
                  <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-outline" />
                <span className="text-on-surface-2 text-xs font-medium">or</span>
                <div className="flex-1 h-px bg-outline" />
              </div>

              {/* Full name */}
              <div className="mb-4">
                <FieldLabel>Full name</FieldLabel>
                <TextInput
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(v) => set("fullName", v)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <FieldLabel>Email address</FieldLabel>
                <TextInput
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <input
                    type={form.showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className="w-full border border-outline rounded-lg px-4 py-3 pr-12 text-sm text-on-surface bg-white
                      focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors
                      placeholder:text-on-surface-2/50"
                  />
                  <button
                    type="button"
                    onClick={() => set("showPassword", !form.showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-2 hover:text-on-surface text-xs font-medium"
                  >
                    {form.showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => set("termsAccepted", e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span className="text-xs text-on-surface-2 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </span>
              </label>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-primary text-white rounded-lg py-3 font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>

              <p className="text-center text-sm text-on-surface-2 mt-4">
                Already have an account?{" "}
                <a href="#" className="text-primary font-medium hover:underline">Sign In</a>
              </p>
            </div>
          )}

          {/* STEP 2: Academic Info */}
          {step === 2 && (
            <div>
              <h2 className="text-on-surface font-semibold text-2xl mb-1">Tell us about your academics</h2>
              <p className="text-on-surface-2 text-sm mb-6">
                We use this to match you with scholarships you're eligible for.
              </p>

              {/* Student type toggles */}
              <div className="flex gap-2 mb-6">
                {(
                  [
                    { value: "uk" as StudentType, label: "🇬🇧 UK Student" },
                    { value: "international" as StudentType, label: "🌍 International Student" }
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("studentType", opt.value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-colors ${
                      form.studentType === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-on-surface-2 border-outline hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {form.studentType === "international" && (
                  <div>
                    <FieldLabel>Country of Residence</FieldLabel>
                    <TextInput
                      placeholder="e.g. India"
                      value={form.countryOfResidence}
                      onChange={(v) => set("countryOfResidence", v)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Education Level</FieldLabel>
                    <SelectInput value={form.educationLevel} onChange={(v) => set("educationLevel", v)}>
                      <option value="">Select level</option>
                      <option>High School</option>
                      <option>Undergraduate</option>
                      <option>Postgraduate</option>
                      <option>PhD</option>
                    </SelectInput>
                  </div>
                  <div>
                    <FieldLabel>Graduation Year</FieldLabel>
                    <SelectInput value={form.graduationYear} onChange={(v) => set("graduationYear", v)}>
                      <option value="">Select year</option>
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                    </SelectInput>
                  </div>
                </div>

                <div>
                  <FieldLabel>Institution</FieldLabel>
                  <TextInput
                    placeholder="e.g. University of Manchester"
                    value={form.institution}
                    onChange={(v) => set("institution", v)}
                  />
                </div>

                <div>
                  <FieldLabel>Field of Study</FieldLabel>
                  <TextInput
                    placeholder="e.g. Computer Science"
                    value={form.fieldOfStudy}
                    onChange={(v) => set("fieldOfStudy", v)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>GPA</FieldLabel>
                    <TextInput
                      type="number"
                      placeholder="e.g. 3.8"
                      value={form.gpa}
                      onChange={(v) => set("gpa", v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>GPA Scale</FieldLabel>
                    <SelectInput value={form.gpaScale} onChange={(v) => set("gpaScale", v)}>
                      <option>/4.0</option>
                      <option>/10.0</option>
                      <option>Percentage</option>
                    </SelectInput>
                  </div>
                </div>

                {/* Indian-specific fields */}
                {form.studentType === "international" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>10th Standard %</FieldLabel>
                        <TextInput
                          type="number"
                          placeholder="e.g. 92"
                          value={form.standard10}
                          onChange={(v) => set("standard10", v)}
                        />
                      </div>
                      <div>
                        <FieldLabel>12th Standard %</FieldLabel>
                        <TextInput
                          type="number"
                          placeholder="e.g. 88"
                          value={form.standard12}
                          onChange={(v) => set("standard12", v)}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Category</FieldLabel>
                      <SelectInput value={form.category} onChange={(v) => set("category", v)}>
                        <option value="">Select category</option>
                        <option>General</option>
                        <option>OBC-NCL</option>
                        <option>SC/ST</option>
                        <option>EWS</option>
                        <option>Prefer not to say</option>
                      </SelectInput>
                    </div>
                  </>
                )}

                {/* Languages */}
                <div>
                  <FieldLabel>Languages Spoken</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a language, press Enter"
                      value={form.languagesSpoken}
                      onChange={(e) => set("languagesSpoken", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguageChip())}
                      className="flex-1 border border-outline rounded-lg px-4 py-2.5 text-sm text-on-surface bg-white
                        focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors
                        placeholder:text-on-surface-2/50"
                    />
                    <button
                      type="button"
                      onClick={addLanguageChip}
                      className="px-4 py-2.5 bg-primary-container text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {form.languageChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.languageChips.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 bg-primary-container text-primary text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguageChip(lang)}
                            className="hover:text-primary-dark font-bold leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Scores (collapsible) */}
                <div className="border border-outline rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => set("testScoresOpen", !form.testScoresOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-low transition-colors"
                  >
                    <span>Test Scores (optional)</span>
                    <span className="text-on-surface-2">{form.testScoresOpen ? "▲" : "▼"}</span>
                  </button>
                  {form.testScoresOpen && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-outline pt-3">
                      {[
                        { key: "ieltsOverall" as keyof SignUpForm, label: "IELTS Overall" },
                        { key: "ieltsSpeaking" as keyof SignUpForm, label: "IELTS Speaking" },
                        { key: "toefl" as keyof SignUpForm, label: "TOEFL" },
                        { key: "sat" as keyof SignUpForm, label: "SAT" },
                        { key: "gre" as keyof SignUpForm, label: "GRE" },
                        { key: "gmat" as keyof SignUpForm, label: "GMAT" }
                      ].map((t) => (
                        <div key={t.key}>
                          <label className="text-xs font-medium text-on-surface-2 mb-1 block">{t.label}</label>
                          <input
                            type="number"
                            placeholder="—"
                            value={form[t.key] as string}
                            onChange={(e) => set(t.key, e.target.value)}
                            className="w-full border border-outline rounded-lg px-3 py-2 text-sm text-on-surface bg-white
                              focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <StepNav step={step} totalSteps={STEPS.length} onBack={prevStep} onNext={nextStep} onComplete={complete} />
            </div>
          )}

          {/* STEP 3: Eligibility Profile */}
          {step === 3 && (
            <div>
              <h2 className="text-on-surface font-semibold text-2xl mb-1">Eligibility profile</h2>
              <p className="text-on-surface-2 text-sm mb-6">
                Many scholarships are restricted by nationality, residency, or background.
              </p>

              <div className="space-y-4">
                <div>
                  <FieldLabel>Nationality</FieldLabel>
                  <SelectInput value={form.nationality} onChange={(v) => set("nationality", v)}>
                    <option value="">Select nationality</option>
                    <option>Indian</option>
                    <option>British</option>
                    <option>American</option>
                    <option>Nigerian</option>
                    <option>Pakistani</option>
                    <option>Bangladeshi</option>
                    <option>Other</option>
                  </SelectInput>
                </div>

                {/* Citizenship status */}
                <div>
                  <FieldLabel>Citizenship Status (for study destination)</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: "home" as CitizenshipStatus, label: "Home" },
                        { value: "eu" as CitizenshipStatus, label: "EU" },
                        { value: "international" as CitizenshipStatus, label: "International" },
                        { value: "other" as CitizenshipStatus, label: "Other" }
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set("citizenshipStatus", opt.value)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-semibold border transition-colors ${
                          form.citizenshipStatus === opt.value
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-on-surface-2 border-outline hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <TextInput
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(v) => set("dateOfBirth", v)}
                  />
                </div>

                <div>
                  <FieldLabel>Gender</FieldLabel>
                  <SelectInput value={form.gender} onChange={(v) => set("gender", v)}>
                    <option value="">Select gender</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </SelectInput>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-sm font-medium text-on-surface">Household Income Bracket</label>
                    <span
                      title="Used for need-based matching only"
                      className="w-4 h-4 rounded-full bg-surface-container text-on-surface-2 text-xs flex items-center justify-center cursor-help flex-shrink-0"
                    >
                      ?
                    </span>
                  </div>
                  <SelectInput value={form.householdIncome} onChange={(v) => set("householdIncome", v)}>
                    <option value="">Select bracket</option>
                    <option>Under £25,000</option>
                    <option>£25,000–£40,000</option>
                    <option>£40,000–£60,000</option>
                    <option>Over £60,000</option>
                  </SelectInput>
                </div>

                {/* Background (collapsible) */}
                <div className="border border-outline rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => set("backgroundOpen", !form.backgroundOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-low transition-colors"
                  >
                    <span>Background Information (optional)</span>
                    <span className="text-on-surface-2">{form.backgroundOpen ? "▲" : "▼"}</span>
                  </button>
                  {form.backgroundOpen && (
                    <div className="px-4 pb-4 border-t border-outline pt-3 space-y-3">
                      {[
                        {
                          key: "First-generation student",
                          help: "First in your family to attend university"
                        },
                        {
                          key: "Refugee or asylum seeker",
                          help: "Displaced by conflict or persecution"
                        },
                        {
                          key: "Disability or long-term health condition",
                          help: "Physical, mental, or neurodivergent condition"
                        },
                        {
                          key: "Low-income background",
                          help: "Eligible for need-based scholarships"
                        }
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          className="flex items-start gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.backgroundFlags.includes(opt.key)}
                            onChange={() =>
                              set("backgroundFlags", toggleChip(form.backgroundFlags, opt.key))
                            }
                            className="mt-0.5 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-on-surface">{opt.key}</p>
                            <p className="text-xs text-on-surface-2">{opt.help}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <StepNav step={step} totalSteps={STEPS.length} onBack={prevStep} onNext={nextStep} onComplete={complete} />
            </div>
          )}

          {/* STEP 4: Preferences */}
          {step === 4 && (
            <div>
              <h2 className="text-on-surface font-semibold text-2xl mb-1">What are you looking for?</h2>
              <p className="text-on-surface-2 text-sm mb-6">
                We'll personalize your dashboard based on these preferences.
              </p>

              <div className="space-y-6">
                {/* Target Destinations */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Target Destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "🇺🇸 USA",
                      "🇬🇧 UK",
                      "🇨🇦 Canada",
                      "🇦🇺 Australia",
                      "🇩🇪 Germany",
                      "🇳🇱 Netherlands",
                      "🌍 Global"
                    ].map((dest) => (
                      <ChipButton
                        key={dest}
                        active={form.targetDestinations.includes(dest)}
                        onClick={() =>
                          set("targetDestinations", toggleChip(form.targetDestinations, dest))
                        }
                      >
                        {dest}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                {/* Study Level */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Study Level</p>
                  <div className="flex flex-wrap gap-2">
                    {["Bachelor's", "Master's", "PhD", "Postdoc"].map((level) => (
                      <ChipButton
                        key={level}
                        active={form.studyLevel === level}
                        onClick={() => set("studyLevel", level)}
                      >
                        {level}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                {/* Fields of Interest */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Fields of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "STEM",
                      "Medicine",
                      "Law",
                      "Business",
                      "Arts & Humanities",
                      "Social Sciences",
                      "Engineering"
                    ].map((field) => (
                      <ChipButton
                        key={field}
                        active={form.fieldsOfInterest.includes(field)}
                        onClick={() =>
                          set("fieldsOfInterest", toggleChip(form.fieldsOfInterest, field))
                        }
                      >
                        {field}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                {/* Career Stage */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Career Stage</p>
                  <div className="flex rounded-lg border border-outline overflow-hidden">
                    {["Student", "Early Career", "Mid-Career"].map((stage, i, arr) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => set("careerStage", stage)}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                          i < arr.length - 1 ? "border-r border-outline" : ""
                        } ${
                          form.careerStage === stage
                            ? "bg-primary text-white"
                            : "bg-white text-on-surface-2 hover:bg-surface-low"
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Funding Types */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Funding Types</p>
                  <div className="flex flex-wrap gap-2">
                    {["Full Scholarship", "Partial", "Fellowship", "Grant"].map((type) => (
                      <ChipButton
                        key={type}
                        active={form.fundingTypes.includes(type)}
                        onClick={() =>
                          set("fundingTypes", toggleChip(form.fundingTypes, type))
                        }
                      >
                        {type}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <p className="text-sm font-medium text-on-surface mb-3">Notifications</p>
                  <div className="space-y-3">
                    {[
                      {
                        key: "notifWeeklyDigest" as keyof SignUpForm,
                        label: "Weekly digest",
                        desc: "Summary of top opportunities"
                      },
                      {
                        key: "notifMatchAlerts" as keyof SignUpForm,
                        label: "Match alerts",
                        desc: "Instant alerts for perfect fits"
                      },
                      {
                        key: "notifDeadlines" as keyof SignUpForm,
                        label: "Deadlines",
                        desc: "Reminders before closing dates"
                      }
                    ].map((notif) => (
                      <div
                        key={notif.key}
                        className="flex items-center justify-between py-2.5 px-3 bg-surface-low rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{notif.label}</p>
                          <p className="text-xs text-on-surface-2">{notif.desc}</p>
                        </div>
                        <Toggle
                          checked={form[notif.key] as boolean}
                          onChange={(v) => set(notif.key, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complete button */}
              <button
                type="button"
                onClick={complete}
                className="mt-8 w-full bg-primary text-white rounded-xl py-3.5 font-semibold text-base hover:bg-primary-dark transition-colors"
              >
                Complete Profile
              </button>
              <p className="text-center text-xs text-on-surface-2 mt-3">
                You're all set — your matches will be ready in seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
