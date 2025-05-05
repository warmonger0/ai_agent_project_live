from fastapi import APIRouter, HTTPException
from backend.app.plugins.loader import discover_plugins
from backend.app.core.api_response import success_response
import traceback

router = APIRouter()

@router.get("/")  # ⚠️ intentionally empty — plugin_routes.py provides the /plugins prefix
def list_plugins():
    try:
        return success_response({"plugins": discover_plugins()})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to list plugins: {str(e)}")
