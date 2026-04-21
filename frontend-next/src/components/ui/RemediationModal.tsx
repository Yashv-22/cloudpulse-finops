"use client";

import { X, Copy, CheckCircle, Play, Loader2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useState } from "react";
import { api } from "@/lib/api";

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: string;
  resourceId: string;
}

export function RemediationModal({ isOpen, onClose, issue, resourceId }: RemediationModalProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [terraform, setTerraform] = useState<string | null>(null);
  const [execResult, setExecResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateRemediation(resourceId, issue);
      setTerraform(res.terraform);
    } catch (e: any) {
      setError(e.message || "Failed to generate remediation");
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    setExecuting(true);
    setError(null);
    try {
      const res = await api.executeRemediation(resourceId, issue);
      setExecResult(res.message);
    } catch (e: any) {
      setError(e.message || "Execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const copyCode = () => {
    if (!terraform) return;
    navigator.clipboard.writeText(terraform);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTerraform(null);
    setExecResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/80 backdrop-blur-sm p-4">
      <GlassCard className="w-full max-w-2xl bg-[var(--bg-elevated)] border-[var(--border-strong)] shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-xl font-bold theme-text mb-1">Autonomous Remediation</h2>
            <p className="text-sm theme-text-muted">{issue}</p>
          </div>
          <button onClick={handleClose} className="p-2 theme-bg-hover rounded-lg theme-text-secondary hover:text-[var(--text-primary)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!terraform && !loading && (
            <div className="text-center py-8">
              <p className="theme-text-secondary mb-6">Generate an AI-powered Terraform remediation plan for this issue.</p>
              <button onClick={generateCode} className="btn-primary inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Generate Terraform
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-[var(--brand)] animate-spin mx-auto mb-4" />
              <p className="theme-text-secondary">Generating remediation plan...</p>
            </div>
          )}

          {terraform && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono theme-text-muted">main.tf</span>
                <button onClick={copyCode} className="flex items-center gap-1 text-xs theme-text-secondary hover:text-[var(--text-primary)] transition-colors">
                  {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] overflow-x-auto text-sm font-mono theme-text-secondary max-h-64 overflow-y-auto">
                <code>{terraform}</code>
              </pre>
            </>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {execResult && (
            <div className="mt-4 p-3 rounded-lg bg-green-950/50 border border-green-500/30 text-green-400 text-sm">
              {execResult}
            </div>
          )}
        </div>

        {terraform && !execResult && (
          <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-subtle)]">
            <button onClick={handleClose} className="btn-secondary text-sm">Cancel</button>
            <button
              onClick={executeCode}
              disabled={executing}
              className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {executing ? "Executing..." : "Approve & Execute"}
            </button>
          </div>
        )}

        {execResult && (
          <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-subtle)]">
            <button onClick={handleClose} className="btn-primary text-sm">Done</button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
