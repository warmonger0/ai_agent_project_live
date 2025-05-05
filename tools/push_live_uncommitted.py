#!/usr/bin/env python3

import os
import subprocess
import tempfile
from pathlib import Path

project_path = "/home/war/ai_agent_project"
os.chdir(project_path)

def run(cmd, **kwargs):
    print(f"▶️ {' '.join(cmd)}")
    subprocess.run(cmd, check=True, **kwargs)

# Ensure clean git status
status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
if status.stdout.strip():
    print("⚠️ Warning: Uncommitted changes present.")

with tempfile.TemporaryDirectory() as temp_dir:
    print(f"📦 Backing up working tree to: {temp_dir}")
    run(["rsync", "-a", "--no-group", "--exclude", ".git", ".", temp_dir])

    try:
        print("📤 Creating orphan branch: temp-live")
        run(["git", "checkout", "--orphan", "temp-live"])
        run(["git", "reset", "--hard"])

        print("🗂 Restoring backed-up files into clean branch")
        run(["rsync", "-a", "--no-group", "--exclude", ".git", f"{temp_dir}/", "."])

        print("📦 Staging files")
        run(["git", "add", "."])

        # Check if there's anything new to commit
        diff_check = subprocess.run(["git", "diff", "--cached", "--quiet"])
        if diff_check.returncode == 0:
            print("⏭️ No changes to push. Skipping.")
            exit(0)

        print("📌 Committing snapshot")
        run(["git", "commit", "-m", "LIVE CODE SNAPSHOT (unsynced, unstable)"])

        print("🚀 Pushing to github-live:main with token-based remote")
        run(["git", "push", "-f", "github-live", "temp-live:main"])

    finally:
        print("🧹 Restoring working state")
        try:
            run(["git", "checkout", "main"])
        except subprocess.CalledProcessError:
            print("⚠️ Branch 'main' does not exist locally; staying on orphan.")
        subprocess.run(["git", "branch", "-D", "temp-live"])

print("✅ Live snapshot pushed to ai_agent_project_live.git")
