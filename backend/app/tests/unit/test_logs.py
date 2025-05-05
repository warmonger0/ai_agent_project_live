import os
import pytest
from fastapi.testclient import TestClient
from fastapi import status
from unittest import mock

from app.routes.logs import router, LOG_DIR
from fastapi import FastAPI

app = FastAPI()
app.include_router(router, prefix="/api/v1/logs")


@pytest.fixture
def client():
    return TestClient(app)


def test_list_logs_success(client):
    mock_files = ["app.log", "error.log", "readme.txt"]

    with mock.patch("os.path.isdir", return_value=True), \
         mock.patch("os.listdir", return_value=mock_files), \
         mock.patch("os.path.isfile", return_value=True):
        response = client.get("/api/v1/logs/")
        assert response.status_code == 200
        assert response.json() == {"ok": True, "data": ["app.log", "error.log"]}


def test_list_logs_directory_missing(client):
    with mock.patch("os.path.isdir", return_value=False):
        response = client.get("/api/v1/logs/")
        assert response.status_code == 500
        assert "Logs directory not found" in response.json()["detail"]


def test_get_log_file_success(client, tmp_path):
    test_file = tmp_path / "sample.log"
    test_file.write_text("This is a test log entry")

    with mock.patch("app.routes.logs.LOG_DIR", tmp_path):
        response = client.get("/api/v1/logs/sample.log")
        assert response.status_code == 200
        assert response.text == "This is a test log entry"


def test_get_log_file_missing(client):
    with mock.patch("os.path.isfile", return_value=False):
        response = client.get("/api/v1/logs/missing.log")
        assert response.status_code == 404
        assert "Log file not found" in response.json()["detail"]


def test_get_log_file_invalid_extension(client):
    response = client.get("/api/v1/logs/hack.exe")
    assert response.status_code == 400
    assert response.json()["detail"] == "Only .log files allowed."


def test_get_log_file_read_error(client, tmp_path):
    bad_file = tmp_path / "crash.log"
    bad_file.write_text("test")

    with mock.patch("app.routes.logs.LOG_DIR", tmp_path), \
         mock.patch("builtins.open", side_effect=PermissionError("Denied")):
        response = client.get("/api/v1/logs/crash.log")
        assert response.status_code == 500
        assert "Error reading log" in response.json()["detail"]
