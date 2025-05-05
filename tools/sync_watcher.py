#!/usr/bin/env python3

import subprocess
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import pathspec

SRC = Path("/home/war/ai_agent_project")
SYNCIGNORE = SRC / ".syncignore"
DISABLE_FLAG = Path("/tmp/sync_disabled.flag")
SYNC_LOG = Path("/tmp/last_sync.log")
PUSH_SCRIPT = SRC / "tools" / "push_live_uncommitted.py"

# Compile syncignore rules
ignore_spec = pathspec.PathSpec.from_lines(
    "gitwildmatch",
    SYNCIGNORE.read_text().splitlines() if SYNCIGNORE.exists() else []
)

def is_ignored(path: Path) -> bool:
    """Check if the file path should be ignored based on .syncignore patterns."""
    try:
        rel_path = str(path.relative_to(SRC))
    except ValueError:
        return True  # Outside of project folder
    return ignore_spec.match_file(rel_path)

def log(msg):
    """Log messages to both console and log file."""
    print(msg)
    with open(SYNC_LOG, "a") as f:
        f.write(f"{msg}\n")

def trigger_push(changed_file: Path):
    """Trigger the push script only for relevant changes."""
    result = subprocess.run(
        ["python3", str(PUSH_SCRIPT), str(changed_file)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if result.stdout.strip():
        log(result.stdout.strip())
    if result.stderr.strip():
        log("❌ Error during push:")
        log(result.stderr.strip())

class PushHandler(FileSystemEventHandler):
    last_trigger = 0
    debounce_interval = 1  # seconds

    def on_any_event(self, event):
        """Handle file system changes."""
        now = time.time()
        path = Path(event.src_path)

        if DISABLE_FLAG.exists():
            log("⚠️ Sync disabled. Skipping push.")
            return
        if is_ignored(path):
            return
        if now - self.last_trigger < self.debounce_interval:
            return

        self.last_trigger = now
        log(f"📦 Detected change: {path}")
        trigger_push(path)

def main():
    """Start the GitHub push watcher and monitor changes."""
    log("=== GitHub Push Watcher Started ===")
    observer = Observer()
    observer.schedule(PushHandler(), path=str(SRC), recursive=True)
    observer.start()
    try:
        while not DISABLE_FLAG.exists():
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
