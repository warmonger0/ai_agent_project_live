import json

def safe_json_parse(raw: str) -> dict:
    """
    Attempts to parse a raw JSON string. Returns {} on failure.
    """
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}
