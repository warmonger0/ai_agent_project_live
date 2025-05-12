from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.app.api.v1 import api_router

app = FastAPI()
app.include_router(api_router, prefix="/api/v1")
client = TestClient(app)

def test_health_check_model_ok(monkeypatch):
    monkeypatch.setattr(
        "backend.app.controllers.health_controller.check_ollama_health",
        lambda: True
    )
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["backend"] == "OK"
    assert data["model"] == "OK"

def test_health_check_model_fail(monkeypatch):
    monkeypatch.setattr(
        "backend.app.controllers.health_controller.check_ollama_health",
        lambda: False
    )
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["backend"] == "OK"
    assert data["model"] == "FAIL"
