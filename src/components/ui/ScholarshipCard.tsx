import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "./Toast";
import { getMatchInsights } from "../../utils/matching";
import type { MatchResult } from "../../types/app";

interface ScholarshipCardProps {
  match?: MatchResult;
  result?: MatchResult;
  onSave?: () => void;
  onView?: () => void;
}

const getCardImg = (id: string) => {
  const photoIds = [
    "1541339907198-e08756dedf3f",
    "1523050854058-8df90110c9f1",
    "1481627834876-b7833e8f5570",
    "1434030216411-0b793f4b4173",
    "1607237138185-eedd9c632b0b",
    "1497633762265-9d179a990aa6",
    "1532094349884-32d65b46e03e",
    "1519452635265-7b1fbfd1e4e0"
  ];
  const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % photoIds.length;
  return `https://images.unsplash.com/photo-${photoIds[index]}?w=600&auto=format&fit=crop&q=75`;
};

export function ScholarshipCard({ match, result, onSave, onView }: ScholarshipCardProps) {
  const resolved = match ?? result!;
  const { currentProfile, setFocusedScholarshipId, toggleSaveScholarship } = useAppContext();
  const { showToast } = useToast();
  const saved = currentProfile.savedScholarshipIds.includes(resolved.scholarship.id);
  const isTop = resolved.score >= 90;
  const isHigh = resolved.score >= 80;
  const insights = getMatchInsights(resolved);

  const handleSave = () => {
    toggleSaveScholarship(resolved.scholarship.id);
    showToast(saved ? "Removed from saved" : "Saved to your list", "success");
    onSave?.();
  };

  return (
    <article className={`group flex flex-col rounded-xl overflow-hidden bg-white border elevation-1 transition-all hover:shadow-float hover:-translate-y-0.5 ${isTop ? "border-primary/20" : "border-outline"}`}>
      {/* Cover image */}
      <div className="relative h-36 overflow-hidden bg-surface-low">
        <img
          src={getCardImg(resolved.scholarship.id)}
          alt={resolved.scholarship.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-3 right-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isHigh ? "bg-on-surface text-white" : "bg-white/90 text-on-surface"}`}>
            {resolved.score}% match
          </span>
        </div>

        <button
          aria-label={saved ? "Remove from saved" : "Save scholarship"}
          onClick={handleSave}
          className="absolute top-3 left-3 h-7 w-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors"
          type="button"
        >
          <svg className={`h-3.5 w-3.5 ${saved ? "text-on-surface fill-current" : "text-on-surface-2"}`} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {resolved.scholarship.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-on-surface-2 bg-surface-low px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {isTop && (
            <span className="text-[10px] font-semibold text-ai-purple bg-ai-purple-light px-2 py-0.5 rounded-full">
              Top pick
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-on-surface line-clamp-2 leading-snug">
          {resolved.scholarship.name}
        </p>

        {/* Amount + meta */}
        <div>
          <p className="text-base font-semibold text-on-surface">{resolved.scholarship.amountLabel}</p>
          <p className="text-xs text-on-surface-2 mt-0.5">{resolved.scholarship.fundingType} · {resolved.scholarship.country}</p>
        </div>

        {/* Match insights — positive reasons */}
        {insights.length > 0 && (
          <div className="space-y-1 flex-1">
            {insights.map((insight) => (
              <div key={insight} className="flex items-start gap-1.5 text-[11px] text-on-surface-2">
                <span className="text-success mt-0.5 shrink-0">✓</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Missing criteria */}
        {resolved.missingCriteria.length > 0 && insights.length === 0 && (
          <div className="flex flex-wrap gap-1 flex-1">
            {resolved.missingCriteria.slice(0, 2).map((c) => (
              <span key={c} className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            to={`/scholarship/${resolved.scholarship.id}`}
            onClick={() => { setFocusedScholarshipId(resolved.scholarship.id); onView?.(); }}
            className="flex-1 rounded-lg bg-on-surface text-white text-xs font-medium py-2 text-center hover:bg-primary-dark transition-colors"
          >
            View details
          </Link>
          <Link
            to="/improve-plan"
            onClick={() => setFocusedScholarshipId(resolved.scholarship.id)}
            className="rounded-lg border border-outline px-3 py-2 text-xs text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
          >
            Improve
          </Link>
        </div>
      </div>
    </article>
  );
}
