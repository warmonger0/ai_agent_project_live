from fastapi import APIRouter, HTTPException
import os

router = APIRouter()

LOG_PATH = "healing.log"

@router.get("/status")
def get_healing_status():
    if not os.path.exists(LOG_PATH):
        raise HTTPException(status_code=404, detail="Healing log not found")

    try:
        with open(LOG_PATH, "r") as f:
            lines = f.readlines()[-20:]  # Last 20 lines
        return {"logs": [line.strip() for line in lines]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
