import pytest
from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError
from backend.app.core.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)

class DummyRequest:
    # Minimal mock for FastAPI request
    scope = {"type": "http"}

@pytest.mark.asyncio
async def test_http_exception_handler():
    exc = HTTPException(status_code=404, detail="Not Found")
    resp = await http_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 404
    assert resp.body

@pytest.mark.asyncio
async def test_validation_exception_handler():
    exc = RequestValidationError(errors=[{"msg": "field required"}])
    resp = await validation_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 422
    assert b"Validation failed" in resp.body

@pytest.mark.asyncio
async def test_unhandled_exception_handler():
    exc = Exception("boom")
    resp = await unhandled_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 500
    assert b"Internal server error" in resp.body
