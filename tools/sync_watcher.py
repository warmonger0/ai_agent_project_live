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

# Load and compile syncignore rules
if SYNCIGNORE.exists():
    with open(SYNCIGNORE, "r") as f:
        ignore_spec = pathspec.PathSpec.from_lines("gitwildmatch", f)
else:
    ignore_spec = pathspec.PathSpec([])

def is_ignored(path: Path) -> bool:
    try:
        relative = str(path.relative_to(SRC))
        return ignore_spec.match_file(relative)
    except ValueError:
        return True

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
