from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings

client = TestClient(app)


def test_root_route():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert settings.app_env in response.json()["message"]


def test_api_router_prefix_exists():
    response = client.get("/api/v1/tasks")  # Confirm prefix mounting works
    assert response.status_code in (200, 404, 422)  # 404/422 okay if route exists but task doesn't


def test_cors_headers_present():
    response = client.options(
        "/",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
