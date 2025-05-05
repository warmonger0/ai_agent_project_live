# /backend/tests/unit/test_plugin_history.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_plugin_history():
    response = client.get("/api/v1/plugins/history")
    assert response.status_code == 200

    history = response.json()["data"]
    assert isinstance(history, list)

    if history:
        sample = history[0]
        assert "plugin_name" in sample
        assert "input_data" in sample
        assert "output_data" in sample
        assert "status" in sample
        assert "timestamp" in sample
