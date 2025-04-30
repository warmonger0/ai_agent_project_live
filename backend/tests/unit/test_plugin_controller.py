from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.controllers.plugin_controller import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)

@patch("app.controllers.plugin_controller.discover_plugins")
def test_list_plugins(mock_discover):
    mock_discover.return_value = [{"name": "echo"}]
    res = client.get("/plugins")
    assert res.status_code == 200
    assert res.json()["data"]["plugins"][0]["name"] == "echo"

@patch("app.controllers.plugin_controller.load_plugin_class")
def test_get_plugin_spec(mock_loader):
    mock_plugin = MagicMock()
    mock_plugin.input_spec = [{"name": "input_text", "type": "string"}]
    mock_loader.return_value = mock_plugin

    res = client.get("/plugins/echo/spec")
    assert res.status_code == 200
    assert "plugin" in res.json()["data"]

@patch("app.controllers.plugin_controller.run_plugin_job")
@patch("app.controllers.plugin_controller.add_memory_entry")
@patch("app.controllers.plugin_controller.get_db")
def test_execute_plugin_success(mock_get_db, mock_add_memory, mock_run_job):
    mock_run_job.return_value = {"result": "Echo: hi"}
    mock_get_db.return_value = MagicMock()

    res = client.post("/plugins/run/echo", json={"input_text": "hi"})
    assert res.status_code == 200
    assert "result" in res.json()["data"]

@patch("app.controllers.plugin_controller.get_db")
def test_plugin_history(mock_get_db):
    fake_exec = MagicMock()
    fake_exec.id = 1
    fake_exec.plugin_name = "echo"
    fake_exec.input_data = {"input_text": "hi"}
    fake_exec.output_data = {"result": "Echo: hi"}
    fake_exec.status = "success"
    fake_exec.timestamp = "2025-04-30T12:00:00"

    query = MagicMock()
    query.order_by.return_value.limit.return_value.all.return_value = [fake_exec]

    db = MagicMock()
    db.query.return_value = query
    mock_get_db.return_value = db

    res = client.get("/plugin/history")
    assert res.status_code == 200
    assert isinstance(res.json()["data"], list)
