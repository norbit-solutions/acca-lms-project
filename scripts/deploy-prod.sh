#!/usr/bin/env bash
# ============================================================
# ACCA LMS Backend — Production Deploy Script
# ============================================================
# This script is executed ON the Lightsail server (either
# manually via SSH or triggered by GitHub Actions).
#
# Usage:
#   ~/apps/learnspire/deploy-prod.sh
#   ~/apps/learnspire/deploy-prod.sh --skip-migrations
# ============================================================

set -euo pipefail

DEPLOY_DIR=~/apps/learnspire/prod/learnspire-project
APP_NAME="learnspire-prod"
HEALTH_URL="http://localhost:3333/health"
SKIP_MIGRATIONS=false

# Parse args
for arg in "$@"; do
  case $arg in
    --skip-migrations) SKIP_MIGRATIONS=true ;;
  esac
done

echo "=========================================="
echo " Deploying ACCA LMS Backend (Production)"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. Pull latest code
echo "→ Pulling latest code..."
cd "$DEPLOY_DIR"
git fetch origin main
git reset --hard origin/main
echo "  Commit: $(git rev-parse --short HEAD)"

# 2. Install dependencies
echo "→ Installing dependencies..."
cd backend
npm install --prefer-offline --no-audit

# 3. Build
echo "→ Building for production..."
npm run build

# 4. Install production deps in build/
echo "→ Installing production dependencies..."
cd build
npm install --production --prefer-offline --no-audit
cd ..

# 5. Run migrations (unless skipped)
if [ "$SKIP_MIGRATIONS" = false ]; then
  echo "→ Running database migrations..."
  node ace migration:run --force
else
  echo "→ Skipping migrations (--skip-migrations flag)"
fi

# 6. Restart PM2
echo "→ Restarting PM2 app..."
pm2 restart "$APP_NAME" --update-env

# 7. Health check with retry
echo "→ Running health check..."
MAX_RETRIES=5
RETRY_DELAY=3

for i in $(seq 1 $MAX_RETRIES); do
  sleep $RETRY_DELAY
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ Health check passed (HTTP $STATUS)"
    break
  fi
  
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "  ❌ Health check failed after $MAX_RETRIES attempts (HTTP $STATUS)"
    echo ""
    echo "  Recent PM2 logs:"
    pm2 logs "$APP_NAME" --lines 30 --nostream
    exit 1
  fi
  
  echo "  ⏳ Attempt $i/$MAX_RETRIES — HTTP $STATUS, retrying in ${RETRY_DELAY}s..."
done

echo ""
echo "=========================================="
echo " ✅ Deployment complete!"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "==========================================" 
