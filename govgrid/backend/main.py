"""
GovGrid FastAPI Backend — Entry Point
Serves the WhatsApp webhook, tender ingestion, and data query endpoints.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from config import settings
from routers import grievances, tenders, queries

# ── App Init ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="GovGrid API",
    description=(
        "AI-powered DPI Accountability Engine — bridging citizen grievances "
        "with public budget execution through geospatial intelligence."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(grievances.router, prefix="/grievance", tags=["Grievances"])
app.include_router(tenders.router, prefix="/tender", tags=["Tenders"])
app.include_router(queries.router, prefix="/query", tags=["Analytics"])


# ── Root & Health ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "project": "GovGrid",
        "tagline": "AI-Powered DPI Accountability Engine",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info(f"GovGrid backend starting — project: {settings.gcp_project_id}")
    logger.info(f"BigQuery dataset: {settings.bigquery_dataset}")
    logger.info(f"GCS bucket: {settings.gcs_bucket_name}")
