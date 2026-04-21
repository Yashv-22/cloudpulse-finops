"use client";

import { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { usePreferences } from "@/context/PreferencesContext";
import Link from "next/link";

const statusOptions = ["all", "Active", "Idle", "Unattached", "Underutilized", "Orphaned"];
const sortOptions = [
  { label: "Default", value: "" },
  { label: "Cost (High to Low)", value: "cost_desc" },
  { label: "Cost (Low to High)", value: "cost_asc" },
  { label: "Waste Score", value: "waste_desc" },
];

export default function Resources() {
  const { formatCurrency } = usePreferences();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetcher = useCallback(
    () => api.getResources({ page, status: statusFilter, search: searchTerm, sort: sortBy }),
    [page, statusFilter, searchTerm, sortBy]
  );
  const { data, loading } = useFetch(fetcher, [page, statusFilter, searchTerm, sortBy]);

  const tierBadge = (tier: string) => {
    switch (tier) {
      case "CRITICAL": return "badge-critical";
      case "HIGH": return "badge-high";
      case "MEDIUM": return "badge-medium";
      default: return "badge-low";
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-950/50 text-green-500 border border-green-500/30";
      case "Idle": return "bg-yellow-950/50 text-yellow-500 border border-yellow-500/30";
      case "Unattached": case "Orphaned": return "bg-red-950/50 text-red-500 border border-red-500/30";
      default: return "bg-orange-950/50 text-orange-500 border border-orange-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-1">Resource Analytics</h1>
        <p className="theme-text-muted">Deep dive into active cloud assets and their optimization potential.</p>
      </header>

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
            <input
              type="text"
              placeholder="Search by ID, name, or type..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="input-field pl-9"
              data-testid="resource-search"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2 text-sm"
              data-testid="resource-filter-btn"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="btn-secondary appearance-none text-sm pr-8 cursor-pointer"
                data-testid="resource-sort"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  statusFilter === s
                    ? "bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)]"
                    : "bg-[var(--bg-hover)] theme-text-secondary border border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--text-secondary)]">
                <thead className="text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Resource</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Cost / Mo</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Waste</th>
                    <th className="px-4 py-3 font-medium">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.resources || []).map((r) => (
                    <tr key={r.resource_id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-4 py-3.5">
                        <Link href={`/resources/${r.resource_id}`} className="hover:text-[var(--brand)] transition-colors">
                          <div className="font-medium text-[var(--text-primary)]">{r.name}</div>
                          <div className="text-xs text-[var(--text-muted)] font-mono">{r.resource_id}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--text-secondary)]">{r.type} ({r.instance_type})</td>
                      <td className="px-4 py-3.5 font-mono text-[var(--text-primary)]">{formatCurrency(r.cost_monthly)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`${tierBadge(r.waste_tier)}`}>{r.waste_tier}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--brand)] text-xs">{r.recommendation}</td>
                    </tr>
                  ))}
                  {(data?.resources || []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-muted)]">
                        No resources found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data && data.pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-muted)]">{data.total} resources total</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary p-2 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-[var(--text-secondary)]">Page {page} of {data.pages}</span>
                  <button
                    onClick={() => setPage(Math.min(data.pages, page + 1))}
                    disabled={page === data.pages}
                    className="btn-secondary p-2 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>
    </div>
  );
}
