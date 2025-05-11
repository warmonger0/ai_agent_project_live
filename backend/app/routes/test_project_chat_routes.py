from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_create_project_and_chat():
    # Create project
    res_project = client.post("/api/v1/chat/projects/", json={"name": "TestProject"})
    assert res_project.status_code == 200
    project_id = res_project.json()["id"]

    # Create chat
    res_chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Test Chat"})
    assert res_chat.status_code == 200
    chat_id = res_chat.json()["id"]
    assert res_chat.json()["project_id"] == project_id

    # Get chats for project
    res_get = client.get(f"/api/v1/chat/projects/{project_id}/chats/")
    assert res_get.status_code == 200
    chat_ids = [c["id"] for c in res_get.json()]
    assert chat_id in chat_ids

def test_create_message_and_response():
    # Create project and chat
    res_project = client.post("/api/v1/chat/projects/", json={"name": "MessageProject"})
    project_id = res_project.json()["id"]
    res_chat = client.post_
