import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { sampleProfiles } from "../../data/mockProfiles";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  },
  {
    to: "/scholarship-matching",
    label: "Find Scholarships",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  },
  {
    to: "/eligibility-map",
    label: "Eligibility Map",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
  },
  {
    to: "/saved",
    label: "Saved",
    icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
  },
  {
    to: "/profile-builder",
    label: "My Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  {
    to: "/preferences",
    label: "Preferences",
    icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
  },
  {
    to: "/document-vault",
    label: "Documents",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  },
  {
    to: "/application-tracker",
    label: "Applications",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
  },
  {
    to: "/ai-assistant",
    label: "AI Assistant",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    premium: true
  },
  {
    to: "/improve-plan",
    label: "Improve Plan",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
  }
];

export function AppLayout() {
  const navigate = useNavigate();
  const { currentProfile, visibleMatches, isPremium, state, setMode, switchProfile } = useAppContext();
  const initial = currentProfile.personal.name ? currentProfile.personal.name[0].toUpperCase() : "S";

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col bg-white border-r border-outline lg:flex">
        {/* Logo */}
        <div className="px-5 py-5">
          <p className="text-base font-semibold text-on-surface tracking-tight">Scholar Career</p>
          <p className="text-xs text-on-surface-2 mt-0.5">AI Scholarship Engine</p>
        </div>

        {/* Mode toggle */}
        <div className="px-3 pb-3">
          <div className="flex rounded-lg border border-outline overflow-hidden bg-surface-low">
            <button
              type="button"
              onClick={() => setMode("recommended")}
              className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                state.mode === "recommended"
                  ? "bg-on-surface text-white"
                  : "text-on-surface-2 hover:bg-surface-container"
              }`}
            >
              Recommended
            </button>
            <button
              type="button"
              onClick={() => setMode("universal")}
              className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                state.mode === "universal"
                  ? "bg-on-surface text-white"
                  : "text-on-surface-2 hover:bg-surface-container"
              }`}
            >
              Universal
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-surface-low text-on-surface font-medium"
                    : "text-on-surface-2 hover:bg-surface-low hover:text-on-surface"
                }`
              }
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="flex-1 truncate">{item.label}</span>
              {item.premium && !isPremium && (
                <span className="shrink-0 text-[10px] font-bold text-ai-purple bg-ai-purple-light rounded px-1.5 py-0.5">PRO</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-outline space-y-2">
          {!isPremium && (
            <button
              type="button"
              onClick={() => navigate("/upgrade")}
              className="w-full rounded-lg bg-on-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
          {isPremium && (
            <div className="rounded-lg bg-ai-purple-light px-3 py-2 text-center">
              <p className="text-xs font-semibold text-ai-purple">Elite Member</p>
            </div>
          )}

          {/* Profile switcher (demo) */}
          <div className="rounded-lg bg-surface-low border border-outline px-3 py-2">
            <p className="text-[10px] font-semibold text-on-surface-2 uppercase tracking-wider mb-1.5">Demo profile</p>
            <select
              className="w-full bg-transparent text-xs text-on-surface outline-none cursor-pointer"
              value={state.activeProfileId}
              onChange={(e) => switchProfile(e.target.value)}
            >
              {sampleProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.personal.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-surface-container flex items-center justify-center text-xs font-semibold text-on-surface shrink-0">
              {initial}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-on-surface truncate">{currentProfile.personal.name || "Student"}</p>
              <p className="text-[10px] text-on-surface-2">Settings</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Top header */}
      <header className="fixed left-0 right-0 top-0 z-20 h-13 flex items-center border-b border-outline bg-white lg:left-56" style={{ height: "52px" }}>
        <div className="flex w-full items-center justify-between px-6 gap-4">
          <p className="text-sm text-on-surface-2 hidden lg:block">
            {visibleMatches.length} scholarships match your profile
            <span className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-low text-on-surface-2">
              {state.mode === "recommended" ? "Recommended" : "Universal"}
            </span>
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <NavLink
              to="/alerts"
              className="relative h-8 w-8 flex items-center justify-center rounded-lg text-on-surface-2 hover:bg-surface-low hover:text-on-surface transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {currentProfile.notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-on-surface" />
              )}
            </NavLink>
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="h-7 w-7 rounded-full bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              {initial}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav strip */}
      <div className="fixed left-0 right-0 z-10 flex gap-1 overflow-x-auto border-b border-outline bg-white px-3 py-2 lg:hidden" style={{ top: "52px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive ? "bg-on-surface text-white" : "bg-surface-low text-on-surface-2"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main */}
      <main className="min-h-screen bg-surface lg:ml-56" style={{ paddingTop: "52px" }}>
        <div className="px-5 py-7 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
