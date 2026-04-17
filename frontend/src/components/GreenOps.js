import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Leaf, TrendingDown, Globe, Zap } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const REGION_COLORS = ['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#8E8E93', '#FFCC00'];

function GreenScore({ score }) {
  const color = score > 70 ? '#34C759' : score > 40 ? '#FFCC00' : '#FF3B30';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-outfit font-bold text-white">{score}</span>
          <span className="text-xs text-zinc-500">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-outfit font-semibold mt-2" style={{ color }}>GreenOps Score</p>
    </div>
  );
}

export default function GreenOps() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/greenops/carbon`)
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-zinc-500 text-center mt-20">Failed to load GreenOps data</div>;

  return (
    <div data-testid="greenops-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">GreenOps</h1>
          <p className="text-sm text-zinc-500 font-ibm-plex mt-1">Carbon emission tracking and sustainability insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-total">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-green-400" strokeWidth={1.5} />
            <span className="text-xs text-zinc-500 font-ibm-plex">Carbon (7d)</span>
          </div>
          <p className="text-2xl font-outfit font-bold text-white">{data.total_carbon_kg_7d.toFixed(1)} kg</p>
          <p className="text-xs text-zinc-500 font-ibm-plex mt-1">{data.total_carbon_g_7d.toFixed(0)} g CO2e</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center justify-center" data-testid="greenops-score">
          <GreenScore score={data.greenops_score} />
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-top-type">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
            <span className="text-xs text-zinc-500 font-ibm-plex">Top Emitter (Type)</span>
          </div>
          {data.by_type[0] && (
            <>
              <p className="text-2xl font-outfit font-bold text-white">{data.by_type[0].type}</p>
              <p className="text-xs text-zinc-500 font-ibm-plex mt-1">{(data.by_type[0].carbon_g / 1000).toFixed(1)} kg CO2e</p>
            </>
          )}
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-top-region">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            <span className="text-xs text-zinc-500 font-ibm-plex">Top Emitter (Region)</span>
          </div>
          {data.by_region[0] && (
            <>
              <p className="text-2xl font-outfit font-bold text-white">{data.by_region[0].region}</p>
              <p className="text-xs text-zinc-500 font-ibm-plex mt-1">{(data.by_region[0].carbon_g / 1000).toFixed(1)} kg CO2e</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-trend-chart">
        <h3 className="text-sm font-outfit font-semibold text-white mb-4">Carbon Emission Trend (90d)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.trend_90d}>
            <defs>
              <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => v.slice(5)} interval={14} />
            <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `${v}g`} />
            <Tooltip
              contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#A1A1AA' }}
              formatter={(val) => [`${val.toFixed(1)}g CO2`, 'Carbon']}
            />
            <Area type="monotone" dataKey="carbon_g" stroke="#34C759" fill="url(#carbonGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-by-type">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Carbon by Resource Type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.by_type}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `${v}g`} />
              <Tooltip contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="carbon_g" fill="#34C759" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="carbon-by-region">
          <h3 className="text-sm font-outfit font-semibold text-white mb-4">Carbon by Region</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.by_region}
                dataKey="carbon_g"
                nameKey="region"
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.by_region.map((_, i) => (
                  <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [`${val.toFixed(1)}g CO2`, 'Carbon']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {data.by_region.map((r, i) => (
              <div key={r.region} className="flex items-center gap-1.5 text-xs font-ibm-plex">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: REGION_COLORS[i % REGION_COLORS.length] }} />
                <span className="text-zinc-400">{r.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
