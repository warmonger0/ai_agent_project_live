# backend/app/tests/unit/test_insert_failed_task.py

import os
import sys
from datetime import datetime, timedelta

import pytest
from sqlalchemy.orm import Session

# Ensure the root project directory is in path for clean imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from app.db.session import SessionLocal
from app.models import Task
from app.utils.devtools import insert_dummy_task  # ✅ now from safe location

@pytest.fixture(scope="function")
def db_session():
    """Yields a clean session and ensures DB cleanup after test."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.query(Task).delete()
        db.commit()
        db.close()

def test_insert_dummy_failed_task(db_session):
    insert_dummy_task()

    # Query most recent task in last 2 minutes with 'echo' and 'failed' status
    recent_cutoff = datetime.utcnow() - timedelta(minutes=2)
    task = db_session.query(Task).filter(
        Task.model_used == "echo",
        Task.status == "failed",
        Task.created_at >= recent_cutoff
    ).order_by(Task.created_at.desc()).first()

    assert task is not None, "❌ Dummy task was not inserted."
    assert task.description == "Echo test"
    assert task.model_used == "echo"
    assert task.status == "failed"
    assert task.error_message == "Dummy failure for testing"
