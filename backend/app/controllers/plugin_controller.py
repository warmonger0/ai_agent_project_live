from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import traceback
import json

from app.db.session import get_db
from app.db.tasks import add_memory_entry
from app.plugins.loader import discover_plugins
from app.plugins.runner import run_plugin_job  # ✅ Correct import
from app.models import PluginExecution
from app.core.api_response import success_response

router = APIRouter()

# --- Pydantic input model ---
class PluginInput(BaseModel):
    input_text: str

# --- List all available plugins ---
@router.get("/plugins")
def list_plugins():
    try:
        return success_response({"plugins": discover_plugins()})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to list plugins: {str(e)}")

# --- Run a plugin ---
@router.post("/plugins/run/{plugin_name}")
def execute_plugin(plugin_name: str, payload: PluginInput, db: Session = Depends(get_db)):
    try:
        result = run_plugin_job(plugin_name, payload.input_text, source="manual")

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        # Log to memory ledger
        add_memory_entry(
            db, "plugin", plugin_name,
            f"Ran plugin `{plugin_name}` with input: {json.dumps(payload.dict())}"
        )
        add_memory_entry(
            db, "plugin", plugin_name,
            f"Output: {json.dumps(result)}"
        )

        return success_response(result)

    except HTTPException:
        raise

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Plugin execution failed: {str(e)}")

# --- Get plugin execution history ---
@router.get("/plugin/history")
def get_plugin_execution_history(limit: int = 10, db: Session = Depends(get_db)):
    try:
        executions = db.query(PluginExecution).order_by(PluginExecution.timestamp.desc()).limit(limit).all()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"DB query failed: {str(e)}")

    return success_response([
        {
            "id": execution.id,
            "plugin_name": execution.plugin_name,
            "input_data": execution.input_data,
            "output_data": execution.output_data,
            "status": execution.status,
            "timestamp": execution.timestamp,
        }
        for execution in executions
    ])
