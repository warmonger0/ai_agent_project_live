from fastapi.testclient import TestClient
from unittest.mock import patch
from fastapi import FastAPI
from backend.app.controllers.health_controller import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

@patch("backend.app.controllers.health_controller.check_ollama_health", return_value=True)
def test_health_check_model_ok(mock_health):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["backend"] == "OK"
    assert data["model"] == "OK"

@patch("backend.app.controllers.health_controller.check_ollama_health", return_value=False)
def test_health_check_model_fail(mock_health):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["backend"] == "OK"
    assert data["model"] == "FAIL"
