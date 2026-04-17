import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, formatApiError } from '../App';
import { Eye, EyeOff, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1698156731209-b2fae65b5d24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBncmFkaWVudCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2Mjk2ODU4fDA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-outfit font-bold tracking-tight text-white">CloudPulse</h1>
          </div>
          <p className="text-xl text-zinc-300 font-ibm-plex mb-10 leading-relaxed">
            Autonomous FinOps Intelligence for AWS. Detect waste, optimize costs, and reduce your carbon footprint.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Zero-trust security with RBAC' },
              { icon: BarChart3, text: 'Real-time cost intelligence' },
              { icon: Zap, text: 'AI-powered remediation' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-zinc-400">
                <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                <span className="font-ibm-plex">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#09090B' }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-outfit font-bold text-white">CloudPulse</h1>
          </div>

          <h2 className="text-2xl font-outfit font-semibold text-white mb-2">
            {isRegister ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="text-zinc-500 font-ibm-plex mb-8">
            {isRegister ? 'Start optimizing your cloud spend' : 'Sign in to your CloudPulse dashboard'}
          </p>

          {error && (
            <div data-testid="auth-error" className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-sm font-ibm-plex">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm text-zinc-400 font-ibm-plex mb-1.5">Full Name</label>
                <input
                  data-testid="register-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-zinc-400 font-ibm-plex mb-1.5">Email</label>
              <input
                data-testid="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 font-ibm-plex mb-1.5">Password</label>
              <div className="relative">
                <input
                  data-testid="login-password-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              data-testid="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-ibm-plex font-medium hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 font-ibm-plex">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              data-testid="toggle-auth-mode"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
