#!/bin/bash

echo "🚀 Starting FastAPI with Gunicorn..."
source venv/bin/activate

# ✅ Add backend/ to PYTHONPATH
export PYTHONPATH=./backend

gunicorn \
  backend.app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  --timeout 60 \
  --log-level info
