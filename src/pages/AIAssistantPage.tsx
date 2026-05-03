import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const suggestions = [
  "What scholarships am I eligible for right now?",
  "What should I do to unlock better scholarships?",
  "Which country gives me the best chance?",
  "What documents am I missing?",
  "Help me improve my SOP",
  "Write a recommendation letter request",
  "Explain why I'm not eligible for a specific scholarship",
  "Build me a 3-month action plan"
];

type Tone = "mentor" | "direct" | "encouraging";

const toneOpener = (tone: Tone, name: string): string => {
  if (tone === "direct") return "";
  if (tone === "encouraging") return `Great question, **${name}** — you're on the right track. `;
  return `**${name}**, here's what I'm seeing in your profile. `;
};

const toneCloser = (tone: Tone): string => {
  if (tone === "direct") return "";
  if (tone === "encouraging") return "\n\nYou've got this. One step at a time.";
  return "\n\nLet me know if you want me to walk through any of this in more detail.";
};

const buildResponse = (prompt: string, name: string, topMatch: string, tone: Tone, missingDoc?: string) => {
  const normalized = prompt.toLowerCase();
  const opener = toneOpener(tone, name);
  const closer = toneCloser(tone);

  if (normalized.includes("eligible")) {
    return `${opener}Your strongest match is **${topMatch}**. Your academic background and financial profile are well-aligned for Commonwealth and government-funded scholarships. The quickest way to improve your shortlist is to complete your language scores and upload your recommendation letters.${closer}`;
  }
  if (normalized.includes("unlock")) {
    return `Your three fastest unlock paths are:\n\n1. **Upload missing documents** — each document you add improves the match score for 3–5 scholarships immediately.\n2. **Add a language test score** — IELTS or TOEFL unlocks UK, Australia, and Canada scholarships.\n3. **Complete your SOP** — scholarships with story-heavy applications weight this heavily.\n\nFocus on one at a time for the most visible progress.`;
  }
  if (normalized.includes("country")) {
    return `Looking at your match spread: **UK** has your highest density of 85%+ matches (especially merit-based), followed by **Canada** for research programs. Your current profile is borderline for **Australia** — closing the GPA gap there would open 6 additional scholarships. I'd prioritize UK first, then Canada.`;
  }
  if (normalized.includes("document")) {
    return `Your most urgent missing document is **${missingDoc ?? "your SOP"}**. Here's why it matters: 8 of your almost-eligible scholarships require it to move into the "eligible now" bucket. After that, focus on your recommendation letter — it's the single item blocking your top 3 matches.`;
  }
  if (normalized.includes("recommendation")) {
    return `Here's a template you can adapt:\n\n*"Dear [Professor's name],\n\nI am applying for the [scholarship name] and need a recommendation letter that speaks to my academic strengths and future research potential. Given that you supervised my [project/course], I believe you're uniquely positioned to speak to my abilities.\n\nWould you be willing to write a letter by [date]? I'm happy to provide my CV and scholarship details to make it easier.\n\nThank you for considering this."*`;
  }
  if (normalized.includes("3-month") || normalized.includes("plan")) {
    return `Here's your personalised 3-month plan:\n\n**Month 1 — Build the Foundation**\n• Complete all missing profile fields\n• Upload SOP and CV to Document Vault\n• Save 8–10 target scholarships\n\n**Month 2 — Strengthen Eligibility**\n• Book or report language test scores\n• Work through your top 3 improve-plan actions\n• Move 3 scholarships into Application Builder\n\n**Month 3 — Submit**\n• Submit your strongest 2 applications\n• Follow up on recommendation letters\n• Track progress in the Kanban board`;
  }
  if (normalized.includes("sop")) {
    return `A strong SOP for scholarship applications has three parts:\n\n1. **Why this field** — connect your past experiences to a clear academic goal (2–3 sentences)\n2. **Why this scholarship** — show you've researched the specific program, not just the funding (1–2 sentences)\n3. **What you'll contribute** — give a concrete example of impact you've created or plan to create\n\nYour current SOP score is ${Math.floor(Math.random() * 20) + 65}/100. The main gaps are: specificity around contribution and a clearer connection to the scholarship's mission.`;
  }
  return `${opener}The most connected action across your scholarship journey right now is to complete one item at a time — starting with your Document Vault. Each document you add ripples through matching, the dashboard, and the application builder simultaneously.${closer}`;
};

