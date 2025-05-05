from unittest.mock import patch, MagicMock
from backend.app.utils.ollama_healthcheck import check_ollama_health
import requests

@patch("app.utils.ollama_healthcheck.requests.get")
def test_healthcheck_model_available(mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"models": [{"name": "deepseek-coder:latest"}]}
    mock_get.return_value = mock_resp

    result = check_ollama_health()
    assert result is True

@patch("app.utils.ollama_healthcheck.requests.get")
def test_healthcheck_model_missing(mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"models": [{"name": "other-model"}]}
    mock_get.return_value = mock_resp

    result = check_ollama_health()
    assert result is False

@patch("app.utils.ollama_healthcheck.requests.get")
def test_healthcheck_connection_error(mock_get):
    mock_get.side_effect = requests.RequestException("Connection refused")
    result = check_ollama_health()
    assert result is False
