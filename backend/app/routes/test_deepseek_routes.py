from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_deepseek_chat_nonstreaming():
    # Create project and chat
    res_project = client.post("/api/v1/chat/projects/", json={"name": "DeepSeekProject"})
    project_id = res_project.json()["id"]
    res_chat = client.post(f"/api/v1/chat/projects/{project_id}/chats/", json={"title": "Chat for DeepSeek"})
    chat_id = res_chat.json()["id"]

    # Send message to DeepSeek (non-streaming)
    res = client.post("/api/v1/chat", json={
        "chat_id": chat_id,
        "messages": [{"role": "user", "content": "What is 2 + 2?"}],
        "stream": False
    })

    assert res.status_code == 200
    data = res.json()
    assert "choices" in data
    assert data["choices"][0]["message"]["role"] == "assistant"
    assert isinstance(data["choices"][0]["message"]["content"], str)
