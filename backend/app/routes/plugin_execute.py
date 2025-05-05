from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.tasks import add_memory_entry
from app.plugins.loader import load_plugin_class
from app.core.api_response import success_response
from app.models import Task
from datetime import datetime
from typing import Dict, Any
import json
import traceback
import inspect

router = APIRouter()

@router.post("/run/{plugin_name}")
async def execute_plugin(plugin_name: str, request: Request, db: Session = Depends(get_db)):
    try:
        payload: Dict[str, Any] = await request.json()
        plugin = load_plugin_class(plugin_name)

        # ✅ Create Task record for this plugin execution
        task_entry = Task(
            description=f"Plugin: {plugin_name}",
            model_used="plugin",
            status="running",
            created_at=datetime.utcnow(),
        )
        db.add(task_entry)
        db.commit()
        db.refresh(task_entry)

        # ✅ Execute plugin
        if hasattr(plugin, "run") and inspect.isclass(plugin):
            plugin_instance = plugin()
            result = plugin_instance.run(**payload)
        elif hasattr(plugin, "run") and callable(plugin.run):
            result = plugin.run(payload)
        else:
            task_entry.status = "failed"
            db.commit()
            raise HTTPException(status_code=400, detail="Plugin has no valid run() method.")

        if isinstance(result, dict) and "error" in result:
            task_entry.status = "failed"
            db.commit()
            raise HTTPException(status_code=400, detail=result["error"])

        # ✅ Update Task status
        task_entry.status = "success"
        task_entry.completed_at = datetime.utcnow()
        db.commit()

        # ✅ Log to memory
        add_memory_entry(db, "plugin", plugin_name, f"Ran plugin `{plugin_name}` with input: {json.dumps(payload)}")
        add_memory_entry(db, "plugin", plugin_name, f"Output: {json.dumps(result)}")

        return success_response({"result": result} if isinstance(result, (str, int, float)) else result)

    except HTTPException:
        raise
    except json.decoder.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Invalid JSON payload.")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Plugin execution failed: {str(e)}")
