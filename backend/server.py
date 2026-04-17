from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import bcrypt
import jwt
import json
import random
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Response, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# ─── Config ───
JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI(title="CloudPulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), os.environ.get("APP_URL", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ─── Helpers ───
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {"sub": user_id, "email": email, "role": role, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie(key="access_token", value=access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(*roles):
    async def checker(request: Request):
        user = await get_current_user(request)
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker

# ─── Pydantic Models ───
class RegisterModel(BaseModel):
    email: str
    password: str
    name: str

class LoginModel(BaseModel):
    email: str
    password: str

class RemediationApproval(BaseModel):
    action: str  # approve / reject

# ─── Auth Routes ───
@app.post("/api/auth/register")
async def register(body: RegisterModel, response: Response):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "email": email,
        "password_hash": hash_password(body.password),
        "name": body.name,
        "role": "viewer",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(user_doc)
    uid = str(result.inserted_id)
    access = create_access_token(uid, email, "viewer")
    refresh = create_refresh_token(uid)
    return {"id": uid, "email": email, "name": body.name, "role": "viewer", "access_token": access, "refresh_token": refresh}

@app.post("/api/auth/login")
async def login(body: LoginModel, response: Response, request: Request):
    email = body.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = attempt.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")
        else:
            await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    uid = str(user["_id"])
    access = create_access_token(uid, email, user.get("role", "viewer"))
    refresh = create_refresh_token(uid)
    return {"id": uid, "email": email, "name": user.get("name", ""), "role": user.get("role", "viewer"), "access_token": access, "refresh_token": refresh}

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@app.get("/api/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@app.post("/api/auth/refresh")
async def refresh_token(request: Request, response: Response):
    body = await request.json()
    token = body.get("refresh_token", "")
    if not token:
        token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(str(user["_id"]), user["email"], user.get("role", "viewer"))
        return {"access_token": access}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ─── Dashboard ───
@app.get("/api/dashboard/kpis")
async def dashboard_kpis(request: Request):
    await get_current_user(request)
    resources = await db.resources.count_documents({})
    waste_resources = await db.resources.count_documents({"waste_severity": {"$in": ["critical", "high", "medium"]}})
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$estimated_monthly_savings"}}}]
    savings_result = await db.recommendations.aggregate(pipeline).to_list(1)
    total_savings = savings_result[0]["total"] if savings_result else 0
    cost_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$cost_7d"}}}]
    cost_result = await db.resources.aggregate(cost_pipeline).to_list(1)
    total_cost = cost_result[0]["total"] if cost_result else 0
    pending_remediations = await db.remediations.count_documents({"status": "pending"})
    carbon_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$carbon_g_co2_7d"}}}]
    carbon_result = await db.resources.aggregate(carbon_pipeline).to_list(1)
    total_carbon = carbon_result[0]["total"] if carbon_result else 0
    waste_score = round((waste_resources / max(resources, 1)) * 100, 1)
    return {
        "total_resources": resources,
        "waste_resources": waste_resources,
        "waste_score": waste_score,
        "total_monthly_savings": round(total_savings, 2),
        "total_cost_7d": round(total_cost, 2),
        "pending_remediations": pending_remediations,
        "total_carbon_g": round(total_carbon, 2),
        "resource_breakdown": await _resource_breakdown(),
        "severity_breakdown": await _severity_breakdown(),
        "cost_trend": await _cost_trend_data(),
    }

async def _resource_breakdown():
    pipeline = [{"$group": {"_id": "$resource_type", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    results = await db.resources.aggregate(pipeline).to_list(20)
    return [{"type": r["_id"], "count": r["count"]} for r in results]

async def _severity_breakdown():
    pipeline = [{"$match": {"waste_severity": {"$ne": None}}}, {"$group": {"_id": "$waste_severity", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    results = await db.resources.aggregate(pipeline).to_list(10)
    return [{"severity": r["_id"], "count": r["count"]} for r in results]

async def _cost_trend_data():
    data = []
    for i in range(30):
        date = (datetime.now(timezone.utc) - timedelta(days=29 - i)).strftime("%Y-%m-%d")
        base = 850 + random.uniform(-80, 80)
        data.append({"date": date, "cost": round(base + i * 2.5, 2)})
    return data

# ─── Resources ───
@app.get("/api/resources")
async def list_resources(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query("", description="Search by name, id, or type"),
    resource_type: str = Query("", description="Filter by resource type"),
    severity: str = Query("", description="Filter by waste severity"),
    region: str = Query("", description="Filter by region"),
    sort_by: str = Query("cost_7d", description="Sort field"),
    sort_order: str = Query("desc", description="asc or desc"),
):
    await get_current_user(request)
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"resource_id": {"$regex": search, "$options": "i"}},
            {"resource_type": {"$regex": search, "$options": "i"}},
        ]
    if resource_type:
        query["resource_type"] = resource_type
    if severity:
        query["waste_severity"] = severity
    if region:
        query["region"] = region
    total = await db.resources.count_documents(query)
    sort_dir = -1 if sort_order == "desc" else 1
    skip = (page - 1) * limit
    cursor = db.resources.find(query, {"_id": 0}).sort(sort_by, sort_dir).skip(skip).limit(limit)
    resources = await cursor.to_list(limit)
    return {"resources": resources, "total": total, "page": page, "pages": (total + limit - 1) // limit}

@app.get("/api/resources/{resource_id}/metrics")
async def resource_metrics(resource_id: str, request: Request):
    await get_current_user(request)
    resource = await db.resources.find_one({"resource_id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    metrics = []
    for i in range(168):
        ts = (datetime.now(timezone.utc) - timedelta(hours=167 - i)).isoformat()
        metrics.append({
            "timestamp": ts,
            "cpu_avg": round(resource.get("cpu_avg", 5) + random.uniform(-3, 3), 2),
            "memory_avg": round(resource.get("memory_avg", 15) + random.uniform(-5, 5), 2),
            "network_mbps": round(random.uniform(0.1, 10), 2),
        })
    return {"resource": resource, "metrics": metrics}

@app.get("/api/resources/types")
async def resource_types(request: Request):
    await get_current_user(request)
    types = await db.resources.distinct("resource_type")
    return {"types": types}

@app.get("/api/resources/regions")
async def resource_regions(request: Request):
    await get_current_user(request)
    regions = await db.resources.distinct("region")
    return {"regions": regions}

# ─── Recommendations ───
@app.get("/api/recommendations")
async def list_recommendations(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    severity: str = Query(""),
    status: str = Query(""),
):
    await get_current_user(request)
    query = {}
    if severity:
        query["waste_classification"] = severity
    if status:
        query["status"] = status
    total = await db.recommendations.count_documents(query)
    skip = (page - 1) * limit
    recs = await db.recommendations.find(query, {"_id": 0}).sort("estimated_monthly_savings", -1).skip(skip).limit(limit).to_list(limit)
    return {"recommendations": recs, "total": total, "page": page, "pages": (total + limit - 1) // limit}

@app.patch("/api/recommendations/{rec_id}")
async def update_recommendation(rec_id: str, request: Request):
    user = await get_current_user(request)
    if user.get("role") not in ("admin", "engineer", "analyst"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    body = await request.json()
    new_status = body.get("status")
    if new_status not in ("accepted", "dismissed", "pending"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.recommendations.update_one({"rec_id": rec_id}, {"$set": {"status": new_status, "updated_by": user["email"], "updated_at": datetime.now(timezone.utc).isoformat()}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return {"message": f"Recommendation {new_status}"}

# ─── AI Analysis ───
@app.post("/api/recommendations/generate")
async def generate_recommendation(request: Request):
    user = await get_current_user(request)
    if user.get("role") not in ("admin", "engineer"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    body = await request.json()
    resource_id = body.get("resource_id")
    resource = await db.resources.find_one({"resource_id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"cloudpulse-{uuid.uuid4().hex[:8]}",
            system_message="You are CloudPulse AI, an expert cloud FinOps analyst. Analyze AWS resources and provide waste detection recommendations. Always respond with valid JSON."
        ).with_model("openai", "gpt-5.2")
        prompt = f"""Analyze this AWS resource for waste and provide a remediation recommendation:

Resource: {json.dumps(resource, default=str)}

Respond with ONLY valid JSON (no markdown):
{{
  "summary": "Brief 1-2 sentence summary of the finding",
  "waste_classification": "critical|high|medium|low|monitor",
  "confidence": 0.0-1.0,
  "priority": 1-5,
  "estimated_monthly_savings": dollar amount,
  "remediation_action": "specific action to take",
  "reasoning": "detailed explanation",
  "risk_flags": ["list of risks"],
  "terraform_script": "terraform HCL code to remediate",
  "cli_command": "AWS CLI command to remediate"
}}"""
        msg = UserMessage(text=prompt)
        ai_response = await chat.send_message(msg)
        try:
            cleaned = ai_response.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
            rec_data = json.loads(cleaned)
        except json.JSONDecodeError:
            rec_data = {
                "summary": ai_response[:200],
                "waste_classification": resource.get("waste_severity", "medium"),
                "confidence": 0.7,
                "priority": 3,
                "estimated_monthly_savings": resource.get("cost_7d", 0) * 2,
                "remediation_action": "Review resource utilization",
                "reasoning": ai_response,
                "risk_flags": [],
                "terraform_script": "",
                "cli_command": "",
            }
        rec_id = f"REC-{uuid.uuid4().hex[:8].upper()}"
        rec_doc = {
            "rec_id": rec_id,
            "resource_id": resource_id,
            "resource_name": resource.get("name", ""),
            "resource_type": resource.get("resource_type", ""),
            "region": resource.get("region", ""),
            **rec_data,
            "status": "pending",
            "generated_by": "ai",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.recommendations.insert_one(rec_doc)
        rec_doc.pop("_id", None)
        return rec_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

# ─── Cost Explorer ───
@app.get("/api/costs/summary")
async def cost_summary(request: Request):
    await get_current_user(request)
    pipeline = [{"$group": {"_id": "$resource_type", "total_cost": {"$sum": "$cost_7d"}, "count": {"$sum": 1}}}]
    results = await db.resources.aggregate(pipeline).to_list(20)
    total = sum(r["total_cost"] for r in results)
    return {
        "total_cost_7d": round(total, 2),
        "projected_monthly": round(total * 4.3, 2),
        "by_type": [{"type": r["_id"], "cost": round(r["total_cost"], 2), "count": r["count"]} for r in results],
    }

@app.get("/api/costs/trend")
async def cost_trend(request: Request, days: int = Query(30, ge=7, le=90)):
    await get_current_user(request)
    cost_data = await db.cost_history.find({}, {"_id": 0}).sort("date", 1).to_list(days)
    if not cost_data:
        cost_data = []
        for i in range(days):
            d = (datetime.now(timezone.utc) - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
            base = 280 + random.uniform(-20, 20)
            cost_data.append({
                "date": d,
                "ec2": round(base * 0.45 + random.uniform(-10, 10), 2),
                "rds": round(base * 0.25 + random.uniform(-5, 5), 2),
                "s3": round(base * 0.1 + random.uniform(-3, 3), 2),
                "lambda": round(base * 0.08 + random.uniform(-2, 2), 2),
                "elb": round(base * 0.07 + random.uniform(-2, 2), 2),
                "other": round(base * 0.05 + random.uniform(-1, 1), 2),
                "total": round(base, 2),
            })
    anomalies = []
    for i in range(1, len(cost_data)):
        if cost_data[i].get("total", 0) > cost_data[i - 1].get("total", 0) * 1.15:
            anomalies.append({"date": cost_data[i]["date"], "type": "spike", "change_pct": round(((cost_data[i]["total"] - cost_data[i - 1]["total"]) / max(cost_data[i - 1]["total"], 1)) * 100, 1)})
    return {"trend": cost_data, "anomalies": anomalies}

@app.get("/api/costs/by-region")
async def costs_by_region(request: Request):
    await get_current_user(request)
    pipeline = [{"$group": {"_id": "$region", "total_cost": {"$sum": "$cost_7d"}, "count": {"$sum": 1}}}, {"$sort": {"total_cost": -1}}]
    results = await db.resources.aggregate(pipeline).to_list(20)
    return [{"region": r["_id"], "cost": round(r["total_cost"], 2), "resources": r["count"]} for r in results]

# ─── Remediation ───
@app.get("/api/remediations")
async def list_remediations(request: Request, status: str = Query("")):
    await get_current_user(request)
    query = {}
    if status:
        query["status"] = status
    remediations = await db.remediations.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"remediations": remediations}

@app.post("/api/remediations")
async def create_remediation(request: Request):
    user = await get_current_user(request)
    if user.get("role") not in ("admin", "engineer"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    body = await request.json()
    rec_id = body.get("rec_id")
    rec = await db.recommendations.find_one({"rec_id": rec_id}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    remediation_id = f"REM-{uuid.uuid4().hex[:8].upper()}"
    remediation = {
        "remediation_id": remediation_id,
        "rec_id": rec_id,
        "resource_id": rec.get("resource_id", ""),
        "resource_name": rec.get("resource_name", ""),
        "resource_type": rec.get("resource_type", ""),
        "action": rec.get("remediation_action", ""),
        "terraform_script": rec.get("terraform_script", ""),
        "cli_command": rec.get("cli_command", ""),
        "estimated_savings": rec.get("estimated_monthly_savings", 0),
        "risk_flags": rec.get("risk_flags", []),
        "status": "pending",
        "created_by": user["email"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": (datetime.now(timezone.utc) + timedelta(hours=72)).isoformat(),
    }
    await db.remediations.insert_one(remediation)
    remediation.pop("_id", None)
    await db.recommendations.update_one({"rec_id": rec_id}, {"$set": {"status": "accepted"}})
    return remediation

@app.patch("/api/remediations/{remediation_id}")
async def approve_remediation(remediation_id: str, body: RemediationApproval, request: Request):
    user = await get_current_user(request)
    if user.get("role") not in ("admin",):
        raise HTTPException(status_code=403, detail="Only admins can approve remediations")
    action = body.action
    if action not in ("approve", "reject"):
        raise HTTPException(status_code=400, detail="Invalid action")
    new_status = "approved" if action == "approve" else "rejected"
    result = await db.remediations.update_one(
        {"remediation_id": remediation_id},
        {"$set": {"status": new_status, "approved_by": user["email"], "approved_at": datetime.now(timezone.utc).isoformat()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Remediation not found")
    return {"message": f"Remediation {new_status}", "remediation_id": remediation_id}

# ─── GreenOps ───
@app.get("/api/greenops/carbon")
async def carbon_data(request: Request):
    await get_current_user(request)
    pipeline = [
        {"$group": {
            "_id": "$resource_type",
            "total_carbon": {"$sum": "$carbon_g_co2_7d"},
            "count": {"$sum": 1},
            "avg_intensity": {"$avg": "$carbon_intensity_score"},
        }},
        {"$sort": {"total_carbon": -1}},
    ]
    by_type = await db.resources.aggregate(pipeline).to_list(20)
    region_pipeline = [
        {"$group": {"_id": "$region", "total_carbon": {"$sum": "$carbon_g_co2_7d"}, "count": {"$sum": 1}}},
        {"$sort": {"total_carbon": -1}},
    ]
    by_region = await db.resources.aggregate(region_pipeline).to_list(20)
    total_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$carbon_g_co2_7d"}}}]
    total_result = await db.resources.aggregate(total_pipeline).to_list(1)
    total_carbon = total_result[0]["total"] if total_result else 0
    greenops_score = max(0, min(100, 100 - (total_carbon / 1000)))
    trend = []
    for i in range(90):
        d = (datetime.now(timezone.utc) - timedelta(days=89 - i)).strftime("%Y-%m-%d")
        base_carbon = total_carbon / 90
        trend.append({"date": d, "carbon_g": round(base_carbon + random.uniform(-base_carbon * 0.3, base_carbon * 0.3), 2)})
    return {
        "total_carbon_g_7d": round(total_carbon, 2),
        "total_carbon_kg_7d": round(total_carbon / 1000, 2),
        "greenops_score": round(greenops_score, 1),
        "by_type": [{"type": r["_id"], "carbon_g": round(r["total_carbon"], 2), "count": r["count"], "avg_intensity": round(r.get("avg_intensity", 0), 2)} for r in by_type],
        "by_region": [{"region": r["_id"], "carbon_g": round(r["total_carbon"], 2), "count": r["count"]} for r in by_region],
        "trend_90d": trend,
    }

# ─── Seed Data ───
AWS_REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "eu-central-1"]
EC2_TYPES = ["t3.micro", "t3.small", "t3.medium", "m5.large", "m5.xlarge", "c5.2xlarge", "r5.large", "m6i.xlarge"]
RDS_ENGINES = ["mysql", "postgresql", "aurora-mysql", "aurora-postgresql"]

def generate_ec2_instances(count=40):
    resources = []
    names = ["web-server", "api-gateway", "worker", "batch-proc", "ml-inference", "dev-sandbox",
             "staging-app", "test-runner", "ci-runner", "monitoring", "log-aggregator", "cache-node",
             "data-pipeline", "etl-job", "cron-worker", "demo-instance", "legacy-app", "migration-temp",
             "load-test", "canary"]
    for i in range(count):
        name = f"{random.choice(names)}-{random.randint(1, 99):02d}"
        cpu = round(random.uniform(0.5, 95), 1)
        mem = round(random.uniform(2, 90), 1)
        is_zombie = cpu < 8 and mem < 15
        cost_7d = round(random.uniform(5, 350), 2)
        severity = None
        waste_score = 0
        if cpu < 2 and mem < 5:
            severity, waste_score = "critical", round(random.uniform(85, 100), 1)
        elif cpu < 5 and mem < 10:
            severity, waste_score = "high", round(random.uniform(65, 84), 1)
        elif cpu < 10 and mem < 20:
            severity, waste_score = "medium", round(random.uniform(40, 64), 1)
        elif cpu < 20 and mem < 30:
            severity, waste_score = "low", round(random.uniform(20, 39), 1)
        elif cpu < 30:
            severity, waste_score = "monitor", round(random.uniform(5, 19), 1)
        carbon = round(cost_7d * random.uniform(0.3, 0.8), 2)
        resources.append({
            "resource_id": f"i-{uuid.uuid4().hex[:12]}",
            "provider": "aws",
            "account_id": "123456789012",
            "region": random.choice(AWS_REGIONS),
            "resource_type": "EC2",
            "name": name,
            "instance_type": random.choice(EC2_TYPES),
            "tags": {"Environment": random.choice(["production", "staging", "development", "test"]), "Team": random.choice(["platform", "backend", "frontend", "data", "ml", "devops"])},
            "cost_7d": cost_7d,
            "cpu_avg": cpu,
            "memory_avg": mem,
            "network_mbps": round(random.uniform(0.01, 50), 2),
            "last_active": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 60))).isoformat(),
            "waste_severity": severity,
            "waste_score": waste_score,
            "carbon_g_co2_7d": carbon,
            "carbon_intensity_score": round(carbon / max(cost_7d, 1), 2),
            "collected_at": datetime.now(timezone.utc).isoformat(),
        })
    return resources

def generate_rds_instances(count=12):
    resources = []
    for i in range(count):
        name = f"db-{random.choice(['main', 'replica', 'analytics', 'staging', 'test', 'backup', 'migration', 'archive'])}-{random.randint(1, 20):02d}"
        cpu = round(random.uniform(1, 80), 1)
        mem = round(random.uniform(5, 85), 1)
        cost_7d = round(random.uniform(20, 600), 2)
        severity = None
        waste_score = 0
        if cpu < 3 and mem < 8:
            severity, waste_score = "critical", round(random.uniform(85, 100), 1)
        elif cpu < 8 and mem < 15:
            severity, waste_score = "high", round(random.uniform(65, 84), 1)
        elif cpu < 15 and mem < 25:
            severity, waste_score = "medium", round(random.uniform(40, 64), 1)
        carbon = round(cost_7d * random.uniform(0.4, 0.9), 2)
        resources.append({
            "resource_id": f"db-{uuid.uuid4().hex[:12]}",
            "provider": "aws",
            "account_id": "123456789012",
            "region": random.choice(AWS_REGIONS),
            "resource_type": "RDS",
            "name": name,
            "engine": random.choice(RDS_ENGINES),
            "tags": {"Environment": random.choice(["production", "staging", "development"]), "Team": random.choice(["backend", "data", "platform"])},
            "cost_7d": cost_7d,
            "cpu_avg": cpu,
            "memory_avg": mem,
            "network_mbps": round(random.uniform(0.5, 20), 2),
            "last_active": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).isoformat(),
            "waste_severity": severity,
            "waste_score": waste_score,
            "carbon_g_co2_7d": carbon,
            "carbon_intensity_score": round(carbon / max(cost_7d, 1), 2),
            "collected_at": datetime.now(timezone.utc).isoformat(),
        })
    return resources

def generate_s3_buckets(count=15):
    resources = []
    for i in range(count):
        name = f"s3-{random.choice(['logs', 'backups', 'assets', 'data-lake', 'archive', 'temp', 'uploads', 'reports'])}-{random.randint(1, 30):02d}"
        cost_7d = round(random.uniform(2, 150), 2)
        size_gb = round(random.uniform(1, 5000), 1)
        severity = None
        waste_score = 0
        if size_gb > 1000 and cost_7d > 80:
            severity, waste_score = "high", round(random.uniform(65, 84), 1)
        elif size_gb > 500 and cost_7d > 40:
            severity, waste_score = "medium", round(random.uniform(40, 64), 1)
        elif size_gb > 200:
            severity, waste_score = "low", round(random.uniform(20, 39), 1)
        carbon = round(cost_7d * random.uniform(0.1, 0.4), 2)
        resources.append({
            "resource_id": f"s3-{uuid.uuid4().hex[:12]}",
            "provider": "aws",
            "account_id": "123456789012",
            "region": random.choice(AWS_REGIONS),
            "resource_type": "S3",
            "name": name,
            "size_gb": size_gb,
            "tags": {"Environment": random.choice(["production", "staging", "development"]), "Team": random.choice(["data", "devops", "backend"])},
            "cost_7d": cost_7d,
            "cpu_avg": 0, "memory_avg": 0,
            "network_mbps": round(random.uniform(0.01, 5), 2),
            "last_active": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 90))).isoformat(),
            "waste_severity": severity,
            "waste_score": waste_score,
            "carbon_g_co2_7d": carbon,
            "carbon_intensity_score": round(carbon / max(cost_7d, 1), 2),
            "collected_at": datetime.now(timezone.utc).isoformat(),
        })
    return resources

def generate_lambda_functions(count=15):
    resources = []
    for i in range(count):
        name = f"fn-{random.choice(['process', 'notify', 'resize', 'sync', 'auth', 'webhook', 'cron', 'transform'])}-{random.randint(1, 30):02d}"
        invocations = random.randint(0, 50000)
        cost_7d = round(random.uniform(0.5, 50), 2)
        severity = None
        waste_score = 0
        if invocations < 10 and cost_7d > 5:
            severity, waste_score = "high", round(random.uniform(65, 84), 1)
        elif invocations < 100:
            severity, waste_score = "medium", round(random.uniform(40, 64), 1)
        carbon = round(cost_7d * random.uniform(0.05, 0.2), 2)
        resources.append({
            "resource_id": f"fn-{uuid.uuid4().hex[:12]}",
            "provider": "aws",
            "account_id": "123456789012",
            "region": random.choice(AWS_REGIONS),
            "resource_type": "Lambda",
            "name": name,
            "invocations_7d": invocations,
            "tags": {"Environment": random.choice(["production", "staging"]), "Team": random.choice(["backend", "platform"])},
            "cost_7d": cost_7d,
            "cpu_avg": round(random.uniform(5, 60), 1),
            "memory_avg": round(random.uniform(10, 70), 1),
            "network_mbps": round(random.uniform(0.01, 2), 2),
            "last_active": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 45))).isoformat(),
            "waste_severity": severity,
            "waste_score": waste_score,
            "carbon_g_co2_7d": carbon,
            "carbon_intensity_score": round(carbon / max(cost_7d, 1), 2),
            "collected_at": datetime.now(timezone.utc).isoformat(),
        })
    return resources

def generate_elb_resources(count=8):
    resources = []
    for i in range(count):
        name = f"elb-{random.choice(['web', 'api', 'internal', 'legacy', 'staging'])}-{random.randint(1, 10):02d}"
        requests_7d = random.randint(0, 5000000)
        cost_7d = round(random.uniform(10, 200), 2)
        severity = None
        waste_score = 0
        if requests_7d < 100:
            severity, waste_score = "critical", round(random.uniform(85, 100), 1)
        elif requests_7d < 1000:
            severity, waste_score = "high", round(random.uniform(65, 84), 1)
        carbon = round(cost_7d * random.uniform(0.2, 0.5), 2)
        resources.append({
            "resource_id": f"elb-{uuid.uuid4().hex[:12]}",
            "provider": "aws",
            "account_id": "123456789012",
            "region": random.choice(AWS_REGIONS),
            "resource_type": "ELB",
            "name": name,
            "requests_7d": requests_7d,
            "tags": {"Environment": random.choice(["production", "staging"]), "Team": random.choice(["platform", "devops"])},
            "cost_7d": cost_7d,
            "cpu_avg": 0, "memory_avg": 0,
            "network_mbps": round(random.uniform(1, 100), 2),
            "last_active": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 20))).isoformat(),
            "waste_severity": severity,
            "waste_score": waste_score,
            "carbon_g_co2_7d": carbon,
            "carbon_intensity_score": round(carbon / max(cost_7d, 1), 2),
            "collected_at": datetime.now(timezone.utc).isoformat(),
        })
    return resources

def generate_recommendations(resources):
    recs = []
    waste_resources = [r for r in resources if r.get("waste_severity") in ("critical", "high", "medium")]
    for r in waste_resources[:25]:
        sev = r["waste_severity"]
        savings = round(r["cost_7d"] * random.uniform(1.5, 4), 2)
        actions = {
            "EC2": {"action": "Terminate or downsize instance", "terraform": f'resource "aws_instance" "{r["name"]}" {{\n  # Downsize to t3.nano or terminate\n  instance_type = "t3.nano"\n}}', "cli": f'aws ec2 stop-instances --instance-ids {r["resource_id"]}'},
            "RDS": {"action": "Delete or downsize RDS instance", "terraform": f'resource "aws_db_instance" "{r["name"]}" {{\n  instance_class = "db.t3.micro"\n}}', "cli": f'aws rds stop-db-instance --db-instance-identifier {r["resource_id"]}'},
            "S3": {"action": "Enable lifecycle policy or delete bucket", "terraform": f'resource "aws_s3_bucket_lifecycle_configuration" "{r["name"]}" {{\n  rule {{\n    id = "archive"\n    status = "Enabled"\n    transition {{\n      days = 30\n      storage_class = "GLACIER"\n    }}\n  }}\n}}', "cli": f'aws s3 rm s3://{r["name"]} --recursive'},
            "Lambda": {"action": "Delete unused Lambda function", "terraform": f'# Remove resource "aws_lambda_function" "{r["name"]}"', "cli": f'aws lambda delete-function --function-name {r["name"]}'},
            "ELB": {"action": "Delete idle load balancer", "terraform": f'# Remove resource "aws_lb" "{r["name"]}"', "cli": f'aws elbv2 delete-load-balancer --load-balancer-arn {r["resource_id"]}'},
        }
        act = actions.get(r["resource_type"], {"action": "Review and optimize", "terraform": "# Manual review needed", "cli": "# Manual review needed"})
        recs.append({
            "rec_id": f"REC-{uuid.uuid4().hex[:8].upper()}",
            "resource_id": r["resource_id"],
            "resource_name": r["name"],
            "resource_type": r["resource_type"],
            "region": r["region"],
            "summary": f'{r["resource_type"]} instance "{r["name"]}" in {r["region"]} shows {sev} waste with {r["cpu_avg"]}% CPU and {r["memory_avg"]}% memory utilization.',
            "waste_classification": sev,
            "confidence": round(random.uniform(0.75, 0.98), 2),
            "priority": {"critical": 1, "high": 2, "medium": 3}.get(sev, 4),
            "estimated_monthly_savings": savings,
            "remediation_action": act["action"],
            "reasoning": f'Resource has been underutilized for the past 7 days. CPU avg: {r["cpu_avg"]}%, Memory avg: {r["memory_avg"]}%. Cost: ${r["cost_7d"]}/week.',
            "risk_flags": ["Verify no dependent services"] if sev == "critical" else [],
            "terraform_script": act["terraform"],
            "cli_command": act["cli"],
            "status": "pending",
            "generated_by": "heuristic",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        })
    return recs

async def seed_data():
    # Check if already seeded
    if await db.resources.count_documents({}) > 0:
        return
    all_resources = []
    all_resources.extend(generate_ec2_instances(40))
    all_resources.extend(generate_rds_instances(12))
    all_resources.extend(generate_s3_buckets(15))
    all_resources.extend(generate_lambda_functions(15))
    all_resources.extend(generate_elb_resources(8))
    await db.resources.insert_many(all_resources)
    recs = generate_recommendations(all_resources)
    if recs:
        await db.recommendations.insert_many(recs)
    # Seed some remediations
    pending_recs = [r for r in recs if r["waste_classification"] == "critical"][:3]
    for r in pending_recs:
        rem = {
            "remediation_id": f"REM-{uuid.uuid4().hex[:8].upper()}",
            "rec_id": r["rec_id"],
            "resource_id": r["resource_id"],
            "resource_name": r["resource_name"],
            "resource_type": r["resource_type"],
            "action": r["remediation_action"],
            "terraform_script": r["terraform_script"],
            "cli_command": r["cli_command"],
            "estimated_savings": r["estimated_monthly_savings"],
            "risk_flags": r["risk_flags"],
            "status": "pending",
            "created_by": "system",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=72)).isoformat(),
        }
        await db.remediations.insert_one(rem)

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@cloudpulse.io")
    admin_password = os.environ.get("ADMIN_PASSWORD", "CloudPulse2024!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.resources.create_index("resource_id", unique=True)
    await db.resources.create_index("resource_type")
    await db.resources.create_index("waste_severity")
    await db.resources.create_index("region")
    await db.recommendations.create_index("rec_id", unique=True)
    await db.remediations.create_index("remediation_id", unique=True)
    await seed_admin()
    await seed_data()

@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "1.0.0", "service": "CloudPulse API"}
