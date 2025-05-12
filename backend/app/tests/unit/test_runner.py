import pytest
from unittest.mock import patch, MagicMock
from backend.app.plugins.runner import run_plugin_job


@patch("backend.app.plugins.runner.SessionLocal")
@patch("backend.app.plugins.runner.run_plugin")
def test_run_plugin_job_success(mock_run_plugin, mock_session):
    mock_run_plugin.return_value = {"result": "ok"}
    mock_db = MagicMock()
    mock_session.return_value = mock_db

    result = run_plugin_job("echo", "hello", source="test")

    assert result == {"result": "ok"}
    mock_run_plugin.assert_called_once_with("echo", "hello")
    assert mock_db.add.called
    assert mock_db.commit.called
    mock_db.close.assert_called_once()


@patch("backend.app.plugins.runner.SessionLocal")
@patch("backend.app.plugins.runner.run_plugin")
def test_run_plugin_job_failure(mock_run_plugin, mock_session):
    mock_run_plugin.side_effect = Exception("fail")
    mock_db = MagicMock()
    mock_session.return_value = mock_db

    result = run_plugin_job("echo", "oops", source="test")

    assert "error" in result
    assert "fail" in result["error"]
    assert mock_db.add.called
    assert mock_db.commit.called
    mock_db.close.assert_called_once()
