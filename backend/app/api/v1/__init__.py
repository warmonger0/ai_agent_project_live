from fastapi import APIRouter

from backend.app.controllers import (
    health_controller,
    task_controller,
    healing_controller,
    logs_controller,
    status_controller,
)

from backend.app.routes.plugin_routes import router as plugin_router

# -----------------------------------
# Main versioned API router
# -----------------------------------
api_router = APIRouter()

# ✅ Core controller groups
api_router.include_router(health_controller.router, prefix="/health", tags=["health"])
api_router.include_router(task_controller.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(healing_controller.router, prefix="/healing", tags=["healing"])
api_router.include_router(logs_controller.router, prefix="/logs", tags=["logs"])
api_router.include_router(status_controller.router, prefix="/status", tags=["status"])

# ✅ Grouped plugin routes under /api/v1/plugins/
api_router.include_router(plugin_router, prefix="/plugins", tags=["plugins"])
