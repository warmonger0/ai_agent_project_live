# app/models.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db import Base  # ✅ Base now comes from the shared db module

# --- Task model ---
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    model_used = Column(String, nullable=False)
    generated_code = Column(Text, nullable=True)
    status = Column(String, default="processing")
    created_at = Column(DateTime, default=datetime.utcnow)
