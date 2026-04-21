"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, X, ExternalLink, Sun, Moon, DollarSign, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";
import { useNotificationStore } from "@/lib/store";
import { usePreferences } from "@/context/PreferencesContext";
import Link from "next/link";

export function Navbar() {
  const { theme, toggleTheme, currency, toggleCurrency } = usePreferences();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getNotifications().then((res) => {
      setNotifications(res.notifications);
      setUnreadCount(res.unread_count);
    }).catch(() => {});
  }, [setUnreadCount]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      api.globalSearch(query).then((res) => {
        setSearchResults(res.results);
        setSearchOpen(true);
      }).catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleMarkRead = async (id: number) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const notifColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-500";
      case "warning": return "bg-orange-500";
      case "success": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <header className="h-16 glass-header flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="relative w-96" ref={searchRef}>
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
        <input
          type="text"
          placeholder="Search resources, recommendations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10 pr-4 py-2 text-sm"
          data-testid="navbar-search"
        />
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 theme-bg-panel border theme-border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
            {searchResults.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="flex items-center justify-between px-4 py-3 theme-bg-hover transition-colors border-b border-[var(--border-subtle)] last:border-0"
              >
                <div>
                  <p className="text-sm font-medium theme-text">{r.title}</p>
                  <p className="text-xs theme-text-muted">{r.subtitle}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 theme-text-muted" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleCurrency}
          className="p-2 rounded-lg theme-bg-hover transition-colors theme-text-secondary hover:text-[var(--text-primary)]"
          title={`Switch to ${currency === "USD" ? "INR" : "USD"}`}
          data-testid="navbar-currency-toggle"
        >
          {currency === "USD" ? <DollarSign className="w-5 h-5" strokeWidth={1.5} /> : <IndianRupee className="w-5 h-5" strokeWidth={1.5} />}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg theme-bg-hover transition-colors theme-text-secondary hover:text-[var(--text-primary)]"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          data-testid="navbar-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg theme-bg-hover transition-colors theme-text-secondary hover:text-[var(--text-primary)]"
            data-testid="navbar-notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-12 right-0 w-96 theme-bg-panel border theme-border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-semibold theme-text">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#007AFF] hover:text-blue-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1 theme-bg-hover rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 theme-text-muted" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleMarkRead(n.id)}
                    className={`w-full text-left px-4 py-3 theme-bg-hover transition-colors border-b border-[var(--border-subtle)] last:border-0 ${
                      !n.read ? "bg-[var(--bg-hover)]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notifColor(n.type)}`} />
                      <div className="min-w-0">
                        <p className={`text-sm ${!n.read ? "font-medium text-[var(--text-primary)]" : "theme-text-secondary"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs theme-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Link
                href="/notifications"
                onClick={() => setNotifOpen(false)}
                className="block text-center py-3 text-xs text-[#007AFF] hover:text-blue-300 border-t border-[var(--border-subtle)] transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
