from unittest.mock import MagicMock, patch
from backend.app.plugins import logger


def test_store_plugin_execution():
    mock_db = MagicMock()

    with patch("backend.app.plugins.logger.SessionLocal", return_value=mock_db):
        logger.store_plugin_execution(
            plugin_name="echo",
            input_data={"text": "hello"},
            output_data={"response": "hello"},
            status="success"
        )

        # Verify session operations
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.close.assert_called_once()

        # Optional: verify PluginExecution structure
        args, _ = mock_db.add.call_args
        execution = args[0]
        assert execution.plugin_name == "echo"
        assert execution.input_data["text"] == "hello"
        assert execution.output_data["response"] == "hello"
        assert execution.status == "success"
