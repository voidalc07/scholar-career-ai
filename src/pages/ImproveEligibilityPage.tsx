import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import type { StudentProfile } from "../types/app";
import { evaluateScholarship } from "../utils/matching";

function SliderInput({
  label,
  min,
  max,
  step,
  value,
  onChange,
  displayValue,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  displayValue?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-on-surface-2 text-xs font-medium">{label}</label>
        <span className="text-on-surface font-semibold text-sm">
          {displayValue ?? value}
        </span>
      </div>
      <input
        className="w-full accent-primary h-1.5 rounded-full"
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div className="flex justify-between text-xs text-on-surface-2 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function ImproveEligibilityPage() {
  const { showToast } = useToast();
  const { allMatches, currentProfile, currentPreferences, state, addPlanItem, updateProfile } = useAppContext();
  const target = allMatches.find((item) => item.scholarship.id === state.focusedScholarshipId) ?? allMatches[0] ?? null;

  const [ielts, setIelts] = useState(currentProfile.testScores.ielts ?? 0);
  const [gpa, setGpa] = useState(currentProfile.education.gpaValue);
  const [country, setCountry] = useState(currentProfile.personal.targetCountry);
  const [sopUploaded, setSopUploaded] = useState(
    currentProfile.documents.find((item) => item.id === "sop")?.status === "Uploaded"
  );

  const simulated = useMemo(() => {
    if (!target) return null;
    const sopStatus: StudentProfile["documents"][number]["status"] = sopUploaded
      ? "Uploaded"
      : "Missing";
    const draftProfile: StudentProfile = {
      ...currentProfile,
      personal: { ...currentProfile.personal, targetCountry: country },
      education: { ...currentProfile.education, gpaValue: gpa },
      testScores: { ...currentProfile.testScores, ielts },
      documents: currentProfile.documents.map((document) =>
        document.id === "sop"
          ? { ...document, status: sopStatus, score: sopUploaded ? 82 : document.score }
          : document
      ),
    };
    return evaluateScholarship(draftProfile, currentPreferences, target.scholarship);
  }, [country, currentPreferences, currentProfile, gpa, ielts, sopUploaded, target]);

  const scoreDiff = simulated && target ? simulated.score - target.score : 0;

  const applyChanges = () => {
    const sopStatus: StudentProfile["documents"][number]["status"] = sopUploaded
      ? "Uploaded"
      : "Missing";
    updateProfile((profile) => ({
      ...profile,
      personal: { ...profile.personal, targetCountry: country },
      education: { ...profile.education, gpaValue: gpa },
      testScores: { ...profile.testScores, ielts },
      documents: profile.documents.map((document) =>
        document.id === "sop" ? { ...document, status: sopStatus } : document
      ),
    }));
    showToast("Profile updated — match scores recalculated.", "success");
  };

  if (!target) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-on-surface-2 text-sm">Complete your profile to see improvement recommendations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-on-surface">Improve Your Eligibility</h1>
        <p className="text-on-surface-2 text-sm mt-2 max-w-xl">
          Follow priority actions to boost your match scores, and use the simulator to preview the
          impact of profile changes in real time.
        </p>
        {target && (
          <p className="text-xs text-on-surface-2 mt-1.5">
            Focused on:{" "}
            <span className="font-semibold text-on-surface">{target.scholarship.name}</span>
          </p>
        )}
      </div>

      {/* CURRENT SCORE DISPLAY */}
      <div className="mb-8">
        <div
          className="bg-gradient-to-br from-primary to-ai-purple p-0.5 rounded-xl inline-block w-full max-w-xs"
        >
          <div className="bg-white rounded-[10px] p-6 text-center">
            <p className="text-5xl font-bold text-on-surface">{target.score}%</p>
            <p className="text-on-surface-2 text-sm mt-1">Current Match Score</p>
            <div className="mt-4 h-2 w-full rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-ai-purple"
                style={{ width: `${target.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* PRIORITY ACTIONS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-on-surface text-lg">Priority Actions</h3>
            <span className="text-on-surface-2 text-sm">· sorted by impact</span>
          </div>

          <div className="space-y-4">
            {target.unlockActions.map((action, index) => (
              <div
                className="bg-white rounded-xl elevation-1 border border-outline p-5"
                key={action}
              >
                <div className="flex items-start gap-4">
                  {/* Impact badge */}
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-success-light flex flex-col items-center justify-center">
                    <span className="text-success font-bold text-xs">+{Math.round((target.improvedScore - target.score) / (target.unlockActions.length || 1))}%</span>
                    <span className="text-success text-xs">impact</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm leading-relaxed">{action}</p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          target.difficulty === "Low"
                            ? "bg-success-light text-success border-success/20"
                            : target.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {target.difficulty}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-2 font-medium">
                        ⏱ {target.timeToUnlock}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-2 font-medium">
                        💰 {target.costEstimate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline flex items-center justify-between">
                  <button
                    className="text-primary text-sm font-semibold hover:underline"
                    onClick={() => {
                      addPlanItem(
                        target.scholarship.id,
                        `Improve ${target.scholarship.name}`,
                        action,
                        `Toward ${target.improvedScore}%`
                      );
                      showToast("Action added to your plan", "success");
                    }}
                    type="button"
                  >
                    + Add to Plan
                  </button>
                  <span className="text-on-surface-2 text-xs">Action {index + 1}</span>
                </div>
              </div>
            ))}

            {/* Missing criteria */}
            {target.missingCriteria.length > 0 && (
              <div className="bg-white rounded-xl elevation-1 border border-outline p-5">
                <h4 className="font-semibold text-on-surface text-sm mb-3">Missing Criteria</h4>
                <div className="space-y-2">
                  {target.missingCriteria.map((crit) => (
                    <div
                      className="flex items-center gap-2 text-red-600 text-sm"
                      key={crit}
                    >
                      <span>❌</span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WHAT-IF SIMULATOR */}
        <div>
          <div className="mb-4">
            <h3 className="font-semibold text-on-surface text-lg">What-if Simulator</h3>
            <p className="text-on-surface-2 text-sm mt-0.5">
              Adjust variables to see how your score changes before making real profile edits.
            </p>
          </div>

          <div className="bg-white rounded-xl elevation-2 border border-outline p-6">
            <div className="space-y-5">
              {/* IELTS Slider */}
              <SliderInput
                displayValue={ielts.toFixed(1)}
                label="IELTS Score"
                max={9}
                min={5}
                onChange={setIelts}
                step={0.5}
                value={ielts}
              />

              {/* GPA Slider */}
              <SliderInput
                displayValue={gpa.toFixed(1)}
                label="GPA / Grade"
                max={4}
                min={0}
                onChange={setGpa}
                step={0.1}
                value={gpa}
              />

              {/* Target Country */}
              <div>
                <label className="text-on-surface-2 text-xs font-medium block mb-1.5">
                  Target Country
                </label>
                <input
                  className="w-full border border-outline rounded-lg px-3 py-2.5 text-sm bg-surface-low text-on-surface placeholder:text-on-surface-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  type="text"
                  value={country}
                />
              </div>

              {/* SOP Uploaded toggle */}
              <div className="flex items-center justify-between">
                <span className="text-on-surface-2 text-xs font-medium">SOP Uploaded</span>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sopUploaded ? "bg-primary" : "bg-surface-container"
                  }`}
                  onClick={() => setSopUploaded((p) => !p)}
                  type="button"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      sopUploaded ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Side-by-side score comparison */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-surface-container rounded-xl p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-2 mb-2">
                  Current
                </p>
                <p className="text-4xl font-bold text-on-surface">{target.score}%</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-surface-low overflow-hidden">
                  <div
                    className="h-full rounded-full bg-on-surface-2/30"
                    style={{ width: `${target.score}%` }}
                  />
                </div>
              </div>
              <div
                className={`rounded-xl p-4 text-center ${
                  scoreDiff > 0 ? "bg-success-light" : scoreDiff < 0 ? "bg-red-50" : "bg-surface-container"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                    scoreDiff > 0 ? "text-success" : scoreDiff < 0 ? "text-red-600" : "text-on-surface-2"
                  }`}
                >
                  Simulated
                </p>
                <p
                  className={`text-4xl font-bold ${
                    scoreDiff > 0 ? "text-success" : scoreDiff < 0 ? "text-red-600" : "text-on-surface"
                  }`}
                >
                  {simulated?.score ?? target.score}%
                </p>
                {scoreDiff !== 0 && (
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      scoreDiff > 0 ? "text-success" : "text-red-600"
                    }`}
                  >
                    {scoreDiff > 0 ? "+" : ""}
                    {scoreDiff}%
                  </p>
                )}
              </div>
            </div>

            <button
              className="mt-5 w-full bg-primary text-white rounded-xl py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity"
              onClick={applyChanges}
              type="button"
            >
              Apply Changes to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
