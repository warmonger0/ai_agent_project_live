from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Index
from app.db.session import Base

# --- Task Model ---
class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    model_used = Column(String, nullable=False)
    generated_code = Column(Text, nullable=True)

    status = Column(String, nullable=False, default="pending", index=True)
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True, index=True)

# --- Plugin Execution Model ---
class PluginExecution(Base):
    __tablename__ = "plugin_executions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    plugin_name = Column(String, nullable=False, index=True)

    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON, nullable=True)

    status = Column(String, nullable=False, default="pending", index=True)
    error_message = Column(Text, nullable=True)

    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True, index=True)

# --- Memory Ledger Model ---
class MemoryLedger(Base):
    __tablename__ = "memory_ledger"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    context_type = Column(String, nullable=False, index=True)
    related_id = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)

    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
