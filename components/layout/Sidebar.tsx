"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Server, HardDrive, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/compute", label: "Compute", icon: Server },
  { href: "/dashboard/storage", label: "Storage", icon: HardDrive },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          CloudPulse
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-muted-foreground shadow-inner">
          <p className="font-semibold text-foreground mb-1">Zero-Trust Active</p>
          <p>Session secures AWS credentials in memory scope.</p>
        </div>
      </div>
    </aside>
  );
}
