from app.core.api_response import success_response, error_response

def test_success_response_basic():
    data = {"foo": "bar"}
    resp = success_response(data)
    assert resp["ok"] is True
    assert resp["data"] == data

def test_error_response_with_details():
    message = "Something went wrong"
    details = ["Line 42", "Timeout"]
    resp = error_response(message, details)
    assert resp["ok"] is False
    assert resp["error"] == message
    assert resp["details"] == details

def test_error_response_without_details():
    message = "Bad request"
    resp = error_response(message)
    assert resp["ok"] is False
    assert resp["error"] == message
    assert resp["details"] == []
