from fastapi import APIRouter

# Plugin-related subroutes
from backend.app.routes.plugin_list import router as list_router
from backend.app.routes.plugin_spec import router as spec_router
from backend.app.routes.plugin_execute import router as exec_router
from backend.app.routes.plugin_history import router as history_router
from backend.app.routes import plugin_execute
from backend.app.controllers import health_controller, status_controller

# Health & logs
from backend.app.routes.health import router as health_router
from backend.app.routes.logs import router as logs_router

#command panel
from backend.app.routes import deepseek_routes as planning_chat

router = APIRouter()

# Core plugin functionality

router.include_router(list_router, prefix="/plugins", tags=["plugins"])
router.include_router(spec_router, prefix="/plugins", tags=["plugins"])
router.include_router(exec_router, prefix="/plugins", tags=["plugins"])
router.include_router(history_router, prefix="/plugins", tags=["plugins"])
router.include_router(plugin_execute.router, prefix="/plugins", tags=["plugins"])
router.include_router(health_controller.router, prefix="/api/v1", tags=["health"])
router.include_router(status_controller.router, prefix="/api/v1", tags=["status"])

# System health
router.include_router(health_router, prefix="/api/v1", tags=["health"])

# Logs
router.include_router(logs_router, prefix="/api/v1/logs", tags=["logs"])

#command panel routes
router.include_router(planning_chat.router, prefix="/planning", tags=["planning"])
