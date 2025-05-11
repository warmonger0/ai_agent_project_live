import os
import ast
import json
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))

APP_DIR = os.path.join(PROJECT_ROOT, "backend/app")
TEST_DIR = os.path.join(PROJECT_ROOT, "backend/tests")
VARIABLE_TRACK_FILE = os.path.join(PROJECT_ROOT, "backend/group_variables.txt")
COVERAGE_FILE = os.path.join(PROJECT_ROOT, "backend/tests/coverage_summary.json")

def list_python_files(directory):
    for dirpath, _, filenames in os.walk(directory):
        for file in filenames:
            if file.endswith(".py") and not file.startswith("test_"):
                yield os.path.relpath(os.path.join(dirpath, file), PROJECT_ROOT)

def has_test_file(py_file):
    base = os.path.basename(py_file)
    test_name = f"test_{base}"
    for root, _, files in os.walk(TEST_DIR):
        if test_name in files:
            return True
    return False

def test_all_code_files_have_tests():
    missing = []
    for py_file in list_python_files(APP_DIR):
        if not has_test_file(py_file):
            missing.append(py_file)
    assert not missing, f"Missing tests for: {missing}"

def test_no_any_usage_without_comment():
    offending_lines = []
    for dirpath, _, filenames in os.walk(APP_DIR):
        for file in filenames:
            if not file.endswith(".py"):
                continue
            path = os.path.join(dirpath, file)
            with open(path, "r") as f:
                for i, line in enumerate(f, start=1):
                    if "Any" in line and "type: ignore" not in line and "#" not in line:
                        offending_lines.append((file, i, line.strip()))
    assert not offending_lines, f"'Any' type used without comment: {offending_lines}"

def test_all_tracked_variables_listed():
    with open(VARIABLE_TRACK_FILE, "r") as f:
        declared = f.read()

    new_vars = []

    for dirpath, _, filenames in os.walk(APP_DIR):
        for file in filenames:
            if not file.endswith(".py"):
                continue
            with open(os.path.join(dirpath, file)) as f:
                tree = ast.parse(f.read(), filename=file)
                for node in ast.walk(tree):
                    if isinstance(node, ast.Assign):
                        for target in node.targets:
                            if isinstance(target, ast.Name):
                                var = target.id
                                if var.startswith("_") or var.isupper():
                                    continue
                                if var not in declared:
                                    new_vars.append((file, var))

    assert not new_vars, f"Untracked variables found: {new_vars}"
