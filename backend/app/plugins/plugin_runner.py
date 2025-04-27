import sys
import os
import importlib.util
import inspect
import json
import traceback

# Add backend root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.utils.plugin_logger import store_plugin_execution  # ✅ Log plugin executions properly

def main():
    if len(sys.argv) != 3:
        error = {"error": "Usage: plugin_runner.py <plugin_name> <input_json>"}
        print(json.dumps(error))
        store_plugin_execution("UNKNOWN", {}, error, "error")
        sys.exit(1)

    plugin_name = sys.argv[1]
    input_raw = sys.argv[2]

    # --- Parse input safely ---
    try:
        input_data = json.loads(input_raw)
    except json.JSONDecodeError:
        input_data = {"input_text": input_raw}  # 🔥 fallback if not JSON

    plugin_file = os.path.join(os.path.dirname(__file__), f"{plugin_name}.py")

    if not os.path.isfile(plugin_file):
        error = {"error": f"Plugin file '{plugin_name}.py' not found."}
        print(json.dumps(error))
        store_plugin_execution(plugin_name, input_data, error, "error")
        sys.exit(1)

    try:
        spec = importlib.util.spec_from_file_location(plugin_name, plugin_file)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # --- Look for a valid class with run() method ---
        for attr_name in dir(module):
            attr = getattr(module, attr_name)
            if inspect.isclass(attr) and hasattr(attr, "run") and callable(attr.run):
                instance = attr()
                try:
                    result = instance.run(input_data)

                    # --- ✅ Fix Output ---
                    output = result if isinstance(result, dict) else {"result": result}
                    print(json.dumps(output))

                    store_plugin_execution(plugin_name, input_data, output, "success")
                    return
                except Exception as e:
                    traceback.print_exc()
                    error = {"error": str(e)}
                    print(json.dumps(error))
                    store_plugin_execution(plugin_name, input_data, error, "error")
                    return

        # --- No valid plugin class found ---
        error = {"error": "No valid Plugin class with run() method found"}
        print(json.dumps(error))
        store_plugin_execution(plugin_name, input_data, error, "error")

    except Exception as e:
        traceback.print_exc()
        error = {"error": str(e)}
        print(json.dumps(error))
        store_plugin_execution(plugin_name, input_data, error, "error")
        sys.exit(1)

if __name__ == "__main__":
    main()
