from fastapi import APIRouter
from backend.app.utils.ollama_healthcheck import check_ollama_health

router = APIRouter()

@router.get("/", tags=["System"])
async def health_check():
    """
    Returns basic health status of backend and model service.
    """
    is_model_ok = check_ollama_health()

    return {
        "backend": "OK",
        "model": "OK" if is_model_ok else "FAIL"
    }
