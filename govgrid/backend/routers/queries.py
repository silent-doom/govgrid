"""
Queries Router — analytics endpoints powering the Streamlit dashboard.

Endpoints:
  GET /query/clusters      — complaint clusters with severity + size
  GET /query/reconciliation — unfunded liabilities + capital leakage
  GET /query/summary        — district-level KPI summary
"""
from fastapi import APIRouter, Query
from loguru import logger

from services.bigquery_service import (
    get_complaint_clusters,
    get_reconciliation_report,
    get_district_summary,
    get_tenders,
)

router = APIRouter()


@router.get(
    "/clusters",
    summary="Get complaint clusters",
    description=(
        "Returns spatially-clustered citizen complaints (500m radius via BigQuery GIS). "
        "Each cluster has: centroid lat/lng, complaint count, max severity, category breakdown."
    ),
)
async def clusters(min_complaints: int = Query(1, ge=1)):
    logger.info(f"Fetching complaint clusters (min={min_complaints})...")
    data = await get_complaint_clusters(min_complaints=min_complaints)
    return {"count": len(data), "clusters": data}


@router.get(
    "/reconciliation",
    summary="Get reconciliation report",
    description=(
        "Cross-references complaint clusters against active tender zones. "
        "Returns two alert lists:\n"
        "  - unfunded_liabilities: clusters with NO active tender\n"
        "  - capital_leakage: tenders with ongoing severe complaints"
    ),
)
async def reconciliation():
    logger.info("Running reconciliation report...")
    report = await get_reconciliation_report()
    return report


@router.get(
    "/summary",
    summary="District KPI summary",
    description="High-level KPIs: total complaints, active tenders, unfunded count, leakage count.",
)
async def summary():
    logger.info("Fetching district summary...")
    return await get_district_summary()


@router.get(
    "/tenders",
    summary="Get all tenders for map overlay",
)
async def tenders_for_map(status_filter: str = Query(None)):
    data = await get_tenders(status_filter=status_filter)
    return {"count": len(data), "tenders": data}
