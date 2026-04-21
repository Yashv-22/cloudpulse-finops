"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { DollarSign, Zap, Shield, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { KpiWidget } from "@/components/ui/KpiWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { usePreferences } from "@/context/PreferencesContext";
import Link from "next/link";

export default function MainDashboard() {
  const { formatCurrency } = usePreferences();
  const { data: kpis, loading: kpiLoading } = useFetch(() => api.getKpis(), []);
  const { data: costTrend, loading: trendLoading } = useFetch(() => api.getCostTrend(), []);
  const { data: serviceCost, loading: serviceLoading } = useFetch(() => api.getServiceCost(), []);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="theme-text-muted">AWS FinOps intelligence and autonomous governance overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiWidget
          title="Total Cost (MTD)"
          value={kpis ? formatCurrency(kpis.total_cost_mtd) : "$0"}
          trend={kpis ? `${kpis.cost_trend_pct}%` : undefined}
          trendUp={kpis ? kpis.cost_trend_pct < 0 : false}
          icon={<DollarSign className="w-4 h-4" />}
          loading={kpiLoading}
        />
        <KpiWidget
          title="Est. Savings"
          value={kpis ? formatCurrency(kpis.total_monthly_savings) : "$0"}
          trend={kpis ? `+${kpis.savings_trend_pct}%` : undefined}
          trendUp={true}
          icon={<Zap className="w-4 h-4 text-yellow-500" />}
          loading={kpiLoading}
        />
        <KpiWidget
          title="Active Resources"
          value={kpis ? kpis.total_resources.toLocaleString() : "0"}
          trend={kpis ? `+${kpis.resource_trend_pct}%` : undefined}
          trendUp={false}
          icon={<Activity className="w-4 h-4 text-[#007AFF]" />}
          loading={kpiLoading}
        />
        <KpiWidget
          title="Governance Score"
          value={kpis ? `${kpis.governance_score}/100` : "0/100"}
          trend="Action Required"
          trendUp={false}
          icon={<Shield className="w-4 h-4 text-orange-500" />}
          loading={kpiLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Cost Trend</h3>
            <Link href="/cost-explorer" className="text-xs text-[#007AFF] hover:text-blue-300 transition-colors">
              View details
            </Link>
          </div>
          {trendLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costTrend?.data || []}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--chart-bg)", borderColor: "var(--chart-border)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)" }} itemStyle={{ color: "#007AFF" }} />
                  <Area type="monotone" dataKey="cost" stroke="#007AFF" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Spend by Service</h3>
          {serviceLoading ? (
            <Skeleton className="flex-1 min-h-[250px]" />
          ) : (
            <>
              <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={serviceCost?.data || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {(serviceCost?.data || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--chart-bg)", borderColor: "var(--chart-border)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="theme-text-muted text-xs">Total</span>
                  <span className="text-xl font-bold theme-text">
                    {serviceCost ? formatCurrency(serviceCost.total) : "$0"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {(serviceCost?.data || []).map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm theme-text-secondary">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Daily Savings Identification</h3>
            <Link href="/recommendations" className="text-xs text-[#007AFF] hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          {trendLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costTrend?.data || []}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--chart-bg)", borderColor: "var(--chart-border)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)" }} cursor={{ fill: "var(--chart-border)" }} />
                  <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-6 w-full text-left">Autonomous Governance</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[var(--border-subtle)]" />
              <circle
                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="502" strokeDashoffset={502 - (502 * (kpis?.governance_score || 0)) / 100}
                className="text-[#007AFF] drop-shadow-[0_0_12px_rgba(0,122,255,0.5)] transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-bold theme-text">
                {kpis?.governance_score || 0}
                <span className="text-xl theme-text-muted">/100</span>
              </span>
              <span className="text-sm theme-text-muted mt-2">Needs Attention</span>
            </div>
          </div>
          <Link
            href="/compliance"
            className="mt-6 w-full glass-button text-[#007AFF] py-2.5 rounded-lg text-sm font-medium text-center block"
            data-testid="view-risks-btn"
          >
            View Critical Risks
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
