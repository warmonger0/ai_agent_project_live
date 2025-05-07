import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models import Base
from backend.app.main import app
from backend.app.db.session import get_db

# --- Setup disk-based SQLite test DB ---
DATABASE_URL = "sqlite:///./test_database.db"  # ✅ Persistent during tests

# 1. Create engine and session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(bind=engine)

# 2. Override DB dependency for FastAPI
def override_get_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. Apply override
app.dependency_overrides[get_db] = override_get_db

# 4. Initialize test client
client = TestClient(app)

# --- TESTS ---

def test_create_task():
    payload = {"description": "Test Task", "model_used": "deepseek"}
    response = client.post("/tasks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert "created_at" in data


def test_get_all_tasks():
    client.post("/tasks", json={"description": "Seed", "model_used": "any"})
    response = client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_task_by_id():
    create_res = client.post("/tasks", json={"description": "Fetch Me", "model_used": "claude"})
    task_id = create_res.json()["id"]

    fetch_res = client.get(f"/tasks/{task_id}")
    assert fetch_res.status_code == 200
    data = fetch_res.json()
    assert data["description"] == "Fetch Me"


def test_patch_task_status():
    post = client.post("/tasks", json={"description": "Patch Me", "model_used": "test"})
    task_id = post.json()["id"]

    patch = client.patch(f"/tasks/{task_id}?status=success")
    assert patch.status_code == 200
    data = patch.json()
    assert data["status"] == "success"
    assert data["completed_at"] is not None


def test_retry_task():
    post = client.post("/tasks", json={"description": "Retry Me", "model_used": "test"})
    task_id = post.json()["id"]

    client.patch(f"/tasks/{task_id}?status=error&error_message=boom")

    retry = client.post(f"/retry/{task_id}")
    assert retry.status_code == 200
    assert "pending" in retry.json()["message"]


def test_plugin_results_empty():
    response = client.get("/plugin-results")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# --- Optional Cleanup After All Tests ---
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    yield
    if os.path.exists("./test_database.db"):
        os.remove("./test_database.db")
