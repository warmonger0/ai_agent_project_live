from backend.app.plugins.echo import Echo


def test_echo_metadata():
    echo = Echo()
    assert echo.name == "echo"
    assert echo.description == "Returns input as output."
    assert isinstance(echo.input_spec, list)
    assert echo.input_spec[0]["name"] == "input_text"
    assert echo.input_spec[0]["type"] == "string"


def test_echo_run_behavior():
    echo = Echo()
    output = echo.run("hello world")
    assert output == "Echo: hello world"


def test_echo_run_with_empty_string():
    echo = Echo()
    output = echo.run("")
    assert output == "Echo: "


def test_echo_run_with_non_string():
    echo = Echo()
    output = echo.run(12345)
    assert output == "Echo: 12345"
