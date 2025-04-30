from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings  # ✅ Import config

# Import routers
from app.controllers import (
    health_controller,
    task_controller,
    healing_controller,
)
from app.controllers.logs_controller import router as logs_router
from app.controllers.plugin_controller import router as plugin_router

# Import DB + Healing
from app.db import engine, Base
from app.services.healing_loop import healing_loop
import asyncio

# ----------------------------------------
# Create FastAPI app instance
# ----------------------------------------
app = FastAPI()

# ----------------------------------------
# CORS Middleware Setup (now using env var)
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
# API Route Registration
# ----------------------------------------
app.include_router(health_controller.router)
app.include_router(task_controller.router)
app.include_router(logs_router)
app.include_router(healing_controller.router)
app.include_router(plugin_router)

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
