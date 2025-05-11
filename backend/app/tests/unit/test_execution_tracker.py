import pytest
from unittest.mock import MagicMock, patch
from backend.app.services.execution_tracker import store_execution_result


def test_store_successful_execution():
    mock_plugin_execution = MagicMock()
    mock_session = MagicMock()

    with patch("backend.app.services.execution_tracker.SessionLocal", return_value=mock_session), \
         patch("backend.app.services.execution_tracker.PluginExecution", return_value=mock_plugin_execution):

        store_execution_result(
            plugin_name="echo",
            input_data={"message": "hi"},
            output_data={"response": "hi back"},
            status="success",
            error_message=None
        )

        # PluginExecution was instantiated
        assert mock_plugin_execution.plugin_name == "echo"
        mock_session.add.assert_called_once_with(mock_plugin_execution)
        mock_session.commit.assert_called_once()
        mock_session.close.assert_called_once()


def test_store_execution_db_failure():
    mock_session = MagicMock()
    mock_session.add.side_effect = Exception("DB write failed")

    with patch("backend.app.services.execution_tracker.SessionLocal", return_value=mock_session):
        store_execution_result(
            plugin_name="echo",
            input_data={"message": "fail"},
            output_data=None,
            status="failed",
            error_message="DB write failed"
        )

        mock_session.close.assert_called_once()
