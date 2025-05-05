#!/usr/bin/env python3

import os
import subprocess
from pathlib import Path

project_path = "/home/war/ai_agent_project"
os.chdir(project_path)

def run(cmd, **kwargs):
    print(f"▶️ {' '.join(cmd)}")
    subprocess.run(cmd, check=True, **kwargs)

def staged_changes_exist():
    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    return result.returncode != 0

# Detect branch
branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True).stdout.strip()

if branch != "temp-live":
    print("❌ push_live_uncommitted.py is only allowed from temp-live branch.")
    exit(1)

# Stage any changes
subprocess.run(["git", "add", "."], check=False)

# Skip if nothing is staged
if not staged_changes_exist():
    exit(0)

print("📌 Committing pending changes...")
run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])

print("🚀 Pushing updates to github-live:main")
run(["git", "push", "-f", "github-live", "temp-live:main"])

print("✅ Snapshot updated and pushed.")
