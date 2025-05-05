#!/bin/bash

# --- Config ---
PROJECT_ROOT="/home/war/ai_agent_project"
BACKEND_ENTRY="app.main:app"
VENV_PATH="$PROJECT_ROOT/venv/bin/activate"

# --- Ensure working directory ---
cd "$PROJECT_ROOT" || exit 1

# --- Activate virtual environment ---
echo "📦 Activating virtual environment..."
source "$VENV_PATH"

# --- IP Detection ---
LOCAL_IP=$(hostname -I | awk '{print $1}')

# --- Track child PIDs for cleanup ---
PIDS=()

cleanup() {
  echo ""
  echo "🔻 Stopping frontend and backend..."
  for pid in "${PIDS[@]}"; do
    echo "🛑 Killing PID $pid"
    kill "$pid" 2>/dev/null
  done
  echo "✅ All processes stopped."
  exit 0
}

trap cleanup SIGINT

# --- Start Backend ---
echo "🚀 Starting FastAPI backend..."
PYTHONPATH=backend uvicorn "$BACKEND_ENTRY" --reload --host 0.0.0.0 &
PIDS+=($!)

sleep 3

# --- Start Frontend ---
echo "🚀 Starting Vite frontend..."
cd "$PROJECT_ROOT/frontend"
npm run dev -- --host &
PIDS+=($!)

# --- Output Info ---
echo "🌐 Backend:  http://$LOCAL_IP:8000"
echo "🌐 Frontend: http://$LOCAL_IP:5173"
echo "🔧 Hit CTRL+C to stop both processes."

# --- Wait for both processes ---
wait
