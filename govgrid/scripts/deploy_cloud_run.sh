#!/usr/bin/env bash
# ==============================================================================
# GovGrid — Google Cloud Run Automated Deployment Script
# Tracks: Code for Communities Season 2 (Track 1: AI for DPI & Governance)
# ==============================================================================
set -euo pipefail

# Configuration Defaults
PROJECT_ID="${GCP_PROJECT_ID:-eventflow-e3c91}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE_NAME="govgrid"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo "=========================================================="
echo "🚀 Deploying GovGrid to Google Cloud Run"
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE_NAME}"
echo "Image:    ${IMAGE_TAG}"
echo "=========================================================="

# 1. Ensure gcloud is configured
gcloud config set project "${PROJECT_ID}"

# 2. Build image via Google Cloud Build
echo "📦 Building and pushing container image via Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" .

# 3. Deploy to Cloud Run with auto-scaling & environment variables
echo "🌐 Deploying service to Cloud Run (${REGION})..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="GCP_PROJECT_ID=${PROJECT_ID},BIGQUERY_DATASET=govgrid_dpi,GCS_BUCKET_NAME=govgrid-audio-bucket"

# 4. Fetch and display the deployed service URL
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format="value(status.url)")

echo "=========================================================="
echo "✅ GovGrid successfully deployed to Google Cloud Run!"
echo "Public URL: ${SERVICE_URL}"
echo "API Docs:   ${SERVICE_URL}/docs"
echo "Health:     ${SERVICE_URL}/health"
echo "=========================================================="
