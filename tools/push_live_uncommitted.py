#!/usr/bin/env python3

import subprocess
import tempfile
from pathlib import Path
import os

project_path = Path(__file__).resolve().parent.parent
syncignore_path = project_path / ".syncignore"
os.chdir(project_path)

def run(cmd, silent=False, **kwargs):
    """Run the command and handle output based on silent flag."""
    if silent:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, **kwargs)
    else:
        print(f"▶️ {' '.join(cmd)}")
        subprocess.run(cmd, check=True, **kwargs)

def has_meaningful_changes():
    """Detect if there are any meaningful file changes by using git status."""
    result = subprocess.run(
        ["git", "status", "--porcelain"], capture_output=True, text=True
    )
    changes = [line for line in result.stdout.splitlines() if line]
    return changes

# Ensure inside Git repo
if not Path(".git").exists():
    print("❌ Not a git repository.")
    exit(1)

# Identify current branch
branch = subprocess.run(
    ["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True
).stdout.strip()
print(f"📦 Current local branch: {branch} (pushing to github-live:master regardless)")

# Detect if there are any meaningful changes
if not has_meaningful_changes():
    print("⚠️ No meaningful changes detected. Skipping push.")
    exit(0)

# Stage changes
print("📌 Staging changes...")
run(["git", "add", "."], silent=True)

# Check if anything is staged
if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
    print("⚠️ No staged changes to commit. Skipping push.")
    exit(0)

# Commit
print("📌 Committing changes...")
run(["git", "commit", "-m", f"📌 Auto-commit snapshot ({branch} sync)"])

# Push
print("🚀 Pushing updates to github-live:master...")
result = subprocess.run(
    ["git", "push", "-f", "github-live", f"{branch}:master"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

if result.returncode == 0:
    print("✅ Live snapshot pushed to GitHub (github-live:master).")
else:
    print(f"❌ Error during push:\n{result.stderr}")
    exit(1)

print("🔁 Push complete.")
