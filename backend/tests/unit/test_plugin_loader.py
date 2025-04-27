import pytest
from app.plugins.plugin_loader import discover_plugins, run_plugin
from app import plugins  # Needed for monkeypatching if ever required

PLUGIN_NAME = "echo_plugin"
PLUGIN_INPUT = '{"text": "Unit test input"}'


def test_plugin_discovery():
    plugins_list = discover_plugins()
    names = [p["name"] for p in plugins_list]
    assert "Echo" in names


def test_plugin_execution(tmp_path):
    from app.plugins import plugin_loader

    # Setup: Create a real echo_plugin.py in tmp_path
    echo_plugin = tmp_path / "echo_plugin.py"
    echo_plugin.write_text(
        "class Echo:\n"
        "    def run(self, input_data):\n"
        "        import json\n"
        "        if isinstance(input_data, str):\n"
        "            input_data = json.loads(input_data)\n"
        "        return f\"Echo: {input_data.get('text', '')}\"\n"
    )


    output = plugin_loader.run_plugin("echo_plugin", PLUGIN_INPUT, plugin_dir=str(tmp_path))
    assert output == "Echo: Unit test input"


def test_plugin_not_found():
    with pytest.raises(FileNotFoundError):
        run_plugin("nonexistent_plugin", "test")


def test_plugin_invalid_structure(tmp_path):
    from app.plugins import plugin_loader

    # Create a dummy plugin file with no valid Plugin class
    bad_plugin = tmp_path / "bad_plugin.py"
    bad_plugin.write_text("def nope(): return 'nope'")

    with pytest.raises(Exception) as err:
        plugin_loader.run_plugin("bad_plugin", "ignored", plugin_dir=str(tmp_path))

    err_text = str(err.value).lower()
    assert "plugin process failed" in err_text or "no valid plugin" in err_text or "error" in err_text
