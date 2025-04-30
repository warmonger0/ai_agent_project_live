from app.db import engine, Base
from app.models import Task  # ✅ Ensures model is loaded before create_all

if __name__ == "__main__":
    print("🔧 Creating all tables in database.db...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")
