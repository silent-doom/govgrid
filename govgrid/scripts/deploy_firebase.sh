#!/usr/bin/env bash
set -e

echo "=== GovGrid Firebase Deployment ==="
cd "$(dirname "$0")/.."

echo "[1/2] Building Frontend..."
cd frontend
npm run build
cd ..

echo "[2/2] Deploying to Firebase Hosting..."
npx firebase-tools deploy --only hosting --project eventflow-e3c91

echo "Deployment complete! Live at: https://eventflow-e3c91.web.app"
