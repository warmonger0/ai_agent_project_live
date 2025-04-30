import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from fastapi.testclient import TestClient
from app.main import app
import app.plugins.loader as loader  # 👈 needed for monkeypatch

client = TestClient(app)

def test_plugin_spec_success():
    response = client.get("/api/v1/plugins/echo/spec")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert data["data"]["plugin"] == "echo"
    assert isinstance(data["data"]["input_spec"], list)
    assert any(field["name"] == "input_text" for field in data["data"]["input_spec"])

def test_plugin_spec_not_found():
    response = client.get("/api/v1/plugins/unknown/spec")
    assert response.status_code == 404
    body = response.json()
    assert "error" in body
    assert "not found" in body["error"].lower()

def test_plugin_spec_missing_input_spec(monkeypatch):
    class NoSpecPlugin:
        def run(self, input_text: str):
            return input_text

    def fake_loader(name):
        return NoSpecPlugin

    import app.controllers.plugin_controller as plugin_controller
    monkeypatch.setattr(plugin_controller, "load_plugin_class", fake_loader)

    response = client.get("/api/v1/plugins/anything/spec")
    assert response.status_code == 500
    body = response.json()
    assert "error" in body
    assert "input_spec not defined" in body["error"]
