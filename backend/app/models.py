from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
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


# --- Plugin Execution History model ---
class PluginExecution(Base):
    __tablename__ = "plugin_executions"

    id = Column(Integer, primary_key=True, index=True)
    plugin_name = Column(String, index=True)
    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON, nullable=True)
    status = Column(String, default="pending")
    timestamp = Column(DateTime, default=datetime.utcnow)
