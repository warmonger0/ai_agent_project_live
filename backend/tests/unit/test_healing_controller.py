from fastapi.testclient import TestClient
from unittest.mock import patch, mock_open
from app.controllers.healing_controller import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
client = TestClient(app)

@patch("os.path.exists", return_value=True)
@patch("builtins.open", new_callable=mock_open, read_data="line1\nline2\nline3\n")
def test_get_healing_status_success(mock_file, mock_exists):
    res = client.get("/healing/status")
    assert res.status_code == 200
    assert res.json() == {"logs": ["line1", "line2", "line3"]}

@patch("os.path.exists", return_value=False)
def test_get_healing_status_missing_log(mock_exists):
    res = client.get("/healing/status")
    assert res.status_code == 404
    assert "Healing log not found" in res.text

@patch("os.path.exists", return_value=True)
@patch("builtins.open", side_effect=OSError("read failure"))
def test_get_healing_status_read_failure(mock_file, mock_exists):
    res = client.get("/healing/status")
    assert res.status_code == 500
    assert "read failure" in res.text
