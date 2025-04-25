import sys
import importlib.util
import inspect
import json

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: plugin_runner.py <plugin_name> <input_text>"}))
        sys.exit(1)

    plugin_name = sys.argv[1]
    input_text = sys.argv[2]

    path = f"{plugin_name}.py"

    spec = importlib.util.spec_from_file_location(plugin_name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    for attr_name in dir(module):
        attr = getattr(module, attr_name)
        if inspect.isclass(attr) and hasattr(attr, "run") and callable(attr.run):
            instance = attr()
            result = instance.run(input_text)
            print(json.dumps({"result": result}))
            return

    print(json.dumps({"error": "No valid Plugin class with run() found"}))

if __name__ == "__main__":
    main()
