import types
from unittest.mock import patch, MagicMock
from backend.app.plugins.loader import discover_plugins, load_plugin_class

@patch("app.plugins.loader.os.listdir", return_value=["my_plugin.py"])
@patch("app.plugins.loader.importlib.util.spec_from_file_location")
@patch("app.plugins.loader.importlib.util.module_from_spec")
def test_discover_plugins_success(mock_from_spec, mock_spec, mock_listdir):
    class FakePlugin:
        name = "fake"
        description = "does nothing"
        def run(self): ...

    mock_module = MagicMock()
    setattr(mock_module, "FakePlugin", FakePlugin)
    mock_from_spec.return_value = mock_module
    mock_spec_obj = MagicMock()
    mock_spec.return_value = mock_spec_obj

    with patch("app.plugins.loader.inspect.isclass", return_value=True), \
         patch("app.plugins.loader.callable", return_value=True), \
         patch("app.plugins.loader.dir", return_value=["FakePlugin"]), \
         patch("app.plugins.loader.getattr", side_effect=lambda obj, name, *args: getattr(obj, name, *args)):
        plugins = discover_plugins()
        assert len(plugins) == 1
        assert plugins[0]["name"] == "fake"
        assert plugins[0]["description"] == "does nothing"
        assert plugins[0]["class"] == "FakePlugin"

@patch("app.plugins.loader.os.path.isfile", return_value=True)
@patch("app.plugins.loader.importlib.util.spec_from_file_location")
@patch("app.plugins.loader.importlib.util.module_from_spec")
def test_load_plugin_class_success(mock_from_spec, mock_spec, mock_isfile):
    class TestPlugin:
        def run(self): ...

    mock_module = types.SimpleNamespace(TestPlugin=TestPlugin)
    mock_from_spec.return_value = mock_module
    mock_spec_obj = MagicMock()
    mock_spec.return_value = mock_spec_obj

    with patch("app.plugins.loader.inspect.isclass", return_value=True), \
         patch("app.plugins.loader.callable", return_value=True), \
         patch("app.plugins.loader.dir", return_value=["TestPlugin"]), \
         patch("app.plugins.loader.getattr", side_effect=lambda obj, name, *args: getattr(obj, name, *args)):
        cls = load_plugin_class("TestPlugin")
        assert cls.__name__ == "TestPlugin"
