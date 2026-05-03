import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import type { MatchResult } from "../types/app";

type GroupKey = "Eligible now" | "Almost eligible" | "Needs improvement" | "Not eligible yet";

const GROUP_STYLES: Record<GroupKey, { badge: string; label: string }> = {
  "Eligible now": { badge: "bg-success-light text-success", label: "Apply now" },
  "Almost eligible": { badge: "bg-amber-50 text-warning", label: "Close to ready" },
  "Needs improvement": { badge: "bg-primary-container text-primary", label: "Needs work" },
  "Not eligible yet": { badge: "bg-surface-container text-on-surface-2", label: "Long-term" }
};

function SavedCard({
  match,
  onRemove,
  onTrack,
  onImprove
}: {
  match: MatchResult;
  onRemove: () => void;
  onTrack: () => void;
  onImprove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = GROUP_STYLES[match.status as GroupKey] ?? GROUP_STYLES["Not eligible yet"];
  const daysLeft = Math.max(0, Math.ceil((new Date(match.scholarship.deadline).getTime() - Date.now()) / 86400000));
  const isUrgent = daysLeft <= 30;

  return (
    <div className="rounded-xl border border-outline bg-white p-5 elevation-1 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-surface-container flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {match.scholarship.provider[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on-surface line-clamp-2 leading-snug">
              {match.scholarship.name}
            </p>
            <p className="text-xs text-on-surface-2 mt-0.5">
              {match.scholarship.amountLabel} · {match.scholarship.country}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${match.score >= 85 ? "bg-ai-purple text-white" : "bg-primary-container text-primary"}`}>
            {match.score}%
          </span>
          <p className={`text-[10px] mt-1 ${isUrgent ? "text-red-500" : "text-on-surface-2"}`}>
            {daysLeft > 0 ? `${daysLeft}d left` : "Deadline passed"}
          </p>
        </div>
      </div>

      {/* Status + missing */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
          {style.label}
        </span>
        {match.missingCriteria.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-on-surface-2 hover:text-on-surface flex items-center gap-1 font-medium"
          >
            {match.missingCriteria.length} gap{match.missingCriteria.length > 1 ? "s" : ""}
            <svg className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {expanded && match.missingCriteria.length > 0 && (
        <div className="space-y-1.5">
          {match.missingCriteria.slice(0, 3).map((c) => (
            <div key={c} className="flex items-start gap-2 text-xs text-red-600">
              <span className="shrink-0">·</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          type="button"
          onClick={onTrack}
          className="flex-1 rounded-lg bg-on-surface text-white text-xs font-semibold py-2 hover:bg-primary-dark transition-colors"
        >
          Track
        </button>
        <button
          type="button"
          onClick={onImprove}
          className="flex-1 rounded-lg border border-outline text-xs font-semibold py-2 text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
        >
          Improve
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from saved"
          className="rounded-lg border border-outline px-2.5 py-2 text-on-surface-2 hover:border-red-300 hover:text-red-500 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SavedPlanningPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { savedMatches, toggleSaveScholarship, addApplication, setFocusedScholarshipId } = useAppContext();

  const [filter, setFilter] = useState<GroupKey | "All">("All");

  const grouped: Record<GroupKey, MatchResult[]> = {
    "Eligible now": savedMatches.filter((m) => m.status === "Eligible now"),
    "Almost eligible": savedMatches.filter((m) => m.status === "Almost eligible"),
    "Needs improvement": savedMatches.filter((m) => m.status === "Needs improvement"),
    "Not eligible yet": savedMatches.filter((m) => m.status === "Not eligible yet")
  };

  const filtered =
    filter === "All"
      ? savedMatches
      : grouped[filter] ?? [];

  const handleRemove = (id: string) => {
    toggleSaveScholarship(id);
    showToast("Removed from saved", "info");
  };

  const handleTrack = (match: MatchResult) => {
    addApplication(match.scholarship.id, ["Review requirements", "Prepare documents", "Draft application", "Submit"]);
    showToast(`${match.scholarship.name} added to tracker`, "success");
    navigate("/application-tracker");
  };

  const handleImprove = (match: MatchResult) => {
    setFocusedScholarshipId(match.scholarship.id);
    navigate("/improve-plan");
  };

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-outline pb-5">
        <p className="label-caps text-primary">Planning hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Saved Scholarships</h1>
        <p className="mt-1.5 text-sm text-on-surface-2">
          {savedMatches.length} saved · Track, improve, or remove from your shortlist.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(grouped) as [GroupKey, MatchResult[]][]).map(([key, items]) => {
          const style = GROUP_STYLES[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(filter === key ? "All" : key)}
              className={`rounded-xl border p-4 text-left transition-all hover:shadow-card ${
                filter === key ? "border-primary shadow-card bg-primary-container/30" : "border-outline bg-white"
              }`}
            >
              <p className="text-2xl font-bold text-on-surface">{items.length}</p>
              <p className="text-xs text-on-surface-2 mt-0.5">{key}</p>
              {items.length > 0 && (
                <span className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {style.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter pills */}
      {savedMatches.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === "All" ? "bg-on-surface text-white" : "bg-surface-low text-on-surface-2 hover:bg-surface-container"
            }`}
          >
            All ({savedMatches.length})
          </button>
          {(Object.entries(grouped) as [GroupKey, MatchResult[]][]).map(([key, items]) =>
            items.length > 0 ? (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(filter === key ? "All" : key)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  filter === key ? "bg-on-surface text-white" : "bg-surface-low text-on-surface-2 hover:bg-surface-container"
                }`}
              >
                {key} ({items.length})
              </button>
            ) : null
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <SavedCard
              key={match.scholarship.id}
              match={match}
              onRemove={() => handleRemove(match.scholarship.id)}
              onTrack={() => handleTrack(match)}
              onImprove={() => handleImprove(match)}
            />
          ))}
        </div>
      ) : savedMatches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline p-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-low flex items-center justify-center mx-auto">
            <svg className="h-7 w-7 text-on-surface-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-on-surface">No saved scholarships yet</h3>
            <p className="text-sm text-on-surface-2 mt-1 max-w-sm mx-auto">
              Bookmark scholarships using the bookmark icon on any scholarship card.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/scholarship-matching")}
            className="btn-primary"
          >
            Browse scholarships
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-outline p-8 text-center">
          <p className="text-sm text-on-surface-2">No scholarships in this category.</p>
          <button type="button" onClick={() => setFilter("All")} className="mt-2 text-sm text-primary font-medium hover:underline">
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
