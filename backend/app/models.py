from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.db import Base  # Shared Base from db.py


# --- Task model ---
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    model_used = Column(String, nullable=False)
    generated_code = Column(Text, nullable=True)

    status = Column(String, default="pending")  # pending | running | success | error
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


# --- Plugin Execution History model ---
class PluginExecution(Base):
    __tablename__ = "plugin_executions"

    id = Column(Integer, primary_key=True, index=True)
    plugin_name = Column(String, index=True)

    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON, nullable=True)

    status = Column(String, default="pending")  # pending | running | success | error
    error_message = Column(Text, nullable=True)

    timestamp = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


# --- Memory Ledger model (placeholder) ---
class MemoryLedger(Base):
    __tablename__ = "memory_ledger"

    id = Column(Integer, primary_key=True, index=True)
    context_type = Column(String, nullable=False)  # task / plugin / note / error
    related_id = Column(Integer, nullable=True)    # Optional FK to Task or PluginExecution
    content = Column(Text, nullable=False)

    timestamp = Column(DateTime, default=datetime.utcnow)
