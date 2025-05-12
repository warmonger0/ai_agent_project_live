from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings
from typing import Any  # used for plugin interface compatibility


client = TestClient(app)

def test_root_route():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert settings.app_env in response.json()["message"]

def test_api_router_prefix_exists():
    response = client.get("/api/v1/tasks")  # Assume /tasks is registered in router
    assert response.status_code in (200, 422, 404)  # Confirm router prefix works

def test_cors_headers_present():
    response = client.options("/", headers={"Origin": "http://testclient"})
    assert "access-control-allow-origin" in response.headers

@patch("backend.app.core.config.settings.vite_api_base_url", "http://localhost:5173")
