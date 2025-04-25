import os
import pytest
from app.plugins.plugin_loader import discover_plugins, run_plugin
import subprocess

PLUGIN_NAME = "echo_plugin"
PLUGIN_INPUT = "Unit test input"

def test_plugin_discovery():
    plugins = discover_plugins()
    names = [p["name"] for p in plugins]
    assert "Echo" in names

def test_plugin_execution():
    output = run_plugin(PLUGIN_NAME, PLUGIN_INPUT)
    assert output == f"Echo: {PLUGIN_INPUT}"

def test_plugin_not_found():
    with pytest.raises(FileNotFoundError):
        run_plugin("nonexistent_plugin", "test")

def test_plugin_invalid_structure(tmp_path):
    # Create dummy plugin with no valid Plugin class
    bad_plugin = tmp_path / "bad_plugin.py"
    bad_plugin.write_text("def nope(): return 'nope'")

    # Use absolute path to runner script (recommended)
    runner_path = os.path.abspath("app/plugins/plugin_runner.py")

    result = subprocess.run(
        ["python3", runner_path, "bad_plugin", "ignored"],
        cwd=tmp_path,
        capture_output=True,
        text=True
    )

    assert "error" in result.stdout.lower()
