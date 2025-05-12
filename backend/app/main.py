from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from backend.app.core import error_handler
from backend.app.core.config import settings

print(f"[DEBUG] vite_api_base_url: {settings.vite_api_base_url}")

from backend.app.db.session import engine, Base
from backend.app.db.session import SessionLocal
from backend.app.models import Task
from backend.app.services.healing_loop import healing_loop

from backend.app.api.v1 import api_router
from backend.app.controllers import logs_controller, health_controller, status_controller
from backend.app.routes import project_chat_routes 
from backend.app.routes import deepseek_routes
from backend.app.routes import plugin_routes

import asyncio
import logging
import sys

# ✅ Configure Logging to display DEBUG or WARNING messages in console
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

# ✅ FastAPI application setup
app = FastAPI(
    title="Local AI Agent Brain",
    version="1.0.0",
    description="Backend services for AI Agent task routing, plugin execution, and monitoring.",
)

# ✅ Unified CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.50.142:5173",
        "https://localhost:5173",
        "https://127.0.0.1:5173",
        "https://192.168.50.142:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Error handlers
app.add_exception_handler(HTTPException, error_handler.http_exception_handler)
app.add_exception_handler(RequestValidationError, error_handler.validation_exception_handler)
app.add_exception_handler(Exception, error_handler.unhandled_exception_handler)

# ✅ Mount API routes
app.include_router(api_router, prefix="/api/v1")
app.include_router(logs_controller.router, prefix="/api/v1/logs", tags=["logs"])  # ✅ explicit and scoped
app.include_router(project_chat_routes.router, prefix="/api/v1")  # ✅ Mount chat routes
app.include_router(deepseek_routes.router, prefix="/api/v1", tags=["deepseek"])
app.include_router(plugin_routes.router, prefix="/api/v1")
app.include_router(health_controller.router, prefix="/api/v1")
app.include_router(status_controller.router, prefix="/api/v1")

# ✅ Root route
@app.get("/")
async def root():
    return {"message": f"Local AI Agent Brain Running in {settings.app_env} mode"}

# ✅ Startup hook
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
