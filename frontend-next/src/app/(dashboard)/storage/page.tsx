"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/context/PreferencesContext";
import { HardDrive, ArrowRightLeft, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RemediationModal } from "@/components/ui/RemediationModal";

const modernizationData = [
  { id: "vol-0987654321fedcba1", type: "gp2", size: 100, savings: 160 },
  { id: "vol-0987654321fedcba2", type: "gp2", size: 100, savings: 160 },
];

const opportunitiesData = [
  { id: "vol-0987654321fedcba1", type: "EBS (gp2)", status: "Unattached", size: "100", cost: 950 },
  { id: "vol-0987654321fedcba2", type: "EBS (gp2)", status: "Unattached", size: "100", cost: 950 },
  { id: "customer-data-backups-2023", type: "S3 Bucket", status: "Standard Tier", size: "-", cost: 1850 },
];

export default function StorageOptimization() {
  const { formatCurrency, currency } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFix = (resourceId: string, issueType: string) => {
    setSelectedResource(resourceId);
    setSelectedIssue(issueType);
    setModalOpen(true);
  };

  // Use a converter to match exactly the mock amounts in the image, assuming the mock was in INR natively.
  // We'll divide by the rate if we are in USD so it converts back.
  const getDisplayValue = (inrValue: number) => {
    if (currency === 'INR') {
      return formatCurrency(inrValue / 93.596047); // formatCurrency multiplies by 93.596047
    }
    return formatCurrency(inrValue / 93.596047);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Storage Optimization</h1>
          <p className="text-[var(--text-muted)]">Review unattached volumes and modernize legacy storage.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-strong)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-all text-[var(--text-primary)]">
          Add Custom Storage
        </button>
      </header>

      {/* Modernization Section */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--border-strong)] relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent pointer-events-none" />
        <div className="p-6 relative z-10 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[#3B82F6] font-semibold mb-1 text-sm">
            <ArrowRightLeft className="w-4 h-4" /> Modernization (GP2 → GP3)
          </div>
          <p className="text-xs text-[#3B82F6]/70">Upgrade older gp2 volumes to gp3 for up to 20% lower price point and configurable performance.</p>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left text-sm text-[var(--text-primary)]">
              <thead className="text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Volume ID</th>
                  <th className="px-6 py-4 font-medium">Current Type</th>
                  <th className="px-6 py-4 font-medium">Size (GB)</th>
                  <th className="px-6 py-4 font-medium text-green-500">Est. Savings (GP3)</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {modernizationData.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-[var(--text-secondary)]">{item.id}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">{item.size}</td>
                    <td className="px-6 py-4 text-xs font-bold text-green-500">{getDisplayValue(item.savings)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFix(item.id, `Upgrade volume to GP3`)}
                        className="px-4 py-1.5 text-xs font-medium bg-[#3B82F6] text-white rounded hover:bg-[#2563EB] transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        Modify Volume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Storage Opportunities Section */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--border-strong)]">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-semibold mb-1 text-[var(--text-primary)] text-sm">
            <Database className="w-4 h-4" /> Storage Opportunities
          </div>
          <p className="text-xs text-[var(--text-muted)]">EBS volumes that are unattached and S3 buckets missing Intelligent Tiering.</p>
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
                  <th className="px-6 py-4 font-medium">Resource ID / Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Size (GB)</th>
                  <th className="px-6 py-4 font-medium text-red-400">Est. Monthly Cost</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {opportunitiesData.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-[var(--text-secondary)]">{item.id}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)]">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "Unattached" ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
                          {item.status}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">{item.size}</td>
                    <td className="px-6 py-4 text-xs font-bold text-red-400">{getDisplayValue(item.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFix(item.id, `Remediate ${item.status} Storage Resource`)}
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
