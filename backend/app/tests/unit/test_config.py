import os
from unittest.mock import patch
from backend.app.core.config import Settings

@patch.dict(os.environ, {
    "APP_ENV": "test",
    "DATABASE_URL": "sqlite:///test.db",
    "FRONTEND_URL": "http://localhost:3000"
}, clear=True)
def test_settings_from_mocked_env():
    settings = Settings()
    assert settings.app_env == "test"
    assert settings.database_url == "sqlite:///test.db"
    assert settings.frontend_url == "http://localhost:3000"
