from fastapi import APIRouter, HTTPException
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import time

from app.config import settings
from app.services.remediation_engine import remediation_engine

router = APIRouter()


# ─── AUTH ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    first_name: str = ""
    last_name: str = ""

class ForgotPasswordRequest(BaseModel):
    email: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

def create_access_token(data: dict):
    try:
        from jose import jwt
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {**data, "exp": expire}
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    except ImportError:
        import hashlib
        return hashlib.sha256(f"{data}{datetime.utcnow()}".encode()).hexdigest()


MOCK_USERS = {
    "admin@cloudpulse.com": {
        "password": "admin",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin",
        "avatar": None,
    }
}


@router.post("/auth/login")
async def login(req: LoginRequest):
    user = MOCK_USERS.get(req.email)
    if user and user["password"] == req.password:
        token = create_access_token(data={"sub": req.email, "role": user["role"]})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "email": req.email,
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "role": user["role"],
            },
        }
    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/auth/signup")
async def signup(req: SignupRequest):
    if req.email in MOCK_USERS:
        raise HTTPException(status_code=409, detail="Account already exists")
    MOCK_USERS[req.email] = {
        "password": req.password,
        "first_name": req.first_name,
        "last_name": req.last_name,
        "role": "viewer",
        "avatar": None,
    }
    token = create_access_token(data={"sub": req.email, "role": "viewer"})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": req.email,
            "first_name": req.first_name,
            "last_name": req.last_name,
            "role": "viewer",
        },
        "message": "Account created successfully",
    }


@router.post("/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    return {"message": "If an account exists for that email, a reset link has been sent."}


@router.post("/auth/change-password")
async def change_password(req: ChangePasswordRequest):
    return {"message": "Password changed successfully"}


@router.get("/auth/me")
async def get_current_user():
    return {
        "email": "admin@cloudpulse.com",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin",
        "company": "CloudPulse Inc.",
        "joined": "2025-01-15",
    }


# ─── DASHBOARD KPIs ──────────────────────────────────────────────────────────

@router.get("/dashboard/kpis")
async def get_dashboard_kpis():
    return {
        "total_resources": 1240,
        "waste_resources": 47,
        "governance_score": 68.0,
        "total_monthly_savings": 4200.0,
        "total_cost_mtd": 42500.0,
        "pending_remediations": 4,
        "total_carbon_g": 204.0,
        "cost_trend_pct": -12.0,
        "savings_trend_pct": 8.0,
        "resource_trend_pct": 2.0,
    }


@router.get("/dashboard/cost-trend")
async def get_cost_trend(days: int = 7):
    base = 4000
    data = []
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] if days <= 7 else [f"Day {i+1}" for i in range(days)]
    for i, label in enumerate(labels[:days]):
        cost = base + random.randint(-300, 400)
        savings = random.randint(200, 600)
        data.append({"name": label, "cost": cost, "savings": savings})
    return {"data": data}


@router.get("/dashboard/service-cost")
async def get_service_cost():
    return {
        "data": [
            {"name": "EC2", "value": 4500, "color": "#3B82F6"},
            {"name": "RDS", "value": 3000, "color": "#8B5CF6"},
            {"name": "S3", "value": 1500, "color": "#10B981"},
            {"name": "Lambda", "value": 800, "color": "#F59E0B"},
        ],
        "total": 9800,
    }


# ─── RESOURCES ───────────────────────────────────────────────────────────────

