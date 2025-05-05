from fastapi import APIRouter
from backend.app.core.api_response import success_response

router = APIRouter()

@router.get("/all")
def get_all_statuses():
    return success_response(["pending", "running", "success", "error"])
