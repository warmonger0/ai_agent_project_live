from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.plugins.plugin_loader import discover_plugins, run_plugin

router = APIRouter()

@router.get("/plugins")
def list_plugins():
    return {"plugins": discover_plugins()}

class PluginInput(BaseModel):
    input_text: str

@router.post("/plugins/run/{plugin_name}")
def execute_plugin(plugin_name: str, payload: PluginInput):
    try:
        output = run_plugin(plugin_name, payload.input_text)
        return {"result": output}
    except (FileNotFoundError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
