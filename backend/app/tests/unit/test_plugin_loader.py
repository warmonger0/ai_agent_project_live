import pytest
import os
import tempfile
import shutil
from backend.app.plugins import loader as plugin_loader


@pytest.fixture
def temp_plugin_dir():
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)


def create_plugin_file(dir_path, name, content):
    path = os.path.join(dir_path, f"{name}.py")
    with open(path, "w") as f:
        f.write(content.strip() + "\n")


def create_plugin_runner(dir_path):
    runner_path = os.path.join(dir_path, "runner.py")
    with open(runner_path, "w") as f:
        f.write(
            """
import sys
import os
import importlib
import json
import traceback

# Add plugin dir to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    try:
        plugin_name = sys.argv[1]
        input_text = sys.argv[2]

        plugin_module = importlib.import_module(plugin_name)

        plugin_class = None
        for attr_name in dir(plugin_module):
            attr = getattr(plugin_module, attr_name)
            if isinstance(attr, type) and hasattr(attr, "run"):
                plugin_class = attr
                break

        if plugin_class is None:
            raise Exception("No valid plugin class with run() found.")

        plugin_instance = plugin_class()

        try:
            parsed_input = json.loads(input_text)
        except Exception:
            parsed_input = input_text

        result = plugin_instance.run(parsed_input)
        print(json.dumps({"ok": True, "result": result}))

    except Exception as e:
        error_info = traceback.format_exc()
        print(json.dumps({"ok": False, "error": str(e), "traceback": error_info}))
"""
        )

def test_plugin_discovery():
    plugins_list = plugin_loader.discover_plugins()
    names = [p["name"].lower() for p in plugins_list]
    assert "echo" in names, f"Available plugins: {names}"


def test_run_plugin_success(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(
    temp_plugin_dir,
    "test_success",
    """
class Plugin:
    def run(self, input_data):
        return "HELLO"
"""
)

    result = plugin_loader.run_plugin("test_success", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is True
    assert result["result"] == "HELLO"


def test_run_plugin_not_found(temp_plugin_dir):
    result = plugin_loader.run_plugin("missing_plugin", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "not found" in result.get("error", "").lower()


def test_run_plugin_crash(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(
        temp_plugin_dir,
        "test_crash",
        """
class TestCrash:
    def run(self, input_data):
        raise Exception("Crash test")
""",
    )
    result = plugin_loader.run_plugin("test_crash", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "error" in result


def test_run_plugin_timeout(temp_plugin_dir):
    create_plugin_runner(temp_plugin_dir)
    create_plugin_file(
        temp_plugin_dir,
        "test_timeout",
        """
class TestTimeout:
    def run(self, input_data):
        import time
        time.sleep(10)
        return "done"
""",
    )
    result = plugin_loader.run_plugin("test_timeout", "hello", plugin_dir=temp_plugin_dir)
    assert result["ok"] is False
    assert "error" in result
