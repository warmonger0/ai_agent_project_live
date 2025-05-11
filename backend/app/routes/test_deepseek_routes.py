import uuid
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_deepseek_chat_nonstreaming():
    project_name = f"DeepSeekProject_{uuid.uuid4()}"
    res_project = client.post("/api/v1/chat/projects/", json={"name": project_name})
    project_id = res_project.json()["id"]

    res_chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Chat for DeepSeek"})
    chat_id = res_chat.json()["id"]

    res = client.post("/api/v1/chat", json={
        "chat_id": chat_id,
        "messages": [{"role": "user", "content": "What is 2 + 2?"}],
        "stream": False
    })

    assert res.status_code == 200
    data = res.json()
    assert "choices" in data
    assert data["choices"][0]["message"]["role"] == "assistant"
