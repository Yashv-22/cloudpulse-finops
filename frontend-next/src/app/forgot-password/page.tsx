"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Shield, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-zinc-500 text-sm mb-6">
              If an account exists for <span className="text-zinc-300">{email}</span>, we&apos;ve sent a password reset link.
            </p>
            <Link href="/login" className="btn-primary inline-block text-sm">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-1">Reset Password</h2>
            <p className="text-center text-zinc-500 text-sm mb-6">Enter your email to receive a reset link</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@cloudpulse.com"
                  data-testid="forgot-email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="forgot-submit"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-6">
              Remember your password?{" "}
              <Link href="/login" className="text-[#007AFF] hover:text-blue-300 transition-colors">Sign in</Link>
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
