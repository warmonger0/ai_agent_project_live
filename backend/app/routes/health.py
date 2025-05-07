from fastapi import APIRouter
from datetime import datetime
from typing import Dict

router = APIRouter()

@router.get("/health", include_in_schema=True) 
def health_check():
    return {
        "backend": "OK",
        "model": "OK",
        "timestamp": datetime.utcnow().isoformat()
    }
