# backend/app/plugins/test_plugin.py

def name():
    return "Test Plugin"

def description():
    return "A simple plugin for testing UI and runner integration."

def spec():
    return [
        {
            "name": "text",
            "type": "string",
            "label": "Test Input Text",
            "required": True
        }
    ]

def run(inputs):
    text = inputs.get("text", "")
    return {
        "ok": True,
        "result": f"[TEST PLUGIN] You entered: {text}"
    }
