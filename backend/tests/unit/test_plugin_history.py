# /backend/tests/unit/test_plugin_history.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_plugin_history():
    response = client.get("/plugin/history")
    assert response.status_code == 200

    history = response.json()
    assert isinstance(history, list)

    if history:  # if any executions exist
        sample = history[0]
        assert "plugin_name" in sample
        assert "input_data" in sample
        assert "output_data" in sample
        assert "status" in sample
        assert "timestamp" in sample
