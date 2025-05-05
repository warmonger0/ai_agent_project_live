import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models import Base, Task, PluginExecution, MemoryLedger
from datetime import datetime

# Use in-memory SQLite DB for test isolation
DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def session():
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_create_task(session):
    task = Task(
        description="Test task run",
        model_used="deepseek-v2"
    )
    session.add(task)
    session.commit()
    result = session.query(Task).first()
    assert result.description == "Test task run"
    assert result.status == "pending"
    assert result.created_at is not None
    assert result.completed_at is None


def test_create_plugin_execution(session):
    plugin = PluginExecution(
        plugin_name="echo_plugin",
        input_data={"text": "hello world"}
    )
    session.add(plugin)
    session.commit()
    result = session.query(PluginExecution).first()
    assert result.plugin_name == "echo_plugin"
    assert result.status == "pending"
    assert result.input_data["text"] == "hello world"
    assert result.completed_at is None


def test_create_memory_ledger(session):
    entry = MemoryLedger(
        context_type="task",
        related_id=1,
        content="This is a memory entry."
    )
    session.add(entry)
    session.commit()
    result = session.query(MemoryLedger).first()
    assert result.context_type == "task"
    assert result.related_id == 1
    assert result.content == "This is a memory entry."
    assert isinstance(result.timestamp, datetime)
