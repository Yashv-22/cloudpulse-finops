import React from "react";
import { GlassCard } from "./GlassCard";
import { Skeleton } from "./Skeleton";

interface KpiWidgetProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  loading?: boolean;
}

export function KpiWidget({ title, value, trend, trendUp, icon, loading }: KpiWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-8 w-32" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium theme-text-secondary flex items-center gap-2">
          {icon} {title}
        </h3>
        {trend && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              trendUp
                ? "bg-green-950/50 text-green-500 border border-green-500/30"
                : "bg-red-950/50 text-red-500 border border-red-500/30"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold theme-text">{value}</div>
    </GlassCard>
  );
}
