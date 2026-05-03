import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import { WeightSlider } from "../components/ui/WeightSlider";
import {
  opportunityTypeOptions,
  countryOptions,
  subjectOptions,
  eligibilityRangeOptions,
  improvementOptions,
  intakeOptions,
  careerGoalOptions,
  weightLabels
} from "../data/preferences";
import type { StudentPreferences } from "../types/app";

const TABS = [
  "Goals",
  "Countries & Courses",
  "Funding",
  "Eligibility",
  "Effort & Timeline",
  "Career",
  "Match Weights"
] as const;

type Tab = (typeof TABS)[number];

function Chip({
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
      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-on-surface-2 border-outline hover:border-primary/40 hover:text-on-surface"
      }`}
    >
      {children}
    </button>
  );
}

function SegRow({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-outline last:border-0">
      <p className="text-sm font-medium text-on-surface min-w-[140px]">{label}</p>
      <div className="flex rounded-lg border border-outline overflow-hidden">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${i < options.length - 1 ? "border-r border-outline" : ""} ${
              value === opt.value
                ? "bg-primary text-white"
                : "bg-white text-on-surface-2 hover:bg-surface-low"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniMatchCard({ score, name, amount, country }: { score: number; name: string; amount: string; country: string }) {
  return (
    <div className="rounded-lg border border-outline bg-white p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-low flex items-center justify-center text-xs font-bold text-primary shrink-0">
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface truncate">{name}</p>
        <p className="text-[10px] text-on-surface-2">{amount} · {country}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${score >= 85 ? "bg-ai-purple text-white" : "bg-primary-container text-primary"}`}>
        {score}%
      </span>
    </div>
  );
}

