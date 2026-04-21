"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/context/PreferencesContext";
import { Cpu, AlertCircle, Server } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RemediationModal } from "@/components/ui/RemediationModal";

const idleInstances = [
  { id: "i-0abcd1234efgh5671", name: "dev-server-1", type: "t3.medium", status: "Under-utilized", cpu: "0.8%", cost: 2700 },
  { id: "i-0abcd1234efgh5672", name: "dev-server-2", type: "t3.medium", status: "Under-utilized", cpu: "0.4%", cost: 2700 },
  { id: "i-0abcd1234efgh5673", name: "staging-worker", type: "t3.medium", status: "Under-utilized", cpu: "0.9%", cost: 2700 },
  { id: "i-0abcd1234efgh5674", name: "test-db-replica", type: "t3.medium", status: "Under-utilized", cpu: "0.2%", cost: 2700 },
];

export default function ComputeResources() {
  const { formatCurrency, currency } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFix = (resourceId: string, name: string) => {
    setSelectedResource(resourceId);
    setSelectedIssue(`Idle EC2 Instance Detected: ${name}`);
    setModalOpen(true);
  };

  const getDisplayValue = (inrValue: number) => {
    return formatCurrency(inrValue / 93.596047);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Compute Resources</h1>
          <p className="text-[var(--text-muted)]">Review and optimize your EC2 instances.</p>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium text-sm">Permissions Required</span>
        <div className="w-10 h-4 bg-red-400/20 rounded-full ml-2"></div>
      </div>

      {/* Modernization Banner */}
      <GlassCard className="p-6 relative overflow-hidden border border-[var(--border-strong)] flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
          <Cpu className="w-6 h-6 text-[var(--text-primary)]" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Modernize with Graviton4 (ARM)</h3>
            <span className="px-2 py-0.5 rounded-full border border-[var(--border-strong)] text-xs text-[var(--text-secondary)]">High Impact</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Migrating compatible workloads to AWS Graviton4 processors would save you approximately <strong className="text-[var(--text-primary)] font-semibold">{getDisplayValue(3400)}/month</strong> with 40% better price-performance.
          </p>
        </div>
      </GlassCard>

      {/* Idle Instances Table */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--border-strong)]">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-semibold mb-1 text-[var(--text-primary)] text-sm">
            <Server className="w-4 h-4" /> Idle EC2 Instances
          </div>
          <p className="text-xs text-[var(--text-muted)]">Instances with average CPU utilization below 5%.</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-primary)]">
              <thead className="text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Instance ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-red-400">Avg CPU</th>
                  <th className="px-6 py-4 font-medium">Est. Monthly Cost</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {idleInstances.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-[var(--text-secondary)]">{item.id}</td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)]">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-red-400">{item.cpu}</td>
                    <td className="px-6 py-4 text-xs font-bold text-[var(--text-primary)]">{getDisplayValue(item.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFix(item.id, item.name)}
                        className="px-4 py-1.5 text-xs font-medium border border-[var(--border-strong)] text-[var(--text-secondary)] rounded hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        View Fix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <RemediationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        issue={selectedIssue}
        resourceId={selectedResource}
      />
    </div>
  );
}