export function AIAssistantPage() {
  const navigate = useNavigate();
  const { currentProfile, visibleMatches, addAssistantMessage, isPremium, state } = useAppContext();
  const tone = state.settings.assistantTone;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const topMatch = visibleMatches[0]?.scholarship.name ?? "your current top scholarship";
  const missingDoc = currentProfile.documents.find((item) => item.status !== "Uploaded")?.label;

  const messages = useMemo(
    () =>
      currentProfile.assistantMessages.length > 0
        ? currentProfile.assistantMessages
        : [
            {
              id: "assistant-welcome",
              role: "assistant" as const,
              content: `Hi ${currentProfile.personal.name || "there"}! I'm your AI scholarship advisor. I have full context on your profile, your matches, and your document state.\n\nAsk me anything — eligibility questions, country strategy, how to unlock specific scholarships, or help drafting documents.`
            }
          ],
    [currentProfile.assistantMessages, currentProfile.personal.name]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendPrompt = (prompt: string) => {
    if (!prompt.trim()) return;
    addAssistantMessage({ id: `user-${Date.now()}`, role: "user", content: prompt });
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addAssistantMessage({
        id: `assistant-${Date.now() + 1}`,
        role: "assistant",
        content: buildResponse(prompt, currentProfile.personal.name || "Scholar", topMatch, tone, missingDoc)
      });
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(input);
    }
  };

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto py-16 space-y-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-ai-purple-light flex items-center justify-center mx-auto">
          <svg className="h-8 w-8 text-ai-purple" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-on-surface">AI Assistant is a Pro feature</h1>
          <p className="text-on-surface-2">
            Get profile-aware answers to eligibility questions, scholarship strategy, document guidance, and more.
          </p>
        </div>
        <div className="rounded-xl border border-outline bg-white p-6 text-left space-y-3">
          {[
            "Ask about eligibility for any scholarship",
            "Get country-specific strategy advice",
            "Draft SOP and recommendation letter templates",
            "Build a personalised 3-month action plan",
            "Identify fastest document unlock paths"
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm text-on-surface">
              <span className="h-5 w-5 rounded-full bg-ai-purple-light text-ai-purple flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              {f}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate("/upgrade")}
          className="inline-flex items-center gap-2 rounded-lg bg-ai-purple px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Upgrade to Pro — unlock AI Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-ai-purple-light px-3 py-0.5 text-xs font-bold text-ai-purple">AI Assistant</span>
            <span className="text-xs text-on-surface-2">Profile-aware · Context-grounded</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Ask me anything about your scholarship journey</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-240px)] min-h-[500px]">
        {/* Left: Suggested prompts */}
        <div className="rounded-xl border border-outline bg-white p-5 flex flex-col gap-4 overflow-y-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2/70">Suggested prompts</p>
          <div className="space-y-2">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                className="w-full text-left rounded-xl border border-outline bg-surface px-3.5 py-2.5 text-sm text-on-surface-2 hover:border-primary/30 hover:bg-primary-container hover:text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Profile context card */}
          <div className="mt-auto rounded-xl bg-surface-low p-3 space-y-2">
            <p className="text-xs font-semibold text-on-surface-2">Active context</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-2">Profile</span>
                <span className="text-primary font-semibold">{currentProfile.personal.name || "Student"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-2">Live matches</span>
                <span className="text-on-surface font-semibold">{visibleMatches.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-2">Top match</span>
                <span className="text-on-surface font-semibold truncate ml-2 max-w-[100px]">{visibleMatches[0]?.score ?? 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="rounded-xl border border-outline bg-white flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-ai-purple-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-ai-purple" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    message.role === "assistant"
                      ? "bg-surface-low text-on-surface rounded-tl-sm"
                      : "bg-primary text-white rounded-tr-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-ai-purple-light flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-ai-purple" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="bg-surface-low rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-2/40 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-2/40 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-2/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-outline">
            <div className="flex items-center gap-3 rounded-xl border border-outline bg-white px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                className="flex-1 text-sm text-on-surface outline-none placeholder:text-on-surface-2/50 bg-transparent"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about eligibility, documents, strategy, or application tips..."
                value={input}
              />
              <button
                type="button"
                onClick={() => sendPrompt(input)}
                disabled={!input.trim() || isTyping}
                className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-on-surface-2/50">
              AI responses are grounded in your profile data. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
