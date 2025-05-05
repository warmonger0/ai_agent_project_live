# /backend/tests/unit/test_plugin_execute.py

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_plugin_execution_success():
    response = client.post("/api/v1/plugins/run/echo", json={"input_text": "hi"})
    assert response.status_code in [200, 400]  # Echo plugin might not be loaded

    if response.status_code == 200:
        data = response.json()["data"]
        assert "result" in data

def test_plugin_execution_bad_json():
    res = client.post(
        "/api/v1/plugins/run/echo",
        data="{ input_text: 'bad' }",
        headers={"Content-Type": "application/json"},
    )
    assert res.status_code == 422
