import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

const stories = [
  {
    name: "Priya S.",
    country: "India → UK",
    scholarship: "Chevening Scholarship",
    title: "Turned a 62% match into a fully funded UK offer",
    text: "Fixed IELTS, tightened her SOP around impact, and reused a stronger CV across multiple scholarships. Whole process took 6 weeks.",
    amount: "£40,000",
    emoji: "🇬🇧"
  },
  {
    name: "Daniel K.",
    country: "Nigeria → Canada",
    scholarship: "Vanier CGS",
    title: "Found a realistic Canada route after switching target country",
    text: "A country-strategy shift exposed scholarships that fit his work-study goals much better. The AI matching surfaced three he'd never heard of.",
    amount: "$50,000",
    emoji: "🇨🇦"
  },
  {
    name: "Mina R.",
    country: "Pakistan → Australia",
    scholarship: "Australia Awards",
    title: "Moved from missing documents to ready-to-apply in 3 weeks",
    text: "The document vault and application builder gave her a cleaner workflow than hunting requirements manually. Submitted 2 days early.",
    amount: "Full tuition",
    emoji: "🇦🇺"
  }
];

const mentorPrompts = [
  "How do I explain a career switch in my SOP?",
  "Which documents should I polish first?",
  "How can I make my leadership story stronger?",
  "Which country has the best scholarship depth for my subject?",
  "How do I approach a professor for a recommendation?",
  "What's the best way to answer 'why this scholarship' questions?"
];

export function CommunityPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentProfile } = useAppContext();
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");

  const submitStory = () => {
    if (!storyTitle.trim() || !storyText.trim()) {
      showToast("Add a title and your story before submitting.", "warning");
      return;
    }
    setShowStoryForm(false);
    setStoryTitle("");
    setStoryText("");
    showToast("Thanks for sharing — your story is now in the review queue.", "success");
  };

  return (
    <div className="max-w-screen-lg mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Community & Stories</h1>
        <p className="text-on-surface-2 text-sm mt-1">
          Real paths from students who navigated the same journey as {currentProfile.personal.name || "you"}.
        </p>
      </div>

      {/* Success stories */}
      <div>
        <h2 className="text-base font-semibold text-on-surface mb-4">Success stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stories.map((story) => (
            <div key={story.name} className="rounded-xl border border-outline bg-white p-5 flex flex-col gap-4 elevation-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{story.name}</p>
                  <p className="text-xs text-on-surface-2 mt-0.5">{story.country}</p>
                </div>
                <span className="text-2xl">{story.emoji}</span>
              </div>

              <div>
                <p className="text-xs font-bold text-primary mb-1">{story.scholarship}</p>
                <h3 className="text-sm font-semibold text-on-surface leading-snug">{story.title}</h3>
              </div>

              <p className="text-xs text-on-surface-2 leading-relaxed flex-1">{story.text}</p>

              <div className="flex items-center justify-between pt-3 border-t border-outline">
                <span className="text-sm font-bold text-success">{story.amount}</span>
                <span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-semibold text-success">Awarded</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor prompts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-on-surface">Common questions</h2>
          <button
            type="button"
            onClick={() => navigate("/ai-assistant")}
            className="text-sm text-primary font-medium hover:underline"
          >
            Ask AI Assistant →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mentorPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => navigate("/ai-assistant")}
              className="text-left rounded-xl border border-outline bg-white px-4 py-3.5 text-sm text-on-surface hover:border-primary/30 hover:bg-primary-container/30 transition-colors flex items-center justify-between gap-2"
            >
              <span>{prompt}</span>
              <svg className="h-4 w-4 shrink-0 text-on-surface-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-ai-purple p-0.5">
        <div className="rounded-[11px] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-base font-semibold text-on-surface">Share your story</h3>
              <p className="text-sm text-on-surface-2 mt-0.5">Help other students by sharing what worked in your application journey.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowStoryForm((p) => !p)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              {showStoryForm ? "Cancel" : "Submit your story"}
            </button>
          </div>

          {showStoryForm && (
            <div className="space-y-3 pt-4 border-t border-outline">
              <label className="block">
                <span className="text-xs font-medium text-on-surface mb-1.5 block">Story title</span>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="e.g. From a 65% match to a fully funded offer"
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-on-surface mb-1.5 block">Your journey</span>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  rows={4}
                  placeholder="What worked? What did you fix? How long did it take?"
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStoryForm(false)}
                  className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-2 hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitStory}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
                >
                  Submit for review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
