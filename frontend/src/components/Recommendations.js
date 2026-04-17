import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API, useAuth } from '../App';
import { Brain, ChevronDown, ChevronUp, Play, CheckCircle, XCircle, Loader2, Code, Terminal } from 'lucide-react';

const SEVERITY_STYLES = {
  critical: 'bg-red-950/50 text-red-500 border-red-500/30',
  high: 'bg-orange-950/50 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-950/50 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-950/50 text-green-400 border-green-500/30',
  monitor: 'bg-zinc-800/50 text-zinc-400 border-zinc-600/30',
};

function ScriptViewer({ terraform, cli }) {
  const [tab, setTab] = useState('terraform');
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
      <div className="flex border-b border-zinc-800">
        <button
          data-testid="script-tab-terraform"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-ibm-plex transition-colors ${tab === 'terraform' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setTab('terraform')}
        >
          <Code className="w-3.5 h-3.5" /> Terraform
        </button>
        <button
          data-testid="script-tab-cli"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-ibm-plex transition-colors ${tab === 'cli' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setTab('cli')}
        >
          <Terminal className="w-3.5 h-3.5" /> AWS CLI
        </button>
      </div>
      <div className="bg-black/80 p-4">
        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{tab === 'terraform' ? terraform : cli}</pre>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [generating, setGenerating] = useState(null);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, severity, status });
      const { data } = await axios.get(`${API}/api/recommendations?${params}`);
      setRecs(data.recommendations);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, severity, status]);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const updateStatus = async (recId, newStatus) => {
    try {
      await axios.patch(`${API}/api/recommendations/${recId}`, { status: newStatus });
      setRecs(prev => prev.map(r => r.rec_id === recId ? { ...r, status: newStatus } : r));
    } catch (e) { console.error(e); }
  };

  const createRemediation = async (rec) => {
    setGenerating(rec.rec_id);
    try {
      await axios.post(`${API}/api/remediations`, { rec_id: rec.rec_id });
      setRecs(prev => prev.map(r => r.rec_id === rec.rec_id ? { ...r, status: 'accepted' } : r));
    } catch (e) { console.error(e); }
    finally { setGenerating(null); }
  };

  const canManage = ['admin', 'engineer', 'analyst'].includes(user?.role);

  return (
    <div data-testid="recommendations-page" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">Recommendations</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">AI-powered waste analysis and remediation suggestions</p>
        </div>
        <span className="text-sm text-zinc-500 font-ibm-plex">{total} recommendations</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <select data-testid="rec-filter-severity" value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 focus:outline-none">
          <option value="">All Severities</option>
          {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select data-testid="rec-filter-status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 focus:outline-none">
          <option value="">All Statuses</option>
          {['pending', 'accepted', 'dismissed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 font-ibm-plex">No recommendations found</div>
        ) : recs.map((rec, idx) => (
          <div
            key={rec.rec_id}
            data-testid={`recommendation-card-${idx}`}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
          >
            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(rec.rec_id)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 text-xs font-ibm-plex font-medium rounded border capitalize ${SEVERITY_STYLES[rec.waste_classification]}`}>
                      {rec.waste_classification}
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">{rec.resource_type}</span>
                    <span className="text-xs text-zinc-600 font-ibm-plex">{rec.region}</span>
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded font-ibm-plex ${
                      rec.status === 'accepted' ? 'bg-green-950/50 text-green-400 border border-green-500/30' :
                      rec.status === 'dismissed' ? 'bg-zinc-800 text-zinc-500 border border-zinc-700' :
                      'bg-blue-950/50 text-blue-400 border border-blue-500/30'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                  <p className="text-sm text-white font-ibm-plex">{rec.summary}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-outfit font-bold text-emerald-400">${rec.estimated_monthly_savings?.toLocaleString()}/mo</span>
                    <span className="text-xs text-zinc-500 font-ibm-plex">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                    <span className="text-xs text-zinc-500 font-ibm-plex">Priority: P{rec.priority}</span>
                  </div>
                </div>
                <div className="text-zinc-500">
                  {expanded[rec.rec_id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {expanded[rec.rec_id] && (
              <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 font-ibm-plex mb-1">Resource</p>
                  <p className="text-sm font-mono text-zinc-300">{rec.resource_name} ({rec.resource_id})</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 font-ibm-plex mb-1">Reasoning</p>
                  <p className="text-sm text-zinc-400 font-ibm-plex">{rec.reasoning}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 font-ibm-plex mb-1">Action</p>
                  <p className="text-sm text-white font-ibm-plex">{rec.remediation_action}</p>
                </div>
                {rec.risk_flags?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-zinc-500 font-ibm-plex mb-1">Risk Flags</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.risk_flags.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-red-950/30 text-red-400 border border-red-500/20 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(rec.terraform_script || rec.cli_command) && (
                  <ScriptViewer terraform={rec.terraform_script} cli={rec.cli_command} />
                )}
                {canManage && rec.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      data-testid={`accept-rec-${idx}`}
                      onClick={(e) => { e.stopPropagation(); createRemediation(rec); }}
                      disabled={generating === rec.rec_id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-ibm-plex hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                      {generating === rec.rec_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Create Remediation
                    </button>
                    <button
                      data-testid={`dismiss-rec-${idx}`}
                      onClick={(e) => { e.stopPropagation(); updateStatus(rec.rec_id, 'dismissed'); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-ibm-plex hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
