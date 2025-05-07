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
    # We only care about modified or untracked files that are relevant to the push
    changes = [line for line in result.stdout.splitlines() if line]
    return changes

# Ensure inside Git repo
if not Path(".git").exists():
    print("❌ Not a git repository.")
    exit(1)

# Only push from temp-live branch
branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True).stdout.strip()
if branch != "temp-live":
    print("⚠️ Not on temp-live branch. Skipping push.")
    exit(0)

# Detect if there are any meaningful changes
if not has_meaningful_changes():
    print("⚠️ No meaningful changes detected. Skipping push.")
    exit(0)

# Stage changes if any
print("📌 Staging changes...")
run(["git", "add", "."], silent=True)

# Check if there are actually any staged changes
if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
    print("⚠️ No staged changes to commit. Skipping push and listening for new changes...")
    exit(0)

# Commit changes
print("📌 Committing changes...")
run(["git", "commit", "-m", "📌 Auto-commit snapshot (temp-live sync)"])

# Push updates to GitHub
print("🚀 Pushing updates to github-live:main...")
result = subprocess.run(
    ["git", "push", "-f", "github-live", "temp-live:main"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

if result.returncode == 0:
    print("✅ Snapshot updated and pushed.")
    print("✅ Live snapshot pushed to GitHub.")
else:
    print(f"❌ Error during push:\n{result.stderr}")
    exit(1)

print("🔁 Push complete. Listening for new changes...")
