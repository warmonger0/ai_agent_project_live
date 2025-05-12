from pydantic import BaseSettings

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str
    frontend_url: str
    enable_healing_loop: bool = False
    push_api_key: str

    class Config:
        env_file = ".env"

settings = Settings()
