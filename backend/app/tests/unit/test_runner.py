import pytest
from unittest.mock import patch
from backend.app.services.plugin_runner import run_plugin_job


@patch("backend.app.services.plugin_runner.store_execution_result")
@patch("backend.app.services.plugin_runner.run_plugin")
def test_run_plugin_job_success(mock_run_plugin, mock_store_result):
    mock_run_plugin.return_value = "mock output"

    result = run_plugin_job("echo", "hello", source="test")

    assert result == {"result": "mock output"}
    mock_run_plugin.assert_called_once_with("echo", "hello")
    mock_store_result.assert_called_once()
    args, kwargs = mock_store_result.call_args
    assert kwargs["status"] == "success"


@patch("backend.app.services.plugin_runner.store_execution_result")
@patch("backend.app.services.plugin_runner.run_plugin")
def test_run_plugin_job_failure(mock_run_plugin, mock_store_result):
    mock_run_plugin.side_effect = Exception("fail test")

    result = run_plugin_job("echo", "oops", source="test")

    assert result == {"error": "fail test"}
    mock_run_plugin.assert_called_once_with("echo", "oops")
    mock_store_result.assert_called_once()
    args, kwargs = mock_store_result.call_args
    assert kwargs["status"] == "error"
