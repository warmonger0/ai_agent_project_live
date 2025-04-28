import os
import importlib.util
import inspect
import subprocess
import json
from typing import Dict, List, Any

PLUGIN_DIR = os.path.dirname(__file__)


def discover_plugins() -> List[Dict[str, Any]]:
    plugins = []

    for filename in os.listdir(PLUGIN_DIR):
        if not filename.endswith(".py") or filename.startswith("_"):
            continue

        path = os.path.join(PLUGIN_DIR, filename)
        name = filename[:-3]

        try:
            spec = importlib.util.spec_from_file_location(name, path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
        except Exception as e:
            print(f"⚠️ Skipping plugin '{name}' due to import error: {e}")
            continue

        for attr_name in dir(module):
            attr = getattr(module, attr_name)
            if inspect.isclass(attr) and hasattr(attr, 'run') and callable(attr.run):
                plugins.append({
                    "name": getattr(attr, "name", name),
                    "description": getattr(attr, "description", ""),
                    "module": name,
                    "class": attr.__name__,
                })

    return plugins


def run_plugin(plugin_name: str, input_text: str, plugin_dir: str = None) -> Dict[str, Any]:
    if plugin_dir is None:
        plugin_dir = os.path.dirname(__file__)

    runner_path = os.path.abspath(os.path.join(plugin_dir, "plugin_runner.py"))
    plugin_path = os.path.abspath(os.path.join(plugin_dir, f"{plugin_name}.py"))

    if not os.path.isfile(plugin_path):
        return {"ok": False, "error": f"Plugin '{plugin_name}' not found."}

    try:
        result = subprocess.run(
            ["python3", runner_path, plugin_name, input_text],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=plugin_dir,
        )

        if result.returncode != 0:
            stderr = result.stderr.strip() or "Unknown error."
            return {"ok": False, "error": f"Plugin process failed: {stderr}"}

        try:
            output = json.loads(result.stdout)
        except json.JSONDecodeError as e:
            return {"ok": False, "error": f"Invalid plugin output (not JSON): {e}"}

        if "error" in output:
            return {"ok": False, "error": f"Plugin error: {output['error']}"}

        if "result" not in output:
            return {"ok": False, "error": "Plugin returned invalid output: missing 'result' key."}

        return {"ok": True, "result": output["result"]}

    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "Plugin execution timed out."}
    except Exception as e:
        return {"ok": False, "error": f"Unexpected error: {str(e)}"}
