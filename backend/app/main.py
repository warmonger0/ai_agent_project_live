from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
# CORS Middleware Setup (open during dev)
# ----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔐 TODO: Restrict origins before production!
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
    return {"message": "Local AI Agent Brain Running"}

# ----------------------------------------
# App Startup: DB Init + Healing Loop
# ----------------------------------------
@app.on_event("startup")
async def startup_event():
    # ✅ Ensure DB tables are created first
    Base.metadata.create_all(bind=engine)
    # ✅ Then start healing loop
    asyncio.create_task(healing_loop())
