"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Bell, CheckCheck, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { useNotificationStore } from "@/lib/store";

export default function NotificationsPage() {
  const { setUnreadCount } = useNotificationStore();
  const { data, loading, refetch } = useFetch(() => api.getNotifications(), []);

  const handleMarkAll = async () => {
    await api.markAllRead().catch(() => {});
    setUnreadCount(0);
    refetch();
  };

  const handleMarkOne = async (id: number) => {
    await api.markNotificationRead(id).catch(() => {});
    refetch();
    if (data) {
      const remaining = data.notifications.filter((n) => !n.read && n.id !== id).length;
      setUnreadCount(remaining);
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "critical": return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-[var(--brand)]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-[var(--text-muted)]">Stay on top of alerts, anomalies, and system events.</p>
        </div>
        {data && data.unread_count > 0 && (
          <button onClick={handleMarkAll} className="btn-secondary text-sm flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </header>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.notifications || []).map((n) => (
            <GlassCard
              key={n.id}
              className={`p-5 flex items-start gap-4 cursor-pointer hover:border-[var(--border-strong)] transition-all ${!n.read ? "border-l-2 border-l-[var(--brand)]" : ""}`}
              onClick={() => !n.read && handleMarkOne(n.id)}
            >
              <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <p className={`text-sm ${!n.read ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-[var(--text-muted)] whitespace-nowrap shrink-0">
                    {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{n.message}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--brand)] mt-2 shrink-0" />}
            </GlassCard>
          ))}
          {(data?.notifications || []).length === 0 && (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <Bell className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
