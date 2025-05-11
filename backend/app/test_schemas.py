from backend.app.schemas import Chat, Project
from datetime import datetime

def test_chat_schema_serialization():
    data = {
        "id": 1,
        "project_id": 1,
        "title": "Schema Test",
        "created_at": datetime.utcnow(),
        "messages": []
    }
    chat = Chat(**data)
    assert chat.title == "Schema Test"
    assert chat.project_id == 1