ALL_RESOURCES = [
    {"resource_id": "i-0abcd1234efgh5678", "name": "prod-db-replica", "type": "EC2", "instance_type": "r5.xlarge",
     "cost_monthly": 450.20, "status": "Idle", "waste_score": 82.0, "waste_tier": "HIGH",
     "recommendation": "Scale down to r5.large", "region": "us-east-1", "cpu_avg": 3.2, "memory_avg": 18.5},
    {"resource_id": "vol-0f1234567890abcde", "name": "old-backup-vol", "type": "EBS", "instance_type": "gp3",
     "cost_monthly": 120.00, "status": "Unattached", "waste_score": 100.0, "waste_tier": "CRITICAL",
     "recommendation": "Delete volume", "region": "us-east-1", "cpu_avg": None, "memory_avg": None},
    {"resource_id": "db-ABCDEF123456", "name": "staging-rds", "type": "RDS", "instance_type": "db.t3.xlarge",
     "cost_monthly": 310.50, "status": "Underutilized", "waste_score": 45.0, "waste_tier": "MEDIUM",
     "recommendation": "Stop during weekends", "region": "us-west-2", "cpu_avg": 12.0, "memory_avg": 35.0},
    {"resource_id": "s3-log-bucket-99", "name": "app-logs-2022", "type": "S3", "instance_type": "Standard",
     "cost_monthly": 890.00, "status": "Active", "waste_score": 30.0, "waste_tier": "LOW",
     "recommendation": "Transition to Glacier", "region": "us-east-1", "cpu_avg": None, "memory_avg": None},
    {"resource_id": "i-09876xyz543abc", "name": "staging-web-01", "type": "EC2", "instance_type": "t3.medium",
     "cost_monthly": 95.00, "status": "Active", "waste_score": 10.0, "waste_tier": "LOW",
     "recommendation": "No action needed", "region": "us-west-2", "cpu_avg": 45.0, "memory_avg": 62.0},
    {"resource_id": "lambda-auth-handler", "name": "auth-handler", "type": "Lambda", "instance_type": "128MB",
     "cost_monthly": 12.30, "status": "Active", "waste_score": 5.0, "waste_tier": "LOW",
     "recommendation": "No action needed", "region": "us-east-1", "cpu_avg": None, "memory_avg": None},
    {"resource_id": "nat-0abc123def456", "name": "prod-nat-gw", "type": "NAT Gateway", "instance_type": "Standard",
     "cost_monthly": 185.00, "status": "Active", "waste_score": 20.0, "waste_tier": "LOW",
     "recommendation": "Evaluate VPC endpoints", "region": "us-east-1", "cpu_avg": None, "memory_avg": None},
    {"resource_id": "snap-0deadbeef1234", "name": "legacy-snap-2023", "type": "EBS Snapshot", "instance_type": "Standard",
     "cost_monthly": 45.60, "status": "Orphaned", "waste_score": 90.0, "waste_tier": "CRITICAL",
     "recommendation": "Delete orphaned snapshot", "region": "us-east-1", "cpu_avg": None, "memory_avg": None},
]


