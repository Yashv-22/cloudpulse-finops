"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";

export default function Compliance() {
  const { data, loading } = useFetch(() => api.getCompliance(), []);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-1">Compliance & Governance</h1>
        <p className="text-[var(--text-muted)]">Real-time security posture and compliance audit results.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex flex-col items-center justify-center">
          {loading ? (
            <Skeleton className="h-32 w-32 rounded-full" />
          ) : (
            <>
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--border-subtle)]" />
                  <circle
                    cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray="352" strokeDashoffset={352 - (352 * (data?.compliance_score || 0)) / 100}
                    className={`${(data?.compliance_score || 0) >= 80 ? "text-green-500" : (data?.compliance_score || 0) >= 50 ? "text-orange-500" : "text-red-500"} transition-all duration-1000`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-[var(--text-primary)]">{data?.compliance_score || 0}%</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Compliance Score</p>
            </>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Passed ({data?.passed || 0})</h3>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="space-y-2">
              {(data?.passed_checks || []).map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-950/20 border border-green-500/10">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{c.check}</p>
                    <p className="text-xs text-[var(--text-muted)]">{c.resource_type}: {c.resource_id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Failed ({data?.failed || 0})</h3>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="space-y-2">
              {(data?.failed_checks || []).map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-950/20 border border-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{c.issue}</p>
                    <p className="text-xs text-[var(--text-muted)]">{c.resource_type}: {c.resource_id}</p>
                    <span className={`text-xs mt-1 inline-block ${c.severity === "CRITICAL" ? "badge-critical" : "badge-high"}`}>
                      {c.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
