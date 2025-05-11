import pytest
from unittest.mock import MagicMock, patch
from backend.app.services.execution_tracker import store_execution_result


def test_store_successful_execution():
    mock_plugin_execution = MagicMock()
    mock_session = MagicMock()

    with patch("backend.app.services.execution_tracker.SessionLocal", return_value=mock_session), \
         patch("backend.app.services.execution_tracker.PluginExecution", return_value=mock_plugin_execution):

        store_execution_result(
            "echo",                    # plugin_name
            "hi",                      # input_text
            {"response": "hi back"},   # output_data
            "success",                 # status
            "test"                     # source
        )

        mock_session.add.assert_called_once_with(mock_plugin_execution)
        mock_session.commit.assert_called_once()
        mock_session.close.assert_called_once()


def test_store_execution_db_failure():
    mock_session = MagicMock()
    mock_session.add.side_effect = Exception("DB write failed")

    with patch("backend.app.services.execution_tracker.SessionLocal", return_value=mock_session):
        store_execution_result(
            "echo",
            "fail",
            None,
            "failed",
            "test"
        )

        mock_session.close.assert_called_once()
