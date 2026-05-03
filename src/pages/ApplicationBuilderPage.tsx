import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

export function ApplicationBuilderPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { allMatches, state, addApplication, setFocusedScholarshipId } = useAppContext();
  const [selectedId, setSelectedId] = useState(state.focusedScholarshipId ?? allMatches[0]?.scholarship.id ?? "");
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => allMatches.find((m) => m.scholarship.id === selectedId) ?? allMatches[0],
    [allMatches, selectedId]
  );

  const checklist = [
    "Confirm profile details are accurate and up to date",
    "Upload all required documents to the vault",
    "Draft responses to essay prompts",
    "Review AI suggestions and eligibility score",
    "Prepare and send recommendation requests",
    "Final review and submission check"
  ];

  const handleAdd = () => {
    if (!selected) return;
    addApplication(selected.scholarship.id, checklist);
    setAdded(true);
    showToast(`${selected.scholarship.name} added to tracker`, "success");
  };

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-on-surface-2 text-sm">No scholarships to build an application for yet.</p>
        <button
          className="mt-4 btn-primary"
          onClick={() => navigate("/scholarship-matching")}
          type="button"
        >
          Find scholarships
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* Header */}
      <div className="border-b border-outline pb-5">
        <p className="label-caps text-primary">Application builder</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Build your application</h1>
        <p className="mt-2 text-sm text-on-surface-2 max-w-2xl">
          Select a scholarship, review its requirements and essay prompts, then add it to your tracker with a pre-built checklist.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: scholarship selector + requirements */}
        <div className="space-y-5">
          {/* Scholarship selector */}
          <div className="panel p-5">
            <label className="field-group">
              <span>Select scholarship</span>
              <select
                className="input"
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setFocusedScholarshipId(e.target.value);
                  setAdded(false);
                }}
                value={selected.scholarship.id}
              >
                {allMatches.slice(0, 20).map((m) => (
                  <option key={m.scholarship.id} value={m.scholarship.id}>
                    {m.scholarship.name} — {m.score}% match
                  </option>
                ))}
              </select>
            </label>

            {/* Match summary */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-surface-low">
              <div className="w-10 h-10 rounded-lg bg-white border border-outline flex items-center justify-center text-base font-bold text-primary shrink-0">
                {selected.scholarship.provider.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{selected.scholarship.name}</p>
                <p className="text-xs text-on-surface-2 mt-0.5">{selected.scholarship.amountLabel} · {selected.scholarship.country}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${selected.score >= 80 ? "bg-primary text-white" : "bg-surface-container text-on-surface-2"}`}>
                {selected.score}%
              </span>
            </div>
          </div>

          {/* Required documents */}
          <div className="panel p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3">Required documents</h3>
            <ul className="space-y-2">
              {selected.scholarship.documents.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-sm text-on-surface-2">
                  <svg className="h-4 w-4 shrink-0 text-on-surface-2" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Essay prompts */}
          <div className="panel p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-3">Essay prompts</h3>
            <ul className="space-y-3">
              {selected.scholarship.essayPrompts.map((prompt, i) => (
                <li key={prompt} className="text-sm text-on-surface-2 flex items-start gap-2">
                  <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: checklist + templates */}
        <div className="space-y-5">
          <div className="panel p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-4">Application steps</h3>
            <ol className="space-y-3">
              {checklist.map((item, i) => (
                <li key={item} className="flex items-start gap-3 p-3 rounded-lg bg-surface-low">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-on-surface">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="panel p-4">
              <h4 className="text-sm font-semibold text-on-surface mb-1.5">Essay draft scaffold</h4>
              <p className="text-xs text-on-surface-2">Use the essay prompts above plus your profile achievements to build a first draft in the AI Assistant.</p>
            </div>
            <div className="panel p-4">
              <h4 className="text-sm font-semibold text-on-surface mb-1.5">Recommendation template</h4>
              <p className="text-xs text-on-surface-2">
                "I am applying for {selected.scholarship.name}. Could you speak to my academic growth, research, and leadership strengths?"
              </p>
            </div>
            <div className="panel p-4">
              <h4 className="text-sm font-semibold text-on-surface mb-1.5">Email to recommender</h4>
              <p className="text-xs text-on-surface-2">
                "Dear recommender, I'm applying to {selected.scholarship.provider} and would value your support in speaking to my strengths."
              </p>
            </div>
            <div className="panel p-4">
              <h4 className="text-sm font-semibold text-on-surface mb-1.5">Pre-submission checklist</h4>
              <p className="text-xs text-on-surface-2">Check the document vault, review AI analysis, and confirm all essay prompts are answered before submitting.</p>
            </div>
          </div>

          {added ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success-light border border-success/20">
              <span className="text-success font-bold text-lg">✓</span>
              <div>
                <p className="text-sm font-semibold text-success">Added to your tracker</p>
                <p className="text-xs text-on-surface-2 mt-0.5">Track progress in the Applications tab.</p>
              </div>
              <button
                className="ml-auto text-xs text-primary font-semibold hover:underline"
                onClick={() => navigate("/application-tracker")}
                type="button"
              >
                Open tracker →
              </button>
            </div>
          ) : (
            <button
              className="btn-primary w-full py-3"
              onClick={handleAdd}
              type="button"
            >
              Add to application tracker
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
