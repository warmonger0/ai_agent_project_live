#!/bin/bash
pip "$@"
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ]; then
    echo "✔️ pip success, updating requirements.txt"
    pip freeze > /home/war/ai_agent_project/requirements.txt
else
    echo "❌ pip failed, not updating requirements.txt"
fi
exit $EXIT_CODE

