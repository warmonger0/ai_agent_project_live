# Add to tests/unit/test_schemas.py

from backend.app.schemas import Chat, Project
from datetime import datetime

def test_chat_schema_fields():
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
    assert isinstance(chat.created_at, datetime)
    assert isinstance(chat.messages, list)

def test_project_schema_basic():
    project = Project(id=10, name="MyProj", understanding="Deep", created_at=datetime.utcnow())
    assert project.id == 10
    assert project.name == "MyProj"
