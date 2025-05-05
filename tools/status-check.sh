#!/bin/bash

echo "📦 Checking branch and sync status..."
echo "----------------------------------------------------"

echo "🔀 Current branch:"
git branch --show-current

echo ""
echo "🕒 Last commit:"
git log -1 --oneline

echo ""
echo "🌐 Remote repositories:"
git remote -v

echo ""
echo "🧼 Uncommitted changes:"
git status --short

echo ""
echo "📄 Last Sync Log (/tmp/last_sync.log):"
if [[ -f /tmp/last_sync.log ]]; then
    tail -n 10 /tmp/last_sync.log
else
    echo "No sync log found."
fi

echo "----------------------------------------------------"
echo "✅ Status check complete."
