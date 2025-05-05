# /backend/tests/unit/test_plugin_spec.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_plugin_spec():
    response = client.get("/api/v1/plugins/echo/spec")
    assert response.status_code in [200, 404]  # Plugin may or may not exist

    if response.status_code == 200:
        data = response.json()["data"]
        assert "plugin" in data
        assert "input_spec" in data