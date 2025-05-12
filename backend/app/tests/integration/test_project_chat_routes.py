import uuid
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_create_project_and_chat():
    project_name = f"TestProject_{uuid.uuid4()}"
    res_project = client.post("/api/v1/chat/projects/", json={"name": project_name})
    assert res_project.status_code == 200
    project_id = res_project.json()["id"]

    res_chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Test Chat"})
    assert res_chat.status_code == 200
    chat_id = res_chat.json()["id"]

    res_get = client.get(f"/api/v1/chat/projects/{project_id}/chats/")
    assert res_get.status_code == 200
    assert any(c["id"] == chat_id for c in res_get.json())

def test_create_message_and_response():
    project_name = f"MessageProject_{uuid.uuid4()}"
    res_project = client.post("/api/v1/chat/projects/", json={"name": project_name})
    project_id = res_project.json()["id"]

    res_chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Chat for Msgs"})
    chat_id = res_chat.json()["id"]

    res_msg = client.post(f"/api/v1/chat/chats/{chat_id}/messages/", json={
        "role": "user",
        "content": "Hello DeepSeek"
    })
    assert res_msg.status_code == 200
    assert res_msg.json()["role"] == "assistant"
