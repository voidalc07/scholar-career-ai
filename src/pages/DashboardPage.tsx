import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { MatchResult } from "../types/app";
import { getMatchInsights } from "../utils/matching";

const BANNER_IMG = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80";

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  return { day: d.getDate(), month: d.toLocaleString("default", { month: "short" }), days };
}

function MatchRow({ result, onClick }: { result: MatchResult; onClick: () => void }) {
  const dl = fmt(result.scholarship.deadline);
  const isTop = result.score >= 90;
  const insights = getMatchInsights(result);
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border bg-white cursor-pointer hover:shadow-card hover:border-primary/30 transition-all ${isTop ? "border-primary/20" : "border-outline"}`}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-lg bg-surface-low flex items-center justify-center text-sm font-bold text-on-surface shrink-0">
        {result.scholarship.provider?.[0] ?? "S"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface truncate">{result.scholarship.name}</p>
        <p className="text-xs text-on-surface-2 mt-0.5 truncate">
          {result.scholarship.amountLabel} · {result.scholarship.country}
          {insights[0] && <span className="text-success"> · ✓ {insights[0]}</span>}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${isTop ? "text-ai-purple" : "text-primary"}`}>{result.score}%</p>
        <p className="text-[10px] text-on-surface-2 mt-0.5">{dl.month} {dl.day}</p>
      </div>
    </div>
  );
}

