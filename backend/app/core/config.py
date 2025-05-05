from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    app_env: str
    database_url: str
    frontend_url: str

    enable_healing_loop: bool = False  # ✅ NEW: toggle for healing loop

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
