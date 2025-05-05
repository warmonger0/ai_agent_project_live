from unittest.mock import patch, MagicMock
from app.utils.monitor import check_backend_health

@patch("app.utils.monitor.requests.get")
def test_check_backend_health_success(mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"status": "ok"}
    mock_get.return_value = mock_resp

    ok, payload = check_backend_health("http://mock")
    assert ok is True
    assert payload["status"] == "ok"

@patch("app.utils.monitor.requests.get")
def test_check_backend_health_error_status(mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 500
    mock_resp.json.return_value = {"error": "Internal Server Error"}
    mock_get.return_value = mock_resp

    ok, payload = check_backend_health("http://mock")
    assert ok is False
    assert payload["error"] == "Internal Server Error"

@patch("app.utils.monitor.requests.get")
def test_check_backend_health_connection_fail(mock_get):
    mock_get.side_effect = Exception("Connection error")

    ok, payload = check_backend_health("http://mock")
    assert ok is False
    assert payload is None
