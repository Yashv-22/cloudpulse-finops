export const mockCostTrend = [
  { name: "Mon", cost: 4200, savings: 240 },
  { name: "Tue", cost: 4100, savings: 310 },
  { name: "Wed", cost: 4350, savings: 290 },
  { name: "Thu", cost: 4400, savings: 450 },
  { name: "Fri", cost: 4150, savings: 400 },
  { name: "Sat", cost: 3900, savings: 520 },
  { name: "Sun", cost: 3850, savings: 550 },
];

export const mockServiceCost = [
  { name: "EC2", value: 4500, color: "#3B82F6" },
  { name: "RDS", value: 3000, color: "#8B5CF6" },
  { name: "S3", value: 1500, color: "#10B981" },
  { name: "Lambda", value: 800, color: "#F59E0B" },
];

export const mockResources = [
  { id: "i-0abcd1234efgh5678", name: "prod-db-replica", type: "EC2 (r5.xlarge)", cost: 450.2, status: "Idle", recommendation: "Scale down to r5.large" },
  { id: "vol-0f1234567890abcde", name: "old-backup-vol", type: "EBS (gp3)", cost: 120.0, status: "Unattached", recommendation: "Delete volume" },
  { id: "db-ABCDEF123456", name: "staging-rds", type: "RDS (db.t3.xlarge)", cost: 310.5, status: "Underutilized", recommendation: "Stop during weekends" },
  { id: "s3-log-bucket-99", name: "app-logs-2022", type: "S3 (Standard)", cost: 890.0, status: "Active", recommendation: "Transition to Glacier" },
];

export const mockRecommendations = [
  { id: 1, issue: "Idle EC2 Instance Detected", detail: "Instance 'prod-db-replica' has <5% CPU for 7 days.", savings: 220, priority: "High" },
  { id: 2, issue: "Unattached EBS Volumes", detail: "4 volumes found without any attachment.", savings: 480, priority: "Critical" },
  { id: 3, issue: "Unencrypted S3 Bucket", detail: "Bucket 'app-logs-2022' missing default encryption.", savings: 0, priority: "High" },
  { id: 4, issue: "Overprovisioned RDS", detail: "Staging database max CPU is 12%.", savings: 155, priority: "Medium" },
];
