from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.db import tasks as task_db
from backend.app.db.tasks import add_memory_entry
from backend.app.models import Task, PluginExecution
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

router = APIRouter(prefix="/tasks")  # ✅ Added prefix

# --- Pydantic input model for new task creation ---
class TaskCreate(BaseModel):
    description: str
    model_used: str

# --- TASK ROUTES ---

@router.post("/", response_model=dict)  # ✅ non-empty path
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    task = task_db.create_task(db, description=task_data.description, model_used=task_data.model_used)
    add_memory_entry(db, "task", task.id, f"Created task with model `{task.model_used}` and description: {task.description}")
    return {
        "id": task.id,
        "status": task.status,
        "created_at": task.created_at
    }

@router.get("/", response_model=List[dict])
def get_all_tasks(db: Session = Depends(get_db)):
    tasks = task_db.get_all_tasks(db)
    return [
        {
            "id": t.id,
            "description": t.description,
            "model_used": t.model_used,
            "status": t.status,
            "created_at": t.created_at,
            "completed_at": t.completed_at,
        }
        for t in tasks
    ]

@router.get("/{task_id}", response_model=dict)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = task_db.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "id": task.id,
        "description": task.description,
        "model_used": task.model_used,
        "status": task.status,
        "created_at": task.created_at,
        "completed_at": task.completed_at,
    }

@router.patch("/{task_id}", response_model=dict)
def update_task(task_id: int, status: str, error_message: Optional[str] = None, db: Session = Depends(get_db)):
    task = task_db.update_task_status(
        db, task_id, status=status,
        error_message=error_message,
        completed=(status in ["success", "error"])
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    add_memory_entry(db, "task", task.id, f"Updated task status to `{status}`. Error: {error_message}")
    return {
        "id": task.id,
        "status": task.status,
        "error_message": task.error_message,
        "completed_at": task.completed_at,
    }

@router.post("/retry/{task_id}")
def retry_task(task_id: int, db: Session = Depends(get_db)):
    task = task_db.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != "error":
        raise HTTPException(status_code=400, detail="Only errored tasks can be retried")
    task = task_db.update_task_status(db, task_id, status="pending", error_message=None, completed=False)
    add_memory_entry(db, "task", task.id, f"Task retried. Status reset to `pending`.")
    return {"message": f"Task {task_id} status set to pending."}

# --- PLUGIN EXECUTION HISTORY ---

@router.get("/plugin-results", response_model=List[dict])
def get_plugin_execution_history(plugin_name: Optional[str] = None, db: Session = Depends(get_db)):
    executions = task_db.get_plugin_executions(db, plugin_name)
    return [
        {
            "id": e.id,
            "plugin_name": e.plugin_name,
            "input_data": e.input_data,
            "output_data": e.output_data,
            "status": e.status,
            "timestamp": e.timestamp,
            "completed_at": e.completed_at,
            "error_message": e.error_message
        }
        for e in executions
    ]
