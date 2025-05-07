from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from backend.app.core import error_handler
from backend.app.core.config import settings
from backend.app.db.session import engine, Base
from backend.app.db.session import SessionLocal
from backend.app.models import Task
from backend.app.services.healing_loop import healing_loop

from backend.app.api.v1 import api_router
from backend.app.controllers import logs_controller  # ✅ Add this import

import asyncio

app = FastAPI(
    import logging

    logging.basicConfig(
    level=logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

    title="Local AI Agent Brain",
    version="1.0.0",
    description="Backend services for AI Agent task routing, plugin execution, and monitoring.",
)

# Error handlers
app.add_exception_handler(HTTPException, error_handler.http_exception_handler)
app.add_exception_handler(RequestValidationError, error_handler.validation_exception_handler)
app.add_exception_handler(Exception, error_handler.unhandled_exception_handler)

# CORS setup
allowed_origins = [settings.frontend_url] if settings.app_env == "production" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API route prefixes
app.include_router(api_router, prefix="/api/v1")
app.include_router(logs_controller.router)  # ✅ Mount /logs route

# Root route
@app.get("/")
async def root():
    return {"message": f"Local AI Agent Brain Running in {settings.app_env} mode"}

# Startup logic
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

    if not settings.enable_healing_loop:
        print("⏸️ Healing loop skipped (disabled via config).")
        return

    db = SessionLocal()
    try:
        pending = db.query(Task).filter(Task.status != "success").count()
    finally:
        db.close()

    if pending > 0:
        print(f"🛠️ Healing loop started — {pending} active task(s) found.")
        asyncio.create_task(healing_loop())
    else:
        print("⏹️ Healing loop skipped — no active tasks.")
