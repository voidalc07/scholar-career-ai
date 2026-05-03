import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { StudentProfile } from "../types/app";

const sections = [
  "Personal Details",
  "Education Stage",
  "Course Goals",
  "Financial Background",
  "Test Scores",
  "Achievements",
  "Documents"
] as const;

type Section = typeof sections[number];

export function ProfileBuilderPage() {
  const navigate = useNavigate();
  const { currentProfile, updateProfile, profileCompletion, visibleMatches } = useAppContext();
  const [activeTab, setActiveTab] = useState<Section>("Personal Details");

  const testScoreFields: Array<[keyof StudentProfile["testScores"], number | null | undefined]> = [
    ["ielts", currentProfile.testScores.ielts],
    ["toefl", currentProfile.testScores.toefl],
    ["sat", currentProfile.testScores.sat],
    ["act", currentProfile.testScores.act],
    ["gre", currentProfile.testScores.gre],
    ["gmat", currentProfile.testScores.gmat]
  ];

  const topGap = visibleMatches.find((m) => m.missingCriteria.length > 0)?.missingCriteria[0];

  const updateDocStatus = (id: string, status: "Uploaded" | "Missing" | "Needs improvement" | "Expired") => {
    updateProfile((p) => ({
      ...p,
      documents: p.documents.map((d) => d.id === id ? { ...d, status, updatedAt: new Date().toISOString().split("T")[0] } : d)
    }));
  };

  const statusColors = {
    Uploaded: "bg-success-light text-success",
    Missing: "bg-red-50 text-red-600",
    "Needs improvement": "bg-amber-50 text-amber-600",
    Expired: "bg-orange-50 text-orange-600"
  } as const;

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Profile Builder</h1>
          <p className="text-on-surface-2 text-sm mt-1">
            Changes update your scholarship matches everywhere in real time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/eligibility-map")}
          className="rounded-lg border border-outline px-4 py-2 text-sm font-semibold text-on-surface-2 hover:border-primary/40 hover:text-primary transition-colors"
        >
          View Eligibility Map
        </button>
      </div>

      {/* Completion bar */}
      <div className="rounded-xl border border-outline bg-white p-4 flex items-center gap-4 elevation-1">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-on-surface">Profile completion</span>
            <span className="font-bold text-primary">{profileCompletion}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-high overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-on-surface-2 shrink-0 max-w-[140px]">
          Auto-saved locally
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Main form */}
        <div className="rounded-xl border border-outline bg-white overflow-hidden elevation-1">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-outline">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveTab(s)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === s
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-2 hover:text-on-surface"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 space-y-4">
            {activeTab === "Personal Details" && (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Full name", key: "name", field: "personal" as const },
                  { label: "Age", key: "age", field: "personal" as const, type: "number" },
                  { label: "Nationality", key: "nationality", field: "personal" as const },
                  { label: "Current country", key: "currentCountry", field: "personal" as const },
                  { label: "Target country", key: "targetCountry", field: "personal" as const },
                  { label: "Preferred intake year", key: "preferredIntakeYear", field: "personal" as const }
                ].map(({ label, key, type }) => (
                  <label key={key} className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                    {label}
                    <input
                      className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                      type={type ?? "text"}
                      value={(currentProfile.personal as Record<string, string | number>)[key] as string ?? ""}
                      onChange={(e) =>
                        updateProfile((p) => ({
                          ...p,
                          personal: { ...p.personal, [key]: type === "number" ? Number(e.target.value) || 0 : e.target.value }
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            )}

            {activeTab === "Education Stage" && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Current qualification
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.currentQualification} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, currentQualification: e.target.value } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Board / curriculum
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.boardOrCurriculum} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, boardOrCurriculum: e.target.value } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  GPA scale
                  <select className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.gpaScale} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, gpaScale: e.target.value } }))}>
                    <option>CGPA / 4</option>
                    <option>CGPA / 10</option>
                    <option>Percentage</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  GPA / grade value
                  <input type="number" className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.gpaValue} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, gpaValue: Number(e.target.value) || 0 } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface md:col-span-2">
                  Subjects studied (comma-separated)
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.subjects.join(", ")} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, subjects: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Graduation year
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.education.graduationYear} onChange={(e) => updateProfile((p) => ({ ...p, education: { ...p.education, graduationYear: e.target.value } }))} />
                </label>
              </div>
            )}

            {activeTab === "Course Goals" && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Preferred degree level
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.courseGoals.preferredDegreeLevel} onChange={(e) => updateProfile((p) => ({ ...p, courseGoals: { ...p.courseGoals, preferredDegreeLevel: e.target.value } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Preferred subject
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.courseGoals.preferredSubject} onChange={(e) => updateProfile((p) => ({ ...p, courseGoals: { ...p.courseGoals, preferredSubject: e.target.value } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface md:col-span-2">
                  Preferred countries (comma-separated)
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.courseGoals.preferredCountries.join(", ")} onChange={(e) => updateProfile((p) => ({ ...p, courseGoals: { ...p.courseGoals, preferredCountries: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } }))} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Budget range
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.courseGoals.budgetRange} onChange={(e) => updateProfile((p) => ({ ...p, courseGoals: { ...p.courseGoals, budgetRange: e.target.value } }))} />
                </label>
              </div>
            )}

            {activeTab === "Financial Background" && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                  Family income range
                  <input className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={currentProfile.financial.familyIncomeRange} onChange={(e) => updateProfile((p) => ({ ...p, financial: { ...p.financial, familyIncomeRange: e.target.value } }))} />
                </label>
                {[
                  { label: "Need-based funding interest", key: "needBasedFundingInterest" as const },
                  { label: "Government aid eligibility", key: "governmentAidEligibility" as const },
                  { label: "Work-study interest", key: "workStudyInterest" as const }
                ].map(({ label, key }) => (
                  <label key={key} className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                    {label}
                    <select className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface" value={String(currentProfile.financial[key])} onChange={(e) => updateProfile((p) => ({ ...p, financial: { ...p.financial, [key]: e.target.value === "true" } }))}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                ))}
              </div>
            )}

            {activeTab === "Test Scores" && (
              <div className="grid gap-4 md:grid-cols-3">
                {testScoreFields.map(([key, value]) => (
                  <label key={key} className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                    {String(key).toUpperCase()}
                    <input
                      type="number"
                      className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface"
                      value={value ?? ""}
                      onChange={(e) =>
                        updateProfile((p) => ({
                          ...p,
                          testScores: { ...p.testScores, [key]: e.target.value ? Number(e.target.value) : null }
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            )}

            {activeTab === "Achievements" && (
              <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface">
                Achievements, volunteering, leadership, research (comma-separated)
                <textarea
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-on-surface min-h-[160px] resize-none"
                  value={currentProfile.achievements.join(", ")}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      achievements: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    }))
                  }
                />
              </label>
            )}

            {activeTab === "Documents" && (
              <div className="grid gap-4 md:grid-cols-2">
                {currentProfile.documents.map((doc) => (
                  <div key={doc.id} className="rounded-xl border border-outline p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-on-surface">{doc.label}</h3>
                        <p className="text-xs text-on-surface-2 mt-0.5">Updated {doc.updatedAt}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(["Uploaded", "Missing", "Needs improvement", "Expired"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateDocStatus(doc.id, s)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                            doc.status === s
                              ? "bg-primary text-white"
                              : "border border-outline text-on-surface-2 hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
            <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2/70 mb-3">AI suggestions</p>
            <ul className="space-y-2.5 text-sm text-on-surface-2">
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0 mt-0.5">→</span>
                Updating target country refreshes dashboard recommendations instantly.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0 mt-0.5">→</span>
                Uploading missing documents is the fastest unlock path.
              </li>
              {topGap && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">!</span>
                  Biggest gap: {topGap}
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
            <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2/70 mb-3">Connected effect</p>
            <p className="text-sm text-on-surface-2 leading-relaxed">
              Changing any field here recalculates match scores, missing criteria, unlock actions, and application checklists across the whole app.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
