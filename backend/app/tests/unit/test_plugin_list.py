import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_list_plugins():
    response = client.get("/api/v1/plugins/list")
    assert response.status_code == 200, f"Expected 200, got {response.status_code} with body: {response.text}"

    json_data = response.json()
    assert "data" in json_data, "Missing 'data' key in response"
    assert "plugins" in json_data["data"], "Missing 'plugins' key in data"
    assert isinstance(json_data["data"]["plugins"], list), "'plugins' is not a list"
