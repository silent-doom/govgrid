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


import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ── Health & API Root ─────────────────────────────────────────────────────────
@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/api", tags=["Root"])
async def api_info():
    return {
        "project": "GovGrid",
        "tagline": "AI-Powered DPI Accountability Engine",
        "status": "running",
        "docs": "/docs",
    }


# ── Production Static & SPA Routing ──────────────────────────────────────────
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    logger.info(f"Mounting production static frontend assets from: {dist_dir}")
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "project": "GovGrid",
            "tagline": "AI-Powered DPI Accountability Engine",
            "status": "running",
            "docs": "/docs",
        }
