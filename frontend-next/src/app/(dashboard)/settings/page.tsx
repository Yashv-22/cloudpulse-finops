"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Cloud, Bell, Shield, Key, Plus, Check, Unlink, User, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { useAuthStore } from "@/lib/store";

export default function Settings() {
  const { data, loading, refetch } = useFetch(() => api.getSettings(), []);
  const { user } = useAuthStore();
  const [showConnect, setShowConnect] = useState(false);
  const [connectForm, setConnectForm] = useState({ id: "", name: "", region: "us-east-1" });
  const [connecting, setConnecting] = useState(false);
  const [slackLoading, setSlackLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  const handleAutomation = async (key: string, value: boolean) => {
    await api.updateAutomation({ [key]: value }).catch(() => {});
    refetch();
  };

  const handleAlerts = async (key: string, value: boolean) => {
    await api.updateAlerts({ [key]: value }).catch(() => {});
    refetch();
  };

  const handleSlack = async () => {
    setSlackLoading(true);
    if (data?.alerts?.slack_connected) {
      await api.disconnectSlack().catch(() => {});
    } else {
      await api.connectSlack().catch(() => {});
    }
    setSlackLoading(false);
    refetch();
  };

  const handleConnect = async () => {
    setConnecting(true);
    await api.connectAccount(connectForm.id, connectForm.name, connectForm.region).catch(() => {});
    setConnecting(false);
    setShowConnect(false);
    setConnectForm({ id: "", name: "", region: "us-east-1" });
    refetch();
  };

  const handleChangePassword = async () => {
    if (pwForm.new !== pwForm.confirm) {
      setPwMsg("Passwords do not match");
      return;
    }
    if (pwForm.new.length < 6) {
      setPwMsg("Password must be at least 6 characters");
      return;
    }
    try {
      await api.forgotPassword(user?.email || "");
      setPwMsg("Password changed successfully");
      setPwForm({ current: "", new: "", confirm: "" });
    } catch {
      setPwMsg("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-40" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-zinc-500">Manage integrations, alerts, and platform automation.</p>
      </header>

      {/* Profile */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[#007AFF]" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Name</label>
            <p className="text-sm text-zinc-200">{user ? `${user.first_name} ${user.last_name}` : "Admin User"}</p>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <p className="text-sm text-zinc-200">{user?.email || "admin@cloudpulse.com"}</p>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Role</label>
            <p className="text-sm text-zinc-200 capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
      </GlassCard>

      {/* Change Password */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Current Password</label>
            <input type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">New Password</label>
            <input type="password" value={pwForm.new} onChange={(e) => setPwForm({ ...pwForm, new: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Confirm Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="input-field" />
          </div>
        </div>
        {pwMsg && <p className={`text-sm mb-3 ${pwMsg.includes("success") ? "text-green-500" : "text-red-500"}`}>{pwMsg}</p>}
        <button onClick={handleChangePassword} className="btn-primary text-sm" data-testid="change-pw-btn">Update Password</button>
      </GlassCard>

      {/* AWS Integration */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="w-5 h-5 text-[#007AFF]" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold">AWS Integration</h2>
        </div>
        <div className="space-y-3">
          {(data?.aws_accounts || []).map((acc: any) => (
            <div key={acc.id} className="flex justify-between items-center p-4 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <div>
                <p className="font-medium text-zinc-200">{acc.name}</p>
                <p className="text-sm text-zinc-500">ID: {acc.id} ({acc.region})</p>
              </div>
              <span className="bg-green-950/50 text-green-500 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Connected
              </span>
            </div>
          ))}

          {showConnect && (
            <div className="p-4 bg-zinc-900/80 rounded-lg border border-zinc-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input placeholder="Account ID" value={connectForm.id} onChange={(e) => setConnectForm({ ...connectForm, id: e.target.value })} className="input-field text-sm" />
                <input placeholder="Account Name" value={connectForm.name} onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })} className="input-field text-sm" />
                <select value={connectForm.region} onChange={(e) => setConnectForm({ ...connectForm, region: e.target.value })} className="input-field text-sm">
                  <option value="us-east-1">us-east-1</option>
                  <option value="us-west-2">us-west-2</option>
                  <option value="eu-west-1">eu-west-1</option>
                  <option value="ap-southeast-1">ap-southeast-1</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleConnect} disabled={connecting || !connectForm.id || !connectForm.name} className="btn-primary text-sm disabled:opacity-50">
                  {connecting ? "Connecting..." : "Connect Account"}
                </button>
                <button onClick={() => setShowConnect(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          )}

          {!showConnect && (
            <button onClick={() => setShowConnect(true)} className="btn-secondary flex items-center gap-2 text-sm" data-testid="connect-account-btn">
              <Plus className="w-4 h-4" /> Connect New Account
            </button>
          )}
        </div>
      </GlassCard>

      {/* Automation */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold">Autonomous Governance</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-200">Zero-Touch FinOps</p>
              <p className="text-sm text-zinc-500">Automatically apply safe cost-saving recommendations without manual approval.</p>
            </div>
            <ToggleSwitch
              initialState={data?.automation?.zero_touch_finops || false}
              onChange={(v) => handleAutomation("zero_touch_finops", v)}
            />
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
            <div>
              <p className="font-medium text-zinc-200">Auto-Remediate Critical Security Risks</p>
              <p className="text-sm text-zinc-500">Instantly execute AI-generated Terraform to patch critical vulnerabilities.</p>
            </div>
            <ToggleSwitch
              initialState={data?.automation?.auto_remediate_critical || false}
              onChange={(v) => handleAutomation("auto_remediate_critical", v)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Alerts */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold">Alert Settings</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-200">Cost Anomaly Detection</p>
              <p className="text-sm text-zinc-500">Send alerts for abnormal spending spikes.</p>
            </div>
            <ToggleSwitch
              initialState={data?.alerts?.cost_anomaly_detection || false}
              onChange={(v) => handleAlerts("cost_anomaly_detection", v)}
            />
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
            <div>
              <p className="font-medium text-zinc-200">Email Alerts</p>
              <p className="text-sm text-zinc-500">Receive daily digest and critical alert emails.</p>
            </div>
            <ToggleSwitch
              initialState={data?.alerts?.email_alerts || false}
              onChange={(v) => handleAlerts("email_alerts", v)}
            />
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
            <div>
              <p className="font-medium text-zinc-200">Slack Integration</p>
              <p className="text-sm text-zinc-500">
                {data?.alerts?.slack_connected
                  ? `Connected to ${data.alerts.slack_channel}`
                  : "Route alerts and recommendation summaries to Slack."}
              </p>
            </div>
            <button
              onClick={handleSlack}
              disabled={slackLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                data?.alerts?.slack_connected
                  ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                  : "bg-[#4A154B]/80 hover:bg-[#4A154B] border border-[#4A154B] text-white"
              }`}
              data-testid="slack-btn"
            >
              {data?.alerts?.slack_connected ? (
                <><Unlink className="w-4 h-4" /> Disconnect</>
              ) : (
                "Connect Slack"
              )}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
