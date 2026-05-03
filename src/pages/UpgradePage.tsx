import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

const features = {
  free: [
    "Up to 10 AI scholarship matches",
    "Basic profile builder",
    "Document vault (3 docs)",
    "Email alerts",
    "Community access"
  ],
  pro: [
    "Up to 50 AI scholarship matches",
    "Full profile + eligibility map",
    "Document vault (unlimited)",
    "AI Assistant (50 queries/mo)",
    "Priority deadline alerts",
    "Course + Country strategy",
    "Application builder",
    "Kanban tracker"
  ],
  elite: [
    "Unlimited AI scholarship matches",
    "Everything in Pro",
    "AI Document Review & scoring",
    "Unlimited AI Assistant",
    "1-on-1 advisor session (monthly)",
    "Early access to new scholarships",
    "Admin / provider panel",
    "Priority support"
  ]
};

export function UpgradePage() {
  const navigate = useNavigate();
  const { isPremium, upgradeToPremium } = useAppContext();
  const { showToast } = useToast();

  const handleUpgrade = (plan: "pro" | "elite") => {
    upgradeToPremium();
    showToast(`Welcome to ${plan === "pro" ? "Pro" : "Scholar Career Elite"} — premium features unlocked.`, "success");
    navigate("/dashboard");
  };

  if (isPremium) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-success-light text-success flex items-center justify-center text-2xl mx-auto">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-on-surface">You're on Scholar Career Elite</h1>
        <p className="text-on-surface-2">All premium features are unlocked across your account.</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-block rounded-full bg-ai-purple-light px-4 py-1 text-xs font-bold text-ai-purple tracking-widest uppercase">
          Scholar Career Elite
        </span>
        <h1 className="text-4xl font-bold text-on-surface">
          Unlock your full scholarship potential
        </h1>
        <p className="text-on-surface-2 text-lg max-w-xl mx-auto">
          Get AI-powered matching, unlimited applications, and expert guidance — all in one place.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free */}
        <div className="rounded-xl border border-outline bg-white p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2 mb-1">Free</p>
            <p className="text-4xl font-bold text-on-surface">$0</p>
            <p className="text-on-surface-2 text-sm mt-1">Forever</p>
          </div>
          <ul className="flex-1 space-y-2.5">
            {features.free.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-on-surface-2">
                <span className="text-success mt-0.5 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="w-full rounded-lg border border-outline py-2.5 text-sm font-semibold text-on-surface-2 cursor-default"
          >
            Current plan
          </button>
        </div>

        {/* Pro — recommended */}
        <div className="relative rounded-xl border-2 border-on-surface bg-white p-6 flex flex-col gap-4 shadow-card">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-on-surface px-4 py-1 text-xs font-bold text-white">
              Most popular
            </span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">Pro</p>
            <p className="text-4xl font-bold text-on-surface">$9</p>
            <p className="text-on-surface-2 text-sm mt-1">per month</p>
          </div>
          <ul className="flex-1 space-y-2.5">
            {features.pro.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                <span className="text-primary mt-0.5 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleUpgrade("pro")}
            className="w-full rounded-lg bg-on-surface py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Elite */}
        <div className="rounded-xl border border-outline bg-gradient-to-b from-[#1C1A17] to-[#111009] p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-ai-purple-light mb-1">Elite</p>
            <p className="text-4xl font-bold text-white">$19</p>
            <p className="text-white/60 text-sm mt-1">per month</p>
          </div>
          <ul className="flex-1 space-y-2.5">
            {features.elite.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                <span className="text-ai-purple-light mt-0.5 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleUpgrade("elite")}
            className="w-full rounded-lg bg-ai-purple py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Upgrade to Elite
          </button>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="rounded-xl border border-outline bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-outline">
          <h2 className="font-semibold text-on-surface">Full feature comparison</h2>
        </div>
        <div className="divide-y divide-outline">
          {[
            ["AI Scholarship Matches", "10", "50", "Unlimited"],
            ["AI Assistant queries", "—", "50/mo", "Unlimited"],
            ["Document AI Review", "—", "—", "✓"],
            ["Application Builder", "—", "✓", "✓"],
            ["Kanban Tracker", "—", "✓", "✓"],
            ["Eligibility Map", "Basic", "Full", "Full"],
            ["Advisor Sessions", "—", "—", "1/month"],
            ["Priority Alerts", "—", "✓", "✓"]
          ].map(([feature, free, pro, elite]) => (
            <div key={feature} className="grid grid-cols-4 px-6 py-3.5">
              <span className="text-sm text-on-surface col-span-1">{feature}</span>
              <span className="text-sm text-on-surface-2 text-center">{free}</span>
              <span className="text-sm text-primary font-medium text-center">{pro}</span>
              <span className="text-sm text-ai-purple font-medium text-center">{elite}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 px-6 py-3.5 bg-surface-low border-t border-outline">
          <span />
          <span className="text-xs text-on-surface-2 text-center font-semibold">Free</span>
          <span className="text-xs text-primary text-center font-semibold">Pro</span>
          <span className="text-xs text-ai-purple text-center font-semibold">Elite</span>
        </div>
      </div>

      <p className="text-center text-xs text-on-surface-2">
        This is a demo — clicking "Upgrade" activates all premium features instantly with no charge.
      </p>
    </div>
  );
}
