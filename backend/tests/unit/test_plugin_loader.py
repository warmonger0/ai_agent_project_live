import pytest
import os
import tempfile
import shutil
from app.plugins import plugin_loader

PLUGIN_NAME = "echo_plugin"
PLUGIN_INPUT = '{"text": "Unit test input"}'


@pytest.fixture
def temp_plugin_dir():
    # Create a temporary plugin directory
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)

def create_plugin_file(dir_path, name, content):
    with open(os.path.join(dir_path, f"{name}.py"), "w") as f:
        f.write(content)

def create_plugin_runner(dir_path):
    with open(os.path.join(dir_path, "plugin_runner.py"), "w") as f:
        f.write("""
import sys
import importlib.util
import json
import traceback

if __name__ == "__main__":
    try:
        plugin_name = sys.argv[1]
        input_text = sys.argv[2]
        plugin_module = importlib.import_module(plugin_name)

        # Find class with 'run' method
        plugin_class = None
        for attr_name in dir(plugin_module):
            attr = getattr(plugin_module, attr_name)
            if isinstance(attr, type) and hasattr(attr, "run"):
                plugin_class = attr
                break

        if plugin_class is None:
            raise Exception("No valid plugin class with run() found.")

        plugin_instance = plugin_class()

        # Parse input_text from JSON first
        try:
            parsed_input = json.loads(input_text)
        except Exception:
            parsed_input = input_text

        result = plugin_instance.run(parsed_input)
        print(json.dumps({"result": result}))

    except Exception as e:
        error_info = traceback.format_exc()
        print(json.dumps({"error": str(e), "traceback": error_info}))
""")

def test_plugin_discovery():
    plugins_list = plugin_loader.discover_plugins()
    names = [p["name"] for p in plugins_list]
    assert "Echo" in names

def test_run_plugin_success(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(temp_plugin_dir, "test_success", """
class TestSuccess:
    def run(self, input_data):
        if isinstance(input_data, str):
            return input_data.upper()
        if isinstance(input_data, dict):
            return input_data.get('text', '').upper()
        return str(input_data).upper()
""")
    result = plugin_loader.run_plugin("test_success", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is True
    assert result["result"] == "HELLO"

def test_run_plugin_not_found(temp_plugin_dir):
    # No need to create plugin_runner since plugin is missing
    result = plugin_loader.run_plugin("missing_plugin", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "not found" in result["error"]

def test_run_plugin_crash(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(temp_plugin_dir, "test_crash", """
class TestCrash:
    def run(self, input_data):
        raise Exception("Crash test")
""")
    result = plugin_loader.run_plugin("test_crash", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "failed" in result["error"] or "error" in result["error"]

def test_run_plugin_timeout(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(temp_plugin_dir, "test_timeout", """
class TestTimeout:
    def run(self, input_data):
        import time
        time.sleep(10)
        return "done"
""")
    result = plugin_loader.run_plugin("test_timeout", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "timed out" in result["error"]
