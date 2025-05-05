import os
import subprocess
import tempfile

project_path = "/home/war/ai_agent_project"
os.chdir(project_path)

# Backup live code snapshot into a temporary dir
with tempfile.TemporaryDirectory() as temp_dir:
    print(f"📦 Backing up working tree to: {temp_dir}")
    subprocess.run([
        "rsync", "-a", "--no-group", "--exclude", ".git", ".", temp_dir
    ], check=True)

    print("📤 Creating orphan branch: temp-live")
    subprocess.run(["git", "checkout", "--orphan", "temp-live"], check=True)
    subprocess.run(["git", "reset", "--hard"], check=True)

    print("🗂 Restoring files to clean branch")
    subprocess.run([
        "rsync", "-a", "--no-group", "--exclude", ".git", f"{temp_dir}/", "."
    ], check=True)

    print("📦 Adding + committing all files")
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run([
        "git", "commit", "-m", "LIVE CODE SNAPSHOT (unsynced, unstable)"
    ], check=True)

    print("🚀 Pushing forcefully to github-live:main")
    subprocess.run(["git", "push", "-f", "github-live", "temp-live:main"], check=True)

    print("🧹 Cleaning up: restoring working state")
    subprocess.run(["git", "checkout", "main"], check=True)
    subprocess.run(["git", "branch", "-D", "temp-live"], check=True)

print("✅ Live snapshot pushed to ai_agent_project_live.git")
