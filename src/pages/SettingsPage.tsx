import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";

export function SettingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resetWorkspace, state, updateSettings, isPremium, currentProfile } = useAppContext();
  const userInitial = currentProfile.personal.name ? currentProfile.personal.name[0].toUpperCase() : "S";
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSettingsChange = <K extends keyof typeof state.settings>(key: K, value: (typeof state.settings)[K]) => {
    updateSettings({ [key]: value } as Partial<typeof state.settings>);
    showToast("Preferences saved", "success");
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetWorkspace();
    setConfirmReset(false);
    showToast("Workspace reset to defaults", "info");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Settings</h1>
        <p className="text-on-surface-2 text-sm mt-1">Manage your account preferences and workspace.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-outline bg-white p-5 flex items-center gap-4 elevation-1">
        <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-xl font-bold text-primary">
          {userInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface">{currentProfile.personal.name || "Student"}</p>
          <p className="text-sm text-on-surface-2">{currentProfile.personal.nationality || "Nationality not set"}</p>
        </div>
        {isPremium ? (
          <span className="rounded-full bg-ai-purple-light px-3 py-1 text-xs font-bold text-ai-purple">Elite</span>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/upgrade")}
            className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            Free plan
          </button>
        )}
      </div>

      {/* Workspace preferences */}
      <div className="rounded-xl border border-outline bg-white overflow-hidden elevation-1">
        <div className="px-5 py-4 border-b border-outline">
          <h2 className="font-semibold text-on-surface text-sm">Workspace preferences</h2>
        </div>
        <div className="divide-y divide-outline">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-on-surface">Display density</p>
              <p className="text-xs text-on-surface-2 mt-0.5">Adjust how content is spaced across the app</p>
            </div>
            <select
              className="rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              onChange={(e) => handleSettingsChange("compactMode", e.target.value === "true")}
              value={String(state.settings.compactMode)}
            >
              <option value="false">Comfortable</option>
              <option value="true">Compact</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-on-surface">Email notifications</p>
              <p className="text-xs text-on-surface-2 mt-0.5">Deadline reminders and new match alerts</p>
            </div>
            <select
              className="rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              onChange={(e) => handleSettingsChange("notificationsEnabled", e.target.value === "true")}
              value={String(state.settings.notificationsEnabled)}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-on-surface">AI Assistant tone</p>
              <p className="text-xs text-on-surface-2 mt-0.5">How the assistant frames its advice</p>
            </div>
            <select
              className="rounded-lg border border-outline bg-white px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              onChange={(e) => handleSettingsChange("assistantTone", e.target.value as "mentor" | "direct" | "encouraging")}
              value={state.settings.assistantTone}
            >
              <option value="mentor">Mentor</option>
              <option value="direct">Direct</option>
              <option value="encouraging">Encouraging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plan */}
      {!isPremium && (
        <div className="rounded-xl border border-primary/20 bg-primary-container/40 p-5 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">You're on the Free plan</p>
            <p className="text-xs text-on-surface-2 mt-0.5">Upgrade to unlock AI Assistant, unlimited matches, and more.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/upgrade")}
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Danger zone */}
      <div className="rounded-xl border border-outline bg-white overflow-hidden elevation-1">
        <div className="px-5 py-4 border-b border-outline">
          <h2 className="font-semibold text-on-surface text-sm">Workspace</h2>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">Reset to defaults</p>
            <p className="text-xs text-on-surface-2 mt-0.5">Restore seed profiles, saved scholarships, and application state.</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              confirmReset
                ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-outline text-on-surface-2 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {confirmReset ? "Click again to confirm" : "Reset workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
