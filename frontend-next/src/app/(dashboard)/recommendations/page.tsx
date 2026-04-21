"use client";

import { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Zap, AlertTriangle, ShieldAlert, Filter } from "lucide-react";
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
      default: return <Zap className="w-5 h-5 text-[#007AFF]" />;
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
          <p className="text-zinc-500">Zero-touch FinOps. Review and auto-remediate infrastructure waste.</p>
        </div>
        {!loading && (
          <GlassCard className="px-4 py-2">
            <span className="text-xs text-zinc-500">Total potential savings</span>
            <p className="text-lg font-bold text-green-500">{formatCurrency(totalSavings)}/mo</p>
          </GlassCard>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-zinc-500 self-center mr-2">Priority:</span>
        {priorityFilters.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              priorityFilter === p
                ? "bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:text-white"
            }`}
          >
            {p === "all" ? "All" : p}
          </button>
        ))}
        <span className="text-xs text-zinc-500 self-center ml-4 mr-2">Category:</span>
        {categoryFilters.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              categoryFilter === c
                ? "bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:text-white"
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
            <GlassCard key={rec.id} className="p-6 flex flex-col justify-between group hover:border-[#007AFF]/30 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {priorityIcon(rec.priority)}
                    <h3 className="text-base font-semibold text-white">{rec.issue}</h3>
                  </div>
                  <span className={priorityBadge(rec.priority)}>{rec.priority}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{rec.detail}</p>
                <span className="text-xs text-zinc-600 capitalize">{rec.category}</span>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
                <div>
                  <span className="text-xs text-zinc-500">Est. Savings</span>
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
            <div className="col-span-2 text-center py-12 text-zinc-600">
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
