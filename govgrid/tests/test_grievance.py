"""
Unit tests for Grievance models and endpoints.
"""
import pytest
from pydantic import ValidationError
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from models.grievance import GrievanceRecord


def test_grievance_model_valid():
    record = GrievanceRecord(
        complaint_id="test-uuid-001",
        category="Roads",
        severity_score=8,
        extracted_location="Post Office Road, Anantapur",
        lat=14.6819,
        lng=77.6006,
        damage_assessment="Large pothole causing vehicle damage.",
        original_language="Telugu",
    )
    assert record.category == "Roads"
    assert record.severity_score == 8
    assert record.lat == 14.6819
    assert record.lng == 77.6006


def test_grievance_severity_bounds():
    # Severity score must be between 1 and 10
    with pytest.raises(ValidationError):
        GrievanceRecord(
            category="Roads",
            severity_score=15,  # Invalid
            extracted_location="Main Market",
            damage_assessment="Broken asphalt",
        )
