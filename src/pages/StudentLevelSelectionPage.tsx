import { useNavigate } from "react-router-dom";
import type { StudentLevel } from "../types/app";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

const levelOptions: { level: StudentLevel; helper: string }[] = [
  { level: "Finished high school", helper: "Recently completed high school or equivalent" },
  { level: "Undergraduate student", helper: "Currently enrolled in an undergraduate program" },
  { level: "Final year undergraduate", helper: "Graduating soon — applying for postgrad funding" },
  { level: "Graduate applicant", helper: "Applying to a master's, MBA, or graduate program" },
  { level: "Master’s applicant", helper: "Targeting a master's degree specifically" },
  { level: "PhD applicant", helper: "Pursuing doctoral research opportunities" },
  { level: "Career switcher", helper: "Returning to study after years of work" },
  { level: "International student", helper: "Studying outside your home country" },
  { level: "Low-income applicant", helper: "Eligible for need-based scholarship support" },
  { level: "First-generation student", helper: "First in your family to attend higher education" }
];

export function StudentLevelSelectionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentProfile, updateSelectedLevels } = useAppContext();

  const toggleLevel = (level: StudentLevel) => {
    const next = currentProfile.selectedLevels.includes(level)
      ? currentProfile.selectedLevels.filter((item) => item !== level)
      : [...currentProfile.selectedLevels, level];
    updateSelectedLevels(next);
  };

  const handleContinue = () => {
    if (currentProfile.selectedLevels.length === 0) {
      showToast("Select at least one student level to continue", "warning");
      return;
    }
    navigate("/profile-builder");
  };

  return (
    <div className="space-y-8 max-w-screen-xl">
      <div className="border-b border-outline pb-5">
        <p className="label-caps text-primary">Step 1 of 3</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Tell us about you</h1>
        <p className="mt-2 text-sm text-on-surface-2 max-w-2xl">
          Select every label that applies. We use these tags to filter realistic opportunities and shape your matching engine.
        </p>
        {currentProfile.selectedLevels.length > 0 && (
          <p className="mt-3 text-xs text-on-surface-2">
            <span className="font-semibold text-on-surface">{currentProfile.selectedLevels.length}</span> selected
          </p>
        )}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {levelOptions.map(({ level, helper }) => {
          const active = currentProfile.selectedLevels.includes(level);
          return (
            <button
              key={level}
              type="button"
              onClick={() => toggleLevel(level)}
              className={`text-left rounded-xl border p-5 transition-all ${
                active
                  ? "border-primary bg-primary-container shadow-card"
                  : "border-outline bg-white hover:border-primary/40 hover:shadow-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span
                  className={`label-caps rounded-full px-2.5 py-1 text-[10px] ${
                    active ? "bg-primary text-white" : "bg-surface-low text-on-surface-2"
                  }`}
                >
                  {active ? "Selected" : "Available"}
                </span>
                {active && (
                  <span className="text-primary text-base">✓</span>
                )}
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-1">{level}</h3>
              <p className="text-xs text-on-surface-2 leading-relaxed">{helper}</p>
            </button>
          );
        })}
      </section>

      <div className="sticky bottom-0 left-0 right-0 -mx-5 md:-mx-8 px-5 md:px-8 py-4 bg-surface/95 backdrop-blur border-t border-outline flex items-center justify-between gap-4">
        <p className="text-xs text-on-surface-2">
          You can change these any time from your profile.
        </p>
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary"
        >
          Continue to profile →
        </button>
      </div>
    </div>
  );
}
