class EchoPlugin:
    name = "Echo"
    description = "Returns the input text as output."

    def run(self, input_text: str):
        return {"ok": True, "echo": input_text}

