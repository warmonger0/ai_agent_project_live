import pytest
from app.schemas import (
    TaskRequest,
    TaskResponse,
    TaskStatusResponse,
    TaskSummaryResponse,
)
from pydantic import ValidationError

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

def test_task_summary_response_valid():
    obj = TaskSummaryResponse(task_id=99, description="brief", status="queued")
    assert obj.status == "queued"
