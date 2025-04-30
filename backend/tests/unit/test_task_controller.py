from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.controllers.task_controller import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
client = TestClient(app)

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_create_task(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    mock_task = MagicMock(id=1, status="pending", created_at="now", model_used="gpt", description="test")
    mock_db_module.create_task.return_value = mock_task
    mock_get_db.return_value = mock_db

    res = client.post("/tasks", json={"description": "test", "model_used": "gpt"})
    assert res.status_code == 200
    assert res.json()["status"] == "pending"

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_get_all_tasks(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    mock_task = MagicMock(id=1, description="d", model_used="m", status="pending", created_at="now", completed_at=None)
    mock_db_module.get_all_tasks.return_value = [mock_task]
    mock_get_db.return_value = mock_db

    res = client.get("/tasks")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_get_task_not_found(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    mock_db_module.get_task.return_value = None
    mock_get_db.return_value = mock_db

    res = client.get("/tasks/999")
    assert res.status_code == 404

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_update_task_success(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    mock_task = MagicMock(id=1, status="success", error_message=None, completed_at="now")
    mock_db_module.update_task_status.return_value = mock_task
    mock_get_db.return_value = mock_db

    res = client.patch("/tasks/1?status=success")
    assert res.status_code == 200
    assert res.json()["status"] == "success"

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_retry_task_success(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    task = MagicMock(status="error", id=1)
    mock_db_module.get_task.return_value = task
    mock_db_module.update_task_status.return_value = task
    mock_get_db.return_value = mock_db

    res = client.post("/retry/1")
    assert res.status_code == 200
    assert "status set to pending" in res.json()["message"]

@patch("app.controllers.task_controller.get_db")
@patch("app.controllers.task_controller.task_db")
def test_plugin_results_history(mock_db_module, mock_get_db):
    mock_db = MagicMock()
    fake_exec = MagicMock(
        id=1, plugin_name="echo", input_data={}, output_data={}, status="success", timestamp="now", completed_at=None, error_message=None
    )
    mock_db_module.get_plugin_executions.return_value = [fake_exec]
    mock_get_db.return_value = mock_db

    res = client.get("/plugin-results")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_get_status_list():
    res = client.get("/tasks/status/all")
    assert res.status_code == 200
    assert "success" in res.json()

def test_get_status_alias():
    res = client.get("/status/all")
    assert res.status_code == 200
    assert res.json() == ["pending", "running", "success", "error"]
