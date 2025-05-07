# backend/tests/unit/test_execution_tracker.py

import pytest
from unittest.mock import patch, MagicMock
from backend.app.services.execution_tracker import store_execution_result


@pytest.fixture
def mock_session():
    """Mock SQLAlchemy session lifecycle."""
    with patch("app.services.execution_tracker.SessionLocal") as mock_session_cls:
        mock_db = MagicMock()
        mock_session_cls.return_value = mock_db
        yield mock_db


@patch("app.services.execution_tracker.PluginExecution")
def test_store_successful_execution(mock_execution_cls, mock_session):
    plugin_name = "echo"
    input_text = "hello"
    result = {"result": "Echo: hello"}
    status = "success"
    source = "manual"

    store_execution_result(plugin_name, input_text, result, status, source)

    # Ensure PluginExecution was created with correct params
    mock_execution_cls.assert_called_once()
    args, kwargs = mock_execution_cls.call_args
    assert kwargs["plugin_name"] == plugin_name
    assert kwargs["input_data"]["input_text"] == input_text
    assert kwargs["output_data"] == result
    assert kwargs["status"] == status

    # Ensure DB add/commit/close were called
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.close.assert_called_once()


@patch("app.services.execution_tracker.PluginExecution", side_effect=Exception("Insert failed"))
def test_store_execution_db_failure(mock_execution_cls, mock_session, caplog):
    plugin_name = "fail"
    input_text = "crash"
    output_data = {"error": "Failure"}
    status = "error"
    source = "test"

    store_execution_result(plugin_name, input_text, output_data, status, source)

    # DB session should be closed even on failure
    mock_session.close.assert_called_once()

    # Should have logged an exception
    assert any("❌ Failed to record plugin" in message for message in caplog.text.splitlines())
