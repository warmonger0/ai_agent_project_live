from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    app_env: str
    database_url: str
    frontend_url: str
    enable_healing_loop: bool = False  # ✅ Toggle for healing loop
    push_api_key: str  # ✅ New: include support for .env-defined API key
    vite_api_base_url: str = "http://localhost:8000"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
