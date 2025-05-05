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

def branch_exists(name):
    result = subprocess.run(["git", "rev-parse", "--verify", name],
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)
    return result.returncode == 0

def current_branch():
    return subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"],
                          capture_output=True, text=True).stdout.strip()

def has_uncommitted_changes():
    result = subprocess.run(["git", "status", "--porcelain"],
                            capture_output=True, text=True)
    return bool(result.stdout.strip())

def auto_commit_changes():
    run(["git", "add", "."])
    run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])

def clean_temp_live_branch():
    if current_branch() == "temp-live":
        print("⚠️ 'temp-live' is currently checked out. Skipping deletion.")
        return False
    if branch_exists("temp-live"):
        run(["git", "branch", "-D", "temp-live"])
    return True

if current_branch() == "temp-live":
    print("📍 Already on temp-live branch.")
    if has_uncommitted_changes():
        print("📌 Committing pending changes...")
        auto_commit_changes()
    print("🚀 Pushing updates to github-live:main")
    run(["git", "push", "-f", "github-live", "temp-live:main"])
    print("✅ Snapshot updated and pushed.")
    exit(0)

# Otherwise create new snapshot
if has_uncommitted_changes():
    print("⚠️ Warning: Uncommitted changes present.")

with tempfile.TemporaryDirectory() as temp_dir:
    print(f"📦 Backing up working tree to: {temp_dir}")
    run(["rsync", "-a", "--no-group", "--exclude", ".git", ".", temp_dir])

    print("📤 Preparing clean orphan branch: temp-live")
    if not clean_temp_live_branch():
        print("❌ Aborting. Please commit or switch branches before continuing.")
        exit(1)

    run(["git", "checkout", "--orphan", "temp-live"])
    run(["git", "reset", "--hard"])

    print("🗂 Restoring backed-up files into clean branch")
    run(["rsync", "-a", "--no-group", "--exclude", ".git", f"{temp_dir}/", "."])

    print("📦 Adding and committing all files")
    run(["git", "add", "."])
    run(["git", "commit", "-m", "LIVE CODE SNAPSHOT (unsynced, unstable)"])

    print("🚀 Pushing to github-live:main with token-based remote")
    run(["git", "push", "-f", "github-live", "temp-live:main"])

    print("🧹 Restoring working state")
    try:
        run(["git", "checkout", "main"])
        clean_temp_live_branch()
    except subprocess.CalledProcessError:
        print("⚠️ Branch 'main' does not exist locally; staying on orphan.")

print("✅ Live snapshot pushed to ai_agent_project_live.git")
