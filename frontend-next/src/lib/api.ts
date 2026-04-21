const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cp_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...options?.headers } });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; user: { email: string; first_name: string; last_name: string; role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  signup: (email: string, password: string, first_name: string, last_name: string) =>
    request<{ access_token: string; user: { email: string; first_name: string; last_name: string; role: string }; message: string }>("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, first_name, last_name }) }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  changePassword: (current_password: string, new_password: string) =>
    request<{ message: string }>("/auth/change-password", { method: "POST", body: JSON.stringify({ current_password, new_password }) }),

  getMe: () => request<{ email: string; first_name: string; last_name: string; role: string; company: string; joined: string }>("/auth/me"),

  // Dashboard
  getKpis: () => request<{ total_resources: number; waste_resources: number; governance_score: number; total_monthly_savings: number; total_cost_mtd: number; pending_remediations: number; cost_trend_pct: number; savings_trend_pct: number; resource_trend_pct: number }>("/dashboard/kpis"),

  getCostTrend: (days?: number) => request<{ data: { name: string; cost: number; savings: number }[] }>(`/dashboard/cost-trend${days ? `?days=${days}` : ""}`),

  getServiceCost: () => request<{ data: { name: string; value: number; color: string }[]; total: number }>("/dashboard/service-cost"),

  // Resources
  getResources: (params?: { page?: number; status?: string; search?: string; sort?: string }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.status) sp.set("status", params.status);
    if (params?.search) sp.set("search", params.search);
    if (params?.sort) sp.set("sort", params.sort);
    const qs = sp.toString();
    return request<{ resources: any[]; total: number; page: number; pages: number }>(`/resources${qs ? `?${qs}` : ""}`);
  },

  getResourceDetail: (id: string) => request<any>(`/resources/${id}`),

  // Recommendations
  getRecommendations: (params?: { priority?: string; category?: string }) => {
    const sp = new URLSearchParams();
    if (params?.priority) sp.set("priority", params.priority);
    if (params?.category) sp.set("category", params.category);
    return request<{ data: any[]; total: number }>(`/recommendations?${sp.toString()}`);
  },

  // Remediation
  generateRemediation: (resource_id: string, issue: string) =>
    request<{ status: string; terraform: string; resource_id: string }>("/remediation/generate", { method: "POST", body: JSON.stringify({ resource_id, issue }) }),

  executeRemediation: (resource_id: string, issue: string) =>
    request<{ status: string; message: string; execution_id: string }>("/remediation/execute", { method: "POST", body: JSON.stringify({ resource_id, issue }) }),

  // Cost Explorer
  getCostExplorerDaily: (days?: number) => request<{ data: { date: string; cost: number; forecast: number }[] }>(`/cost-explorer/daily${days ? `?days=${days}` : ""}`),

  getCostByService: () => request<{ data: { service: string; cost: number; previous: number; change: number }[] }>("/cost-explorer/by-service"),

  getCostAnomalies: () => request<{ anomalies: any[]; forecast_savings: number; forecast_savings_pct: number }>("/cost-explorer/anomalies"),

  // Compliance
  getCompliance: () => request<{ compliance_score: number; total_checks: number; passed: number; failed: number; failed_checks: any[]; passed_checks: any[] }>("/compliance"),

  // Notifications
  getNotifications: () => request<{ notifications: any[]; unread_count: number }>("/notifications"),

  markNotificationRead: (id: number) => request<{ status: string }>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () => request<{ status: string }>("/notifications/read-all", { method: "POST" }),

  // Settings
  getSettings: () => request<any>("/settings"),

  updateAutomation: (data: { zero_touch_finops?: boolean; auto_remediate_critical?: boolean }) =>
    request<any>("/settings/automation", { method: "PUT", body: JSON.stringify(data) }),

  updateAlerts: (data: { cost_anomaly_detection?: boolean; email_alerts?: boolean }) =>
    request<any>("/settings/alerts", { method: "PUT", body: JSON.stringify(data) }),

  connectSlack: () => request<any>("/settings/slack/connect", { method: "POST" }),
  disconnectSlack: () => request<any>("/settings/slack/disconnect", { method: "POST" }),

  connectAccount: (account_id: string, name: string, region: string) =>
    request<any>(`/settings/accounts/connect?account_id=${account_id}&name=${encodeURIComponent(name)}&region=${region}`, { method: "POST" }),

  // Search
  globalSearch: (q: string) => request<{ results: any[] }>(`/search?q=${encodeURIComponent(q)}`),
};
