import sys
import os
import json
import logging
import traceback

# ✅ Ensure `app.*` imports work, even when executed as a subprocess
BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from backend.app.services.plugin_runner import run_plugin_job  # Absolute import

# ✅ Stream logs to STDERR only, to preserve STDOUT for subprocess JSON
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run a plugin manually.")
    parser.add_argument("plugin", help="Name of the plugin to run")
    parser.add_argument("input", nargs="?", default="", help="Input text for the plugin")
    args = parser.parse_args()

    try:
        logging.info(f"🧪 Executing plugin '{args.plugin}' with input: {args.input!r}")
        result = run_plugin_job(args.plugin, args.input, source="manual")
        logging.info(f"🎯 Final plugin output: {result}")
        print(json.dumps(result))  # ✅ STDOUT: must be clean JSON only
    except Exception as e:
        logging.error("❌ Plugin execution failed")
        traceback.print_exc()
        try:
            print(json.dumps({"error": str(e)}))
        except Exception:
            print('{"error": "Unhandled plugin error"}')  # ✅ Failsafe output
        sys.exit(1)
