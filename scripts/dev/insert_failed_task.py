# scripts/dev/insert_failed_task.py

import sys
import os

# Allow importing from backend/app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend", "app")))

from app.utils.devtools import insert_dummy_task

if __name__ == "__main__":
    insert_dummy_task()
