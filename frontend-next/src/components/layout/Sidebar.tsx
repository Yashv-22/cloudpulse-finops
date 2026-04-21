"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Activity,
  Zap,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Database,
  Cpu,
  Globe,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Resources", href: "/resources", icon: Server },
  { name: "Cost Explorer", href: "/cost-explorer", icon: Activity },
  { name: "Compute", href: "/compute", icon: Cpu },
  { name: "Storage", href: "/storage", icon: Database },
  { name: "Network", href: "/vpc", icon: Globe },
  { name: "Serverless", href: "/lambda", icon: Cloud },
  { name: "Recommendations", href: "/recommendations", icon: Zap },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = user ? `${user.first_name} ${user.last_name}` : "Admin";
  const displayEmail = user?.email || "admin@cloudpulse.com";
  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`
    : "A";

  return (
    <aside className="w-64 glass-sidebar flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="py-6 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 mb-10 px-2"
          data-testid="sidebar-logo"
        >
          <Shield className="text-[var(--brand)] w-8 h-8" strokeWidth={1.5} />
          <span className="text-xl font-bold glow-text tracking-tight">
            CloudPulse
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm group",
                  isActive
                    ? "bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)]"
                    : "theme-text-secondary hover:theme-text theme-bg-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {item.name}
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t theme-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-lg theme-bg-hover transition-colors mb-2"
          data-testid="sidebar-profile"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center font-semibold text-[var(--text-primary)] text-sm shadow-lg">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium theme-text truncate">
              {displayName}
            </span>
            <span className="text-xs theme-text-muted truncate">
              {displayEmail}
            </span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          data-testid="sidebar-logout"
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
