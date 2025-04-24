import asyncio
import logging
import httpx
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Task

# --- Logging Setup: logs to console + file ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s",
    handlers=[
        logging.FileHandler("healing.log"),     # Writes to backend/healing.log
        logging.StreamHandler()                 # Still logs to terminal
    ]
)

logger = logging.getLogger(__name__)

CHECK_INTERVAL = 15  # seconds

async def healing_loop():
    while True:
        await asyncio.sleep(CHECK_INTERVAL)
        logger.info("🔁 Running healing check...")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:8000/health")
                if response.status_code == 200:
                    logger.info("✅ Health check passed.")
                    continue  # No need to heal if system is healthy

        except Exception as e:
            logger.warning(f"⚠️ Health check failed: {e}")

        db: Session = SessionLocal()
        try:
            failed_tasks = db.query(Task).filter(Task.status == "failed").all()
            for task in failed_tasks:
                logger.info(f"🔁 Healing: resetting task {task.id} to 'pending'")
                task.status = "pending"
            db.commit()
        finally:
            db.close()
