import os
from unittest.mock import patch
from app.core.config import Settings

@patch.dict(os.environ, {
    "APP_ENV": "test",
    "DATABASE_URL": "sqlite:///test.db",
    "FRONTEND_URL": "http://localhost:3000"
})
def test_settings_from_env():
    settings = Settings()
    assert settings.app_env == "test"
    assert settings.database_url == "sqlite:///test.db"
    assert settings.frontend_url == "http://localhost:3000"
