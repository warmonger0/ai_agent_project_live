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

        spec = importlib.util.spec_from_file_location(name, path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

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


def run_plugin(plugin_name: str, input_text: str, plugin_dir: str = None) -> str:
    if plugin_dir is None:
        plugin_dir = os.path.dirname(__file__)

    runner_path = os.path.abspath(os.path.join(plugin_dir, "plugin_runner.py"))
    plugin_path = os.path.abspath(os.path.join(plugin_dir, f"{plugin_name}.py"))

    if not os.path.isfile(plugin_path):
        raise FileNotFoundError(f"Plugin '{plugin_name}' not found")

    try:
        result = subprocess.run(
            ["python3", runner_path, plugin_name, input_text],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=plugin_dir  # ✅ run from specified plugin_dir
        )
        if result.returncode != 0:
            raise RuntimeError("Plugin process failed")

        output = json.loads(result.stdout)
        if "error" in output:
            raise ValueError(output["error"])
        return output["result"]

    except subprocess.TimeoutExpired:
        raise RuntimeError("Plugin execution timed out")
