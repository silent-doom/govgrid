"""
Grievances Router — handles citizen complaint submission.

Simulates the WhatsApp/Twilio webhook. Accepts:
  - text: regional language description
  - audio: optional voice message (base64 or URL)
  - image: optional pothole/infrastructure photo (base64 or URL)

Flow:
  1. Audio → GCP STT → English text
  2. Text + Image → Gemini Flash → structured Grievance JSON
  3. Address → Google Maps → lat/lng
  4. Grievance → BigQuery
  5. Trigger GIS clustering update
"""
import base64
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from loguru import logger

from models.grievance import GrievanceInput, GrievanceRecord
from services.gemini_service import parse_grievance
from services.speech_service import transcribe_audio
from services.geocoding_service import geocode_location
from services.bigquery_service import insert_grievance, run_clustering
from services.gcs_service import upload_file

router = APIRouter()


@router.post(
    "/",
    response_model=GrievanceRecord,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a citizen grievance",
    description=(
        "Accepts a multimodal complaint: text (any language), "
        "optional audio (voice message), and optional image (photo of issue). "
        "Returns a structured grievance record with severity score and coordinates."
    ),
)
async def submit_grievance(
    text: Optional[str] = Form(None, description="Complaint text in any language"),
    location_text: Optional[str] = Form(None, description="Location description in text"),
    audio: Optional[UploadFile] = File(None, description="Voice message (WAV/OGG/MP3)"),
    image: Optional[UploadFile] = File(None, description="Photo of the issue"),
):
    if not text and not audio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of 'text' or 'audio' must be provided.",
        )

    # ── Step 1: Transcribe audio if provided ──────────────────────────────────
    transcribed_text = ""
    if audio:
        logger.info(f"Transcribing audio: {audio.filename}")
        audio_bytes = await audio.read()
        transcribed_text = await transcribe_audio(audio_bytes, audio.content_type)
        logger.info(f"Transcription result: {transcribed_text[:100]}...")

    combined_text = " ".join(filter(None, [text, transcribed_text]))

    # ── Step 2: Upload image to GCS if provided ────────────────────────────────
    image_gcs_uri = None
    if image:
        logger.info(f"Uploading image: {image.filename}")
        image_bytes = await image.read()
        image_gcs_uri = await upload_file(
            file_bytes=image_bytes,
            destination_blob=f"grievance-images/{image.filename}",
            content_type=image.content_type,
        )
        logger.info(f"Image uploaded: {image_gcs_uri}")

    # ── Step 3: Parse grievance with Gemini ────────────────────────────────────
    logger.info("Sending to Gemini for grievance parsing...")
    grievance = await parse_grievance(
        text=combined_text,
        image_gcs_uri=image_gcs_uri,
        location_hint=location_text,
    )
    logger.info(f"Gemini parsed grievance: category={grievance.category}, severity={grievance.severity_score}")

    # ── Step 4: Geocode location if lat/lng not extracted ─────────────────────
    if (not grievance.lat or not grievance.lng) and (grievance.extracted_location or location_text):
        location_query = grievance.extracted_location or location_text
        logger.info(f"Geocoding: {location_query}")
        coords = await geocode_location(location_query)
        if coords:
            grievance.lat, grievance.lng = coords

    # ── Step 5: Store in BigQuery ──────────────────────────────────────────────
    logger.info(f"Inserting grievance {grievance.complaint_id} into BigQuery...")
    await insert_grievance(grievance)

    # ── Step 6: Trigger cluster recomputation (async, non-blocking) ────────────
    logger.info("Triggering GIS cluster recomputation...")
    await run_clustering()

    return grievance


@router.post(
    "/webhook/twilio",
    summary="Twilio WhatsApp Webhook",
    description="Direct webhook endpoint for Twilio WhatsApp integration. Parses TwiML form data.",
)
async def twilio_webhook(
    Body: str = Form(""),
    MediaUrl0: Optional[str] = Form(None),
    From: str = Form(""),
):
    """
    Twilio sends WhatsApp messages as form-encoded POST requests.
    This endpoint normalizes that format and calls the main grievance pipeline.
    """
    logger.info(f"Twilio webhook from {From}: {Body[:80]}")

    grievance = await parse_grievance(
        text=Body,
        image_gcs_uri=MediaUrl0,
        location_hint=None,
    )
    await insert_grievance(grievance)
    await run_clustering()

    # Twilio expects TwiML XML response
    return {"status": "received", "complaint_id": grievance.complaint_id}