@router.get("/resources")
async def get_resources(page: int = 1, page_size: int = 20, status: str = None, search: str = None, sort: str = None):
    results = list(ALL_RESOURCES)

    if status and status != "all":
        results = [r for r in results if r["status"].lower() == status.lower()]

    if search:
        q = search.lower()
        results = [r for r in results if q in r["name"].lower() or q in r["resource_id"].lower() or q in r["type"].lower()]

    if sort == "cost_desc":
        results.sort(key=lambda r: r["cost_monthly"], reverse=True)
    elif sort == "cost_asc":
        results.sort(key=lambda r: r["cost_monthly"])
    elif sort == "waste_desc":
        results.sort(key=lambda r: r["waste_score"], reverse=True)

    total = len(results)
    start = (page - 1) * page_size
    end = start + page_size

    return {
        "resources": results[start:end],
        "total": total,
        "page": page,
        "pages": max(1, (total + page_size - 1) // page_size),
    }


@router.get("/resources/{resource_id}")
async def get_resource_detail(resource_id: str):
    for r in ALL_RESOURCES:
        if r["resource_id"] == resource_id:
            return {
                **r,
                "created_at": "2024-11-03T08:30:00Z",
                "tags": {"Environment": "production", "Team": "platform", "CostCenter": "CC-1234"},
                "metrics": {
                    "cpu_history": [random.uniform(1, 15) for _ in range(24)],
                    "memory_history": [random.uniform(10, 40) for _ in range(24)],
                    "cost_history": [random.uniform(10, 70) for _ in range(7)],
                },
            }
    raise HTTPException(status_code=404, detail="Resource not found")


# ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────

MOCK_RECOMMENDATIONS = [
    {"id": 1, "issue": "Idle EC2 Instance Detected",
     "detail": "Instance 'prod-db-replica' has <5% CPU for 7 days. Running r5.xlarge costs $450/mo with minimal utilization.",
     "savings": 220, "priority": "High", "resource_id": "i-0abcd1234efgh5678",
     "category": "compute", "status": "open", "created_at": "2026-04-18T10:00:00Z"},
    {"id": 2, "issue": "Unattached EBS Volumes",
     "detail": "4 volumes found without any attachment. These gp3 volumes accumulate $120/mo in charges with zero usage.",
     "savings": 480, "priority": "Critical", "resource_id": "vol-0f1234567890abcde",
     "category": "storage", "status": "open", "created_at": "2026-04-17T14:30:00Z"},
    {"id": 3, "issue": "Unencrypted S3 Bucket",
     "detail": "Bucket 'app-logs-2022' missing default encryption. This is a compliance risk under SOC2/HIPAA.",
     "savings": 0, "priority": "High", "resource_id": "s3-log-bucket-99",
     "category": "security", "status": "open", "created_at": "2026-04-16T09:15:00Z"},
    {"id": 4, "issue": "Overprovisioned RDS",
     "detail": "Staging database max CPU is 12%. Running db.t3.xlarge when db.t3.medium would suffice.",
     "savings": 155, "priority": "Medium", "resource_id": "db-ABCDEF123456",
     "category": "database", "status": "open", "created_at": "2026-04-19T16:45:00Z"},
    {"id": 5, "issue": "Orphaned EBS Snapshots",
     "detail": "Legacy snapshot from 2023 with no associated volume. Costs $45.60/mo.",
     "savings": 45, "priority": "High", "resource_id": "snap-0deadbeef1234",
     "category": "storage", "status": "open", "created_at": "2026-04-20T11:00:00Z"},
    {"id": 6, "issue": "NAT Gateway Overuse",
     "detail": "prod-nat-gw processes 2TB/mo. VPC endpoints for S3/DynamoDB could save 40% of data transfer costs.",
     "savings": 74, "priority": "Medium", "resource_id": "nat-0abc123def456",
     "category": "networking", "status": "open", "created_at": "2026-04-20T08:20:00Z"},
]

@router.get("/recommendations")
async def get_recommendations(priority: str = None, category: str = None):
    results = list(MOCK_RECOMMENDATIONS)
    if priority and priority != "all":
        results = [r for r in results if r["priority"].lower() == priority.lower()]
    if category and category != "all":
        results = [r for r in results if r["category"].lower() == category.lower()]
    return {"data": results, "total": len(results)}


@router.get("/recommendations/{rec_id}")
async def get_recommendation_detail(rec_id: int):
    for r in MOCK_RECOMMENDATIONS:
        if r["id"] == rec_id:
            return {**r, "ai_reasoning": "Based on 7-day CloudWatch metrics, this resource shows consistent underutilization patterns. The heuristic engine scored it above the remediation threshold, confirming waste."}
    raise HTTPException(status_code=404, detail="Recommendation not found")


# ─── REMEDIATION ─────────────────────────────────────────────────────────────

class RemediationRequest(BaseModel):
    resource_id: str
    issue: str

@router.post("/remediation/generate")
async def generate_remediation(req: RemediationRequest):
    code = await remediation_engine.generate_remediation(req.resource_id, req.issue)
    return {"status": "success", "terraform": code, "resource_id": req.resource_id}


@router.post("/remediation/execute")
async def execute_remediation(req: RemediationRequest):
    return {
        "status": "executed",
        "resource_id": req.resource_id,
        "message": "Remediation applied successfully",
        "execution_id": f"exec-{int(time.time())}",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ─── COST EXPLORER ───────────────────────────────────────────────────────────

@router.get("/cost-explorer/daily")
async def get_cost_explorer_daily(days: int = 30):
    data = []
    base = 4000
    for i in range(days):
        dt = datetime.utcnow() - timedelta(days=days - i - 1)
        cost = base + random.randint(-500, 500)
        forecast = cost + random.randint(-100, 200)
        data.append({
            "date": dt.strftime("%b %d"),
            "cost": cost,
            "forecast": forecast,
        })
    return {"data": data}


@router.get("/cost-explorer/by-service")
async def get_cost_by_service():
    return {
        "data": [
            {"service": "EC2", "cost": 18500, "previous": 20200, "change": -8.4},
            {"service": "RDS", "cost": 12400, "previous": 11800, "change": 5.1},
            {"service": "S3", "cost": 6200, "previous": 5900, "change": 5.1},
            {"service": "Lambda", "cost": 3100, "previous": 3400, "change": -8.8},
            {"service": "CloudFront", "cost": 1800, "previous": 1750, "change": 2.9},
            {"service": "NAT Gateway", "cost": 1500, "previous": 1500, "change": 0.0},
        ]
    }


@router.get("/cost-explorer/anomalies")
async def get_cost_anomalies():
    return {
        "anomalies": [
            {
                "id": 1,
                "date": "2026-04-17",
                "service": "Lambda",
                "spike_amount": 450.00,
                "description": "Unusual spike in Lambda invocations — 3x normal volume.",
                "severity": "high",
            },
            {
                "id": 2,
                "date": "2026-04-14",
                "service": "S3",
                "spike_amount": 120.00,
                "description": "Increased data transfer out from s3-log-bucket.",
                "severity": "medium",
            },
        ],
        "forecast_savings": 1240.0,
        "forecast_savings_pct": 14.0,
    }


# ─── COMPLIANCE / GOVERNANCE ─────────────────────────────────────────────────

@router.get("/compliance")
async def get_compliance():
    return {
        "compliance_score": 75,
        "total_checks": 12,
        "passed": 9,
        "failed": 3,
        "failed_checks": [
            {"resource_id": "sg-0123456789abcdef0", "resource_type": "SecurityGroup",
             "issue": "Port 22 open to 0.0.0.0/0 on default-sg", "severity": "CRITICAL"},
            {"resource_id": "app-logs-2022", "resource_type": "S3",
             "issue": "Default encryption is not enabled", "severity": "HIGH"},
            {"resource_id": "i-0abcd1234efgh5678", "resource_type": "EC2",
             "issue": "IMDSv2 not enforced", "severity": "MEDIUM"},
        ],
        "passed_checks": [
            {"resource_id": "prod-db-sg", "resource_type": "SecurityGroup", "check": "No unrestricted SSH/RDP"},
            {"resource_id": "secure-assets-bucket", "resource_type": "S3", "check": "Default Encryption Enabled"},
        ],
    }


# ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

MOCK_NOTIFICATIONS = [
    {"id": 1, "title": "Critical: Unattached EBS volumes detected", "message": "4 EBS volumes with no instance attachment found in us-east-1.", "type": "critical", "read": False, "created_at": "2026-04-21T08:00:00Z"},
    {"id": 2, "title": "Cost anomaly: Lambda spike", "message": "Lambda spend increased 300% on Thursday. Investigate auth-handler function.", "type": "warning", "read": False, "created_at": "2026-04-20T14:30:00Z"},
    {"id": 3, "title": "Remediation executed", "message": "Auto-remediation applied to staging-rds: weekend stop schedule enabled.", "type": "success", "read": True, "created_at": "2026-04-19T09:15:00Z"},
    {"id": 4, "title": "New recommendation available", "message": "NAT Gateway optimization could save $74/mo.", "type": "info", "read": True, "created_at": "2026-04-18T16:45:00Z"},
    {"id": 5, "title": "Compliance score dropped", "message": "Governance score decreased from 75 to 68 due to new security group findings.", "type": "warning", "read": True, "created_at": "2026-04-17T11:00:00Z"},
]


@router.get("/notifications")
async def get_notifications():
    unread = sum(1 for n in MOCK_NOTIFICATIONS if not n["read"])
    return {"notifications": MOCK_NOTIFICATIONS, "unread_count": unread}


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    for n in MOCK_NOTIFICATIONS:
        if n["id"] == notification_id:
            n["read"] = True
            return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Notification not found")


@router.post("/notifications/read-all")
async def mark_all_read():
    for n in MOCK_NOTIFICATIONS:
        n["read"] = True
    return {"status": "ok"}


# ─── SETTINGS ────────────────────────────────────────────────────────────────

MOCK_SETTINGS = {
    "aws_accounts": [
        {"id": "1234-5678-9012", "name": "Production Account", "region": "us-east-1", "status": "connected"},
    ],
    "automation": {
        "zero_touch_finops": False,
        "auto_remediate_critical": True,
    },
    "alerts": {
        "cost_anomaly_detection": True,
        "slack_connected": False,
        "slack_channel": "#finops-alerts",
        "email_alerts": True,
    },
}


@router.get("/settings")
async def get_settings():
    return MOCK_SETTINGS


class UpdateAutomationRequest(BaseModel):
    zero_touch_finops: bool = None
    auto_remediate_critical: bool = None

@router.put("/settings/automation")
async def update_automation(req: UpdateAutomationRequest):
    if req.zero_touch_finops is not None:
        MOCK_SETTINGS["automation"]["zero_touch_finops"] = req.zero_touch_finops
    if req.auto_remediate_critical is not None:
        MOCK_SETTINGS["automation"]["auto_remediate_critical"] = req.auto_remediate_critical
    return {"status": "ok", "automation": MOCK_SETTINGS["automation"]}


class UpdateAlertsRequest(BaseModel):
    cost_anomaly_detection: bool = None
    email_alerts: bool = None

@router.put("/settings/alerts")
async def update_alerts(req: UpdateAlertsRequest):
    if req.cost_anomaly_detection is not None:
        MOCK_SETTINGS["alerts"]["cost_anomaly_detection"] = req.cost_anomaly_detection
    if req.email_alerts is not None:
        MOCK_SETTINGS["alerts"]["email_alerts"] = req.email_alerts
    return {"status": "ok", "alerts": MOCK_SETTINGS["alerts"]}


@router.post("/settings/slack/connect")
async def connect_slack():
    MOCK_SETTINGS["alerts"]["slack_connected"] = True
    return {"status": "connected", "channel": MOCK_SETTINGS["alerts"]["slack_channel"]}


@router.post("/settings/slack/disconnect")
async def disconnect_slack():
    MOCK_SETTINGS["alerts"]["slack_connected"] = False
    return {"status": "disconnected"}


@router.post("/settings/accounts/connect")
async def connect_account(account_id: str = "9876-5432-1098", name: str = "Staging Account", region: str = "us-west-2"):
    new_account = {"id": account_id, "name": name, "region": region, "status": "connected"}
    MOCK_SETTINGS["aws_accounts"].append(new_account)
    return {"status": "connected", "account": new_account}


# ─── COLLECTION TRIGGER ─────────────────────────────────────────────────────

@router.post("/collections/trigger")
async def trigger_collection(account_id: str = "123456789012", region: str = "us-east-1"):
    return {"status": "Collection completed", "resources_found": len(ALL_RESOURCES), "account_id": account_id, "region": region}


# ─── MULTI-CLOUD / PRO ──────────────────────────────────────────────────────

@router.get("/pro/multi-cloud")
async def get_multi_cloud():
    from app.services.mock_multi_cloud import MockMultiCloudEngine
    return MockMultiCloudEngine.get_multi_cloud_data()


# ─── SEARCH (global) ────────────────────────────────────────────────────────

@router.get("/search")
async def global_search(q: str = ""):
    if not q:
        return {"results": []}
    q_lower = q.lower()
    results = []
    for r in ALL_RESOURCES:
        if q_lower in r["name"].lower() or q_lower in r["resource_id"].lower():
            results.append({"type": "resource", "id": r["resource_id"], "title": r["name"], "subtitle": f'{r["type"]} — {r["region"]}', "href": f'/resources/{r["resource_id"]}'})
    for rec in MOCK_RECOMMENDATIONS:
        if q_lower in rec["issue"].lower() or q_lower in rec["detail"].lower():
            results.append({"type": "recommendation", "id": rec["id"], "title": rec["issue"], "subtitle": f'Saves ${rec["savings"]}/mo', "href": "/recommendations"})
    return {"results": results[:10]}
