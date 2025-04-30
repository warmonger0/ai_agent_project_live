# insert_failed_task.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.models import Task
from app.db import SessionLocal

def insert_failed_task():
    db = SessionLocal()

    task = Task(
        description="Simulated failure task for healing test",
        model_used="DeepSeek",
        generated_code=None,
        status="failed"
    )

    db.add(task)
    db.commit()
    print(f"✅ Inserted failed task with ID {task.id}")
    db.close()

if __name__ == "__main__":
    insert_failed_task()
