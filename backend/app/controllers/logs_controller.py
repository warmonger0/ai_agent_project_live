# backend/app/controllers/logs_controller.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()
LOG_DIR = Path("deployments/logs")

@router.get("/logs", tags=["Logs"])
def list_logs():
    """
    Lists all deployment log files in the logs directory.
    """
    if not LOG_DIR.exists():
        raise HTTPException(status_code=500, detail="Log directory not found.")
    return [f.name for f in LOG_DIR.glob("*.log")]

@router.get("/logs/{filename}", tags=["Logs"])
def get_log_file(filename: str):
    """
    Returns the contents of a specific log file.
    """
    file_path = LOG_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Log file not found.")
    return FileResponse(file_path)
