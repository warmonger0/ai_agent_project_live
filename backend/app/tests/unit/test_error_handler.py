import pytest
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request as StarletteRequest
from starlette.responses import Response
from backend.app.core.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)


class DummyRequest(Request):
    def __init__(self):
        scope = {"type": "http", "method": "GET", "path": "/test"}
        super().__init__(scope)


@pytest.mark.asyncio
async def test_http_exception_handler():
    exc = HTTPException(status_code=404, detail="Not Found")
    resp: Response = await http_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 404
    assert b"Not Found" in resp.body


@pytest.mark.asyncio
async def test_validation_exception_handler():
    exc = RequestValidationError(errors=[{"msg": "field required"}])
    resp: Response = await validation_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 422
    assert b"Validation failed" in resp.body


@pytest.mark.asyncio
async def test_unhandled_exception_handler():
    exc = Exception("boom")
    resp: Response = await unhandled_exception_handler(DummyRequest(), exc)
    assert resp.status_code == 500
    assert b"Internal server error" in resp.body
