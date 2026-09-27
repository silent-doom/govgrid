"""
Gemini Service — Vertex AI / Google Generative AI integration.
Supports:
  1. Multimodal Grievance parsing (Text + optional Image)
  2. Long-context Tender PDF extraction
  3. Resilient fallback for offline/hackathon testing without live GCP credentials.
"""
import json
import re
from typing import Optional
from loguru import logger

from config import settings
from models.grievance import GrievanceRecord
from models.tender import TenderRecord
from utils.prompts import (
    GRIEVANCE_SYSTEM_PROMPT,
    GRIEVANCE_USER_PROMPT_TEMPLATE,
    IMAGE_INSTRUCTION,
    NO_IMAGE_INSTRUCTION,
    TENDER_SYSTEM_PROMPT,
    TENDER_USER_PROMPT,
)


def _clean_json_response(raw_text: str) -> dict:
    """Clean markdown code blocks and parse raw LLM text into a dict."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\n", "", cleaned)
        cleaned = re.sub(r"\n```$", "", cleaned)
    return json.loads(cleaned)


async def parse_grievance(
    text: str,
    image_gcs_uri: Optional[str] = None,
    location_hint: Optional[str] = None,
) -> GrievanceRecord:
    """
    Parses an incoming citizen grievance into structured data.
    Uses Gemini 1.5/3.7 Flash with system prompt and multimodal inputs.
    """
    logger.info(f"Parsing grievance text='{text[:60]}...' with image={image_gcs_uri}")

    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel, Part

        vertexai.init(
            project=settings.gcp_project_id,
            location=settings.vertex_ai_location,
        )

        model = GenerativeModel(
            model_name=settings.vertex_ai_model,
            system_instruction=[GRIEVANCE_SYSTEM_PROMPT],
        )

        image_instruction = IMAGE_INSTRUCTION if image_gcs_uri else NO_IMAGE_INSTRUCTION
        prompt_content = GRIEVANCE_USER_PROMPT_TEMPLATE.format(
            text=text or "Voice/visual report",
            location_hint=location_hint or "Not provided",
            image_instruction=image_instruction,
        )

        contents = []
        if image_gcs_uri:
            # Load GCS image part
            contents.append(Part.from_uri(image_gcs_uri, mime_type="image/jpeg"))
        contents.append(prompt_content)

        response = model.generate_content(
            contents,
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"},
        )

        parsed = _clean_json_response(response.text)
        return GrievanceRecord(
            category=parsed.get("category", "Roads"),
            severity_score=int(parsed.get("severity_score", 5)),
            extracted_location=parsed.get("extracted_location", location_hint or "Unknown Location"),
            lat=parsed.get("lat"),
            lng=parsed.get("lng"),
            damage_assessment=parsed.get("damage_assessment", "Infrastructure deficit reported."),
            original_language=parsed.get("original_language", "Unknown"),
            image_gcs_uri=image_gcs_uri,
        )
    except Exception as e:
        logger.warning(f"Vertex AI call failed or credentials not configured ({e}). Using heuristic fallback.")
        return _heuristic_grievance_fallback(text, location_hint, image_gcs_uri)


async def parse_tender_pdf(gcs_uri: str) -> TenderRecord:
    """
    Parses a government tender PDF stored in GCS using Gemini long-context.
    """
    logger.info(f"Parsing tender PDF from GCS URI: {gcs_uri}")

    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel, Part

        vertexai.init(
            project=settings.gcp_project_id,
            location=settings.vertex_ai_location,
        )

        model = GenerativeModel(
            model_name=settings.vertex_ai_model,
            system_instruction=[TENDER_SYSTEM_PROMPT],
        )

        pdf_part = Part.from_uri(gcs_uri, mime_type="application/pdf")
        response = model.generate_content(
            [pdf_part, TENDER_USER_PROMPT],
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"},
        )

        parsed = _clean_json_response(response.text)
        return TenderRecord(
            tender_id=parsed.get("tender_id", "TNDR-LOCAL-001"),
            department=parsed.get("department", "Public Works Department"),
            budget_inr=int(parsed.get("budget_inr", 2500000)),
            work_description=parsed.get("work_description", "Civil infrastructure development"),
            target_location=parsed.get("target_location", "District Headquarter"),
            target_lat=parsed.get("target_lat"),
            target_lng=parsed.get("target_lng"),
            expected_completion_date=parsed.get("expected_completion_date"),
            status=parsed.get("status", "Active"),
            source_pdf_uri=gcs_uri,
        )
    except Exception as e:
        logger.warning(f"Vertex AI PDF parsing failed or not configured ({e}). Returning fallback tender.")
        return TenderRecord(
            tender_id="AP-PWD-2026-REC-089",
            department="Public Works Department (Roads & Bridges)",
            budget_inr=4500000,
            work_description="Resurfacing and storm-drain reconstruction along Post Office Road to Bus Stand.",
            target_location="Post Office Road, Anantapur",
            target_lat=14.6819,
            target_lng=77.6006,
            status="Active",
            source_pdf_uri=gcs_uri,
        )


def _heuristic_grievance_fallback(text: str, location_hint: Optional[str], image_uri: Optional[str]) -> GrievanceRecord:
    """Heuristic rule-based extraction when API/Credentials are offline."""
    lower = text.lower() if text else ""
    category = "Roads"
    severity = 6

    if any(k in lower for k in ["pothole", "road", "gaddha", "street", "highway", "tar"]):
        category = "Roads"
        severity = 7 if any(k in lower for k in ["accident", "big", "broken", "severe", "kharaab"]) else 5
    elif any(k in lower for k in ["water", "drain", "pipe", "paani", "leak", "sewage", "jal"]):
        category = "Water"
        severity = 8 if "overflow" in lower or "contamination" in lower else 6
    elif any(k in lower for k in ["light", "electric", "pole", "wire", "current", "bijli"]):
        category = "Electricity"
        severity = 8 if "spark" in lower or "wire" in lower else 5
    elif any(k in lower for k in ["garbage", "kachra", "waste", "trash", "cleaning", "safai"]):
        category = "Sanitation"
        severity = 5

    loc = location_hint or "Clock Tower, Anantapur"
    return GrievanceRecord(
        category=category,
        severity_score=severity,
        extracted_location=loc,
        lat=14.6819,
        lng=77.6006,
        damage_assessment=f"Automated evaluation based on reported condition: {text[:140]}",
        original_language="Hindi / Vernacular detected",
        image_gcs_uri=image_uri,
    )
