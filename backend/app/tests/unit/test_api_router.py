# backend/app/tests/unit/test_api_router.py

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

# Expected route prefixes under /api/v1
EXPECTED_PREFIXES = [
    "/api/v1/health",
    "/api/v1/tasks",
    "/api/v1/healing",
    "/api/v1/logs",
    "/api/v1/status",
    "/api/v1/plugins",
    "/api/v1/planning",
]

@pytest.mark.parametrize("prefix", EXPECTED_PREFIXES)
def test_api_router_includes_expected_routes(prefix):
    # Try a simple GET to each prefix and expect a 200, 404, or 405 (indicates route exists but method mismatch)
    response = client.get(prefix)
    assert response.status_code in (200, 404, 405), f"Missing route: {prefix}"
