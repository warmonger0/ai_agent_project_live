#!/bin/bash
echo "Activating venv and installing dev requirements..."
source ~/ai_agent_project/.venv/bin/activate
pip install -r ~/ai_agent_project/requirements-dev.txt
