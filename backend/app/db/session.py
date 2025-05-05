from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import settings  # ✅ Reads from .env

# Apply special config only if using SQLite
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Create engine dynamically from .env
engine = create_engine(settings.database_url, connect_args=connect_args)

# Create shared session factory and base model
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Non-FastAPI helper for direct session use (e.g. scripts, deployment handler)
def get_db_session() -> Session:
    return SessionLocal()
