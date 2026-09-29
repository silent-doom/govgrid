# Multi-stage Dockerfile for GovGrid (FastAPI + Vite React SPA)
# Optimized for Google Cloud Run, GKE, or standalone Docker deployment

# ── Stage 1: Build Frontend Assets ──────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ── Stage 2: Production Python Runtime ──────────────────────────────────────
FROM python:3.11-slim AS runner

WORKDIR /app

# Install system dependencies for GIS & audio codecs
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Cloud Run defaults PORT to 8080
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Launch FastAPI via Uvicorn
WORKDIR /app/backend
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
