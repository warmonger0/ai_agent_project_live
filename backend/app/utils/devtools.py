# backend/app/utils/devtools.py

from datetime import datetime
from app.db.session import SessionLocal
from app.models import Task

def insert_dummy_task():
    db = SessionLocal()
    try:
        task = Task(
            description="Echo test",
            model_used="echo",
            generated_code=None,
            status="failed",
            error_message="Dummy failure for testing",
            created_at=datetime.utcnow(),
            completed_at=None
        )
        db.add(task)
        db.commit()
        print("✅ Dummy failed task inserted.")
    except Exception as e:
        db.rollback()
        print("❌ Failed to insert dummy task:", e)
        raise
    finally:
        db.close()
