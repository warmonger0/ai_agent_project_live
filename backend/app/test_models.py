from backend.app.models import Project, Chat
from backend.app.db.session import SessionLocal
import datetime

def test_project_chat_relationship():
    db = SessionLocal()

    project = Project(name="Model Test", created_at=datetime.datetime.utcnow())
    chat = Chat(project=project, title="Chat Linked", created_at=datetime.datetime.utcnow())

    db.add(project)
    db.add(chat)
    db.commit()
    db.refresh(project)

    assert len(project.chats) == 1
    assert project.chats[0].title == "Chat Linked"

    db.close()
