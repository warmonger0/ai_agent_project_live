import os
import importlib.util
import inspect
from typing import Dict, List, Any

PLUGIN_DIR = os.path.join(os.path.dirname(__file__))

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
