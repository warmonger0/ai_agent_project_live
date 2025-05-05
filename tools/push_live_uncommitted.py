#!/usr/bin/env python3

import os
import subprocess
import tempfile
from pathlib import Path

project_path = "/home/war/ai_agent_project"
syncignore_path = os.path.join(project_path, ".syncignore")
os.chdir(project_path)

def run(cmd, silent=False, **kwargs):
    if silent:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, **kwargs)
    else:
        print(f"▶️ {' '.join(cmd)}")
        subprocess.run(cmd, check=True, **kwargs)

def has_meaningful_changes(temp_dir):
    diff = subprocess.run([
        "rsync", "-ani", "--exclude-from", syncignore_path,
        "--exclude", ".git/", "--no-specials", "--no-devices",
        ".", f"{temp_dir}/"
    ], capture_output=True, text=True)
    return any(
        line and not line.startswith(".d")
        for line in diff.stdout.splitlines()
    )

# Ensure inside Git repo
if not Path(".git").exists():
    print("❌ Not a git repository.")
    exit(1)

# Only push from temp-live
branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True).stdout.strip()
if branch != "temp-live":
    print("⚠️ Not on temp-live branch. Skipping push.")
    exit(0)

with tempfile.TemporaryDirectory() as temp_dir:
    if not has_meaningful_changes(temp_dir):
        exit(0)  # No tracked file change

    print("📌 Committing pending changes...")
    run(["git", "add", "."], silent=True)
    if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
        exit(0)

    run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])
    print("🚀 Pushing updates to github-live:main")
    run(["git", "push", "-f", "github-live", "temp-live:main"])
    print("✅ Snapshot updated and pushed.")
    print("✅ Live snapshot pushed to GitHub.")
