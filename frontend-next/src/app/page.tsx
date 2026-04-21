"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, Cpu, LogIn, UserPlus, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[var(--text-primary)] overflow-hidden selection:bg-[var(--brand-muted)]">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--brand-muted)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Shield className="text-[var(--brand)] w-8 h-8" strokeWidth={1.5} />
          <span className="text-2xl font-bold glow-text tracking-tight">CloudPulse</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all border border-transparent hover:border-[var(--border-strong)]" data-testid="landing-signin">
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
          <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--brand-muted)] text-[var(--brand)] border border-[var(--brand-border)] hover:bg-[var(--brand-muted)] transition-all" data-testid="landing-signup">
            <UserPlus className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-strong)] text-sm text-[var(--brand)] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]" />
          </span>
          CloudPulse AWS Edition is Now Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          Autonomous FinOps for <br />
          <span className="glow-text">Enterprise Cloud</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed"
        >
          Detect AWS waste instantly. Leverage AI to analyze infrastructure, generate remediation plans, and automate cost-saving workflows with zero friction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-[var(--brand)] text-[var(--text-primary)] hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_30px_var(--brand-muted)] w-full sm:w-auto" data-testid="landing-cta">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--border-strong)] transition-all w-full sm:w-auto" data-testid="landing-demo">
            View Live Demo
          </Link>
        </motion.div>
      </main>

      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Engineered for Scale</h2>
          <p className="text-[var(--text-muted)]">Everything you need to optimize your cloud infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Intelligence",
              desc: "AI models analyze your AWS infrastructure to provide plain-english cost-saving justifications and Terraform remediation code.",
              icon: <Cpu className="w-6 h-6 text-[var(--brand)]" />,
              border: "border-[var(--brand-border)] hover:border-[var(--brand-border)]",
            },
            {
              title: "Autonomous Remediation",
              desc: "Generate and execute Terraform plans or AWS CLI commands directly from your dashboard. One-click cost optimization.",
              icon: <Zap className="w-6 h-6 text-yellow-500" />,
              border: "border-yellow-500/20 hover:border-yellow-500/40",
            },
            {
              title: "Zero-Trust Security",
              desc: "Enterprise-grade RBAC, ephemeral workers, and strictly scoped AssumeRole integration. We never store AWS keys.",
              icon: <ShieldAlert className="w-6 h-6 text-green-500" />,
              border: "border-green-500/20 hover:border-green-500/40",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-8 rounded-xl bg-[var(--bg-surface)] border ${feature.border} transition-all duration-300 cursor-default group hover:-translate-y-1`}
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center border-t border-[var(--border-subtle)]">
        <h2 className="text-3xl font-bold mb-4">Ready to cut your AWS bill?</h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
          Join teams saving thousands per month with autonomous FinOps. No credit card required.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold bg-[var(--brand)] text-[var(--text-primary)] hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_30px_var(--brand-muted)]">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t border-[var(--border-subtle)] py-8 text-center text-sm text-[var(--text-muted)] mt-6">
        <p>&copy; {new Date().getFullYear()} CloudPulse AWS Edition. All rights reserved.</p>
      </footer>
    </div>
  );
}
