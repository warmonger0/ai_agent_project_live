# echo_plugin.py

class Plugin:
    name = "Echo"
    description = "Returns input as output."

    def run(self, input_text: str) -> str:
        return f"Echo: {input_text}"
