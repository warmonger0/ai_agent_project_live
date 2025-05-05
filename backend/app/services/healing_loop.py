import asyncio
import logging
import httpx
from sqlalchemy.orm import Session
from backend.app.db.session import SessionLocal
from backend.app.models import Task

# --- Logging Setup: logs to console + file ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s",
    handlers=[
        logging.FileHandler("healing.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

CHECK_INTERVAL = 15  # seconds
HEALTH_URL = "http://localhost:8000/api/v1/health"

# ✅ Refactored healing task logic into callable
def reset_failed_tasks(source="healing"):
    db: Session = SessionLocal()
    try:
        failed_tasks = db.query(Task).filter(Task.status == "failed").all()
        for task in failed_tasks:
            logger.info(f"🔁 [{source}] Resetting task {task.id} to 'pending'")
            task.status = "pending"
        db.commit()
    finally:
        db.close()

# Main healing loop
async def healing_loop():
    while True:
        await asyncio.sleep(CHECK_INTERVAL)
        logger.info("🔁 Running healing check...")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(HEALTH_URL)
                if response.status_code == 200:
                    logger.info("✅ Health check passed.")
                    continue
        except Exception as e:
            logger.warning(f"⚠️ Health check failed: {e}")

        # ✅ Trigger retry logic
        reset_failed_tasks(source="healing")
