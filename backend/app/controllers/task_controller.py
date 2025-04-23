from fastapi import APIRouter, HTTPException
from backend.app.schemas import TaskRequest, TaskResponse, TaskStatusResponse, TaskSummaryResponse
from backend.app.utils.model_router import route_task_to_model
from backend.app.models import SessionLocal, Task
from typing import List
import requests

router = APIRouter()

@router.post("/task", response_model=TaskResponse)
async def create_task(task: TaskRequest):
    if not task.description:
        raise HTTPException(status_code=400, detail="Task description is required.")

    model_name = route_task_to_model(task.description)
    db = SessionLocal()

    try:
        # Send request to DeepSeek to generate code
        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": model_name,
                "prompt": task.description,
                "stream": False
            },
            timeout=60
        )

        if response.status_code == 200:
            generated = response.json()
            generated_code = generated.get("response", "").strip()
        else:
            raise HTTPException(status_code=500, detail="Model generation failed.")

        # Save task into database
        db_task = Task(
            description=task.description,
            model_used=model_name,
            generated_code=generated_code,
            status="completed"
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)

        return TaskResponse(
            task_id=db_task.id,
            status=db_task.status,
            generated_code=db_task.generated_code
        )

    except requests.RequestException as e:
        print(f"Error communicating with model server: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to model server.")

    finally:
        db.close()

# Make sure /status/all is registered before /status/{task_id}
@router.get("/status/all", response_model=List[TaskStatusResponse])
async def get_all_tasks():
    db = SessionLocal()
    try:
        tasks = db.query(Task).order_by(Task.id).all()
        return [
            TaskStatusResponse(
                task_id=task.id,
                description=task.description,
                model_used=task.model_used,
                generated_code=task.generated_code,
                status=task.status
            ) for task in tasks
        ]
    finally:
        db.close()

@router.get("/status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: int):
    db = SessionLocal()
    try:
        db_task = db.query(Task).filter(Task.id == task_id).first()
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        return TaskStatusResponse(
            task_id=db_task.id,
            description=db_task.description,
            model_used=db_task.model_used,
            generated_code=db_task.generated_code,
            status=db_task.status
        )
    finally:
        db.close()

@router.post("/retry/{task_id}", response_model=TaskResponse)
async def retry_task(task_id: int):
    db = SessionLocal()
    try:
        db_task = db.query(Task).filter(Task.id == task_id).first()
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Retry task through DeepSeek again
        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": db_task.model_used,
                "prompt": db_task.description,
                "stream": False
            },
            timeout=60
        )

        if response.status_code == 200:
            generated = response.json()
            generated_code = generated.get("response", "").strip()
        else:
            raise HTTPException(status_code=500, detail="Model generation failed during retry.")

        # Update task
        db_task.generated_code = generated_code
        db_task.status = "completed"
        db.commit()
        db.refresh(db_task)

        return TaskResponse(
            task_id=db_task.id,
            status=db_task.status,
            generated_code=db_task.generated_code
        )

    except requests.RequestException as e:
        print(f"Error reconnecting to DeepSeek: {e}")
        raise HTTPException(status_code=500, detail="Failed to retry generation.")

    finally:
        db.close()
