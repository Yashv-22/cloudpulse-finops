import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Search, Filter, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

const SEVERITY_STYLES = {
  critical: 'bg-red-950/50 text-red-500 border-red-500/30',
  high: 'bg-orange-950/50 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-950/50 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-950/50 text-green-400 border-green-500/30',
  monitor: 'bg-zinc-800/50 text-zinc-400 border-zinc-600/30',
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [severity, setSeverity] = useState('');
  const [region, setRegion] = useState('');
  const [types, setTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, search, resource_type: resourceType, severity, region, sort_by: 'waste_score', sort_order: 'desc' });
      const { data } = await axios.get(`${API}/api/resources?${params}`);
      setResources(data.resources);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, resourceType, severity, region]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [t, r] = await Promise.all([
          axios.get(`${API}/api/resources/types`),
          axios.get(`${API}/api/resources/regions`),
        ]);
        setTypes(t.data.types);
        setRegions(r.data.regions);
      } catch (e) { console.error(e); }
    };
    fetchFilters();
  }, []);

  const clearFilters = () => {
    setSearch(''); setResourceType(''); setSeverity(''); setRegion(''); setPage(1);
  };

  const hasFilters = search || resourceType || severity || region;

  return (
    <div data-testid="resources-page" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">Resources</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">AWS resource inventory with waste analysis</p>
        </div>
        <span className="text-sm font-ibm-plex text-zinc-500">{total} resources</span>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              data-testid="resource-search"
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <select data-testid="filter-type" value={resourceType} onChange={e => { setResourceType(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 focus:outline-none">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select data-testid="filter-severity" value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 focus:outline-none">
            <option value="">All Severities</option>
            {['critical', 'high', 'medium', 'low', 'monitor'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <select data-testid="filter-region" value={region} onChange={e => { setRegion(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 focus:outline-none">
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-800 transition-all" data-testid="clear-filters">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="resources-table">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Name', 'Type', 'Region', 'CPU %', 'Mem %', 'Cost (7d)', 'Severity', 'Waste Score'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-ibm-plex font-medium text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-zinc-500"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : resources.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-zinc-500 font-ibm-plex">No resources found</td></tr>
              ) : resources.map((r, idx) => (
                <tr
                  key={r.resource_id}
                  data-testid={`resource-row-${idx}`}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-ibm-plex">{r.name}</p>
                    <p className="text-xs text-zinc-600 font-mono mt-0.5">{r.resource_id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300 font-ibm-plex">{r.resource_type}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400 font-ibm-plex">{r.region}</td>
                  <td className="px-4 py-3 text-sm font-mono text-zinc-300">{r.cpu_avg?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-zinc-300">{r.memory_avg?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-white">${r.cost_7d?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {r.waste_severity ? (
                      <span className={`inline-block px-2 py-0.5 text-xs font-ibm-plex font-medium rounded border capitalize ${SEVERITY_STYLES[r.waste_severity] || ''}`}>
                        {r.waste_severity}
                      </span>
                    ) : <span className="text-xs text-zinc-600">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    {r.waste_score > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${r.waste_score}%`,
                              background: r.waste_score > 65 ? '#FF3B30' : r.waste_score > 40 ? '#FF9500' : '#34C759',
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-400">{r.waste_score}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-500 font-ibm-plex">Page {page} of {pages}</span>
            <div className="flex gap-1">
              <button
                data-testid="prev-page"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                data-testid="next-page"
                disabled={page >= pages}
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()} data-testid="resource-detail-modal">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-outfit font-semibold text-white">{selected.name}</h3>
                <p className="text-xs font-mono text-zinc-500 mt-1">{selected.resource_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Type', selected.resource_type],
                ['Region', selected.region],
                ['CPU Avg', `${selected.cpu_avg?.toFixed(1)}%`],
                ['Memory Avg', `${selected.memory_avg?.toFixed(1)}%`],
                ['Cost (7d)', `$${selected.cost_7d?.toFixed(2)}`],
                ['Waste Score', selected.waste_score || '-'],
                ['Carbon (7d)', `${selected.carbon_g_co2_7d?.toFixed(1)}g CO2`],
                ['Last Active', selected.last_active?.split('T')[0]],
              ].map(([k, v]) => (
                <div key={k} className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 font-ibm-plex mb-1">{k}</p>
                  <p className="text-white font-ibm-plex">{v}</p>
                </div>
              ))}
            </div>
            {selected.tags && (
              <div className="mt-4">
                <p className="text-xs text-zinc-500 font-ibm-plex mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selected.tags).map(([k, v]) => (
                    <span key={k} className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300 font-mono">{k}: {v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
