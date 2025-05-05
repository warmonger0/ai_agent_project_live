from backend.app.plugins.echo import Echo

def test_echo_metadata():
    echo = Echo()
    assert echo.name == "echo"
    assert echo.description == "Returns input as output."
    assert isinstance(echo.input_spec, list)
    assert echo.input_spec[0]["name"] == "input_text"

def test_echo_run_behavior():
    echo = Echo()
    output = echo.run("hello world")
    assert output == "Echo: hello world"
