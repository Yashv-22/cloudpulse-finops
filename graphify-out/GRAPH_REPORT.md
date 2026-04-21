# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~20,469 words - fits in a single context window. You may not need a graph.

## Summary
- 319 nodes · 310 edges · 69 communities detected
- Extraction: 82% EXTRACTED · 17% INFERRED · 1% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend API & Data Models|Backend API & Data Models]]
- [[_COMMUNITY_AI Remediation Engine|AI Remediation Engine]]
- [[_COMMUNITY_Product Requirements (PRD)|Product Requirements (PRD)]]
- [[_COMMUNITY_DB Migrations & Event Bus|DB Migrations & Event Bus]]
- [[_COMMUNITY_Async Workers & Heuristics|Async Workers & Heuristics]]
- [[_COMMUNITY_AWS Resource Collectors|AWS Resource Collectors]]
- [[_COMMUNITY_AI Engine & Recommendations|AI Engine & Recommendations]]
- [[_COMMUNITY_Compliance Auditing|Compliance Auditing]]
- [[_COMMUNITY_Settings Page (Frontend)|Settings Page (Frontend)]]
- [[_COMMUNITY_Authentication Flow|Authentication Flow]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_Remediation Modal|Remediation Modal]]
- [[_COMMUNITY_Initial SQLite Migration|Initial SQLite Migration]]
- [[_COMMUNITY_Notifications Page|Notifications Page]]
- [[_COMMUNITY_Recommendations Page|Recommendations Page]]
- [[_COMMUNITY_App Config|App Config]]
- [[_COMMUNITY_FastAPI Main App|FastAPI Main App]]
- [[_COMMUNITY_Zombie Resource Scanner|Zombie Resource Scanner]]
- [[_COMMUNITY_Resources Page|Resources Page]]
- [[_COMMUNITY_Preferences Context|Preferences Context]]
- [[_COMMUNITY_Backend App Config Py|Backend App Config Py]]
- [[_COMMUNITY_Backend App Main Py|Backend App Main Py]]
- [[_COMMUNITY_Backend App Services Zombie Scanner Py|Backend App Services Zombie Scanner Py]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Resource|Frontend Next Src App Dashboard Resource]]
- [[_COMMUNITY_Frontend Next Src Context Preferencescon|Frontend Next Src Context Preferencescon]]
- [[_COMMUNITY_Prd Frontend React|Prd Frontend React]]
- [[_COMMUNITY_Backend App Db Engine Py|Backend App Db Engine Py]]
- [[_COMMUNITY_Frontend Next Src App Layout Tsx|Frontend Next Src App Layout Tsx]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Layout T|Frontend Next Src App Dashboard Layout T]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Cost Exp|Frontend Next Src App Dashboard Cost Exp]]
- [[_COMMUNITY_Frontend Next Src Components Layout Side|Frontend Next Src Components Layout Side]]
- [[_COMMUNITY_Frontend Next Src Components Ui Skeleton|Frontend Next Src Components Ui Skeleton]]
- [[_COMMUNITY_Frontend Next Src Components Ui Togglesw|Frontend Next Src Components Ui Togglesw]]
- [[_COMMUNITY_Api Request|Api Request]]
- [[_COMMUNITY_Frontend Next Src Lib Use Fetch Ts|Frontend Next Src Lib Use Fetch Ts]]
- [[_COMMUNITY_Frontend Next Src Lib Utils Ts|Frontend Next Src Lib Utils Ts]]
- [[_COMMUNITY_Doc Content Aws Amplify|Doc Content Aws Amplify]]
- [[_COMMUNITY_Start Local Ps1|Start Local Ps1]]
- [[_COMMUNITY_Heuristic Engine Rationale 4|Heuristic Engine Rationale 4]]
- [[_COMMUNITY_Mock Multi Cloud Rationale 6|Mock Multi Cloud Rationale 6]]
- [[_COMMUNITY_Frontend Next Eslint Config Mjs|Frontend Next Eslint Config Mjs]]
- [[_COMMUNITY_Frontend Next Next Env D Ts|Frontend Next Next Env D Ts]]
- [[_COMMUNITY_Frontend Next Next Config Ts|Frontend Next Next Config Ts]]
- [[_COMMUNITY_Frontend Next Postcss Config Mjs|Frontend Next Postcss Config Mjs]]
- [[_COMMUNITY_Frontend Next Src App Page Tsx|Frontend Next Src App Page Tsx]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Complian|Frontend Next Src App Dashboard Complian]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Dashboar|Frontend Next Src App Dashboard Dashboar]]
- [[_COMMUNITY_Frontend Next Src App Dashboard Resource|Frontend Next Src App Dashboard Resource]]
- [[_COMMUNITY_Frontend Next Src Components Ui Glasscar|Frontend Next Src Components Ui Glasscar]]
- [[_COMMUNITY_Frontend Next Src Components Ui Kpiwidge|Frontend Next Src Components Ui Kpiwidge]]
- [[_COMMUNITY_Frontend Next Src Lib Mock Data Ts|Frontend Next Src Lib Mock Data Ts]]
- [[_COMMUNITY_Frontend Next Src Lib Store Ts|Frontend Next Src Lib Store Ts]]
- [[_COMMUNITY_Agents Nextjs Rules|Agents Nextjs Rules]]
- [[_COMMUNITY_Prd Persona Analyst|Prd Persona Analyst]]
- [[_COMMUNITY_Prd Persona Viewer|Prd Persona Viewer]]
- [[_COMMUNITY_Svg File Icon|Svg File Icon]]
- [[_COMMUNITY_Svg Globe Icon|Svg Globe Icon]]
- [[_COMMUNITY_Svg Vercel Logo|Svg Vercel Logo]]
- [[_COMMUNITY_Svg Window Icon|Svg Window Icon]]
- [[_COMMUNITY_Doc Content Aes 256 Encryption|Doc Content Aes 256 Encryption]]
- [[_COMMUNITY_Doc Content Gdpr Soc2|Doc Content Gdpr Soc2]]
- [[_COMMUNITY_Doc Content Captcha 403 Handling|Doc Content Captcha 403 Handling]]
- [[_COMMUNITY_Doc Content Worker Scaling|Doc Content Worker Scaling]]
- [[_COMMUNITY_Doc Content Dark Mode|Doc Content Dark Mode]]
- [[_COMMUNITY_Doc Content Sidebar Navigation|Doc Content Sidebar Navigation]]
- [[_COMMUNITY_Doc Content Lucide React|Doc Content Lucide React]]
- [[_COMMUNITY_Doc Content Zustand|Doc Content Zustand]]
- [[_COMMUNITY_Doc Content Tanstack Query|Doc Content Tanstack Query]]
- [[_COMMUNITY_Doc Content Aws Secrets Manager|Doc Content Aws Secrets Manager]]

