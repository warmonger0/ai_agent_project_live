from backend.app.utils.json_utils import safe_json_parse

def test_safe_json_parse_valid():
    raw = '{"foo": "bar"}'
    result = safe_json_parse(raw)
    assert result == {"foo": "bar"}

def test_safe_json_parse_invalid():
    raw = '{"foo": "bar"'
    result = safe_json_parse(raw)
    assert result == {}
