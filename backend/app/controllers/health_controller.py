from fastapi import APIRouter
from app.utils.ollama_healthcheck import check_ollama_health

router = APIRouter()

@router.get("/health")
async def health_check():
    if check_ollama_health():
        return {"status": "healthy"}
    else:
        return {"status": "unhealthy"}
