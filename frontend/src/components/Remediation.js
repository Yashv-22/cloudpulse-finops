import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, useAuth } from '../App';
import { Wrench, CheckCircle, XCircle, Clock, AlertTriangle, Code, Terminal, Shield } from 'lucide-react';

const STATUS_STYLES = {
  pending: { bg: 'bg-amber-950/50', text: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
  approved: { bg: 'bg-green-950/50', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
  rejected: { bg: 'bg-red-950/50', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
};

export default function Remediation() {
  const { user } = useAuth();
  const [remediations, setRemediations] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = filter ? `?status=${filter}` : '';
        const { data } = await axios.get(`${API}/api/remediations${params}`);
        setRemediations(data.remediations);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [filter]);

  const handleAction = async (remediationId, action) => {
    setProcessing(remediationId);
    try {
      await axios.patch(`${API}/api/remediations/${remediationId}`, { action });
      setRemediations(prev => prev.map(r =>
        r.remediation_id === remediationId ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', approved_by: user?.email } : r
      ));
    } catch (e) { console.error(e); }
    finally { setProcessing(null); }
  };

  const pending = remediations.filter(r => r.status === 'pending').length;
  const approved = remediations.filter(r => r.status === 'approved').length;
  const rejected = remediations.filter(r => r.status === 'rejected').length;

  return (
    <div data-testid="remediation-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">Remediation</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">Approval workflow for cloud remediation actions</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-amber-500/30 transition-all" onClick={() => setFilter(filter === 'pending' ? '' : 'pending')} data-testid="rem-pending-count">
          <p className="text-2xl font-outfit font-bold text-amber-400">{pending}</p>
          <p className="text-xs text-zinc-500 font-ibm-plex">Pending</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-green-500/30 transition-all" onClick={() => setFilter(filter === 'approved' ? '' : 'approved')} data-testid="rem-approved-count">
          <p className="text-2xl font-outfit font-bold text-green-400">{approved}</p>
          <p className="text-xs text-zinc-500 font-ibm-plex">Approved</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-red-500/30 transition-all" onClick={() => setFilter(filter === 'rejected' ? '' : 'rejected')} data-testid="rem-rejected-count">
          <p className="text-2xl font-outfit font-bold text-red-400">{rejected}</p>
          <p className="text-xs text-zinc-500 font-ibm-plex">Rejected</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : remediations.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 font-ibm-plex">No remediations found</div>
        ) : remediations.map((rem, idx) => {
          const st = STATUS_STYLES[rem.status] || STATUS_STYLES.pending;
          const StIcon = st.icon;
          const isExpanded = expanded[rem.remediation_id];
          return (
            <div
              key={rem.remediation_id}
              data-testid={`remediation-card-${idx}`}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
            >
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(prev => ({ ...prev, [rem.remediation_id]: !prev[rem.remediation_id] }))}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${st.bg} flex items-center justify-center flex-shrink-0`}>
                    <StIcon className={`w-5 h-5 ${st.text}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-ibm-plex text-white">{rem.resource_name}</span>
                      <span className="text-xs text-zinc-600 font-mono">{rem.resource_type}</span>
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded border font-ibm-plex capitalize ${st.bg} ${st.text} ${st.border}`}>
                        {rem.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 font-ibm-plex">{rem.action}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-outfit font-bold text-emerald-400">${rem.estimated_savings?.toLocaleString()}/mo savings</span>
                      <span className="text-xs text-zinc-600 font-mono">{rem.remediation_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Resource ID</p>
                      <p className="font-mono text-zinc-300 text-xs">{rem.resource_id}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Created By</p>
                      <p className="text-zinc-300">{rem.created_by}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Created At</p>
                      <p className="text-zinc-300">{rem.created_at?.split('T')[0]}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Expires At</p>
                      <p className="text-zinc-300">{rem.expires_at?.split('T')[0]}</p>
                    </div>
                  </div>

                  {rem.risk_flags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rem.risk_flags.map((f, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 text-xs bg-red-950/30 text-red-400 border border-red-500/20 rounded">
                          <AlertTriangle className="w-3 h-3" /> {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {rem.terraform_script && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                        <Code className="w-3.5 h-3.5" /> Terraform HCL
                      </div>
                      <div className="bg-black/80 border border-zinc-800 rounded-lg p-3">
                        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{rem.terraform_script}</pre>
                      </div>
                    </div>
                  )}

                  {rem.cli_command && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                        <Terminal className="w-3.5 h-3.5" /> AWS CLI
                      </div>
                      <div className="bg-black/80 border border-zinc-800 rounded-lg p-3">
                        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{rem.cli_command}</pre>
                      </div>
                    </div>
                  )}

                  {user?.role === 'admin' && rem.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        data-testid={`approve-rem-${idx}`}
                        onClick={() => handleAction(rem.remediation_id, 'approve')}
                        disabled={processing === rem.remediation_id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-ibm-plex hover:bg-emerald-500 transition-colors disabled:opacity-50"
                      >
                        <Shield className="w-4 h-4" /> Approve
                      </button>
                      <button
                        data-testid={`reject-rem-${idx}`}
                        onClick={() => handleAction(rem.remediation_id, 'reject')}
                        disabled={processing === rem.remediation_id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-ibm-plex hover:bg-red-950/30 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}

                  {rem.approved_by && (
                    <p className="text-xs text-zinc-600 font-ibm-plex">
                      {rem.status === 'approved' ? 'Approved' : 'Rejected'} by {rem.approved_by}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
