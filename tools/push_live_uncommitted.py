#!/usr/bin/env python3

import os
import subprocess
import tempfile
from pathlib import Path

project_path = "/home/war/ai_agent_project"
syncignore_path = os.path.join(project_path, ".syncignore")
os.chdir(project_path)

def run(cmd, silent=False, **kwargs):
    """Run the command and handle output based on silent flag."""
    if silent:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, **kwargs)
    else:
        print(f"▶️ {' '.join(cmd)}")
        subprocess.run(cmd, check=True, **kwargs)

def has_meaningful_changes(temp_dir):
    """Detect if there are any meaningful file changes (ignores excluded files)."""
    diff = subprocess.run([
        "rsync", "-ani", "--exclude-from", syncignore_path,
        "--exclude", ".git/", "--no-specials", "--no-devices",
        ".", f"{temp_dir}/"
    ], capture_output=True, text=True)
    # Only consider files that are not directories (i.e., real file changes)
    return any(
        line and not line.startswith(".d")
        for line in diff.stdout.splitlines()
    )

# Ensure inside Git repo
if not Path(".git").exists():
    print("❌ Not a git repository.")
    exit(1)

# Only push from temp-live branch
branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True).stdout.strip()
if branch != "temp-live":
    print("⚠️ Not on temp-live branch. Skipping push.")
    exit(0)

with tempfile.TemporaryDirectory() as temp_dir:
    if not has_meaningful_changes(temp_dir):
        print("⚠️ No meaningful changes detected. Skipping push.")
        exit(0)  # No tracked file change

    print("📌 Committing pending changes...")
    run(["git", "add", "."], silent=True)

    # Check if there are actually any staged changes
    if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
        print("⚠️ No staged changes to commit. Skipping push and listening for new changes...")
        exit(0)

    # Commit changes
    run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])
    
    print("🚀 Pushing updates to github-live:main")
    run(["git", "push", "-f", "github-live", "temp-live:main"])
    
    print("✅ Snapshot updated and pushed.")
    print("✅ Live snapshot pushed to GitHub.")
    print("🔁 Push complete. Listening for new changes...")
