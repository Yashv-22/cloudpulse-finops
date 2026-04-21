"use client";

import { use } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Server, MapPin, Tag, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { usePreferences } from "@/context/PreferencesContext";
import Link from "next/link";

export default function ResourceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formatCurrency } = usePreferences();
  const { data, loading, error } = useFetch(() => api.getResourceDetail(id), [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[var(--text-muted)] mb-4">Resource not found</p>
        <Link href="/resources" className="btn-primary">Back to Resources</Link>
      </div>
    );
  }

  const cpuData = (data.metrics?.cpu_history || []).map((v: number, i: number) => ({ hour: `${i}h`, cpu: v.toFixed(1) }));
  const costData = (data.metrics?.cost_history || []).map((v: number, i: number) => ({ day: `Day ${i + 1}`, cost: v.toFixed(2) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/resources" className="p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-sm text-[var(--text-muted)] font-mono">{data.resource_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <Server className="w-5 h-5 text-[var(--brand)]" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Type</p>
            <p className="text-sm font-medium">{data.type} ({data.instance_type})</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-green-500" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Region</p>
            <p className="text-sm font-medium">{data.region}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <Tag className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Monthly Cost</p>
            <p className="text-sm font-medium">{formatCurrency(data.cost_monthly)}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--text-secondary)]" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Status</p>
            <p className="text-sm font-medium">{data.status} ({data.waste_tier})</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">CPU Utilization (24h)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="cpu" stroke="var(--brand)" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cost History (7d)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <XAxis dataKey="day" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="cost" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="space-y-2">
            {Object.entries(data.tags || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                <span className="text-sm text-[var(--text-muted)]">{k}</span>
                <span className="text-sm font-mono text-[var(--text-secondary)]">{String(v)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Recommendation</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4">{data.recommendation}</p>
          <Link href="/recommendations" className="btn-primary inline-block text-sm">
            View Remediation Options
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
