"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.login(email, password);
      setAuth(res.user, res.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#09090B] text-zinc-200 flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1698156731209-b2fae65b5d24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBncmFkaWVudCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2Mjk2ODU4fDA&ixlib=rb-4.1.0&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <GlassCard className="relative z-10 w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-2xl border-zinc-700/50">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[#007AFF]" strokeWidth={1.5} />
          <span className="text-2xl font-bold glow-text">CloudPulse</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-center text-zinc-500 text-sm mb-6">Sign in to your CloudPulse account</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@cloudpulse.com"
              data-testid="login-email"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-zinc-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#007AFF] hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              data-testid="login-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="login-submit"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#007AFF] hover:text-blue-300 transition-colors">
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Demo: admin@cloudpulse.com / admin
        </p>
      </GlassCard>
    </div>
  );
}
