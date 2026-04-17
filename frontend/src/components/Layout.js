import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import {
  LayoutDashboard, Server, Brain, DollarSign, Wrench, Leaf,
  LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/resources', icon: Server, label: 'Resources' },
  { to: '/recommendations', icon: Brain, label: 'Recommendations' },
  { to: '/costs', icon: DollarSign, label: 'Cost Explorer' },
  { to: '/remediation', icon: Wrench, label: 'Remediation' },
  { to: '/greenops', icon: Leaf, label: 'GreenOps' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleBadgeColor = {
    admin: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    engineer: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    analyst: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    viewer: 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#09090B' }} data-testid="app-layout">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(24px) saturate(150%)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '8px 0 32px rgba(0,0,0,0.4)',
        }}
        data-testid="sidebar"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-outfit font-semibold text-white tracking-tight">CloudPulse</span>
          <button className="lg:hidden ml-auto text-zinc-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" data-testid="nav-menu">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ibm-plex transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span>{label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-300">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-ibm-plex truncate">{user?.name || 'User'}</p>
              <span className={`inline-block text-xs px-1.5 py-0.5 rounded border font-ibm-plex ${roleBadgeColor[user?.role] || roleBadgeColor.viewer}`}>
                {user?.role || 'viewer'}
              </span>
            </div>
          </div>
          <button
            data-testid="logout-button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 h-14 flex items-center px-4 lg:px-6 border-b border-white/10"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(24px) saturate(150%)',
          }}
        >
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden mr-3 text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-ibm-plex">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AWS Connected</span>
            <span className="mx-2 text-zinc-700">|</span>
            <span>Account: 123456789012</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
