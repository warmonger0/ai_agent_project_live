from fastapi import APIRouter
from app.plugins.plugin_loader import discover_plugins

router = APIRouter()

@router.get("/plugins")
def list_plugins():
    return {"plugins": discover_plugins()}
