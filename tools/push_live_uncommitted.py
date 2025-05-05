#!/usr/bin/env python3

import os
import subprocess
import tempfile
from pathlib import Path

project_path = "/home/war/ai_agent_project"
syncignore_path = os.path.join(project_path, ".syncignore")

os.chdir(project_path)

def run(cmd, **kwargs):
    if kwargs.get("silent"):
        kwargs.pop("silent")
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, **kwargs)
    else:
        print(f"▶️ {' '.join(cmd)}")
        subprocess.run(cmd, check=True, **kwargs)

def has_meaningful_changes(temp_dir):
    """Detects if there are changes in files not excluded by .syncignore"""
    diff = subprocess.run([
        "rsync", "-ani", "--exclude-from", syncignore_path,
        "--exclude", ".git/", "--no-specials", "--no-devices",
        ".", f"{temp_dir}/"
    ], capture_output=True, text=True)
    changes = [line for line in diff.stdout.splitlines() if line and not line.startswith(".d")]
    return changes

# Ensure .git is present
if not Path(".git").exists():
    print("❌ Not a git repository.")
    exit(1)

# Skip if not on temp-live
branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True).stdout.strip()
if branch != "temp-live":
    print("⚠️ Not on temp-live branch. Skipping push.")
    exit(0)

with tempfile.TemporaryDirectory() as temp_dir:
    if not has_meaningful_changes(temp_dir):
        # Silent, no-log skip if nothing important changed
        exit(0)

    print("📌 Committing pending changes...")
    run(["git", "add", "."], silent=True)
    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if result.returncode == 0:
        exit(0)  # No staged changes
    run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])

    print("🚀 Pushing updates to github-live:main")
    run(["git", "push", "-f", "github-live", "temp-live:main"])

    print("✅ Snapshot updated and pushed.")
    print("✅ Live snapshot pushed to GitHub.")
