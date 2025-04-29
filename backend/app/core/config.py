from pydantic import BaseSettings

class Settings(BaseSettings):
    app_env: str
    database_url: str
    frontend_url: str

    class Config:
        env_file = ".env"

settings = Settings()
