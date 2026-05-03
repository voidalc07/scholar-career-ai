import { useNavigate } from "react-router-dom";
import { KanbanBoard } from "../components/ui/KanbanBoard";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import type { ApplicationStage } from "../types/app";

export function ApplicationTrackerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentProfile, allMatches, updateApplicationStage, addApplication, visibleMatches } = useAppContext();

  const handleStageMove = (applicationId: string, stage: ApplicationStage) => {
    updateApplicationStage(applicationId, stage);
    const variant = stage === "Accepted" ? "success" : stage === "Rejected" ? "warning" : "info";
    showToast(`Moved to ${stage}`, variant);
  };

  const stages = ["Discovered", "Eligible", "Improving eligibility", "Preparing documents", "Ready to apply", "Submitted", "Interview", "Accepted", "Rejected"] as const;
  const stageCount: Record<string, number> = {};
  stages.forEach((s) => { stageCount[s] = currentProfile.applications.filter((a) => a.stage === s).length; });

  const totalApps = currentProfile.applications.length;
  const submitted = stageCount["Submitted"] + stageCount["Interview"] + stageCount["Accepted"];
  const accepted = stageCount["Accepted"];

  const handleAddApplication = (scholarshipId: string) => {
    addApplication(scholarshipId, ["Complete online application", "Upload personal statement", "Arrange references", "Submit before deadline"]);
    const sch = allMatches.find((m) => m.scholarship.id === scholarshipId)?.scholarship.name ?? "Application";
    showToast(`${sch} added to tracker`, "success");
  };

  const untracked = visibleMatches.filter((m) =>
    !currentProfile.applications.some((a) => a.scholarshipId === m.scholarship.id)
  ).slice(0, 3);

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Application Tracker</h1>
          <p className="text-on-surface-2 text-sm mt-1">Move scholarships through each stage of your application journey.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/application-builder")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          + Start new application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-outline p-4 elevation-1">
          <p className="text-2xl font-bold text-on-surface">{totalApps}</p>
          <p className="text-xs text-on-surface-2 mt-1">Total tracked</p>
        </div>
        <div className="rounded-xl bg-white border border-outline p-4 elevation-1">
          <p className="text-2xl font-bold text-primary">{submitted}</p>
          <p className="text-xs text-on-surface-2 mt-1">Submitted</p>
        </div>
        <div className="rounded-xl bg-white border border-outline p-4 elevation-1">
          <p className="text-2xl font-bold text-success">{accepted}</p>
          <p className="text-xs text-on-surface-2 mt-1">Accepted</p>
        </div>
      </div>

      {/* Kanban */}
      {totalApps > 0 ? (
        <div>
          <h2 className="text-base font-semibold text-on-surface mb-4">Applications pipeline</h2>
          <KanbanBoard applications={currentProfile.applications} matches={allMatches} onMove={handleStageMove} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-outline p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-low flex items-center justify-center mx-auto">
            <svg className="h-7 w-7 text-on-surface-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-on-surface">No applications tracked yet</h3>
            <p className="text-sm text-on-surface-2 mt-1">Add scholarships from your matches to start tracking them here.</p>
          </div>
        </div>
      )}

      {/* Quick add from matches */}
      {untracked.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-on-surface mb-4">Add from your top matches</h2>
          <div className="space-y-3">
            {untracked.map((m) => (
              <div
                key={m.scholarship.id}
                className="flex items-center gap-4 rounded-xl border border-outline bg-white p-4 elevation-1"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{m.scholarship.name}</p>
                  <p className="text-xs text-on-surface-2 mt-0.5">{m.scholarship.amountLabel} · {m.scholarship.country}</p>
                </div>
                <span className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${m.score >= 85 ? "bg-ai-purple text-white" : "bg-primary-container text-primary"}`}>
                  {m.score}% match
                </span>
                <button
                  type="button"
                  onClick={() => handleAddApplication(m.scholarship.id)}
                  className="shrink-0 rounded-lg border border-outline px-3 py-1.5 text-xs font-semibold text-on-surface-2 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
