import sys
from pathlib import Path

# Set up import path so app.XXX resolves in tests
sys.path.append(str(Path(__file__).resolve().parents[1]))
