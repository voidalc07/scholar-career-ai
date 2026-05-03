import { useAppContext } from "../context/AppContext";

const typeConfig: Record<string, { bg: string; text: string; icon: string }> = {
  deadline: { bg: "bg-red-50", text: "text-red-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  document: { bg: "bg-amber-50", text: "text-amber-600", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
  match: { bg: "bg-primary-container", text: "text-primary", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  tip: { bg: "bg-ai-purple-light", text: "text-ai-purple", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
};

export function AlertsPage() {
  const { currentProfile, markNotificationRead } = useAppContext();

  const unread = currentProfile.notifications.filter((n) => !n.read);
  const read = currentProfile.notifications.filter((n) => n.read);

  const NotificationCard = ({ notification }: { notification: typeof currentProfile.notifications[number] }) => {
    const cfg = typeConfig[notification.type] ?? typeConfig.tip;
    return (
      <div className={`flex items-start gap-4 rounded-xl border bg-white p-4 elevation-1 transition-opacity ${notification.read ? "opacity-60 border-outline" : "border-primary/20"}`}>
        <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${cfg.bg}`}>
          <svg className={`h-4.5 w-4.5 ${cfg.text}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path d={cfg.icon} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5 ${cfg.bg} ${cfg.text}`}>
              {notification.type}
            </span>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <h3 className="text-sm font-semibold text-on-surface">{notification.title}</h3>
          <p className="text-xs text-on-surface-2 mt-0.5 leading-relaxed">{notification.body}</p>
        </div>
        {!notification.read && (
          <button
            type="button"
            onClick={() => markNotificationRead(notification.id)}
            className="shrink-0 rounded-lg border border-outline px-3 py-1.5 text-xs font-semibold text-on-surface-2 hover:border-primary/40 hover:text-primary transition-colors"
          >
            Mark read
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Alerts</h1>
          <p className="text-on-surface-2 text-sm mt-1">Deadlines, document blockers, and new match opportunities.</p>
        </div>
        {unread.length > 0 && (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            {unread.length} new
          </span>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2/70">New</p>
          {unread.map((n) => <NotificationCard key={n.id} notification={n} />)}
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest uppercase text-on-surface-2/50">Earlier</p>
          {read.map((n) => <NotificationCard key={n.id} notification={n} />)}
        </div>
      )}

      {currentProfile.notifications.length === 0 && (
        <div className="rounded-xl border border-dashed border-outline p-12 text-center">
          <p className="text-on-surface-2">No alerts yet — they'll appear here when new scholarships match your profile.</p>
        </div>
      )}
    </div>
  );
}
