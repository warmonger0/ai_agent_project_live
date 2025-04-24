# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import healing_controller

# Import routers
from app.controllers import health_controller, task_controller
from app.controllers.logs_controller import router as logs_router

# Create FastAPI app instance
app = FastAPI()

# ----------------------------------------
# CORS Middleware Setup (open during dev)
# ----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔐 TODO: Replace with frontend URL in prod
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

# ----------------------------------------
# Root Route
# ----------------------------------------
@app.get("/")
async def root():
    return {"message": "Local AI Agent Brain Running"}


from app.db import engine, Base
from app.services.healing_loop import healing_loop
import asyncio

# Run healing loop on startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(healing_loop())

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
