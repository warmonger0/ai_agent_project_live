import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base
from app.db.tasks import (
    create_task,
    get_task,
    update_task_status,
    create_plugin_execution,
    get_plugin_executions,
    update_plugin_execution,
    add_memory_entry,
)

# 🧪 Use in-memory SQLite database for isolated testing
DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Task Tests ---

def test_create_task(db_session):
    task = create_task(db_session, "Test task", "deepseek-v2")
    assert task.id is not None
    assert task.status == "pending"
    assert task.description == "Test task"

def test_get_task(db_session):
    task = create_task(db_session, "Retrieve task", "claude")
    fetched = get_task(db_session, task.id)
    assert fetched.id == task.id

def test_update_task_status(db_session):
    task = create_task(db_session, "Needs update", "deepseek")
    updated = update_task_status(db_session, task.id, "success", completed=True)
    assert updated.status == "success"
    assert updated.completed_at is not None

# --- Plugin Execution Tests ---

def test_create_plugin_execution(db_session):
    exec = create_plugin_execution(db_session, "echo_plugin", {"msg": "hi"})
    assert exec.id is not None
    assert exec.status == "pending"
    assert exec.input_data["msg"] == "hi"

def test_get_plugin_executions(db_session):
    create_plugin_execution(db_session, "echo_plugin", {"x": 1})
    create_plugin_execution(db_session, "math_plugin", {"y": 2})
    all_execs = get_plugin_executions(db_session)
    echo_only = get_plugin_executions(db_session, plugin_name="echo_plugin")
    assert len(all_execs) >= 2
    assert all(x.plugin_name == "echo_plugin" for x in echo_only if x.plugin_name == "echo_plugin")

def test_update_plugin_execution(db_session):
    exec = create_plugin_execution(db_session, "echo_plugin", {"text": "go"})
    updated = update_plugin_execution(db_session, exec.id, "success", output_data={"out": "go"})
    assert updated.status == "success"
    assert updated.output_data["out"] == "go"
    assert updated.completed_at is not None

# --- Memory Ledger Tests ---

def test_add_memory_entry(db_session):
    entry = add_memory_entry(db_session, "task", related_id=5, content="Test note")
    assert entry.id is not None
    assert entry.content == "Test note"
    assert entry.context_type == "task"
