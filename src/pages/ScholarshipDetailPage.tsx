import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import { findSimilarScholarships } from "../utils/matching";

const detailTabs = ["Overview", "Eligibility", "Documents", "Timeline", "AI Analysis", "Similar"] as const;
type DetailTab = (typeof detailTabs)[number];

const SCORE_LABELS: Record<string, string> = {
  eligibilityFit: "Eligibility",
  academicFit: "Academic",
  fieldFit: "Field",
  countryFit: "Country",
  fundingFit: "Funding",
  effortFit: "Effort",
  deadlineFit: "Deadline"
};

// Max points per component — used to normalise bars to 0-100%
const SCORE_MAXES: Record<string, number> = {
  eligibilityFit: 35,
  academicFit: 20,
  fieldFit: 15,
  countryFit: 10,
  fundingFit: 10,
  effortFit: 5,
  deadlineFit: 5
};

const normalisedPct = (key: string, value: number) =>
  Math.round((value / (SCORE_MAXES[key] ?? 100)) * 100);

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function getDaysRemaining(deadline: string): number {
  const d = new Date(deadline);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function ScholarshipDetailPage() {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { allMatches, currentProfile, currentPreferences, toggleSaveScholarship, addPlanItem } = useAppContext();
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");

  const match = allMatches.find((item) => item.scholarship.id === scholarshipId) ?? allMatches[0] ?? null;
  const similar = useMemo(
    () => match ? findSimilarScholarships(match.scholarship.id, currentProfile, currentPreferences) : [],
    [currentPreferences, currentProfile, match]
  );
  const saved = match ? currentProfile.savedScholarshipIds.includes(match.scholarship.id) : false;

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-on-surface-2 text-sm">Scholarship not found.</p>
        <button className="mt-4 btn-primary" onClick={() => navigate("/scholarship-matching")} type="button">
          Browse scholarships
        </button>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(match.scholarship.deadline);
  const providerInitial = match.scholarship.provider.charAt(0).toUpperCase();

  const breakdownEntries = Object.entries(match.breakdown) as [string, number][];

  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      {/* BREADCRUMB */}
      <nav className="text-on-surface-2 text-sm mb-6">
        <Link className="hover:text-on-surface transition-colors" to="/scholarship-matching">
          Scholarships
        </Link>
        <span className="mx-2">/</span>
        <span className="text-on-surface">{match.scholarship.name}</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        {/* Logo box */}
        <div className="w-16 h-16 rounded-xl bg-white elevation-1 border border-outline flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {providerInitial}
        </div>

        {/* Meta column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {match.scholarship.tags.slice(0, 3).map((tag) => (
              <span
                className="bg-surface-container text-on-surface-2 text-xs px-2.5 py-1 rounded-full font-medium"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-on-surface font-semibold text-2xl mt-1 leading-tight">
            {match.scholarship.name}
          </h1>
          <p className="text-on-surface-2 text-base mt-1">{match.scholarship.provider}</p>
        </div>

        {/* Award amount */}
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2">
            Award Amount
          </p>
          <h2 className="text-primary font-bold text-3xl mt-1">{match.scholarship.amountLabel}</h2>
          <p className="text-on-surface-2 text-sm mt-0.5">per academic year</p>
        </div>
      </div>

      {/* MAIN 3-COL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT MAIN */}
        <div className="lg:col-span-2 space-y-6">
          {/* TABS */}
          <div className="flex gap-1 bg-surface-container p-1 rounded-xl flex-wrap">
            {detailTabs.map((tab) => (
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm elevation-1"
                    : "text-on-surface-2 hover:text-on-surface"
                }`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="bg-white rounded-xl elevation-1 border border-outline p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-on-surface text-base mb-3">About</h3>
                  <p className="text-on-surface-2 leading-relaxed text-sm">{match.scholarship.description}</p>
                </div>

                <div className="border-t border-outline pt-5">
                  <h3 className="font-semibold text-on-surface text-base mb-3">
                    How this matches your profile
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`text-2xl font-bold ${
                        match.score >= 90
                          ? "text-ai-purple"
                          : match.score >= 75
                          ? "text-primary"
                          : "text-on-surface"
                      }`}
                    >
                      {match.score}%
                    </div>
                    <div>
                      <p className="text-on-surface text-sm font-medium">Overall Match</p>
                      <p className="text-on-surface-2 text-xs">{match.status}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {breakdownEntries.map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-on-surface-2 text-xs">
                            {SCORE_LABELS[key] ?? key}
                          </span>
                          <span className="text-on-surface text-xs font-semibold">{normalisedPct(key, value)}%</span>
                        </div>
                        <ScoreBar value={normalisedPct(key, value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ELIGIBILITY TAB */}
            {activeTab === "Eligibility" && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-success text-lg">✓</span>
                  <h3 className="font-semibold text-on-surface text-base">Eligibility Criteria</h3>
                </div>

                <div className="space-y-2">
                  {match.scholarship.requirements.preferredSubjects.map((subj) => (
                    <div
                      className="text-success bg-success-light rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
                      key={subj}
                    >
                      <span className="text-base">✅</span>
                      <span>{subj}</span>
                    </div>
                  ))}
                  {match.missingCriteria.map((crit) => (
                    <div
                      className="text-red-600 bg-red-50 rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
                      key={crit}
                    >
                      <span className="text-base">❌</span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-on-surface text-sm mb-3">Score Breakdown</h4>
                  <div className="bg-surface-container rounded-lg p-4 grid grid-cols-2 gap-3">
                    {breakdownEntries.map(([key, value]) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-2 text-xs">
                            {SCORE_LABELS[key] ?? key}
                          </span>
                          <span className="text-on-surface text-xs font-semibold">{normalisedPct(key, value)}%</span>
                        </div>
                        <ScoreBar value={normalisedPct(key, value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "Documents" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-on-surface text-base mb-1">Required Documents</h3>
                <div className="space-y-3">
                  {match.scholarship.documents.map((doc) => {
                    const vaultDoc = currentProfile.documents.find(
                      (item) => item.label === doc || item.id === doc.toLowerCase().replace(/ /g, "-")
                    );
                    const status = vaultDoc?.status ?? "Missing";
                    return (
                      <div
                        className="flex items-center justify-between gap-3 border border-outline rounded-lg px-4 py-3"
                        key={doc}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-on-surface-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                          </span>
                          <span className="text-on-surface text-sm font-medium">{doc}</span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            status === "Uploaded"
                              ? "bg-success-light text-success"
                              : status === "Needs improvement"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "Timeline" && (
              <div>
                <h3 className="font-semibold text-on-surface text-base mb-5">Application Timeline</h3>
                <ol className="space-y-0">
                  {match.scholarship.timeline.map((step, index) => (
                    <li className="flex gap-4" key={step}>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        {index < match.scholarship.timeline.length - 1 && (
                          <div className="w-0.5 h-6 bg-outline mt-1" />
                        )}
                      </div>
                      <div className="pb-6 pt-1">
                        <p className="text-on-surface text-sm font-medium leading-relaxed">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* AI ANALYSIS TAB */}
            {activeTab === "AI Analysis" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-ai-purple-light rounded-xl border border-ai-purple/20">
                  <div className="text-ai-purple text-2xl">✦</div>
                  <div>
                    <p className="text-ai-purple font-semibold text-sm">AI Score Analysis</p>
                    <p className="text-on-surface-2 text-xs mt-0.5">
                      Your score could rise from{" "}
                      <span className="font-bold text-on-surface">{match.score}%</span> to{" "}
                      <span className="font-bold text-ai-purple">{match.improvedScore}%</span> by following
                      these actions.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-on-surface text-sm mb-3">Unlock Actions</h4>
                  <div className="space-y-3">
                    {match.unlockActions.map((action, index) => (
                      <div
                        className="bg-ai-purple-light rounded-lg p-4 border border-ai-purple/20"
                        key={action}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-on-surface text-sm font-medium leading-relaxed flex-1">
                            {action}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                              match.difficulty === "Low"
                                ? "bg-success-light text-success"
                                : match.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {match.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs text-on-surface-2 bg-white px-2 py-1 rounded-full border border-outline">
                            ⏱ {match.timeToUnlock}
                          </span>
                          <span className="text-xs text-on-surface-2 bg-white px-2 py-1 rounded-full border border-outline">
                            💰 {match.costEstimate}
                          </span>
                          <span className="text-xs text-ai-purple bg-white px-2 py-1 rounded-full border border-ai-purple/20">
                            +{match.improvedScore - match.score}% potential
                          </span>
                        </div>
                        <button
                          className="text-primary text-xs font-semibold hover:underline"
                          onClick={() => {
                            addPlanItem(
                              match.scholarship.id,
                              `Action ${index + 1}: ${match.scholarship.name}`,
                              action,
                              `Toward ${match.improvedScore}%`
                            );
                            showToast("Action added to your plan", "success");
                          }}
                          type="button"
                        >
                          + Add to My Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SIMILAR TAB */}
            {activeTab === "Similar" && (
              <div>
                <h3 className="font-semibold text-on-surface text-base mb-5">Similar Scholarships</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similar.slice(0, 4).map((result) => (
                    <button
                      className="text-left bg-surface-low border border-outline rounded-xl p-4 hover:border-primary hover:elevation-1 transition-all"
                      key={result.scholarship.id}
                      onClick={() => navigate(`/scholarship/${result.scholarship.id}`)}
                      type="button"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-on-surface-2">
                          {result.scholarship.country}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            result.score >= 75 ? "bg-primary text-white" : "bg-surface-container text-on-surface-2"
                          }`}
                        >
                          {result.score}%
                        </span>
                      </div>
                      <p className="text-on-surface font-semibold text-sm line-clamp-2 mb-1">
                        {result.scholarship.name}
                      </p>
                      <p className="text-primary font-bold text-base">{result.scholarship.amountLabel}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-20">
          {/* ACTION CARD */}
          <div className="bg-white rounded-xl elevation-2 border border-outline p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2">
              Application Deadline
            </p>
            <h3 className="text-on-surface font-semibold text-xl mt-2">{match.scholarship.deadline}</h3>
            {daysRemaining > 0 ? (
              <div className="flex items-center gap-1.5 text-primary text-sm font-medium mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {daysRemaining} Days Remaining
              </div>
            ) : (
              <div className="text-red-500 text-sm font-medium mt-1">Deadline passed</div>
            )}

            <a
              className="block bg-primary text-white text-center rounded-xl py-3.5 w-full font-semibold text-base mt-4 hover:opacity-90 transition-opacity"
              href={`https://www.google.com/search?q=${encodeURIComponent(match.scholarship.name + " apply")}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Apply Now
            </a>
            <button
              className={`w-full rounded-xl py-3 font-medium text-sm mt-2 border transition-colors ${
                saved
                  ? "border-primary text-primary bg-primary/5"
                  : "border-outline text-on-surface hover:border-primary hover:text-primary"
              }`}
              onClick={() => {
                toggleSaveScholarship(match.scholarship.id);
                showToast(saved ? "Removed from saved" : "Saved to your list", "success");
              }}
              type="button"
            >
              {saved ? "Saved" : "Save Scholarship"}
            </button>
          </div>

          {/* MATCH SCORE CARD */}
          <div
            className={`bg-white rounded-xl elevation-1 border border-outline p-5 ${match.score >= 90 ? "ai-glow" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2">
              Your Match Score
            </p>
            <div className="flex items-end gap-3 mt-3 mb-3">
              <span className="text-5xl font-bold text-on-surface">{match.score}%</span>
              <span
                className={`mb-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                  match.score >= 90
                    ? "bg-ai-purple-light text-ai-purple"
                    : match.score >= 75
                    ? "bg-primary/10 text-primary"
                    : match.score >= 50
                    ? "bg-success-light text-success"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {match.status}
              </span>
            </div>
            <div className="space-y-2.5">
              {breakdownEntries.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-on-surface-2 text-xs">{SCORE_LABELS[key] ?? key}</span>
                    <span className="text-on-surface text-xs font-semibold">{normalisedPct(key, value)}%</span>
                  </div>
                  <ScoreBar value={normalisedPct(key, value)} />
                </div>
              ))}
            </div>
          </div>

          {/* SELECTION TIMELINE */}
          <div className="bg-white rounded-xl elevation-1 border border-outline p-5">
            <h3 className="font-semibold text-on-surface text-sm mb-4">Selection Timeline</h3>
            <div className="space-y-3">
              {[
                { icon: "📋", label: "Review Period", date: "After deadline" },
                { icon: "🎤", label: "Interviews", date: "2-4 weeks later" },
                { icon: "🏆", label: "Final Decision", date: "6-8 weeks later" },
              ].map((stage) => (
                <div className="flex items-start gap-3" key={stage.label}>
                  <span className="text-base">{stage.icon}</span>
                  <div>
                    <p className="text-on-surface text-sm font-medium">{stage.label}</p>
                    <p className="text-on-surface-2 text-xs">{stage.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT CARD */}
          <div className="bg-surface-container rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">?</span>
              <h3 className="font-semibold text-on-surface text-sm">Questions?</h3>
            </div>
            <p className="text-on-surface-2 text-xs mb-3">
              Contact the scholarship provider for more details about eligibility and the application process.
            </p>
            <div className="space-y-2">
              <a
                className="block text-primary text-sm font-medium hover:underline"
                href={`mailto:admissions@${match.scholarship.provider.toLowerCase().replace(/ /g, "")}.edu`}
              >
                Email Provider
              </a>
              <a
                className="block text-primary text-sm font-medium hover:underline"
                href={`https://www.google.com/search?q=${encodeURIComponent(match.scholarship.name)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit Website
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
