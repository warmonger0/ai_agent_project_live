def success_response(data):
    return {"ok": True, "data": data}

def error_response(message, details=None):
    return {
        "ok": False,
        "error": message,
        "details": details or [],
    }
