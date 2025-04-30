from fastapi import APIRouter
from app.controllers import (
    health_controller,
    task_controller,
    healing_controller,
)
from app.controllers.logs_controller import router as logs_router
from app.controllers.plugin_controller import router as plugin_router

api_router = APIRouter()

api_router.include_router(health_controller.router)
api_router.include_router(task_controller.router)
api_router.include_router(logs_router)
api_router.include_router(healing_controller.router)
api_router.include_router(plugin_router)
