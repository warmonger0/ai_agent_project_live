# File: backend/app/tests/unit/test_crud.py

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.db.session import Base
from backend.app import crud

# Use an isolated in-memory SQLite database for unit testing
DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db():
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_get_chats_for_project(db):
    project = crud.create_project(db, name="Test Fetch Chats")
    chat1 = crud.create_chat(db, project_id=project.id, title="First Chat")
    chat2 = crud.create_chat(db, project_id=project.id, title="Second Chat")

    chats = crud.get_chats_for_project(db, project_id=project.id)

    assert len(chats) == 2
    titles = [chat.title for chat in chats]
    assert "First Chat" in titles
    assert "Second Chat" in titles
