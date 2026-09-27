"""
Tender Pydantic models — exact schemas from the PRD.
"""
import uuid
from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class TenderIngestRequest(BaseModel):
    """Request to ingest a tender via GCS URI."""
    gcs_uri: str = Field(description="gs:// URI of the tender PDF in GCS")


class TenderRecord(BaseModel):
    """
    Structured tender output from Gemini long-context extraction.
    Matches the PRD target JSON schema exactly.
    """
    tender_id: str = Field(
        description="Official tender ID extracted from the PDF",
    )
    department: str = Field(
        description="Government department issuing the tender",
    )
    budget_inr: int = Field(
        description="Allocated budget in Indian Rupees",
    )
    work_description: str = Field(
        description="Description of the infrastructure work to be done",
    )
    target_location: Optional[str] = Field(
        None, description="Human-readable target location string"
    )
    target_lat: Optional[float] = Field(None, description="Target latitude")
    target_lng: Optional[float] = Field(None, description="Target longitude")
    expected_completion_date: Optional[date] = Field(
        None, description="Expected project completion date"
    )
    status: Literal["Active", "Completed", "Pending"] = Field(
        default="Active",
        description="Current tender status",
    )
    source_pdf_uri: Optional[str] = Field(
        None, description="GCS URI of the source PDF"
    )
    ingested_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "tender_id": "AP/PWD/2026/RD/0892",
                "department": "Andhra Pradesh Public Works Department",
                "budget_inr": 4500000,
                "work_description": "Repair and relaying of BT road from Post Office Junction to Bus Stand, Anantapur",
                "target_location": "Anantapur, Andhra Pradesh",
                "target_lat": 14.6819,
                "target_lng": 77.6006,
                "expected_completion_date": "2026-12-31",
                "status": "Active",
            }
        }
