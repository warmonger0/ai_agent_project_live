# backend/tests/unit/test_plugin_spec.py

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_plugin_spec():
    response = client.get("/api/v1/plugins/echo/spec")
    
    # Assert success
    assert response.status_code == 200

    json_data = response.json()

    # Top-level structure
    assert "ok" in json_data
    assert json_data["ok"] is True
    assert "data" in json_data

    # Inner data structure
    data = json_data["data"]
    assert "plugin" in data
    assert data["plugin"] == "echo"
    assert "input_spec" in data
    assert isinstance(data["input_spec"], list)
