import subprocess
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Source and Destination paths
SRC = "/home/war/ai_agent_project/"
DST = "/mnt/nas_sync/"
SYNCIGNORE = "/home/war/ai_agent_project/.syncignore"
DISABLE_FLAG = Path("/tmp/sync_disabled.flag")
SYNC_LOG = Path("/tmp/last_sync.log")

def log(msg):
    print(msg)
    with open(SYNC_LOG, "a") as f:
        f.write(f"{msg}\n")

def sync_project():
    if not Path(DST).exists():
        log(f"❌ Destination path {DST} is not mounted.")
        return False

    cmd = [
        "rsync", "-az", "--delete",
        "--exclude-from", SYNCIGNORE,
        "--no-specials", "--no-devices",
        SRC, DST
    ]

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        log("❌ Sync failed:")
        log(result.stderr.decode())
        DISABLE_FLAG.touch()
        return False
    else:
        log("✅ Sync succeeded.")
    return True

class SyncHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if DISABLE_FLAG.exists():
            log("⚠️ Sync disabled. Skipping event.")
            return
        log(f"📦 Detected change: {event.src_path}")
        sync_project()

def main():
    log("=== Inotify Sync Watcher Started ===")
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
