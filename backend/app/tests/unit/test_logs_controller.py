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
    log_file = log_dir / "example.log"
    log_file.write_text("test")

    with mock.patch.object(logs, "LOG_DIR", log_dir):
        res = client.get("/api/v1/logs/")
        assert res.status_code == 200
        assert res.json()["ok"] is True
        assert "example.log" in res.json()["data"]


def test_list_logs_missing_dir():
    fake_path = Path("/nonexistent_dir")

    with mock.patch.object(logs, "LOG_DIR", fake_path):
        res = client.get("/api/v1/logs/")
        assert res.status_code == 500
        assert "Logs directory not found" in res.json()["detail"]


def test_get_log_file_success(tmp_path):
    log_dir = tmp_path / "deployments" / "logs"
    log_dir.mkdir(parents=True)
    file_path = log_dir / "test
