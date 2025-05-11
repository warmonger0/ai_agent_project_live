from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_create_and_fetch_chats():
    # Create project
    project = client.post("/api/v1/chat/projects/", json={"name": "TestProject"})
    assert project.status_code == 200
    project_id = project.json()["id"]

    # Create chat
    chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Test Chat"})
    assert chat.status_code == 200
    chat_id = chat.json()["id"]

    # Fetch all chats
    res = client.get(f"/api/v1/chat/projects/{project_id}/chats/")
    assert res.status_code == 200
    chats = res.json()
    assert any(c["id"] == chat_id for c in chats)
