class Echo:
    name = "echo"
    description = "Returns input as output."
    input_spec = [
        {
            "name": "input_text",
            "type": "string",
            "required": True,
            "description": "The text to echo back."
        }
    ]

    def run(self, input_text: str) -> str:
        return f"Echo: {input_text}"


if __name__ == "__main__":
    import sys
    import json
    import inspect

    # 🔍 Dynamically find the plugin class
    plugin_class = next(
        (cls for cls in globals().values() if inspect.isclass(cls) and hasattr(cls, "run")),
        None,
    )

    if not plugin_class:
        print(json.dumps({"error": "No valid plugin class found."}))
        sys.exit(1)

    plugin = plugin_class()
    input_text = sys.argv[1] if len(sys.argv) > 1 else ""

    try:
        result = plugin.run(input_text)
        print(json.dumps({"result": result}))  # ✅ ONLY JSON to STDOUT
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
