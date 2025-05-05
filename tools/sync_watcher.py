#!/usr/bin/env python3

import subprocess
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

SRC = Path("/home/war/ai_agent_project")
SYNCIGNORE = SRC / ".syncignore"
DISABLE_FLAG = Path("/tmp/sync_disabled.flag")
SYNC_LOG = Path("/tmp/last_sync.log")
PUSH_SCRIPT = SRC / "tools" / "push_live_uncommitted.py"

# Load .syncignore into memory once
ignore_patterns = set()
if SYNCIGNORE.exists():
    with open(SYNCIGNORE, "r") as f:
        ignore_patterns.update([
            line.strip().rstrip("/") for line in f
            if line.strip() and not line.strip().startswith("#")
        ])

def is_ignored(path: Path) -> bool:
    try:
        relative = path.relative_to(SRC)
    except ValueError:
        return True  # Outside of SRC

    for pattern in ignore_patterns:
        if pattern and (relative.match(pattern) or any(part == pattern for part in relative.parts)):
            return True
    return False

def log(msg):
    print(msg)
    with open(SYNC_LOG, "a") as f:
        f.write(f"{msg}\n")

def trigger_push():
    result = subprocess.run(["python3", str(PUSH_SCRIPT)],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            text=True)
    log(result.stdout.strip())
    if result.stderr:
        log("❌ Error during push:")
        log(result.stderr.strip())

class PushHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        changed_path = Path(event.src_path)

        if DISABLE_FLAG.exists():
            log("⚠️ Sync disabled. Skipping push.")
            return
        if is_ignored(changed_path):
            return

        log(f"📦 Detected change: {changed_path}")
        trigger_push()

def main():
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
