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
