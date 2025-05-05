#!/usr/bin/env python3

import subprocess
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

SRC = "/home/war/ai_agent_project/"
DISABLE_FLAG = Path("/tmp/sync_disabled.flag")
SYNC_LOG = Path("/tmp/last_sync.log")
PUSH_SCRIPT = Path("/home/war/ai_agent_project/venv/bin/push-live")

def log(msg):
    print(msg)
    with open(SYNC_LOG, "a") as f:
        f.write(f"{msg}\n")

def push_live_snapshot():
    if not PUSH_SCRIPT.exists():
        log("❌ push-live script not found.")
        return
    try:
        subprocess.run([str(PUSH_SCRIPT)], check=True)
        log("✅ Live snapshot pushed to GitHub.")
    except subprocess.CalledProcessError as e:
        log("❌ GitHub push failed.")
        log(str(e))

class SyncHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if DISABLE_FLAG.exists():
            log("⚠️ Sync disabled. Skipping push.")
            return
        log(f"📦 Detected change: {event.src_path}")
        push_live_snapshot()

def main():
    log("=== GitHub Push Watcher Started ===")
    event_handler = SyncHandler()
    observer = Observer()
    observer.schedule(event_handler, path=SRC, recursive=True)
    observer.start()
    try:
        while not DISABLE_FLAG.exists():
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
