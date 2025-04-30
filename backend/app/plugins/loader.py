import os
import sys
import importlib.util
import inspect
import subprocess
import json
import resource
import signal
from typing import Dict, List, Any, Type

PLUGIN_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(PLUGIN_DIR, "../../../"))

def set_limits():
    # Limit CPU time (seconds)
    resource.setrlimit(resource.RLIMIT_CPU, (2, 2))  # Max 2 seconds of CPU time
    # Limit address space (memory usage) to 200 MB
    mem_limit = 200 * 1024 * 1024  # 200MB
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
    import pprint
    filename = f"{plugin_name}.py"
    plugin_path = os.path.join(PLUGIN_DIR, filename)

    print(f"\n🔍 Trying to load plugin: {plugin_name}")
    print(f"🔍 Plugin path: {plugin_path}")

    if not os.path.isfile(plugin_path):
        print("❌ Plugin file not found.")
        raise ImportError(f"Plugin file '{filename}' not found.")

    spec = importlib.util.spec_from_file_location(plugin_name, plugin_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    print(f"📦 Attributes in {plugin_name}.py:")
    pprint.pprint(dir(module))

    for attr_name in dir(module):
        attr = getattr(module, attr_name)
        if inspect.isclass(attr):
            print(f"🔎 Found class: {attr.__name__}")
            if hasattr(attr, "run") and callable(attr.run):
                print(f"✅ Matched class: {attr.__name__}")
                return attr

    print("❌ No valid plugin class found.")
    raise ImportError(f"No valid plugin class found in '{filename}'.")

def run_plugin(plugin_name: str, input_text: str, plugin_dir: str = None) -> Dict[str, Any]:
    if plugin_dir is None:
        plugin_dir = os.path.dirname(__file__)

    runner_path = os.path.abspath(os.path.join(plugin_dir, "runner.py"))
    plugin_path = os.path.abspath(os.path.join(plugin_dir, f"{plugin_name}.py"))

    if not os.path.isfile(plugin_path):
        return {"ok": False, "error": f"Plugin '{plugin_name}' not found."}

    env = os.environ.copy()
    existing_path = env.get("PYTHONPATH", "")
    if PROJECT_ROOT not in existing_path:
        env["PYTHONPATH"] = PROJECT_ROOT + os.pathsep + existing_path

    try:
        result = subprocess.run(
            ["python3", runner_path, plugin_name, input_text],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=plugin_dir,
            env=env,
            preexec_fn=set_limits,
        )

        if result.returncode < 0:
            signal_num = -result.returncode
            if signal_num == signal.SIGKILL:
                return {"ok": False, "error": "Plugin terminated: Killed (possible Out of Memory)"}
            elif signal_num == signal.SIGXCPU:
                return {"ok": False, "error": "Plugin terminated: CPU time limit exceeded"}
            else:
                return {"ok": False, "error": f"Plugin terminated by signal {signal_num}"}

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