export function PreferencesPage() {
  const { showToast } = useToast();
  const {
    currentPreferences,
    updatePreferences,
    visibleMatches,
    allMatches,
    preferenceCompletion,
    matchmakingStrength,
    preferenceSummary
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<Tab>("Goals");

  const set = <K extends keyof StudentPreferences>(key: K, value: StudentPreferences[K], toast = true) => {
    updatePreferences((p) => ({ ...p, [key]: value }));
    if (toast) showToast("Preferences saved.", "success");
  };

  const toggleArr = <K extends keyof StudentPreferences>(key: K, value: string) => {
    updatePreferences((p) => {
      const arr = (p[key] as string[]);
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...p, [key]: next };
    });
  };

  const setWeight = (key: keyof StudentPreferences["weights"], value: number) => {
    updatePreferences((p) => ({
      ...p,
      weights: { ...p.weights, [key]: value }
    }));
  };

  const eligibleNow = allMatches.filter((m) => m.status === "Eligible now").length;
  const almostEligible = allMatches.filter((m) => m.status === "Almost eligible").length;
  const topThree = [...visibleMatches].slice(0, 3);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-outline pb-5">
        <p className="label-caps text-primary">Matchmaking engine</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Preferences</h1>
        <p className="mt-1.5 text-sm text-on-surface-2 max-w-2xl">
          Every change here updates your match scores across all pages in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-6 items-start">
        {/* Left: Status panel */}
        <div className="space-y-4">
          <div className="panel p-5">
            <p className="label-caps text-on-surface-2 mb-3">Matchmaking strength</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-on-surface">{matchmakingStrength}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${matchmakingStrength}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-ai-purple mb-0.5">{preferenceSummary.label}</p>
            <p className="text-[11px] text-on-surface-2 leading-relaxed">{preferenceSummary.body}</p>
          </div>

          <div className="panel p-5 space-y-3">
            <p className="label-caps text-on-surface-2">Live match counts</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-2">Eligible now</span>
              <span className="text-base font-bold text-success">{eligibleNow}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-2">Almost eligible</span>
              <span className="text-base font-bold text-warning">{almostEligible}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-2">Visible total</span>
              <span className="text-base font-bold text-on-surface">{visibleMatches.length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-outline pt-2">
              <span className="text-xs text-on-surface-2">Pref. completion</span>
              <span className="text-sm font-semibold text-primary">{preferenceCompletion}%</span>
            </div>
          </div>

          <div className="panel p-5">
            <p className="label-caps text-on-surface-2 mb-2">Quick links</p>
            {[
              { label: "Edit profile", to: "/profile-builder" },
              { label: "View eligibility map", to: "/eligibility-map" },
              { label: "Browse matches", to: "/scholarship-matching" }
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center justify-between py-2 text-xs font-medium text-on-surface-2 hover:text-primary transition-colors"
              >
                {l.label}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Tab editor */}
        <div className="space-y-5">
          {/* Tab nav */}
          <div className="flex gap-1 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-on-surface text-white"
                    : "bg-white border border-outline text-on-surface-2 hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="panel p-6">
            {/* GOALS */}
            {activeTab === "Goals" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Opportunity types</h3>
                  <p className="text-xs text-on-surface-2 mb-3">What kinds of funding are you looking for?</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunityTypeOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.opportunityTypes.includes(opt)}
                        onClick={() => toggleArr("opportunityTypes", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Target intakes</h3>
                  <p className="text-xs text-on-surface-2 mb-3">When do you plan to start?</p>
                  <div className="flex flex-wrap gap-2">
                    {intakeOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.intakes.includes(opt)}
                        onClick={() => toggleArr("intakes", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COUNTRIES & COURSES */}
            {activeTab === "Countries & Courses" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Preferred countries</h3>
                  <p className="text-xs text-on-surface-2 mb-3">Select every destination you'd consider.</p>
                  <div className="flex flex-wrap gap-2">
                    {countryOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.preferredCountries.includes(opt)}
                        onClick={() => toggleArr("preferredCountries", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline pt-5">
                  <SegRow
                    label="Country flexibility"
                    value={currentPreferences.countryFlexibility}
                    options={[
                      { value: "strict", label: "Strict" },
                      { value: "similar", label: "Similar" },
                      { value: "global", label: "Global" }
                    ]}
                    onChange={(v) => set("countryFlexibility", v as StudentPreferences["countryFlexibility"])}
                  />
                </div>

                <div className="border-t border-outline pt-5">
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Preferred subjects</h3>
                  <p className="text-xs text-on-surface-2 mb-3">What fields are you targeting?</p>
                  <div className="flex flex-wrap gap-2">
                    {subjectOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.preferredSubjects.includes(opt)}
                        onClick={() => toggleArr("preferredSubjects", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline pt-5">
                  <SegRow
                    label="Subject flexibility"
                    value={currentPreferences.subjectFlexibility}
                    options={[
                      { value: "exact", label: "Exact" },
                      { value: "related", label: "Related" },
                      { value: "open", label: "Open" }
                    ]}
                    onChange={(v) => set("subjectFlexibility", v as StudentPreferences["subjectFlexibility"])}
                  />
                </div>
              </div>
            )}

            {/* FUNDING */}
            {activeTab === "Funding" && (
              <div className="space-y-5">
                <SegRow
                  label="Funding type"
                  value={currentPreferences.fundingType}
                  options={[
                    { value: "full", label: "Full" },
                    { value: "tuition", label: "Tuition" },
                    { value: "partial", label: "Partial" },
                    { value: "any", label: "Any" }
                  ]}
                  onChange={(v) => set("fundingType", v as StudentPreferences["fundingType"])}
                />

                <div className="border-t border-outline pt-5">
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Minimum funding (£)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={currentPreferences.minimumFunding}
                    onChange={(e) => set("minimumFunding", Number(e.target.value), false)}
                    className="input max-w-xs"
                  />
                  <p className="text-xs text-on-surface-2 mt-1.5">Scholarships below this will score lower in funding fit.</p>
                </div>

                <div className="border-t border-outline pt-5">
                  <SegRow
                    label="Need-based interest"
                    value={String(currentPreferences.needBased)}
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "unsure", label: "Unsure" },
                      { value: "false", label: "No" }
                    ]}
                    onChange={(v) => set("needBased", v === "true" ? true : v === "false" ? false : "unsure")}
                  />
                </div>
              </div>
            )}

            {/* ELIGIBILITY */}
            {activeTab === "Eligibility" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Eligibility range to show</h3>
                  <p className="text-xs text-on-surface-2 mb-3">Which match tiers should appear in your feed?</p>
                  <div className="flex flex-wrap gap-2">
                    {eligibilityRangeOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.eligibilityRange.includes(opt)}
                        onClick={() => toggleArr("eligibilityRange", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline pt-5">
                  <SegRow
                    label="Recommendation style"
                    value={currentPreferences.recommendationStyle}
                    options={[
                      { value: "safe", label: "Safe" },
                      { value: "balanced", label: "Balanced" },
                      { value: "ambitious", label: "Ambitious" }
                    ]}
                    onChange={(v) => set("recommendationStyle", v as StudentPreferences["recommendationStyle"])}
                  />
                  <p className="text-xs text-on-surface-2 mt-2">
                    Safe shows only strong fits. Ambitious includes all potential opportunities even with gaps.
                  </p>
                </div>
              </div>
            )}

            {/* EFFORT & TIMELINE */}
            {activeTab === "Effort & Timeline" && (
              <div className="space-y-5">
                <SegRow
                  label="Max effort level"
                  value={currentPreferences.maxEffort}
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" }
                  ]}
                  onChange={(v) => set("maxEffort", v as StudentPreferences["maxEffort"])}
                />

                <div className="border-t border-outline pt-5">
                  <SegRow
                    label="Deadline preference"
                    value={currentPreferences.deadlinePreference}
                    options={[
                      { value: "safe", label: "Safe" },
                      { value: "urgent", label: "Urgent" },
                      { value: "longterm", label: "Long-term" }
                    ]}
                    onChange={(v) => set("deadlinePreference", v as StudentPreferences["deadlinePreference"])}
                  />
                </div>

                <div className="border-t border-outline pt-5">
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Willing to improve</h3>
                  <p className="text-xs text-on-surface-2 mb-3">Which of these are you open to working on?</p>
                  <div className="flex flex-wrap gap-2">
                    {improvementOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.willingToImprove.includes(opt)}
                        onClick={() => toggleArr("willingToImprove", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CAREER */}
            {activeTab === "Career" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Career goals</h3>
                  <p className="text-xs text-on-surface-2 mb-3">
                    These signal to the engine which scholarships align with your post-study ambitions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {careerGoalOptions.map((opt) => (
                      <Chip
                        key={opt}
                        active={currentPreferences.careerGoals.includes(opt)}
                        onClick={() => toggleArr("careerGoals", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MATCH WEIGHTS */}
            {activeTab === "Match Weights" && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-surface-low border border-outline text-xs text-on-surface-2">
                  Adjusting weights re-ranks all scholarships instantly. Higher weight = that dimension matters more to you.
                </div>
                {weightLabels.map((w) => (
                  <WeightSlider
                    key={w.key}
                    label={w.label}
                    value={currentPreferences.weights[w.key]}
                    onChange={(v) => setWeight(w.key, v)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <div>
            <p className="label-caps text-on-surface-2 mb-3">Live preview</p>
            <div className="panel p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-2">Top match</span>
                <span className="text-sm font-bold text-primary">{visibleMatches[0]?.score ?? 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-2">Eligible now</span>
                <span className="text-sm font-bold text-success">{eligibleNow}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-2">Almost eligible</span>
                <span className="text-sm font-bold text-warning">{almostEligible}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="label-caps text-on-surface-2 mb-3">Top scholarships</p>
            <div className="space-y-2">
              {topThree.length > 0 ? (
                topThree.map((m) => (
                  <MiniMatchCard
                    key={m.scholarship.id}
                    score={m.score}
                    name={m.scholarship.name}
                    amount={m.scholarship.amountLabel}
                    country={m.scholarship.country}
                  />
                ))
              ) : (
                <p className="text-xs text-on-surface-2 py-4 text-center">Complete your profile to see live matches.</p>
              )}
            </div>
          </div>

          <div className="panel p-4 bg-ai-purple-light border-ai-purple/20">
            <p className="text-xs font-semibold text-ai-purple mb-1">{preferenceSummary.label}</p>
            <p className="text-[11px] text-on-surface-2 leading-relaxed">{preferenceSummary.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
