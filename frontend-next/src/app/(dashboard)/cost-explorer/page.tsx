"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Download, AlertTriangle, TrendingDown } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { usePreferences } from "@/context/PreferencesContext";

const rangeTabs = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

export default function CostExplorer() {
  const { formatCurrency } = usePreferences();
  const [range, setRange] = useState(30);
  const { data: dailyData, loading: dailyLoading } = useFetch(() => api.getCostExplorerDaily(range), [range]);
  const { data: serviceData, loading: serviceLoading } = useFetch(() => api.getCostByService(), []);
  const { data: anomalyData, loading: anomalyLoading } = useFetch(() => api.getCostAnomalies(), []);

  const handleExport = () => {
    if (!dailyData) return;
    const csv = "Date,Cost,Forecast\n" + dailyData.data.map((d) => `${d.date},${d.cost},${d.forecast}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cloudpulse-cost-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Cost Explorer</h1>
          <p className="text-[var(--text-muted)]">Deep dive into historical cloud spending and forecasting.</p>
        </div>
        <div className="flex gap-2">
          {rangeTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setRange(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === t.value
                  ? "bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)]"
                  : "btn-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm" data-testid="export-btn">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-6">Spend vs Forecast ({range} Days)</h3>
          {dailyLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData?.data || []}>
                  <defs>
                    <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="cost" stroke="var(--brand)" strokeWidth={2} fillOpacity={1} fill="url(#costFill)" name="Actual" />
                  <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#forecastFill)" name="Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <div className="space-y-6">
          {anomalyLoading ? (
            <>
              <Skeleton className="h-44" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              {(anomalyData?.anomalies || []).slice(0, 1).map((a) => (
                <GlassCard key={a.id} className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Cost Spike Detected</h3>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">+{formatCurrency(a.spike_amount)}</p>
                  <p className="text-xs text-[var(--text-muted)] mb-4">{a.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${a.severity === "high" ? "badge-high" : "badge-medium"}`}>
                    {a.severity}
                  </span>
                </GlassCard>
              ))}

              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)]">AI Forecasting</h3>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)] mb-1">
                  -{formatCurrency(anomalyData?.forecast_savings || 0)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Implement top recommendations to reduce end-of-month spend by {anomalyData?.forecast_savings_pct || 0}%.
                </p>
              </GlassCard>
            </>
          )}
        </div>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-6">Cost by Service (Monthly Comparison)</h3>
        {serviceLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Current Month</th>
                  <th className="px-4 py-3 font-medium">Previous Month</th>
                  <th className="px-4 py-3 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {(serviceData?.data || []).map((s) => (
                  <tr key={s.service} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{s.service}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(s.cost)}</td>
                    <td className="px-4 py-3 font-mono text-[var(--text-muted)]">{formatCurrency(s.previous)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${s.change < 0 ? "text-green-500" : s.change > 0 ? "text-red-500" : "text-[var(--text-muted)]"}`}>
                        {s.change > 0 ? "+" : ""}{s.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
