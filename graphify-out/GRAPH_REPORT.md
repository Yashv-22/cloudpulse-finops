# Graph Report - .  (2026-04-18)

## Corpus Check
- Corpus is ~8,034 words - fits in a single context window. You may not need a graph.

## Summary
- 182 nodes · 185 edges · 53 communities detected
- Extraction: 64% EXTRACTED · 35% INFERRED · 1% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Routes & Collection|API Routes & Collection]]
- [[_COMMUNITY_App Lifecycle & Event Bus|App Lifecycle & Event Bus]]
- [[_COMMUNITY_PRD Product Vision|PRD Product Vision]]
- [[_COMMUNITY_Remediation Pipeline|Remediation Pipeline]]
- [[_COMMUNITY_ORM & Task Workers|ORM & Task Workers]]
- [[_COMMUNITY_AI Analysis Engine|AI Analysis Engine]]
- [[_COMMUNITY_DB Migration|DB Migration]]
- [[_COMMUNITY_Database Stack|Database Stack]]
- [[_COMMUNITY_App Configuration|App Configuration]]
- [[_COMMUNITY_Zombie Resource Scanner|Zombie Resource Scanner]]
- [[_COMMUNITY_Auth & JWT|Auth & JWT]]
- [[_COMMUNITY_Frontend Framework|Frontend Framework]]
- [[_COMMUNITY_DB Session|DB Session]]
- [[_COMMUNITY_Unified Resource Model|Unified Resource Model]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Dashboard Layout|Dashboard Layout]]
- [[_COMMUNITY_Recommendations Page|Recommendations Page]]
- [[_COMMUNITY_Settings Page|Settings Page]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Signup Page|Signup Page]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_Sidebar Component|Sidebar Component]]
- [[_COMMUNITY_Remediation Modal|Remediation Modal]]
- [[_COMMUNITY_Skeleton Component|Skeleton Component]]
- [[_COMMUNITY_Toggle Switch|Toggle Switch]]
- [[_COMMUNITY_Utils|Utils]]
- [[_COMMUNITY_FastAPI Backend|FastAPI Backend]]
- [[_COMMUNITY_Celery & Redis|Celery & Redis]]
- [[_COMMUNITY_Dependency Graph|Dependency Graph]]
- [[_COMMUNITY_Local Start Script|Local Start Script]]
- [[_COMMUNITY_Heuristic Rationale|Heuristic Rationale]]
- [[_COMMUNITY_Mock Cloud Rationale|Mock Cloud Rationale]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Cost Explorer Page|Cost Explorer Page]]
- [[_COMMUNITY_Dashboard Page|Dashboard Page]]
- [[_COMMUNITY_Resources Page|Resources Page]]
- [[_COMMUNITY_GlassCard Component|GlassCard Component]]
- [[_COMMUNITY_KPI Widget|KPI Widget]]
- [[_COMMUNITY_Mock Data|Mock Data]]
- [[_COMMUNITY_Uvicorn Server|Uvicorn Server]]
- [[_COMMUNITY_Pydantic Validation|Pydantic Validation]]
- [[_COMMUNITY_Structured Logging|Structured Logging]]
- [[_COMMUNITY_Analyst Persona|Analyst Persona]]
- [[_COMMUNITY_Viewer Persona|Viewer Persona]]
- [[_COMMUNITY_Next.js Agent Rules|Next.js Agent Rules]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]

## God Nodes (most connected - your core abstractions)
1. `CollectorService` - 16 edges
2. `HeuristicEngine` - 14 edges
3. `MockMultiCloudEngine` - 12 edges
4. `CloudPulse FinOps Platform` - 10 edges
5. `AIRemediationAgent` - 9 edges
6. `LocalEventBus` - 7 edges
7. `RemediationEngine` - 6 edges
8. `UserAuth` - 5 edges
9. `RemediationRequest` - 5 edges
10. `process_aws_resource()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Database: MongoDB` --semantically_similar_to--> `SQLAlchemy ORM`  [AMBIGUOUS] [semantically similar]
  memory/PRD.md → backend/requirements.txt
- `Builds a dependency graph to prevent unsafe deletions.         Edges represent d` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `Uses BFS traversal to check if deleting this resource breaks dependencies.` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `Generates Terraform code using the AI agent, wrapped with safety checks.` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `Helper to run async code in sync Celery tasks` --uses--> `HeuristicEngine`  [INFERRED]
  backend\app\tasks\celery_worker.py → backend\app\services\heuristic_engine.py

## Hyperedges (group relationships)
- **Authentication and Security Stack** — prd_auth_jwt, requirements_jose, requirements_passlib, prd_persona_admin, prd_persona_engineer, prd_persona_analyst, prd_persona_viewer [INFERRED 0.85]
- **AI Recommendation Pipeline** — prd_ai_openai, requirements_langchain, requirements_langchain_openai, prd_ai_recommendations, prd_waste_detection [INFERRED 0.80]
- **Core FinOps Feature Set** — prd_executive_dashboard, prd_resource_inventory, prd_cost_explorer, prd_waste_detection, prd_remediation_engine, prd_greenops [EXTRACTED 1.00]

