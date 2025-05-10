from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

import traceback
import json

from backend.app.db.session import get_db
from backend.app.db.tasks import add_memory_entry
from backend.app.plugins.loader import discover_plugins, load_plugin_class
from backend.app.plugins.runner import run_plugin_job
from backend.app.models import PluginExecution
from backend.app.core.api_response import success_response

router = APIRouter()

# --- List all available plugins ---
@router.get("/plugins")
def list_plugins():
    try:
        return success_response({"plugins": discover_plugins()})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to list plugins: {str(e)}")

# --- Get plugin input spec ---
@router.get("/plugins/{plugin_name}/spec")
def get_plugin_spec(plugin_name: str):
    try:
        plugin_class = load_plugin_class(plugin_name)
        if not hasattr(plugin_class, "input_spec"):
            raise HTTPException(status_code=404, detail="input_spec not defined for plugin.")

        return success_response({
            "plugin": plugin_name,
            "input_spec": plugin_class.input_spec
        })

    except ImportError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to load plugin spec: {str(e)}")

# --- Run a plugin (dynamically handle input) ---
@router.post("/plugins/run/{plugin_name}")
async def execute_plugin(
    plugin_name: str,
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        payload: Dict[str, Any] = await request.json()
        print(f"🛠 Received payload: {payload}")

        input_text = payload.get("input_text", "")
        result = run_plugin_job(plugin_name, input_text, source="manual")
        print(f"🎯 Raw plugin result: {result}")

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        # Log to memory ledger
        add_memory_entry(
            db, "plugin", plugin_name,
            f"Ran plugin `{plugin_name}` with input: {json.dumps(payload)}"
        )
        add_memory_entry(
            db, "plugin", plugin_name,
            f"Output: {json.dumps(result)}"
        )

        if isinstance(result, (str, int, float)):
            result = {"result": result}

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
