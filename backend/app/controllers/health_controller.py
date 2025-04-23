from fastapi import APIRouter
from backend.app.utils.ollama_healthcheck import check_ollama_health

router = APIRouter()

@router.get("/health")
async def health_check():
    is_healthy = check_ollama_health()
    return {"status": "healthy" if is_healthy else "unhealthy"}
