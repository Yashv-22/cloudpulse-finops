"use client";

import { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Zap, AlertTriangle, ShieldAlert } from "lucide-react";
import { RemediationModal } from "@/components/ui/RemediationModal";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { usePreferences } from "@/context/PreferencesContext";

const priorityFilters = ["all", "Critical", "High", "Medium"];
const categoryFilters = ["all", "compute", "storage", "database", "security", "networking"];

export default function Recommendations() {
  const { formatCurrency } = usePreferences();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetcher = useCallback(
    () => api.getRecommendations({ priority: priorityFilter, category: categoryFilter }),
    [priorityFilter, categoryFilter]
  );
  const { data, loading } = useFetch(fetcher, [priorityFilter, categoryFilter]);

  const handleRemediate = (issue: string, resourceId: string) => {
    setSelectedIssue(issue);
    setSelectedResource(resourceId);
    setModalOpen(true);
  };

  const priorityIcon = (p: string) => {
    switch (p) {
      case "Critical": return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "High": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Zap className="w-5 h-5 text-[var(--brand)]" />;
    }
  };

  const priorityBadge = (p: string) => {
    switch (p) {
      case "Critical": return "badge-critical";
      case "High": return "badge-high";
      case "Medium": return "badge-medium";
      default: return "badge-low";
    }
  };

  const totalSavings = (data?.data || []).reduce((sum, r) => sum + r.savings, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Recommendations</h1>
          <p className="text-[var(--text-muted)]">Zero-touch FinOps. Review and auto-remediate infrastructure waste.</p>
        </div>
        {!loading && (
          <GlassCard className="px-4 py-2">
            <span className="text-xs text-[var(--text-muted)]">Total potential savings</span>
            <p className="text-lg font-bold text-green-500">{formatCurrency(totalSavings)}/mo</p>
          </GlassCard>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-[var(--text-muted)] self-center mr-2">Priority:</span>
        {priorityFilters.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              priorityFilter === p
                ? "bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)]"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p === "all" ? "All" : p}
          </button>
        ))}
        <span className="text-xs text-[var(--text-muted)] self-center ml-4 mr-2">Category:</span>
        {categoryFilters.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              categoryFilter === c
                ? "bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)]"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.data || []).map((rec) => (
            <GlassCard key={rec.id} className="p-6 flex flex-col justify-between group hover:border-[var(--brand-border)] transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {priorityIcon(rec.priority)}
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">{rec.issue}</h3>
                  </div>
                  <span className={priorityBadge(rec.priority)}>{rec.priority}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">{rec.detail}</p>
                <span className="text-xs text-[var(--text-muted)] capitalize">{rec.category}</span>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Est. Savings</span>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(rec.savings)}/mo</p>
                </div>
                <button
                  onClick={() => handleRemediate(rec.issue, rec.resource_id)}
                  className="btn-primary text-sm"
                  data-testid={`remediate-${rec.id}`}
                >
                  Auto-Remediate
                </button>
              </div>
            </GlassCard>
          ))}

          {(data?.data || []).length === 0 && (
            <div className="col-span-2 text-center py-12 text-[var(--text-muted)]">
              No recommendations match the selected filters.
            </div>
          )}
        </div>
      )}

      <RemediationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        issue={selectedIssue}
        resourceId={selectedResource}
      />
    </div>
  );
}
