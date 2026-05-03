import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

const docIcons: Record<string, string> = {
  sop: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  cv: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  transcript: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  rec: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  passport: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
};

const getDocIcon = (id: string) => {
  if (id.includes("sop")) return docIcons.sop;
  if (id.includes("cv") || id.includes("resume")) return docIcons.cv;
  if (id.includes("transcript") || id.includes("grade")) return docIcons.transcript;
  if (id.includes("rec") || id.includes("letter")) return docIcons.rec;
  return docIcons.passport;
};

const statusConfig = {
  Uploaded: { bg: "bg-success-light", text: "text-success", dot: "bg-success", label: "Uploaded" },
  Missing: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Missing" },
  "Needs improvement": { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", label: "Needs Work" },
  Expired: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500", label: "Expired" }
} as const;

const nextDocumentStatus: Record<string, "Uploaded" | "Missing" | "Needs improvement" | "Expired"> = {
  Uploaded: "Needs improvement",
  "Needs improvement": "Uploaded",
  Missing: "Uploaded",
  Expired: "Uploaded"
};

const docDescriptions: Record<string, string> = {
  sop: "Your statement of purpose is used by AI to unlock story-heavy scholarships and score narrative quality.",
  cv: "CV strength changes how leadership, research, and work-readiness scholarships score your application.",
  transcript: "Academic transcripts verify your GPA and subject performance against scholarship requirements.",
  rec: "Recommendation letters are the single most common blocker across almost-eligible scholarships."
};

const getDocDesc = (id: string, label: string) => {
  if (id.includes("sop")) return docDescriptions.sop;
  if (id.includes("cv") || id.includes("resume")) return docDescriptions.cv;
  if (id.includes("transcript") || id.includes("grade")) return docDescriptions.transcript;
  if (id.includes("rec") || id.includes("letter")) return docDescriptions.rec;
  return `This document supports your application checklist and document readiness score for ${label}.`;
};

export function DocumentVaultPage() {
  const { showToast } = useToast();
  const { currentProfile, allMatches, updateDocumentStatus } = useAppContext();
  const [uploading, setUploading] = useState<string | null>(null);

  const uploaded = currentProfile.documents.filter((d) => d.status === "Uploaded");
  const missing = currentProfile.documents.filter((d) => d.status !== "Uploaded");
  const readiness = Math.round((uploaded.length / currentProfile.documents.length) * 100);

  const handleUpload = (docId: string, currentStatus: string) => {
    setUploading(docId);
    const docLabel = currentProfile.documents.find((d) => d.id === docId)?.label ?? "Document";
    setTimeout(() => {
      updateDocumentStatus(docId, nextDocumentStatus[currentStatus], currentStatus === "Missing" ? 78 : Math.min(100, (currentProfile.documents.find(d => d.id === docId)?.score ?? 70) + 8));
      setUploading(null);
      showToast(
        currentStatus === "Missing" ? `${docLabel} uploaded — AI is reviewing.` : `${docLabel} updated.`,
        "success"
      );
    }, 800);
  };

  return (
    <div className="max-w-screen-lg mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Document Vault</h1>
          <p className="text-on-surface-2 mt-1 text-sm">Upload documents to unlock scholarships and track AI quality scores.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-on-surface">{readiness}%</p>
            <p className="text-xs text-on-surface-2">Document readiness</p>
          </div>
          <div className="w-12 h-12 rounded-full relative">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8E6E1" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#3D5AFE" strokeWidth="3"
                strokeDasharray={`${readiness} ${100 - readiness}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-outline p-4 text-center elevation-1">
          <p className="text-2xl font-bold text-success">{uploaded.length}</p>
          <p className="text-xs text-on-surface-2 mt-1">Documents ready</p>
        </div>
        <div className="rounded-xl bg-white border border-outline p-4 text-center elevation-1">
          <p className="text-2xl font-bold text-red-500">{missing.length}</p>
          <p className="text-xs text-on-surface-2 mt-1">Need attention</p>
        </div>
        <div className="rounded-xl bg-white border border-outline p-4 text-center elevation-1">
          <p className="text-2xl font-bold text-on-surface">
            {Math.round(currentProfile.documents.reduce((sum, d) => sum + (d.score ?? 0), 0) / currentProfile.documents.length) || 0}
          </p>
          <p className="text-xs text-on-surface-2 mt-1">Avg AI score</p>
        </div>
      </div>

      {/* Document cards */}
      <div>
        <h2 className="text-base font-semibold text-on-surface mb-4">Your Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentProfile.documents.map((doc) => {
            const cfg = statusConfig[doc.status];
            const isUploading = uploading === doc.id;
            const scoreWidth = doc.score ? `${doc.score}%` : "0%";

            return (
              <div key={doc.id} className="rounded-xl border border-outline bg-white p-5 flex flex-col gap-4 elevation-1">
                {/* Icon + status */}
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-surface-low flex items-center justify-center">
                    <svg className="h-5 w-5 text-on-surface-2" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                      <path d={getDocIcon(doc.id)} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>

                {/* Name + description */}
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">{doc.label}</h3>
                  <p className="text-xs text-on-surface-2 mt-1 leading-relaxed">{getDocDesc(doc.id, doc.label)}</p>
                </div>

                {/* AI score bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-on-surface-2 font-medium">AI Quality Score</span>
                    <span className={`font-bold ${doc.score && doc.score >= 80 ? "text-success" : doc.score ? "text-amber-600" : "text-on-surface-2"}`}>
                      {doc.score ? `${doc.score}/100` : "Not scored"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-high overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: scoreWidth,
                        background: doc.score && doc.score >= 80 ? "#7A9B76" : doc.score ? "#F59E0B" : "#E8E6E1"
                      }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => handleUpload(doc.id, doc.status)}
                  className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
                    doc.status === "Uploaded"
                      ? "border border-outline text-on-surface-2 hover:bg-surface-container"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : doc.status === "Uploaded" ? "Replace document" : doc.status === "Missing" ? "Upload document" : "Upload improved version"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing documents by scholarship */}
      <div>
        <h2 className="text-base font-semibold text-on-surface mb-4">Document gaps by scholarship</h2>
        <div className="rounded-xl border border-outline bg-white overflow-hidden elevation-1">
          {allMatches.slice(0, 5).map((match, i) => {
            const docGaps = match.missingCriteria.filter((c) =>
              c.toLowerCase().includes("upload") || c.toLowerCase().includes("missing") || c.toLowerCase().includes("document")
            );
            return (
              <div
                key={match.scholarship.id}
                className={`flex items-start gap-4 px-5 py-4 ${i < allMatches.slice(0, 5).length - 1 ? "border-b border-outline" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface truncate">{match.scholarship.name}</p>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold ${match.score >= 85 ? "bg-ai-purple text-white" : "bg-primary-container text-primary"}`}>
                      {match.score}%
                    </span>
                  </div>
                  {docGaps.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {docGaps.slice(0, 3).map((g) => (
                        <span key={g} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{g}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <span>✓</span> No document blockers
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
