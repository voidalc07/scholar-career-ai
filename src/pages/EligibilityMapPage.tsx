import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import type { MatchResult } from "../types/app";

type BucketKey = "Eligible now" | "Almost eligible" | "Long-term target" | "Not realistic";

interface BucketConfig {
  key: BucketKey;
  label: string;
  description: string;
  badgeClass: string;
  countClass: string;
  borderClass: string;
}

const BUCKETS: BucketConfig[] = [
  {
    key: "Eligible now",
    label: "Eligible Now",
    description: "You meet the core criteria. Apply with confidence.",
    badgeClass: "bg-success-light text-success",
    countClass: "text-success",
    borderClass: "border-success/30",
  },
  {
    key: "Almost eligible",
    label: "Almost Eligible",
    description: "A few improvements could unlock these opportunities.",
    badgeClass: "bg-amber-50 text-amber-700",
    countClass: "text-amber-700",
    borderClass: "border-amber-200",
  },
  {
    key: "Long-term target",
    label: "Long-term Target",
    description: "Plan for these with sustained effort over time.",
    badgeClass: "bg-primary/10 text-primary",
    countClass: "text-primary",
    borderClass: "border-primary/20",
  },
  {
    key: "Not realistic",
    label: "Not Realistic",
    description: "Significant gaps exist. Focus elsewhere for now.",
    badgeClass: "bg-surface-container text-on-surface-2",
    countClass: "text-on-surface-2",
    borderClass: "border-outline",
  },
];

function getBucketKey(status: string): BucketKey {
  if (status === "Eligible now") return "Eligible now";
  if (status === "Almost eligible") return "Almost eligible";
  if (status === "Needs improvement") return "Long-term target";
  return "Not realistic";
}

