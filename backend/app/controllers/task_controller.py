from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Task
from app.db import SessionLocal  # ✅ DB session from centralized db.py

router = APIRouter()

# --- DB session dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Get all tasks (used by frontend dashboard) ---
@router.get("/status/all")
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

# --- Retry a task by ID ---
@router.post("/retry/{task_id}")
def retry_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status != "failed":
        raise HTTPException(status_code=400, detail="Only failed tasks can be retried")

    task.status = "pending"
    db.commit()

    return {"message": f"Task {task_id} status set to pending."}
