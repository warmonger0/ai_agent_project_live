#!/bin/bash

set -e

cd "$(dirname "$0")/.."

echo "📦 Adding local state files for NAS commit..."

git add -f \
  backend/database.db \
  frontend/.env \
  frontend/.env.test.local \
  frontend/key.pem \
  frontend/cert.pem \
  healing.log \
  logs/ \
  deployments/logs/

commit_msg="local-state: backup env/db/certs/logs for NAS ($(date +%F-%H%M))"
echo "🔒 Committing with message: $commit_msg"
git commit -m "$commit_msg"

echo "🚀 Pushing to NAS..."
git push synonas master

tag_name="local-fullstate-$(date +%Y%m%d-%H%M)"
echo "🏷️ Tagging commit as $tag_name"
git tag "$tag_name"
git push synonas "$tag_name"

echo "✅ NAS backup complete."
