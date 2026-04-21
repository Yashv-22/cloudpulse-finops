import asyncio
from celery import Celery
from app.config import settings
import structlog
from app.services.heuristic_engine import HeuristicEngine
from app.services.event_bus import event_bus
from app.models.orm import ResourceORM
from app.db.engine import AsyncSessionLocal
import time

logger = structlog.get_logger()

# Initialize Celery
celery_app = Celery(
    "cloudpulse_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
)

def run_async(coro):
    """Helper to run async code in sync Celery tasks"""
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coro)

@celery_app.task(bind=True, max_retries=3)
def process_aws_resource(self, resource_data: dict):
    """
    Normalizes resource data into URM, runs heuristic analysis, 
    and saves to DB.
    """
    try:
        logger.info(f"Processing resource {resource_data.get('resource_id')}")
        
        # 1. Run Heuristic Engine
        score, tier = HeuristicEngine.evaluate(resource_data)
        resource_data["waste_score"] = score
        resource_data["waste_tier"] = tier
        
        # 2. Publish to Event Bus
        run_async(event_bus.publish("resource_events", "resource.normalized", resource_data))
        
        # 3. Store to DB
        async def save_to_db():
            async with AsyncSessionLocal() as db:
                orm_res = ResourceORM(**resource_data)
                db.add(orm_res)
                await db.commit()
                
        run_async(save_to_db())
        
        return {"status": "success", "resource_id": resource_data.get("resource_id")}
        
    except Exception as exc:
        logger.error(f"Task failed: {str(exc)}")
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
