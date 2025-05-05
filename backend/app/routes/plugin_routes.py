from fastapi import APIRouter

# Plugin-related subroutes
from backend.app.routes.plugin_list import router as list_router
from backend.app.routes.plugin_spec import router as spec_router
from backend.app.routes.plugin_execute import router as exec_router
from backend.app.routes.plugin_history import router as history_router
from backend.app.routes import plugin_execute

# Health & logs
from backend.app.routes.health import router as health_router
from backend.app.routes.logs import router as logs_router

router = APIRouter()

# Core plugin functionality
router.include_router(list_router, prefix="/plugins", tags=["plugins"])
router.include_router(spec_router, prefix="/plugins", tags=["plugins"])
router.include_router(exec_router, prefix="/plugins", tags=["plugins"])
router.include_router(history_router, prefix="/plugins", tags=["plugins"])
router.include_router(plugin_execute.router, prefix="/plugins", tags=["plugins"])

# System health
router.include_router(health_router, prefix="/api/v1", tags=["health"])

# Logs
router.include_router(logs_router, prefix="/api/v1/logs", tags=["logs"])
