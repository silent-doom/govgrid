"""
Tenders Router — handles government tender PDF ingestion.

Flow:
  1. Accept a GCS URI or upload a PDF directly
  2. Send PDF to Gemini Long-Context for structured extraction
  3. Geocode the target location
  4. Store structured tender in BigQuery
"""
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from loguru import logger

from models.tender import TenderRecord, TenderIngestRequest
from services.gemini_service import parse_tender_pdf
from services.geocoding_service import geocode_location
from services.bigquery_service import insert_tender
from services.gcs_service import upload_file, get_file_bytes

router = APIRouter()


@router.post(
    "/ingest",
    response_model=TenderRecord,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest a government tender PDF",
    description=(
        "Upload a PDF or provide a GCS URI for a government tender. "
        "Gemini extracts structured data: project name, budget, timeline, and location."
    ),
)
async def ingest_tender(
    gcs_uri: Optional[str] = Form(None, description="gs:// URI if PDF is already in GCS"),
    pdf_file: Optional[UploadFile] = File(None, description="Upload PDF directly"),
):
    if not gcs_uri and not pdf_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either 'gcs_uri' or upload 'pdf_file'.",
        )

    # ── Step 1: Upload PDF to GCS if file provided ────────────────────────────
    if pdf_file:
        logger.info(f"Uploading PDF: {pdf_file.filename}")
        pdf_bytes = await pdf_file.read()
        gcs_uri = await upload_file(
            file_bytes=pdf_bytes,
            destination_blob=f"tender-pdfs/{pdf_file.filename}",
            content_type="application/pdf",
        )
        logger.info(f"PDF uploaded to: {gcs_uri}")

    # ── Step 2: Parse tender with Gemini Long-Context ─────────────────────────
    logger.info(f"Sending PDF to Gemini for extraction: {gcs_uri}")
    tender = await parse_tender_pdf(gcs_uri=gcs_uri)
    logger.info(f"Gemini extracted tender: {tender.tender_id}, budget={tender.budget_inr}")

    # ── Step 3: Geocode target location ────────────────────────────────────────
    if (not tender.target_lat or not tender.target_lng) and tender.target_location:
        logger.info(f"Geocoding tender location: {tender.target_location}")
        coords = await geocode_location(tender.target_location)
        if coords:
            tender.target_lat, tender.target_lng = coords

    # ── Step 4: Store in BigQuery ──────────────────────────────────────────────
    logger.info(f"Inserting tender {tender.tender_id} into BigQuery...")
    await insert_tender(tender)

    return tender


@router.get(
    "/list",
    summary="List all ingested tenders",
    description="Returns all active government tenders stored in BigQuery.",
)
async def list_tenders(status_filter: Optional[str] = None):
    from services.bigquery_service import get_tenders
    tenders = await get_tenders(status_filter=status_filter)
    return {"count": len(tenders), "tenders": tenders}
