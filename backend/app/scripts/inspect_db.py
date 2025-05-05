from backend.app.db import engine
from sqlalchemy import inspect

if __name__ == "__main__":
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("📦 Tables found in database:", tables)

