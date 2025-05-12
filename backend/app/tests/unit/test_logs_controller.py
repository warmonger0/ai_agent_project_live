from fastapi.testclient import TestClient
from backend.app.main import app
from pathlib import Path
import os

client = TestClient(app)

def test_list_logs(tmp_path):
    log_dir = tmp_path / "deployments" / "logs"
    log_dir.mkdir(parents=True)
    log_file = log_dir / "example.log"
    log_file.write_text("test")

    # Patch the LOG_DIR inside the app to point to tmp_path
    original = router.routes[0].endpoint.__globals__["LOG_DIR"]
    router.routes[0].endpoint.__globals__["LOG_DIR"] = log_dir

    try:
        res = client.get("/logs")
        assert res.status_code == 200
        assert "example.log" in res.json()
    finally:
        router.routes[0].endpoint.__globals__["LOG_DIR"] = original

def test_list_logs_missing_dir():
    # Patch to non-existent directory
    router.routes[0].endpoint.__globals__["LOG_DIR"] = Path("/nonexistent_dir")
    res = client.get("/logs")
    assert res.status_code == 500
    assert "Log directory not found" in res.text

def test_get_log_file_success(tmp_path):
    log_dir = tmp_path / "deployments" / "logs"
    log_dir.mkdir(parents=True)
    file_path = log_dir / "test.log"
    file_path.write_text("hello")

    router.routes[1].endpoint.__globals__["LOG_DIR"] = log_dir
    res = client.get(f"/logs/test.log")
    assert res.status_code == 200
    assert res.content == b"hello"

def test_get_log_file_not_found():
    router.routes[1].endpoint.__globals__["LOG_DIR"] = Path("/missing_dir")
    res = client.get("/logs/notfound.log")
    assert res.status_code == 404
    assert "Log file not found" in res.text
