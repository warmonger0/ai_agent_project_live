from backend.app import crud, models
from backend.app.db.session import SessionLocal
import datetime

def test_get_chats_for_project():
    db = SessionLocal()

    project = crud.create_project(db, name="Test Fetch Chats")
    chat1 = crud.create_chat(db, project_id=project.id, title="First Chat")
    chat2 = crud.create_chat(db, project_id=project.id, title="Second Chat")

    chats = crud.get_chats_for_project(db, project_id=project.id)
    assert len(chats) == 2
    titles = [chat.title for chat in chats]
    assert "First Chat" in titles
    assert "Second Chat" in titles

    db.close()
