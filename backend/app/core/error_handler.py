from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import traceback
import logging

from app.core.api_response import error_response  # ✅ centralized shape

logger = logging.getLogger(__name__)

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(exc.detail or "HTTP error")
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = [err["msg"] for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=error_response("Validation failed", details)
    )

async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled Exception: %s", traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content=error_response("Internal server error", [str(exc)])
    )
