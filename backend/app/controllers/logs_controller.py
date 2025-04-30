# backend/app/controllers/logs_controller.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path

router = APIRouter()

# ✅ Resolve absolute path to logs directory reliably
LOG_DIR = Path(__file__).resolve().parent.parent / "logs"

@router.get("/logs", tags=["Logs"])
def list_logs():
    """
    Lists all deployment log files in the logs directory.
    """
    if not LOG_DIR.exists():
        return JSONResponse(status_code=500, content={
            "ok": False,
            "error": "Log directory not found.",
            "details": [str(LOG_DIR)]
        })

    files = [f.name for f in LOG_DIR.glob("*.log") if f.is_file()]
    return {"ok": True, "data": files}

@router.get("/logs/{filename}", tags=["Logs"])
def get_log_file(filename: str):
    """
    Returns the contents of a specific log file.
    """
    file_path = LOG_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Log file not found.")
    return FileResponse(path=file_path, filename=filename)
