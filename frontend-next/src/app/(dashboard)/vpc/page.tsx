"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/context/PreferencesContext";
import { Network, Globe, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RemediationModal } from "@/components/ui/RemediationModal";

const networkOpportunities = [
  { id: "nat-0abc123def456", name: "prod-nat-gw-us-east-1a", issue: "High Data Transfer", recommendation: "Create S3/DynamoDB VPC Endpoint", savings: 1250 },
  { id: "eipalloc-0123456789abcdef0", name: "legacy-app-eip", issue: "Unattached Elastic IP", recommendation: "Release IP Address", savings: 300 },
  { id: "eipalloc-0123456789abcdef1", name: "test-server-eip", issue: "Unattached Elastic IP", recommendation: "Release IP Address", savings: 300 },
  { id: "arn:aws:elasticloadbalancing:us-east-1:.../app/idle-alb", name: "idle-internal-alb", issue: "Idle Load Balancer", recommendation: "Delete ALB (0 Requests in 7 days)", savings: 1400 },
];

export default function NetworkOptimization() {
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
          <h1 className="text-3xl font-bold mb-1">Network Optimization</h1>
          <p className="text-[var(--text-muted)]">Review data transfer costs, NAT Gateways, and unused network assets.</p>
        </div>
      </header>

      {/* Network Architecture Banner */}
      <GlassCard className="p-6 relative overflow-hidden border border-[var(--border-strong)] flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
          <Globe className="w-6 h-6 text-[#8B5CF6]" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Data Transfer Optimization</h3>
            <span className="px-2 py-0.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs text-[#8B5CF6]">High Impact</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            You are processing 4TB of data through NAT Gateways monthly. Implementing Gateway VPC Endpoints for S3 could eliminate these charges entirely.
          </p>
        </div>
      </GlassCard>

      {/* Network Waste Table */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--border-strong)]">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-semibold mb-1 text-[var(--text-primary)] text-sm">
            <Share2 className="w-4 h-4 text-[#8B5CF6]" /> Network Waste Identification
          </div>
          <p className="text-xs text-[var(--text-muted)]">Unattached EIPs, idle load balancers, and unoptimized routing.</p>
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
                  <th className="px-6 py-4 font-medium">Asset ID</th>
                  <th className="px-6 py-4 font-medium">Issue Detected</th>
                  <th className="px-6 py-4 font-medium">Remediation Action</th>
                  <th className="px-6 py-4 font-medium text-green-500">Est. Savings</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {networkOpportunities.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-[var(--text-primary)] mb-0.5">{item.name}</div>
                      <div className="font-mono text-[var(--text-secondary)] text-[10px] w-48 truncate">{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-500">
                        {item.issue}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">{item.recommendation}</td>
                    <td className="px-6 py-4 text-xs font-bold text-green-500">{getDisplayValue(item.savings)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFix(item.id, item.recommendation)}
                        className="px-4 py-1.5 text-xs font-medium border border-[var(--border-strong)] text-[var(--text-secondary)] rounded hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        Resolve Issue
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
