from fastapi import APIRouter, HTTPException
from backend.app.plugins.loader import load_plugin_class
from backend.app.core.api_response import success_response
import traceback

router = APIRouter()

@router.get("/{plugin_name}/spec")
def get_plugin_spec(plugin_name: str):
    try:
        plugin = load_plugin_class(plugin_name)

        # ✅ Class-style (has .input_spec)
        if hasattr(plugin, "input_spec"):
            return success_response({
                "plugin": plugin_name,
                "input_spec": plugin.input_spec
            })

        # ✅ Function-style (has spec())
        if hasattr(plugin, "spec") and callable(plugin.spec):
            return success_response({
                "plugin": plugin_name,
                "input_spec": plugin.spec()
            })

        raise HTTPException(status_code=404, detail="input_spec not defined for plugin.")

    except ImportError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to load plugin spec: {str(e)}")
