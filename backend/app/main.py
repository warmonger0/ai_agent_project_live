# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.controllers.logs_controller import router as logs_router

# Import routers
from backend.app.controllers import health_controller, task_controller

# Create app instance
app = FastAPI()

# Apply CORS settings (open during dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(health_controller.router)
app.include_router(task_controller.router)

# Default root route
@app.get("/")
async def root():
    return {"message": "Local AI Agent Brain Running"}

app.include_router(logs_router)