## Communities

### Community 0 - "API Routes & Collection"
Cohesion: 0.13
Nodes (28): BaseModel, CollectorService, Returns mock resource data for local development.         In production, this ca, Mock AWS Resource Collector for local development.     In production, this would, HeuristicEngine, get_multi_cloud_data(), MockMultiCloudEngine, create_access_token() (+20 more)

### Community 1 - "App Lifecycle & Event Bus"
Cohesion: 0.12
Nodes (7): run_async_migrations(), run_migrations_online(), LocalEventBus, Local in-memory event bus that replaces Redis pub/sub for local development., process_resource_ai(), shutdown_event(), startup_event()

### Community 2 - "PRD Product Vision"
Cohesion: 0.12
Nodes (18): AI: OpenAI GPT-5.2, AI Recommendations with Terraform/CLI, Platform Architecture, P2: Anomaly Detection Alerts, P0: WebSocket Real-Time Updates, CloudPulse FinOps Platform, Cost Explorer, Executive Dashboard with KPIs (+10 more)

### Community 3 - "Remediation Pipeline"
Cohesion: 0.17
Nodes (8): AIRemediationAgent, Runs the LangChain agent to generate the Terraform remediation script.         F, AI Remediation Agent that generates Terraform remediation scripts.     Falls bac, # NOTE: This is a template. Configure your LLM (OPENAI_API_KEY) for AI-generated, Builds a dependency graph to prevent unsafe deletions.         Edges represent d, Uses BFS traversal to check if deleting this resource breaks dependencies., Generates Terraform code using the AI agent, wrapped with safety checks., RemediationEngine

### Community 4 - "ORM & Task Workers"
Cohesion: 0.24
Nodes (7): Base, process_aws_resource(), Helper to run async code in sync Celery tasks, Normalizes resource data into URM, runs heuristic analysis,      and saves to DB, run_async(), evaluate(), ResourceORM

### Community 5 - "AI Analysis Engine"
Cohesion: 0.28
Nodes (3): AIEngine, AIRecommendation, Structured AI recommendation output.

### Community 6 - "DB Migration"
Cohesion: 0.5
Nodes (1): Initial SQLite DB  Revision ID: 6d190e4b1049 Revises:  Create Date: 2026-04-17 1

### Community 7 - "Database Stack"
Cohesion: 0.5
Nodes (4): Database: MongoDB, Alembic Migrations, AsyncPG Driver, SQLAlchemy ORM

### Community 8 - "App Configuration"
Cohesion: 0.67
Nodes (2): BaseSettings, Settings

### Community 9 - "Zombie Resource Scanner"
Cohesion: 1.0
Nodes (2): calculate_savings(), get_zombie_ebs_volumes()

### Community 10 - "Auth & JWT"
Cohesion: 0.67
Nodes (3): Auth: JWT with httpOnly cookies and RBAC, Python-JOSE JWT Library, Passlib Password Hashing

### Community 11 - "Frontend Framework"
Cohesion: 0.67
Nodes (3): Frontend: React + Tailwind CSS v3 on port 3000, Next.js Frontend Project, Next.js Logo Wordmark (SVG)

### Community 12 - "DB Session"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Unified Resource Model"
Cohesion: 1.0
Nodes (1): UnifiedResource

### Community 14 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Dashboard Layout"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Recommendations Page"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Settings Page"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Login Page"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Signup Page"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Navbar Component"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Sidebar Component"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Remediation Modal"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Skeleton Component"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Toggle Switch"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Utils"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "FastAPI Backend"
Cohesion: 1.0
Nodes (2): Backend: FastAPI on port 8001, FastAPI Framework

### Community 27 - "Celery & Redis"
Cohesion: 1.0
Nodes (2): Celery Task Queue, Redis

### Community 28 - "Dependency Graph"
Cohesion: 1.0
Nodes (2): P2: Dependency Graph Visualization (BFS), NetworkX Graph Library

