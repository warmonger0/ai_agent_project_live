from backend.app.db.session import SessionLocal, get_db, get_db_session
from sqlalchemy.orm import Session
import types

def test_sessionlocal_returns_session():
    session = SessionLocal()
    assert isinstance(session, Session)
    session.close()

def test_get_db_generator_yields_session():
    gen = get_db()
    session = next(gen)
    assert isinstance(session, Session)
    try:
        next(gen)
    except StopIteration:
        pass  # Expected when generator ends cleanly

def test_get_db_session_direct():
    session = get_db_session()
    assert isinstance(session, Session)
    session.close()
