"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/context/PreferencesContext";
import { Zap, FunctionSquare, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RemediationModal } from "@/components/ui/RemediationModal";

const lambdaOpportunities = [
  { id: "arn:aws:lambda:us-east-1:auth-service", name: "auth-service-prod", memory: "1024 MB", recommendation: "Reduce to 256 MB", savings: 450 },
  { id: "arn:aws:lambda:us-east-1:image-processor", name: "image-processor-worker", memory: "2048 MB", recommendation: "Enable Provisioned Concurrency", savings: 120 },
  { id: "arn:aws:lambda:us-west-2:data-sync", name: "nightly-data-sync", memory: "512 MB", recommendation: "Migrate to Graviton2", savings: 85 },
];

export default function ServerlessOptimization() {
  const { formatCurrency, currency } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFix = (resourceId: string, issue: string) => {
    setSelectedResource(resourceId);
    setSelectedIssue(issue);
    setModalOpen(true);
  };

  const getDisplayValue = (inrValue: number) => {
    return formatCurrency(inrValue / 93.596047);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Serverless Optimization</h1>
          <p className="text-[var(--text-muted)]">Optimize AWS Lambda functions for cost and performance.</p>
        </div>
      </header>

      {/* Architecture Banner */}
      <GlassCard className="p-6 relative overflow-hidden border border-[var(--border-strong)] flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-[#10B981]" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Architecture Modernization</h3>
            <span className="px-2 py-0.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-xs text-[#10B981]">Medium Impact</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Converting API Gateway REST APIs to HTTP APIs where possible could reduce your serverless invocation costs by up to 70%.
          </p>
        </div>
      </GlassCard>

      {/* Over-provisioned Memory Table */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--border-strong)]">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-semibold mb-1 text-[var(--text-primary)] text-sm">
            <FunctionSquare className="w-4 h-4 text-[#F59E0B]" /> Lambda Tuning Opportunities
          </div>
          <p className="text-xs text-[var(--text-muted)]">Functions with over-provisioned memory or suboptimal architectures.</p>
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
                  <th className="px-6 py-4 font-medium">Function Name</th>
                  <th className="px-6 py-4 font-medium">Current Memory</th>
                  <th className="px-6 py-4 font-medium">Recommendation</th>
                  <th className="px-6 py-4 font-medium text-green-500">Est. Savings</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {lambdaOpportunities.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-[var(--text-primary)] mb-0.5">{item.name}</div>
                      <div className="font-mono text-[var(--text-secondary)] text-[10px]">{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)]">
                        {item.memory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">{item.recommendation}</td>
                    <td className="px-6 py-4 text-xs font-bold text-green-500">{getDisplayValue(item.savings)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFix(item.id, item.recommendation)}
                        className="px-4 py-1.5 text-xs font-medium border border-[var(--border-strong)] text-[var(--text-secondary)] rounded hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        Apply Tuning
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