### Community 29 - "Local Start Script"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Heuristic Rationale"
Cohesion: 1.0
Nodes (1): Evaluates URM resource data using rule-based heuristics.         Returns: (waste

### Community 31 - "Mock Cloud Rationale"
Cohesion: 1.0
Nodes (1): Simulates data collection across AWS, GCP, and Azure for arbitrage and dashboard

### Community 32 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Next Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Next Config"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Landing Page"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Cost Explorer Page"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Dashboard Page"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Resources Page"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "GlassCard Component"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "KPI Widget"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Mock Data"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Uvicorn Server"
Cohesion: 1.0
Nodes (1): Uvicorn ASGI Server

### Community 44 - "Pydantic Validation"
Cohesion: 1.0
Nodes (1): Pydantic Validation

### Community 45 - "Structured Logging"
Cohesion: 1.0
Nodes (1): Structlog Logging

### Community 46 - "Analyst Persona"
Cohesion: 1.0
Nodes (1): Analyst Persona

### Community 47 - "Viewer Persona"
Cohesion: 1.0
Nodes (1): Viewer Persona

### Community 48 - "Next.js Agent Rules"
Cohesion: 1.0
Nodes (1): Next.js Breaking Changes Agent Rules

### Community 49 - "File Icon"
Cohesion: 1.0
Nodes (1): File Document Icon (SVG)

### Community 50 - "Globe Icon"
Cohesion: 1.0
Nodes (1): Globe/World Icon (SVG)

### Community 51 - "Vercel Logo"
Cohesion: 1.0
Nodes (1): Vercel Triangle Logo (SVG)

### Community 52 - "Window Icon"
Cohesion: 1.0
Nodes (1): Browser Window Icon (SVG)

## Ambiguous Edges - Review These
- `SQLAlchemy ORM` → `Database: MongoDB`  [AMBIGUOUS]
  memory/PRD.md · relation: semantically_similar_to

## Knowledge Gaps
- **44 isolated node(s):** `Initial SQLite DB  Revision ID: 6d190e4b1049 Revises:  Create Date: 2026-04-17 1`, `Mock AWS Resource Collector for local development.     In production, this would`, `Returns mock resource data for local development.         In production, this ca`, `Structured AI recommendation output.`, `AI Remediation Agent that generates Terraform remediation scripts.     Falls bac` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `DB Session`** (2 nodes): `engine.py`, `get_db()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Unified Resource Model`** (2 nodes): `urm.py`, `UnifiedResource`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Layout`** (2 nodes): `layout.tsx`, `DashboardLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Recommendations Page`** (2 nodes): `page.tsx`, `handleRemediate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Settings Page`** (2 nodes): `page.tsx`, `Settings()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page`** (2 nodes): `page.tsx`, `Login()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Signup Page`** (2 nodes): `page.tsx`, `Signup()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar Component`** (2 nodes): `Navbar.tsx`, `Navbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sidebar Component`** (2 nodes): `Sidebar.tsx`, `Sidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Remediation Modal`** (2 nodes): `RemediationModal.tsx`, `RemediationModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Component`** (2 nodes): `Skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle Switch`** (2 nodes): `ToggleSwitch.tsx`, `toggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Utils`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `FastAPI Backend`** (2 nodes): `Backend: FastAPI on port 8001`, `FastAPI Framework`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Celery & Redis`** (2 nodes): `Celery Task Queue`, `Redis`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dependency Graph`** (2 nodes): `P2: Dependency Graph Visualization (BFS)`, `NetworkX Graph Library`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Local Start Script`** (1 nodes): `start_local.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Heuristic Rationale`** (1 nodes): `Evaluates URM resource data using rule-based heuristics.         Returns: (waste`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mock Cloud Rationale`** (1 nodes): `Simulates data collection across AWS, GCP, and Azure for arbitrage and dashboard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Landing Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cost Explorer Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resources Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GlassCard Component`** (1 nodes): `GlassCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `KPI Widget`** (1 nodes): `KpiWidget.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mock Data`** (1 nodes): `mock-data.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Uvicorn Server`** (1 nodes): `Uvicorn ASGI Server`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pydantic Validation`** (1 nodes): `Pydantic Validation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Structured Logging`** (1 nodes): `Structlog Logging`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Analyst Persona`** (1 nodes): `Analyst Persona`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Viewer Persona`** (1 nodes): `Viewer Persona`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Agent Rules`** (1 nodes): `Next.js Breaking Changes Agent Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon`** (1 nodes): `File Document Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon`** (1 nodes): `Globe/World Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Logo`** (1 nodes): `Vercel Triangle Logo (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Window Icon`** (1 nodes): `Browser Window Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `SQLAlchemy ORM` and `Database: MongoDB`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `HeuristicEngine` connect `API Routes & Collection` to `ORM & Task Workers`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `process_aws_resource()` connect `ORM & Task Workers` to `App Lifecycle & Event Bus`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `CollectorService` (e.g. with `UserAuth` and `RemediationRequest`) actually correct?**
  _`CollectorService` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `HeuristicEngine` (e.g. with `UserAuth` and `RemediationRequest`) actually correct?**
  _`HeuristicEngine` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `MockMultiCloudEngine` (e.g. with `UserAuth` and `RemediationRequest`) actually correct?**
  _`MockMultiCloudEngine` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AIRemediationAgent` (e.g. with `RemediationEngine` and `Builds a dependency graph to prevent unsafe deletions.         Edges represent d`) actually correct?**
  _`AIRemediationAgent` has 5 INFERRED edges - model-reasoned connections that need verification._