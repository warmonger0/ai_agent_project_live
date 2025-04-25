from fastapi import APIRouter
from app.utils.ollama_healthcheck import check_ollama_health

router = APIRouter()

@router.get("/health")
async def health_check():
    is_model_ok = check_ollama_health()

    return {
        "backend": "OK",
        "model": "OK" if is_model_ok else "FAIL"
    }
