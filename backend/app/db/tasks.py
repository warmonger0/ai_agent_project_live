from sqlalchemy.orm import Session
from app.models import Task, PluginExecution, MemoryLedger
from datetime import datetime
from typing import Optional


# --- Task Operations ---

def create_task(db: Session, description: str, model_used: str) -> Task:
    task = Task(description=description, model_used=model_used)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def get_all_tasks(db: Session) -> list[Task]:
    return db.query(Task).order_by(Task.created_at.desc()).all()


def update_task_status(
    db: Session,
    task_id: int,
    status: str,
    error_message: Optional[str] = None,
    completed: bool = False
) -> Optional[Task]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None

    task.status = status
    if error_message:
        task.error_message = error_message
    if completed:
        task.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(task)
    return task


# --- PluginExecution Operations ---

def create_plugin_execution(db: Session, plugin_name: str, input_data: dict) -> PluginExecution:
    plugin_exec = PluginExecution(plugin_name=plugin_name, input_data=input_data)
    db.add(plugin_exec)
    db.commit()
    db.refresh(plugin_exec)
    return plugin_exec


def get_plugin_executions(db: Session, plugin_name: Optional[str] = None) -> list[PluginExecution]:
    query = db.query(PluginExecution)
    if plugin_name:
        query = query.filter(PluginExecution.plugin_name == plugin_name)
    return query.order_by(PluginExecution.timestamp.desc()).all()


def update_plugin_execution(
    db: Session,
    execution_id: int,
    status: str,
    output_data: Optional[dict] = None,
    error_message: Optional[str] = None,
) -> Optional[PluginExecution]:
    execution = db.query(PluginExecution).filter(PluginExecution.id == execution_id).first()
    if not execution:
        return None

    execution.status = status
    if output_data:
        execution.output_data = output_data
    if error_message:
        execution.error_message = error_message
    execution.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(execution)
    return execution


# --- Memory Ledger (Placeholder Write) ---

def add_memory_entry(db: Session, context_type: str, related_id: Optional[int], content: str) -> MemoryLedger:
    entry = MemoryLedger(context_type=context_type, related_id=related_id, content=content)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
