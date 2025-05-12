import pytest
from datetime import datetime
from pydantic import ValidationError

from backend.app.schemas import (
    TaskRequest,
    TaskResponse,
    TaskStatusResponse,
    TaskSummaryResponse,
    Chat,
    Project
)

def test_task_request_valid():
    obj = TaskRequest(description="summarize")
    assert obj.description == "summarize"

def test_task_response_valid():
    obj = TaskResponse(task_id=1, status="success", generated_code="print('Hello')")
    assert obj.task_id == 1
    assert obj.status == "success"
    assert "print" in obj.generated_code

def test_task_status_response_valid():
    obj = TaskStatusResponse(
        task_id=42,
        description="analyze trends",
        model_used="gpt-4",
        generated_code="bar_chart()",
        status="complete"
    )
    assert obj.model_used == "gpt-4"
    assert obj.status == "complete"

def test_task_summary_response_valid():
    obj = TaskSummaryResponse(task_id=99, description="brief", status="queued")
    assert obj.status == "queued"
    assert obj.description == "brief"

def test_chat_schema_fields():
    data = {
        "id": 1,
        "project_id": 1,
        "title": "Schema Test",
        "created_at": datetime.utcnow(),
        "messages": []
    }
    chat = Chat(**data)
    assert chat.id == 1
    assert chat.project_id == 1
    assert chat.title == "Schema Test"
    assert isinstance(chat.created_at, datetime)
    assert isinstance(chat.messages, list)

def test_project_schema_fields():
    now = datetime.utcnow()
    project = Project(
        id=10,
        name="MyProj",
        understanding="Deep",
        created_at=now,
        chats=[]
    )
    assert project.id == 10
    assert project.name == "MyProj"
    assert project.understanding == "Deep"
    assert project.created_at == now
    assert isinstance(project.chats, list)
