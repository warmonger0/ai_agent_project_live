from unittest.mock import patch, MagicMock
from app.plugins.logger import store_plugin_execution

@patch("app.plugins.logger.SessionLocal")
def test_store_plugin_execution(mock_session):
    mock_db = MagicMock()
    mock_session.return_value = mock_db

    store_plugin_execution(
        plugin_name="echo",
        input_data={"input_text": "hi"},
        output_data={"result": "Echo: hi"},
        status="success"
    )

    assert mock_db.add.called
    assert mock_db.commit.called
    assert mock_db.close.called