function ScholarshipBucketCard({
  result,
  onAddPlan,
}: {
  result: MatchResult;
  onAddPlan: (result: MatchResult) => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const providerInitial = result.scholarship.provider.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl elevation-1 border border-outline p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-2 font-bold text-sm flex items-center justify-center shrink-0">
            {providerInitial}
          </div>
          <div className="min-w-0">
            <p className="text-on-surface font-semibold text-sm line-clamp-2 leading-snug">
              {result.scholarship.name}
            </p>
            <p className="text-on-surface-2 text-xs mt-0.5">{result.scholarship.country}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              result.score >= 90
                ? "bg-ai-purple text-white"
                : result.score >= 75
                ? "bg-primary text-white"
                : result.score >= 50
                ? "bg-amber-50 text-amber-700"
                : "bg-surface-container text-on-surface-2"
            }`}
          >
            {result.score}%
          </span>
          <p className="text-primary font-bold text-sm mt-1">{result.scholarship.amountLabel}</p>
        </div>
      </div>

      {/* Unlock actions (collapsible) */}
      {result.unlockActions.length > 0 && (
        <div className="mt-2">
          <button
            className="text-xs text-on-surface-2 hover:text-on-surface flex items-center gap-1 font-medium"
            onClick={() => setExpanded((p) => !p)}
            type="button"
          >
            <svg
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              height="10"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="10"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {result.unlockActions.length} unlock action{result.unlockActions.length !== 1 ? "s" : ""}
          </button>

          {expanded && (
            <div className="mt-2 space-y-2">
              {result.unlockActions.map((action) => (
                <div
                  className="bg-ai-purple-light rounded-lg p-3 border border-ai-purple/20 text-xs text-on-surface-2"
                  key={action}
                >
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline">
        <button
          className="text-primary text-xs font-semibold hover:underline"
          onClick={() => onAddPlan(result)}
          type="button"
        >
          + Add to Plan
        </button>
        <span className="text-outline">·</span>
        <button
          className="text-on-surface-2 text-xs hover:text-on-surface"
          onClick={() => navigate(`/scholarship/${result.scholarship.id}`)}
          type="button"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export function EligibilityMapPage() {
  const { showToast } = useToast();
  const { allMatches, addPlanItem, setFocusedScholarshipId } = useAppContext();
  const [activeBucket, setActiveBucket] = useState<BucketKey>("Eligible now");

  const bucketMap: Record<BucketKey, MatchResult[]> = {
    "Eligible now": allMatches.filter((item) => item.status === "Eligible now"),
    "Almost eligible": allMatches.filter((item) => item.status === "Almost eligible"),
    "Long-term target": allMatches.filter((item) => item.status === "Needs improvement"),
    "Not realistic": allMatches.filter((item) => item.status === "Not eligible yet"),
  };

  const activeBucketConfig = BUCKETS.find((b) => b.key === activeBucket)!;
  const activeItems = bucketMap[activeBucket];
  const almostEligible = bucketMap["Almost eligible"];

  const handleAddPlan = (result: MatchResult) => {
    setFocusedScholarshipId(result.scholarship.id);
    addPlanItem(
      result.scholarship.id,
      "Follow unlock path",
      result.nextBestAction,
      `Up to ${result.improvedScore}%`
    );
    showToast("Action added to your plan", "success");
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-on-surface">Your Eligibility Map</h1>
        <p className="text-on-surface-2 text-sm mt-2 max-w-xl">
          See exactly where you stand for every scholarship — what's ready now, what's close, and
          what needs more work.
        </p>
        <p className="text-xs text-on-surface-2 mt-1.5 flex items-center gap-1.5">
          <span className="text-ai-purple">✦</span>
          Powered by AI matching across 7 dimensions
        </p>
      </div>

      {/* BUCKET SUMMARY TABS */}
      <div className="flex flex-wrap gap-2 mb-8">
        {BUCKETS.map((bucket) => {
          const count = bucketMap[bucket.key].length;
          const isActive = activeBucket === bucket.key;
          return (
            <button
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface-2 hover:bg-surface-low"
              }`}
              key={bucket.key}
              onClick={() => setActiveBucket(bucket.key)}
              type="button"
            >
              {bucket.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : bucket.badgeClass
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* BUCKET CONTENT */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-on-surface text-lg">
              {activeBucketConfig.label}{" "}
              <span className={`text-base font-bold ${activeBucketConfig.countClass}`}>
                ({activeItems.length})
              </span>
            </h3>
            <p className="text-on-surface-2 text-sm mt-0.5">{activeBucketConfig.description}</p>
          </div>
        </div>

        {activeItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeItems.map((result) => (
              <ScholarshipBucketCard
                key={result.scholarship.id}
                onAddPlan={handleAddPlan}
                result={result}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <svg
                className="text-on-surface-2"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
            </div>
            <p className="text-on-surface font-semibold">No scholarships in this bucket</p>
            <p className="text-on-surface-2 text-sm mt-1">
              Complete your profile to unlock more matches.
            </p>
          </div>
        )}
      </div>

      {/* UNLOCK PATH VISUALIZATION */}
      {almostEligible.length > 0 && (
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="font-semibold text-on-surface text-lg">Paths to Unlock</h3>
            <p className="text-on-surface-2 text-sm mt-0.5">
              These scholarships are within reach. See what's holding you back.
            </p>
          </div>

          <div className="space-y-4">
            {almostEligible.slice(0, 5).map((result) => {
              const threshold = 75;
              const progress = Math.min(100, Math.round((result.score / threshold) * 100));

              return (
                <div
                  className="bg-white rounded-xl elevation-1 border border-outline p-5"
                  key={result.scholarship.id}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-on-surface font-semibold text-sm line-clamp-1 flex-1">
                      {result.scholarship.name}
                    </p>
                    <span className="text-xs text-on-surface-2 shrink-0">
                      {result.score}% / {threshold}% threshold
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-surface-container overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Missing criteria pills */}
                  {result.missingCriteria.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.missingCriteria.map((crit) => (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium"
                          key={crit}
                        >
                          {crit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
