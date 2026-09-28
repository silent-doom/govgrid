"""
Grievance Pydantic models — exact schemas from the PRD.
"""
import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class GrievanceInput(BaseModel):
    """Raw input from user before AI processing."""
    raw_text: Optional[str] = None
    audio_gcs_uri: Optional[str] = None
    image_gcs_uri: Optional[str] = None
    location_hint: Optional[str] = None


class GrievanceRecord(BaseModel):
    """
    Structured grievance output from Gemini.
    Matches the PRD target JSON schema exactly.
    """
    complaint_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier for this complaint",
    )
    category: Literal["Roads", "Water", "Electricity", "Sanitation", "Other"] = Field(
        description="Infrastructure category of the complaint",
    )
    severity_score: int = Field(
        ge=1, le=10,
        description="Severity score from 1 (minor) to 10 (critical)",
    )
    extracted_location: str = Field(
        description="Human-readable location extracted from complaint",
    )
    lat: Optional[float] = Field(None, description="Latitude (from geocoding)")
    lng: Optional[float] = Field(None, description="Longitude (from geocoding)")
    damage_assessment: str = Field(
        description="Short AI-generated description of the damage based on image/text",
    )
    original_language: Optional[str] = Field(None, description="Detected source language")
    audio_recording_uri: Optional[str] = Field(None, description="GCS URI of citizen voice note")
    image_gcs_uri: Optional[str] = Field(None, description="GCS URI of uploaded image")
    status: str = Field(default="Open", description="Grievance status (Open, Escalated, In Progress, Resolved)")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "complaint_id": "550e8400-e29b-41d4-a716-446655440000",
                "category": "Roads",
                "severity_score": 8,
                "extracted_location": "Behind main post office, Anantapur",
                "lat": 14.6819,
                "lng": 77.6006,
                "damage_assessment": "Large pothole approximately 2ft diameter on main road, water logging visible. Risk of vehicle damage and pedestrian injury.",
                "original_language": "Telugu",
                "submitted_at": "2026-09-26T07:30:00Z",
            }
        }
