# /backend/tests/unit/test_plugin_list.py

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_list_plugins():
    response = client.get("/api/v1/plugins/list")
    assert response.status_code == 200

    data = response.json()["data"]
    assert isinstance(data["plugins"], list)
