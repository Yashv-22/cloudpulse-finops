"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Signup() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.signup(email, password, firstName, lastName);
      setAuth(res.user, res.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#09090B] text-[var(--text-primary)] flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1698156731209-b2fae65b5d24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBncmFkaWVudCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2Mjk2ODU4fDA&ixlib=rb-4.1.0&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm" />

      <GlassCard className="relative z-10 w-full max-w-md p-8 bg-[var(--bg-panel)] backdrop-blur-2xl border-[var(--border-subtle)]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[var(--brand)]" strokeWidth={1.5} />
          <span className="text-2xl font-bold glow-text">CloudPulse</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-center text-[var(--text-muted)] text-sm mb-6">Start optimizing your cloud costs today</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" placeholder="Jane" data-testid="signup-first" />
            </div>
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" placeholder="Doe" data-testid="signup-last" />
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="jane@company.com" data-testid="signup-email" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" data-testid="signup-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50" data-testid="signup-submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Creating account..." : "Start Free Trial"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">Sign in</Link>
        </p>
      </GlassCard>
    </div>
  );
}
