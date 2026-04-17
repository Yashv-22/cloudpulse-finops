import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#8E8E93', '#FFCC00'];

export default function CostExplorer() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [byRegion, setByRegion] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [s, t, r] = await Promise.all([
          axios.get(`${API}/api/costs/summary`),
          axios.get(`${API}/api/costs/trend?days=${days}`),
          axios.get(`${API}/api/costs/by-region`),
        ]);
        setSummary(s.data);
        setTrend(t.data);
        setByRegion(r.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [days]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div data-testid="cost-explorer-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">Cost Explorer</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">AWS spend analysis and cost trends</p>
        </div>
        <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5 border border-zinc-700">
          {[7, 30, 60, 90].map(d => (
            <button
              key={d}
              data-testid={`days-${d}`}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-ibm-plex rounded-md transition-all ${days === d ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-total-7d">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
              <span className="text-xs text-zinc-500 font-ibm-plex">Total Cost (7d)</span>
            </div>
            <p className="text-3xl font-outfit font-bold text-white">${summary.total_cost_7d.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-projected">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
              <span className="text-xs text-zinc-500 font-ibm-plex">Projected Monthly</span>
            </div>
            <p className="text-3xl font-outfit font-bold text-white">${summary.projected_monthly.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-services">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" strokeWidth={1.5} />
              <span className="text-xs text-zinc-500 font-ibm-plex">Anomalies Detected</span>
            </div>
            <p className="text-3xl font-outfit font-bold text-white">{trend?.anomalies?.length || 0}</p>
          </div>
        </div>
      )}

      {trend && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-trend-chart">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Cost by Service ({days}d)</h3>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={trend.trend}>
              <defs>
                {['ec2', 'rds', 's3', 'lambda', 'elb', 'other'].map((key, i) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#A1A1AA' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#A1A1AA' }} />
              {['ec2', 'rds', 's3', 'lambda', 'elb', 'other'].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={COLORS[i]} fill={`url(#grad-${key})`} strokeWidth={1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {summary && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-by-type">
            <h3 className="text-sm font-outfit font-semibold text-white mb-4">Cost by Service Type</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={summary.by_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="cost" fill="#007AFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-by-region">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Cost by Region</h3>
          <div className="space-y-3">
            {byRegion.map((r, i) => {
              const maxCost = byRegion[0]?.cost || 1;
              return (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 font-ibm-plex w-28 truncate">{r.region}</span>
                  <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{ width: `${(r.cost / maxCost) * 100}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-300 w-20 text-right">${r.cost.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {trend?.anomalies?.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-anomalies">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Cost Anomalies</h3>
          <div className="space-y-2">
            {trend.anomalies.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-orange-950/20 border border-orange-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-sm text-zinc-300 font-ibm-plex">
                  <span className="font-mono">{a.date}</span> - Cost spike of <span className="text-orange-400 font-medium">+{a.change_pct}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
