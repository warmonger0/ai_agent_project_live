from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException

from app.core import error_handler
from app.core.config import settings
from app.api.v1 import api_router
from app.db import engine, Base
from app.services.healing_loop import healing_loop
import asyncio

# ----------------------------------------
# Create FastAPI app instance
# ----------------------------------------
app = FastAPI()

# ----------------------------------------
# Register custom error handlers
# ----------------------------------------
app.add_exception_handler(HTTPException, error_handler.http_exception_handler)
app.add_exception_handler(RequestValidationError, error_handler.validation_exception_handler)
app.add_exception_handler(Exception, error_handler.unhandled_exception_handler)

# ----------------------------------------
# CORS Middleware Setup (from .env)
# ----------------------------------------
allowed_origins = (
    [settings.frontend_url]
    if settings.app_env == "production"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# Versioned API Registration
# ----------------------------------------
app.include_router(api_router, prefix="/api/v1")

# ----------------------------------------
# Root Route
# ----------------------------------------
@app.get("/")
async def root():
    return {"message": f"Local AI Agent Brain Running in {settings.app_env} mode"}

# ----------------------------------------
# App Startup: DB Init + Healing Loop
# ----------------------------------------
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    asyncio.create_task(healing_loop())
