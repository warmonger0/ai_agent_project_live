import os
import pytest
from fastapi.testclient import TestClient
from pathlib import Path
from unittest import mock

from backend.app.main import app
from backend.app.routes import logs

client = TestClient(app)

def test_list_logs(tmp_path):
    log_dir = tmp_path / "deployments" / "logs"
    log_dir.mkdir(parents=True)
    log_file = log_dir / "test.log"
    log_file.write_text("test")

    with mock.patch.object(logs, "LOG_DIR", log_dir):
        response = client.get("/api/v1/logs/")
        assert response.status_code == 200
        assert response.json()["ok"] is True
        assert "test.log" in response.json()["data"]

def test_list_logs_missing_dir():
    fake_path = Path("/nonexistent_dir")

    with mock.patch.object(logs, "LOG_DIR", fake_path), \
         mock.patch("os.path.isdir", return_value=False):
        response = client.get("/api/v1/logs/")
        print("[DEBUG]", response.json())  # Help diagnose
        assert response.status_code == 500
        assert "Logs directory not found" in response.json().get("detail", "")

def test_get_log_file_success(tmp_path):
    log_dir = tmp_path / "deployments" / "logs"
    log_dir.mkdir(parents=True)
    log_file = log_dir / "test.log"
    log_file.write_text("hello\n")

    with mock.patch.object(logs, "LOG_DIR", log_dir):
        response = client.get("/api/v1/logs/test.log")
        assert response.status_code == 200
        assert response.text == "hello\n"

def test_get_log_file_not_found():
    fake_path = Path("/missing_dir")

    with mock.patch.object(logs, "LOG_DIR", fake_path), \
         mock.patch("os.path.isfile", return_value=False):
        response = client.get("/api/v1/logs/missing.log")
        assert response.status_code == 404
        error_text = response.json().get("detail", response.json().get("error", ""))
        assert "Log file not found" in error_text
