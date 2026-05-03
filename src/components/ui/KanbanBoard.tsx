import type { ApplicationRecord, ApplicationStage, MatchResult } from "../../types/app";

interface KanbanBoardProps {
  applications: ApplicationRecord[];
  matches: MatchResult[];
  onMove: (applicationId: string, stage: ApplicationStage) => void;
}

const columns: { stage: ApplicationStage; color: string; bg: string; next: ApplicationStage[] }[] = [
  { stage: "Discovered", color: "text-on-surface-2", bg: "bg-surface-low", next: ["Eligible", "Improving eligibility"] },
  { stage: "Improving eligibility", color: "text-amber-600", bg: "bg-amber-50", next: ["Eligible", "Preparing documents"] },
  { stage: "Eligible", color: "text-success", bg: "bg-success-light", next: ["Preparing documents"] },
  { stage: "Preparing documents", color: "text-primary", bg: "bg-primary-container", next: ["Ready to apply"] },
  { stage: "Ready to apply", color: "text-ai-purple", bg: "bg-ai-purple-light", next: ["Submitted"] },
  { stage: "Submitted", color: "text-blue-600", bg: "bg-blue-50", next: ["Interview", "Accepted", "Rejected"] },
  { stage: "Interview", color: "text-orange-600", bg: "bg-orange-50", next: ["Accepted", "Rejected"] },
  { stage: "Accepted", color: "text-success", bg: "bg-success-light", next: [] },
  { stage: "Rejected", color: "text-red-600", bg: "bg-red-50", next: ["Discovered"] }
];

export function KanbanBoard({ applications, matches, onMove }: KanbanBoardProps) {
  const activeColumns = columns.filter((col) => {
    const hasCards = applications.some((a) => a.stage === col.stage);
    const isImportant = ["Preparing documents", "Ready to apply", "Submitted", "Accepted"].includes(col.stage);
    return hasCards || isImportant;
  });

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {activeColumns.map((col) => {
          const cards = applications.filter((a) => a.stage === col.stage);
          return (
            <div key={col.stage} className="w-[220px] flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${col.bg} ${col.color}`}>
                  {col.stage}
                </div>
                <span className="text-xs font-bold text-on-surface-2 bg-surface-container rounded-full h-5 w-5 flex items-center justify-center">
                  {cards.length}
                </span>
              </div>

              {/* Drop zone */}
              <div className="min-h-[120px] space-y-2.5">
                {cards.map((app) => {
                  const match = matches.find((m) => m.scholarship.id === app.scholarshipId);
                  if (!match) return null;

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-outline bg-white p-3.5 elevation-1 space-y-3"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-on-surface leading-snug line-clamp-2">
                          {match.scholarship.name}
                        </h4>
                        <p className="text-[10px] text-on-surface-2 mt-0.5">{match.scholarship.country}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-on-surface-2 bg-surface-container rounded px-1.5 py-0.5">
                          {match.scholarship.amountLabel}
                        </span>
                        <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${match.score >= 85 ? "bg-ai-purple text-white" : "bg-primary-container text-primary"}`}>
                          {match.score}%
                        </span>
                      </div>

                      {/* Move buttons */}
                      {col.next.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5 border-t border-outline">
                          {col.next.map((next) => (
                            <button
                              key={next}
                              type="button"
                              onClick={() => onMove(app.id, next)}
                              className="text-[10px] rounded-full border border-outline px-2 py-0.5 text-on-surface-2 hover:border-primary/40 hover:text-primary transition-colors"
                            >
                              → {next}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-outline p-4 text-center">
                    <p className="text-xs text-on-surface-2/60">No applications yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
