import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import {
  Server, AlertTriangle, DollarSign, Wrench, Leaf, TrendingUp,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SEVERITY_COLORS = {
  critical: '#FF3B30', high: '#FF9500', medium: '#FFCC00', low: '#34C759', monitor: '#8E8E93',
};

function KPICard({ icon: Icon, label, value, subValue, color, testId }) {
  return (
    <div
      data-testid={testId}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
        </div>
        {subValue && (
          <span className="text-xs font-ibm-plex text-zinc-500">{subValue}</span>
        )}
      </div>
      <p className="text-2xl font-outfit font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-zinc-500 font-ibm-plex">{label}</p>
    </div>
  );
}

function WasteGauge({ score }) {
  const color = score > 60 ? '#FF3B30' : score > 30 ? '#FF9500' : '#34C759';
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-outfit font-bold text-white">{score}%</span>
        </div>
      </div>
      <p className="text-sm text-zinc-500 font-ibm-plex mt-2">Waste Score</p>
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/dashboard/kpis`)
      .then(({ data }) => setKpis(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!kpis) return <div className="text-zinc-500 text-center mt-20">Failed to load dashboard</div>;

  return (
    <div data-testid="dashboard-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">AWS FinOps overview and waste intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-ibm-plex">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Server} label="Total Resources" value={kpis.total_resources} color="#007AFF" testId="kpi-total-resources" />
        <KPICard icon={AlertTriangle} label="Waste Detected" value={kpis.waste_resources} subValue={`${kpis.waste_score}% waste`} color="#FF3B30" testId="kpi-waste-resources" />
        <KPICard icon={DollarSign} label="Potential Savings/mo" value={`$${kpis.total_monthly_savings.toLocaleString()}`} color="#34C759" testId="kpi-savings" />
        <KPICard icon={Leaf} label="Carbon (7d)" value={`${(kpis.total_carbon_g / 1000).toFixed(1)} kg`} color="#FF9500" testId="kpi-carbon" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="cost-trend-chart">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Cost Trend (30d)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={kpis.cost_trend}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#A1A1AA' }}
                itemStyle={{ color: '#007AFF' }}
              />
              <Area type="monotone" dataKey="cost" stroke="#007AFF" fill="url(#costGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center" data-testid="waste-gauge">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Waste Score</h3>
          <WasteGauge score={kpis.waste_score} />
          <div className="mt-4 grid grid-cols-2 gap-3 w-full">
            <div className="text-center">
              <p className="text-lg font-outfit font-bold text-white">{kpis.pending_remediations}</p>
              <p className="text-xs text-zinc-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-outfit font-bold text-white">${kpis.total_cost_7d.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">Cost (7d)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="resource-breakdown-chart">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Resources by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={kpis.resource_breakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#71717A' }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#A1A1AA' }} width={60} />
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#007AFF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="severity-breakdown-chart">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Waste by Severity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={kpis.severity_breakdown}
                dataKey="count"
                nameKey="severity"
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {kpis.severity_breakdown.map((entry) => (
                  <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#8E8E93'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {kpis.severity_breakdown.map(s => (
              <div key={s.severity} className="flex items-center gap-1.5 text-xs font-ibm-plex">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEVERITY_COLORS[s.severity] }} />
                <span className="text-zinc-400 capitalize">{s.severity}</span>
                <span className="text-zinc-600">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
