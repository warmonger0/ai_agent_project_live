import os
import sys
import json
import signal
import pprint
import importlib.util
import inspect
import subprocess
import resource
from typing import Dict, List, Any, Type

PLUGIN_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(PLUGIN_DIR, "../../.."))

def set_limits():
    # Limit CPU time to 2 seconds
    resource.setrlimit(resource.RLIMIT_CPU, (2, 2))
    # Limit memory usage to 200MB
    mem_limit = 200 * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_AS, (mem_limit, mem_limit))

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

def load_plugin_class(plugin_name: str) -> Type:
    filename = f"{plugin_name}.py"
    plugin_path = os.path.join(PLUGIN_DIR, filename)

    print(f"\n🔍 Trying to load plugin: {plugin_name}")
    print(f"🔍 Plugin path: {plugin_path}")

    if not os.path.isfile(plugin_path):
        raise ImportError(f"Plugin file '{filename}' not found.")

    spec = importlib.util.spec_from_file_location(plugin_name, plugin_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    print(f"📦 Attributes in {plugin_name}.py:")
    pprint.pprint(dir(module))

    for attr_name in dir(module):
        attr = getattr(module, attr_name)
        if inspect.isclass(attr) and hasattr(attr, "run") and callable(attr.run):
            print(f"✅ Found plugin class: {attr.__name__}")
            return attr

    raise ImportError(f"No valid plugin class with 'run()' method found in '{filename}'.")

def run_plugin(plugin_name: str, input_text: str, plugin_dir: str = None) -> Dict[str, Any]:
    if plugin_dir is None:
        plugin_dir = PLUGIN_DIR

    plugin_path = os.path.join(plugin_dir, f"{plugin_name}.py")
    if not os.path.isfile(plugin_path):
        return {"ok": False, "error": f"Plugin '{plugin_name}' not found."}

    # ✅ Isolate execution and ensure `PYTHONPATH` includes backend
    env = os.environ.copy()
    env["PYTHONPATH"] = PROJECT_ROOT  # clean and direct

    try:
        result = subprocess.run(
            ["python3", plugin_path, input_text],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=plugin_dir,
            env=env,
            preexec_fn=set_limits,
        )

        print("🔧 [stdout]:", result.stdout.strip())
        print("⚠️ [stderr]:", result.stderr.strip())
        print("🔁 [returncode]:", result.returncode)

        if result.returncode < 0:
            signal_num = -result.returncode
            msg = (
                "Killed (Out of Memory)" if signal_num == signal.SIGKILL else
                "CPU time limit exceeded" if signal_num == signal.SIGXCPU else
                f"Terminated by signal {signal_num}"
            )
            return {"ok": False, "error": f"Plugin terminated: {msg}"}

        if result.returncode != 0:
            return {"ok": False, "error": f"Plugin process failed: {result.stderr.strip() or 'Unknown error.'}"}

        try:
            output = json.loads(result.stdout.strip())
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
