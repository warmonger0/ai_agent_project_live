from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
import os

router = APIRouter()

LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../logs"))
print(f"🧭 [BOOT] LOG_DIR resolved to: {LOG_DIR}")

@router.get("/")
async def list_logs():
    try:
        if not os.path.isdir(LOG_DIR):
            raise FileNotFoundError(f"Logs directory not found at {LOG_DIR}")

        files = [
            f for f in os.listdir(LOG_DIR)
            if f.endswith(".log") and os.path.isfile(os.path.join(LOG_DIR, f))
        ]
        return {"ok": True, "data": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log listing failed: {str(e)}")


@router.get("/{filename}", response_class=PlainTextResponse)
async def get_log_file(filename: str):
    try:
        clean_filename = os.path.basename(filename.strip())
        print(f"📩 GET /logs/{filename}")
        print(f"🧼 Cleaned filename: {clean_filename}")

        if not clean_filename.endswith(".log"):
            raise HTTPException(status_code=400, detail="Only .log files allowed.")

        file_path = os.path.join(LOG_DIR, clean_filename)
        print(f"📁 Attempting to open: {file_path}")
        print(f"📂 Exists: {os.path.exists(file_path)} | Is file: {os.path.isfile(file_path)}")

        if not os.path.isfile(file_path):
            raise HTTPException(status_code=404, detail=f"Log file not found: {clean_filename}")

        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading log: {str(e)}")
