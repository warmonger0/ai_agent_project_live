from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Task
from app.db import SessionLocal
from pydantic import BaseModel

router = APIRouter()

# --- DB session dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic input model for new task creation ---
class TaskCreate(BaseModel):
    description: str
    model_used: str

# --- Get all tasks ---
@router.get("/status/all")
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

# --- Get task by ID ---
@router.get("/status/{task_id}")
def get_task_by_id(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "task_id": task.id,
        "description": task.description,
        "status": task.status
    }

# --- Retry a failed task by ID ---
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

# --- Insert a new task ---
@router.post("/task")
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        description=task_data.description,
        model_used=task_data.model_used,
        status="pending"
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
