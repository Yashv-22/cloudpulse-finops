# CloudPulse Local-Native Startup Script
# Runs natively without Docker or Celery!

Write-Host "Starting CloudPulse FinOps Platform (Local-Native Mode)..." -ForegroundColor Cyan

# 1. Run Database Migrations (SQLite)
Write-Host "1. Validating SQLite Database Schema..." -ForegroundColor Yellow
cd backend
.\venv\Scripts\Activate.ps1
alembic upgrade head
cd ..

# 2. Start Backend FastAPI Server (in a new window)
Write-Host "2. Starting FastAPI Backend (with native Asyncio tasks)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# 3. Start Next.js Frontend (in a new window)
Write-Host "3. Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-next; npm run dev"

Write-Host "CloudPulse Local-Native is starting! Services will be available at:" -ForegroundColor Green
Write-Host "Frontend Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API Docs: http://localhost:8000/docs" -ForegroundColor White
