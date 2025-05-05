# backend/app/services/plugin_runner.py

from backend.app.plugins.loader import run_plugin
from backend.app.services.execution_tracker import store_execution_result

def run_plugin_job(plugin_name: str, input_text: str, source: str = "manual"):
    try:
        output = run_plugin(plugin_name, input_text)

        # ✅ Normalize to dict
        result = {"result": output} if not isinstance(output, dict) else output

        store_execution_result(
            plugin_name=plugin_name,
            input_text=input_text,
            output_data=result,
            status="success",
            source=source
        )

        return result

    except Exception as e:
        error = {"error": str(e)}

        store_execution_result(
            plugin_name=plugin_name,
            input_text=input_text,
            output_data=error,
            status="error",
            source=source
        )

        return error