## God Nodes (most connected - your core abstractions)
1. `AIRemediationAgent` - 9 edges
2. `CloudPulse FinOps Platform` - 9 edges
3. `CollectorService` - 8 edges
4. `MockMultiCloudEngine` - 8 edges
5. `LangChain Orchestration` - 8 edges
6. `LocalEventBus` - 7 edges
7. `Next.js 14+ App Router` - 7 edges
8. `Project Structure` - 7 edges
9. `ComplianceService` - 6 edges
10. `RemediationEngine` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Database: MongoDB` --semantically_similar_to--> `sqlalchemy`  [AMBIGUOUS] [semantically similar]
  memory/PRD.md → backend/requirements.txt
- `networkx` --conceptually_related_to--> `CloudPulse Pro`  [AMBIGUOUS]
  backend/requirements.txt → doc_content.txt
- `Builds a dependency graph to prevent unsafe deletions.         Edges represent d` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `Uses BFS traversal to check if deleting this resource breaks dependencies.` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `Generates Terraform code using the AI agent, wrapped with safety checks.` --uses--> `AIRemediationAgent`  [INFERRED]
  backend\app\services\remediation_engine.py → backend\app\services\ai_remediation_agent.py
- `process_aws_resource()` --calls--> `evaluate()`  [INFERRED]
  backend\app\tasks\celery_worker.py → backend\app\services\heuristic_engine.py
- `AGENTS.md pointer` --references--> `Next.js 14+ App Router`  [INFERRED]
  frontend-next/CLAUDE.md → doc_content.txt
- `asyncpg` --calls--> `PostgreSQL Database`  [INFERRED]
  backend/requirements.txt → doc_content.txt
- `psycopg2-binary` --calls--> `PostgreSQL Database`  [INFERRED]
  backend/requirements.txt → doc_content.txt
- `LoginRequest` --uses--> `MockMultiCloudEngine`  [INFERRED]
  backend\app\api\routers.py → backend\app\services\mock_multi_cloud.py

## Hyperedges (group relationships)
- **Authentication and Security Stack** — prd_auth_jwt, requirements_jose, requirements_passlib, prd_persona_admin, prd_persona_engineer, prd_persona_analyst, prd_persona_viewer [INFERRED 0.85]
- **AI Recommendation Pipeline** — prd_ai_openai, requirements_langchain, requirements_langchain_openai, prd_ai_recommendations, prd_waste_detection [INFERRED 0.80]
- **Core FinOps Feature Set** — prd_executive_dashboard, prd_resource_inventory, prd_cost_explorer, prd_waste_detection, prd_remediation_engine, prd_greenops [EXTRACTED 1.00]
- **Zombie Detection + AI + Terraform Validation Pipeline** — doc_content_fr1_zombie_resource_hunter, doc_content_langchain, doc_content_terraform_validate_gate, doc_content_remediation_engine, doc_content_fr6_ai_remediation_engine [EXTRACTED 0.95]
- **Glassmorphism 2.0 Design System** — doc_content_glassmorphism_2, doc_content_color_palette, doc_content_inter_font, doc_content_framer_motion, doc_content_tailwind_css [EXTRACTED 0.95]
- **FastAPI Backend Service Architecture** — doc_content_fastapi, doc_content_ai_engine, doc_content_heuristic_engine, doc_content_remediation_engine, doc_content_collector_service, doc_content_event_bus, doc_content_celery_redis [EXTRACTED 0.95]

## Communities

### Community 0 - "Backend API & Data Models"
Cohesion: 0.06
Nodes (16): BaseModel, get_multi_cloud_data(), MockMultiCloudEngine, handleSubmit(), ChangePasswordRequest, create_access_token(), ForgotPasswordRequest, get_multi_cloud() (+8 more)

### Community 1 - "AI Remediation Engine"
Cohesion: 0.09
Nodes (24): Celery + Redis Task Queue, docker-compose.yml, Backend .env Configuration, FastAPI (Python 3.11+), PostgreSQL Database, Pydantic v2, Rationale: Why FastAPI, Redis Cache (+16 more)

### Community 2 - "Product Requirements (PRD)"
Cohesion: 0.11
Nodes (21): AWS CloudWatch Monitoring, Boto3 AWS SDK, Collector Service (app/collectors/), Compliance Gauge Component, Dynamic Cost Heatmap, CTOs / Finance Leads, DevOps / SRE Teams, FR-1 Zombie Resource Hunter (+13 more)

### Community 3 - "DB Migrations & Event Bus"
Cohesion: 0.13
Nodes (21): LangChain Chains (ResourceAnalysis, TerraformGeneration, SavingsReasoning, ComplianceExplainer), AI Engine (app/services/ai_engine.py), Async Event Fabric / Agent + Event Loop Pattern, Event Bus (app/services/event_bus.py), FR-6 AI Remediation Engine, GPT-4o / Claude 3.5 Sonnet (Bedrock), Heuristic Engine (app/services/heuristic.py), LangChain Orchestration (+13 more)

### Community 4 - "Async Workers & Heuristics"
Cohesion: 0.12
Nodes (17): AGENTS.md pointer, CLAUDE.md (references AGENTS.md), Autonomous AI FinOps & Cloud Governance Platform, AWS Edition, CloudPulse Pro, Color Palette, Dashboard Pages, Executive Summary (+9 more)

### Community 5 - "AWS Resource Collectors"
Cohesion: 0.17
Nodes (8): AIRemediationAgent, Runs the LangChain agent to generate the Terraform remediation script.         F, AI Remediation Agent that generates Terraform remediation scripts.     Falls bac, # NOTE: This is a template. Configure your LLM (OPENAI_API_KEY) for AI-generated, Builds a dependency graph to prevent unsafe deletions.         Edges represent d, Uses BFS traversal to check if deleting this resource breaks dependencies., Generates Terraform code using the AI agent, wrapped with safety checks., RemediationEngine

### Community 6 - "AI Engine & Recommendations"
Cohesion: 0.14
Nodes (15): AI: OpenAI GPT-5.2, AI Recommendations with Terraform/CLI, Platform Architecture, P2: Anomaly Detection Alerts, P0: WebSocket Real-Time Updates, CloudPulse FinOps Platform, Cost Explorer, Executive Dashboard with KPIs (+7 more)

### Community 7 - "Compliance Auditing"
Cohesion: 0.17
Nodes (4): run_async_migrations(), run_migrations_online(), LocalEventBus, Local in-memory event bus that replaces Redis pub/sub for local development.

### Community 8 - "Settings Page (Frontend)"
Cohesion: 0.25
Nodes (8): Base, process_aws_resource(), Helper to run async code in sync Celery tasks, Normalizes resource data into URM, runs heuristic analysis,      and saves to DB, run_async(), evaluate(), HeuristicEngine, ResourceORM

### Community 9 - "Authentication Flow"
Cohesion: 0.33
Nodes (2): CollectorService, AWS Resource Collector using boto3.     Includes a fallback to mock data if cred

### Community 10 - "Navbar Component"
Cohesion: 0.28
Nodes (3): AIEngine, AIRecommendation, Structured AI recommendation output.

### Community 11 - "Remediation Modal"
Cohesion: 0.43
Nodes (1): ComplianceService

### Community 12 - "Initial SQLite Migration"
Cohesion: 0.33
Nodes (0): 

### Community 13 - "Notifications Page"
Cohesion: 0.4
Nodes (0): 

### Community 14 - "Recommendations Page"
Cohesion: 0.4
Nodes (0): 

### Community 15 - "App Config"
Cohesion: 0.5
Nodes (1): Initial SQLite DB  Revision ID: 6d190e4b1049 Revises:  Create Date: 2026-04-17 1

### Community 16 - "FastAPI Main App"
Cohesion: 0.5
Nodes (0): 

### Community 17 - "Zombie Resource Scanner"
Cohesion: 0.5
Nodes (0): 

### Community 18 - "Resources Page"
Cohesion: 0.67
Nodes (4): Audit Mode (ReadOnlyAccess), IAM Least Privilege, Rationale: Security-First Starting Point, Remediation Mode (STS Token)

### Community 19 - "Preferences Context"
Cohesion: 0.5
Nodes (4): NextAuth.js / Clerk Auth, Auth: JWT with httpOnly cookies and RBAC, passlib[bcrypt], python-jose[cryptography]

### Community 20 - "Backend App Config Py"
Cohesion: 0.67
Nodes (2): BaseSettings, Settings

### Community 21 - "Backend App Main Py"
Cohesion: 0.67
Nodes (0): 

### Community 22 - "Backend App Services Zombie Scanner Py"
Cohesion: 1.0
Nodes (2): calculate_savings(), get_zombie_ebs_volumes()

### Community 23 - "Frontend Next Src App Dashboard Resource"
Cohesion: 0.67
Nodes (0): 

### Community 24 - "Frontend Next Src Context Preferencescon"
Cohesion: 0.67
Nodes (0): 

### Community 25 - "Prd Frontend React"
Cohesion: 0.67
Nodes (3): Frontend: React + Tailwind CSS v3 on port 3000, Next.js Frontend Project, Next.js Logo Wordmark (SVG)

### Community 26 - "Backend App Db Engine Py"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Frontend Next Src App Layout Tsx"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Frontend Next Src App Dashboard Layout T"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Frontend Next Src App Dashboard Cost Exp"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Frontend Next Src Components Layout Side"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Frontend Next Src Components Ui Skeleton"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Frontend Next Src Components Ui Togglesw"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Api Request"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Frontend Next Src Lib Use Fetch Ts"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Frontend Next Src Lib Utils Ts"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Doc Content Aws Amplify"
Cohesion: 1.0
Nodes (2): AWS Amplify Frontend Hosting, AWS App Runner Backend Hosting

### Community 37 - "Start Local Ps1"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Heuristic Engine Rationale 4"
Cohesion: 1.0
Nodes (1): Evaluates URM resource data using rule-based heuristics.         Returns: (waste

### Community 39 - "Mock Multi Cloud Rationale 6"
Cohesion: 1.0
Nodes (1): Simulates data collection across AWS, GCP, and Azure for arbitrage and dashboard

### Community 40 - "Frontend Next Eslint Config Mjs"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Frontend Next Next Env D Ts"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Frontend Next Next Config Ts"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Frontend Next Postcss Config Mjs"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Frontend Next Src App Page Tsx"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Frontend Next Src App Dashboard Complian"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Frontend Next Src App Dashboard Dashboar"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Frontend Next Src App Dashboard Resource"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Frontend Next Src Components Ui Glasscar"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Frontend Next Src Components Ui Kpiwidge"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Frontend Next Src Lib Mock Data Ts"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Frontend Next Src Lib Store Ts"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Agents Nextjs Rules"
Cohesion: 1.0
Nodes (1): Next.js Breaking Changes Agent Rules

### Community 53 - "Prd Persona Analyst"
Cohesion: 1.0
Nodes (1): Analyst Persona

### Community 54 - "Prd Persona Viewer"
Cohesion: 1.0
Nodes (1): Viewer Persona

### Community 55 - "Svg File Icon"
Cohesion: 1.0
Nodes (1): File Document Icon (SVG)

### Community 56 - "Svg Globe Icon"
Cohesion: 1.0
Nodes (1): Globe/World Icon (SVG)

### Community 57 - "Svg Vercel Logo"
Cohesion: 1.0
Nodes (1): Vercel Triangle Logo (SVG)

### Community 58 - "Svg Window Icon"
Cohesion: 1.0
Nodes (1): Browser Window Icon (SVG)

### Community 59 - "Doc Content Aes 256 Encryption"
Cohesion: 1.0
Nodes (1): AES-256 Encryption at Rest

### Community 60 - "Doc Content Gdpr Soc2"
Cohesion: 1.0
Nodes (1): GDPR / SOC 2 Compliance

### Community 61 - "Doc Content Captcha 403 Handling"
Cohesion: 1.0
Nodes (1): CAPTCHA & 403 Handling

### Community 62 - "Doc Content Worker Scaling"
Cohesion: 1.0
Nodes (1): Independent Worker Scaling

### Community 63 - "Doc Content Dark Mode"
Cohesion: 1.0
Nodes (1): Dark Mode Default

### Community 64 - "Doc Content Sidebar Navigation"
Cohesion: 1.0
Nodes (1): Persistent Sidebar Navigation

### Community 65 - "Doc Content Lucide React"
Cohesion: 1.0
Nodes (1): Lucide-React Icons

### Community 66 - "Doc Content Zustand"
Cohesion: 1.0
Nodes (1): Zustand State Management

### Community 67 - "Doc Content Tanstack Query"
Cohesion: 1.0
Nodes (1): TanStack Query (React Query)

### Community 68 - "Doc Content Aws Secrets Manager"
Cohesion: 1.0
Nodes (1): AWS Secrets Manager

## Ambiguous Edges - Review These
- `Database: MongoDB` → `sqlalchemy`  [AMBIGUOUS]
  memory/PRD.md · relation: semantically_similar_to
- `CloudPulse Pro` → `networkx`  [AMBIGUOUS]
  backend/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **77 isolated node(s):** `Initial SQLite DB  Revision ID: 6d190e4b1049 Revises:  Create Date: 2026-04-17 1`, `AWS Resource Collector using boto3.     Includes a fallback to mock data if cred`, `Structured AI recommendation output.`, `AI Remediation Agent that generates Terraform remediation scripts.     Falls bac`, `Runs the LangChain agent to generate the Terraform remediation script.         F` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Backend App Db Engine Py`** (2 nodes): `engine.py`, `get_db()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Layout Tsx`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Dashboard Layout T`** (2 nodes): `layout.tsx`, `DashboardLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Dashboard Cost Exp`** (2 nodes): `page.tsx`, `handleExport()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Components Layout Side`** (2 nodes): `Sidebar.tsx`, `Sidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Components Ui Skeleton`** (2 nodes): `Skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Components Ui Togglesw`** (2 nodes): `ToggleSwitch.tsx`, `toggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Api Request`** (2 nodes): `request()`, `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Lib Use Fetch Ts`** (2 nodes): `use-fetch.ts`, `useFetch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Lib Utils Ts`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Aws Amplify`** (2 nodes): `AWS Amplify Frontend Hosting`, `AWS App Runner Backend Hosting`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Start Local Ps1`** (1 nodes): `start_local.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Heuristic Engine Rationale 4`** (1 nodes): `Evaluates URM resource data using rule-based heuristics.         Returns: (waste`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mock Multi Cloud Rationale 6`** (1 nodes): `Simulates data collection across AWS, GCP, and Azure for arbitrage and dashboard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Eslint Config Mjs`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Next Env D Ts`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Next Config Ts`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Postcss Config Mjs`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Page Tsx`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Dashboard Complian`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Dashboard Dashboar`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src App Dashboard Resource`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Components Ui Glasscar`** (1 nodes): `GlassCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Components Ui Kpiwidge`** (1 nodes): `KpiWidget.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Lib Mock Data Ts`** (1 nodes): `mock-data.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Next Src Lib Store Ts`** (1 nodes): `store.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agents Nextjs Rules`** (1 nodes): `Next.js Breaking Changes Agent Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prd Persona Analyst`** (1 nodes): `Analyst Persona`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prd Persona Viewer`** (1 nodes): `Viewer Persona`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Svg File Icon`** (1 nodes): `File Document Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Svg Globe Icon`** (1 nodes): `Globe/World Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Svg Vercel Logo`** (1 nodes): `Vercel Triangle Logo (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Svg Window Icon`** (1 nodes): `Browser Window Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Aes 256 Encryption`** (1 nodes): `AES-256 Encryption at Rest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Gdpr Soc2`** (1 nodes): `GDPR / SOC 2 Compliance`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Captcha 403 Handling`** (1 nodes): `CAPTCHA & 403 Handling`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Worker Scaling`** (1 nodes): `Independent Worker Scaling`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Dark Mode`** (1 nodes): `Dark Mode Default`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Sidebar Navigation`** (1 nodes): `Persistent Sidebar Navigation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Lucide React`** (1 nodes): `Lucide-React Icons`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Zustand`** (1 nodes): `Zustand State Management`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Tanstack Query`** (1 nodes): `TanStack Query (React Query)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Content Aws Secrets Manager`** (1 nodes): `AWS Secrets Manager`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Database: MongoDB` and `sqlalchemy`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `CloudPulse Pro` and `networkx`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Async Event Fabric / Agent + Event Loop Pattern` connect `DB Migrations & Event Bus` to `AI Remediation Engine`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `Celery + Redis Task Queue` connect `AI Remediation Engine` to `DB Migrations & Event Bus`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `AIRemediationAgent` (e.g. with `RemediationEngine` and `Builds a dependency graph to prevent unsafe deletions.         Edges represent d`) actually correct?**
  _`AIRemediationAgent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `MockMultiCloudEngine` (e.g. with `LoginRequest` and `SignupRequest`) actually correct?**
  _`MockMultiCloudEngine` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Initial SQLite DB  Revision ID: 6d190e4b1049 Revises:  Create Date: 2026-04-17 1`, `AWS Resource Collector using boto3.     Includes a fallback to mock data if cred`, `Structured AI recommendation output.` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._