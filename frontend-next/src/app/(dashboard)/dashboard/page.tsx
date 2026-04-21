"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Download, ShieldAlert, Zap, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { RemediationModal } from "@/components/ui/RemediationModal";
import { usePreferences } from "@/context/PreferencesContext";
import Link from "next/link";
import { useState, useEffect } from "react";

const forecastData = [
  { month: "Apr", unoptimized: 18000, optimized: 4000 },
  { month: "May", unoptimized: 19000, optimized: 4000 },
  { month: "Jun", unoptimized: 20000, optimized: 4000 },
  { month: "Jul", unoptimized: 21500, optimized: 4000 },
  { month: "Aug", unoptimized: 23000, optimized: 4000 },
  { month: "Sept", unoptimized: 24500, optimized: 4000 },
  { month: "Oct", unoptimized: 26000, optimized: 4000 },
  { month: "Nov", unoptimized: 27500, optimized: 4000 },
  { month: "Dec", unoptimized: 29000, optimized: 4000 },
  { month: "Jan", unoptimized: 30000, optimized: 4000 },
  { month: "Feb", unoptimized: 31000, optimized: 4000 },
  { month: "Mar", unoptimized: 32000, optimized: 4000 },
];

const healthData = [
  { subject: "Cost", A: 80, fullMark: 100 },
  { subject: "Compute", A: 65, fullMark: 100 },
  { subject: "Storage", A: 45, fullMark: 100 },
  { subject: "Network", A: 90, fullMark: 100 },
  { subject: "Security", A: 75, fullMark: 100 },
];

const recentOpps = [
  { resource: "dev-server-1", type: "t3.medium", waste: 2700 },
  { resource: "dev-server-2", type: "t3.medium", waste: 2700 },
  { resource: "staging-worker", type: "t3.medium", waste: 2700 },
  { resource: "test-db-replica", type: "t3.medium", waste: 2700 },
  { resource: "customer-data-backups-...", type: "S3 Bucket", waste: 1850 },
  { resource: "vol-0987654321fedcba1", type: "EBS (gp2)", waste: 950 },
  { resource: "vol-0987654321fedcba2", type: "EBS (gp2)", waste: 950 },
];

const distData = [
  { name: "Compute", value: 60, color: "#EF4444" },
  { name: "Storage", value: 25, color: "#3B82F6" },
  { name: "Network", value: 15, color: "#10B981" },
];

export default function MainDashboard() {
  const { formatCurrency, currency } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFix = (resourceId: string, type: string) => {
    setSelectedResource(resourceId);
    setSelectedIssue(`Optimize ${type} resource to eliminate waste`);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Executive Summary</h1>
          <p className="text-[var(--text-muted)]">Comprehensive view of AWS infrastructure risk, waste, and recovery potential.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-strong)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-all text-[var(--text-primary)]">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-[var(--text-muted)]">Monthly Savings Potential</span>
            <span className="text-[var(--text-muted)]">{currency === 'INR' ? '₹' : '$'}</span>
          </div>
          <div className="text-3xl font-bold text-green-500 mb-1">{formatCurrency(180.56)}</div>
          <div className="text-xs text-[var(--text-muted)]">Found in your account</div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-sm text-[var(--text-muted)]">Optimization Score</span>
            <ShieldAlert className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--border-subtle)]" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset="42.5" className="text-orange-500" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold">66%</span>
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">Financial Health</div>
              <div className="text-xs text-[var(--text-muted)]">Current state of infra</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-[var(--text-muted)]">Zombie Resources</span>
            <Activity className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">16</div>
          <div className="text-xs text-[var(--text-muted)]">Unused EBS / EIPs / EC2</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-[var(--text-muted)]">Efficiency Grade</span>
            <ShieldAlert className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500/30 flex items-center justify-center text-xl font-bold text-orange-500">
              C
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Based on waste %</div>
          </div>
        </GlassCard>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-1">12-Month Spending Forecast</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Projected Unoptimized vs. Optimized Infrastructure Costs.</p>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUnopt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-strong)", borderRadius: "8px", fontSize: "12px", color: "var(--text-primary)" }} />
                  <Area type="monotone" dataKey="unoptimized" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorUnopt)" />
                  <Area type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOpt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-1">Overall System Health</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Multi-dimensional posture analysis across the primary architecture pillars.</p>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthData}>
                  <PolarGrid stroke="var(--border-strong)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Health" dataKey="A" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-strong)", borderRadius: "8px", fontSize: "12px", color: "var(--text-primary)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-1">Recent Opportunities</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Top resources to optimize.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-primary)]">
              <thead className="text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-2 py-3 font-medium">Resource</th>
                  <th className="px-2 py-3 font-medium">Type</th>
                  <th className="px-2 py-3 font-medium">Waste/Mo</th>
                  <th className="px-2 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {recentOpps.map((opp, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-2 py-3 text-xs font-mono">{opp.resource}</td>
                    <td className="px-2 py-3 text-xs"><span className="px-2 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)]">{opp.type}</span></td>
                    <td className="px-2 py-3 text-xs font-mono">{formatCurrency(opp.waste / (currency === 'INR' ? 93.596047 : 1))}</td>
                    <td className="px-2 py-3 text-right">
                      <button 
                        onClick={() => handleFix(opp.resource, opp.type)}
                        className="px-3 py-1 text-xs border border-[var(--border-strong)] rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        Fix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-1">Resource Distribution</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Where the money goes</p>
          {loading ? (
            <Skeleton className="flex-1 min-h-[250px]" />
          ) : (
            <div className="flex-1 min-h-[250px] relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="var(--bg-surface)" strokeWidth={2}>
                    {distData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-strong)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[var(--text-muted)] text-xs">Total Tracked</span>
                <span className="text-xl font-bold text-[var(--text-primary)]">
                  100%
                </span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <RemediationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        issue={selectedIssue}
        resourceId={selectedResource}
      />
    </div>
  );
}