function WelcomeBanner({ name, onDismiss }: { name: string; onDismiss: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-on-surface to-[#2d2a28] p-6 elevation-2">
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        aria-label="Dismiss welcome"
      >
        ✕
      </button>
      <div className="flex items-start gap-4 max-w-3xl">
        <div className="h-10 w-10 rounded-full bg-ai-purple/20 flex items-center justify-center text-ai-purple-light text-lg shrink-0">
          ✦
        </div>
        <div>
          <p className="text-ai-purple-light text-xs font-semibold tracking-widest uppercase mb-1">Welcome aboard</p>
          <h2 className="text-white text-xl font-semibold">
            You're all set, {name || "Scholar"}.
          </h2>
          <p className="text-white/70 text-sm mt-2">
            Your matches are below. We'll keep refining them as you complete your profile and upload documents.
          </p>
          <button
            type="button"
            onClick={onDismiss}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white text-on-surface px-4 py-2 text-sm font-semibold hover:bg-surface-low transition-colors"
          >
            Got it →
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { currentProfile, visibleMatches, profileCompletion, savedMatches, nextBestAction, allMatches, pendingWelcome, dismissWelcome } = useAppContext();

  const eligibleNow = visibleMatches.filter((m) => m.status === "Eligible now").length;
  const almostEligible = visibleMatches.filter((m) => m.status === "Almost eligible").length;
  const topMatches = [...visibleMatches].sort((a, b) => b.score - a.score).slice(0, 5);
  const upcomingDeadlines = [...allMatches]
    .filter((m) => new Date(m.scholarship.deadline) > new Date())
    .sort((a, b) => new Date(a.scholarship.deadline).getTime() - new Date(b.scholarship.deadline).getTime())
    .slice(0, 4);
  const missingDocs = currentProfile.documents.filter((d) => d.status !== "Uploaded");

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      {/* Welcome banner — shown right after signup */}
      {pendingWelcome && (
        <WelcomeBanner name={currentProfile.personal.name} onDismiss={dismissWelcome} />
      )}

      {/* Profile banner */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img src={BANNER_IMG} alt="University campus" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="flex-1">
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Dashboard</p>
            <h1 className="text-white text-2xl font-semibold">
              Welcome back, {currentProfile.personal.name || "Scholar"}.
            </h1>
            <p className="text-white/60 text-sm mt-1">{nextBestAction.description}</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(nextBestAction.href)}
              className="rounded-lg bg-white text-on-surface px-4 py-2 text-sm font-medium hover:bg-surface-low transition-colors"
            >
              {nextBestAction.label}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: `${profileCompletion}%`, label: "Profile complete", sub: profileCompletion < 100 ? "Fill in missing fields" : "Complete", color: profileCompletion >= 80 ? "text-success" : "text-primary" },
          { value: eligibleNow, label: "Eligible now", sub: "Ready to apply", color: "text-on-surface" },
          { value: almostEligible, label: "Almost eligible", sub: "Minor gaps to close", color: "text-on-surface" },
          { value: savedMatches.length, label: "Saved", sub: "Scholarships bookmarked", color: "text-on-surface" }
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-outline p-5 elevation-1">
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-sm font-medium text-on-surface mt-1">{s.label}</p>
            <p className="text-xs text-on-surface-2 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col — matches */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-on-surface">Top matches</h2>
              <button onClick={() => navigate("/scholarship-matching")} className="text-xs text-on-surface-2 hover:text-on-surface transition-colors">
                View all {visibleMatches.length} →
              </button>
            </div>
            <div className="space-y-2">
              {topMatches.length > 0 ? (
                topMatches.map((m) => (
                  <MatchRow key={m.scholarship.id} result={m} onClick={() => navigate(`/scholarship/${m.scholarship.id}`)} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-outline p-8 text-center">
                  <p className="text-sm text-on-surface-2">Complete your profile to see matched scholarships.</p>
                  <button onClick={() => navigate("/profile-builder")} className="mt-3 text-sm text-primary font-medium">
                    Go to Profile Builder →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile completion progress */}
          {profileCompletion < 100 && (
            <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-on-surface">Complete your profile</h2>
                <span className="text-sm font-semibold text-primary">{profileCompletion}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container overflow-hidden mb-4">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
              </div>
              <p className="text-xs text-on-surface-2 mb-3">A complete profile unlocks more accurate scholarship matches.</p>
              <button
                onClick={() => navigate("/profile-builder")}
                className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
              >
                Continue building →
              </button>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Deadlines */}
          <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-on-surface">Upcoming deadlines</h2>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((m) => {
                const dl = fmt(m.scholarship.deadline);
                const urgent = dl.days <= 30;
                return (
                  <div key={m.scholarship.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/scholarship/${m.scholarship.id}`)}>
                    <div className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 ${urgent ? "bg-red-50" : "bg-surface-low"}`}>
                      <span className="text-[9px] font-bold uppercase text-on-surface-2">{dl.month}</span>
                      <span className={`text-base font-bold leading-none ${urgent ? "text-red-600" : "text-on-surface"}`}>{dl.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-on-surface truncate group-hover:text-primary transition-colors">{m.scholarship.name}</p>
                      <p className={`text-[10px] mt-0.5 ${urgent ? "text-red-500" : "text-on-surface-2"}`}>{dl.days}d left</p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs text-on-surface-2">No upcoming deadlines.</p>
              )}
            </div>
          </div>

          {/* Missing docs */}
          {missingDocs.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-on-surface">Missing documents</h2>
                <button onClick={() => navigate("/document-vault")} className="text-xs text-on-surface-2 hover:text-on-surface transition-colors">Fix →</button>
              </div>
              <div className="space-y-2">
                {missingDocs.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-1.5">
                    <p className="text-xs text-on-surface">{doc.label}</p>
                    <span className={`text-[10px] font-medium ${doc.status === "Missing" ? "text-red-500" : "text-warning"}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="rounded-xl border border-outline bg-white p-5 elevation-1">
            <h2 className="text-sm font-semibold text-on-surface mb-3">Quick actions</h2>
            <div className="space-y-1">
              {[
                { label: "View eligibility map", href: "/eligibility-map" },
                { label: "Improve my plan", href: "/improve-plan" },
                { label: "Start an application", href: "/application-builder" },
                { label: "Explore AI Assistant", href: "/ai-assistant" }
              ].map((a) => (
                <button
                  key={a.href}
                  type="button"
                  onClick={() => navigate(a.href)}
                  className="w-full text-left flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
                >
                  {a.label}
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
