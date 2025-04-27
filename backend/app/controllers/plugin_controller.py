from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import traceback  # ✅ Add traceback for better error debug
from app.db import SessionLocal
from app.plugins.plugin_loader import discover_plugins, run_plugin
from app.models import PluginExecution

router = APIRouter()

# --- Dependency for DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic input model ---
class PluginInput(BaseModel):
    input_text: str

# --- List all available plugins ---
@router.get("/plugins")
def list_plugins():
    try:
        return {"plugins": discover_plugins()}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to list plugins: {str(e)}")

# --- Run a plugin ---
@router.post("/plugins/run/{plugin_name}")
def execute_plugin(plugin_name: str, payload: PluginInput, db: Session = Depends(get_db)):
    try:
        # Pass raw input to runner, let runner handle JSON packing
        output = run_plugin(plugin_name, payload.input_text)

        # Store successful execution
        log_execution(db, plugin_name, {"input_text": payload.input_text}, {"result": output}, "success")

        return {"result": output}

    except (FileNotFoundError, ValueError) as e:
        traceback.print_exc()
        log_execution(db, plugin_name, {"input_text": payload.input_text}, {"error": str(e)}, "error")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        traceback.print_exc()
        log_execution(db, plugin_name, {"input_text": payload.input_text}, {"error": str(e)}, "error")
        raise HTTPException(status_code=500, detail=f"Plugin execution failed: {str(e)}")

# --- Get plugin execution history ---
@router.get("/plugin/history")
def get_plugin_execution_history(limit: int = 10, db: Session = Depends(get_db)):
    executions = db.query(PluginExecution).order_by(PluginExecution.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": execution.id,
            "plugin_name": execution.plugin_name,
            "input_data": execution.input_data,
            "output_data": execution.output_data,
            "status": execution.status,
            "timestamp": execution.timestamp,
        }
        for execution in executions
    ]

# --- Helper to log executions (DRY!) ---
def log_execution(db: Session, plugin_name: str, input_data: dict, output_data: dict, status: str):
    execution = PluginExecution(
        plugin_name=plugin_name,
        input_data=input_data,
        output_data=output_data,
        status=status,
    )
    db.add(execution)
    db.commit()
