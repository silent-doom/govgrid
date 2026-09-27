"""
Unit tests for Tender models and spatial reconciliation logic.
"""
import pytest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from models.tender import TenderRecord
from services.bigquery_service import _haversine_meters


def test_tender_model_valid():
    tender = TenderRecord(
        tender_id="AP-PWD-2026-TEST",
        department="Public Works Department",
        budget_inr=5000000,
        work_description="Road widening and resurfacing",
        target_location="Anantapur",
        target_lat=14.6819,
        target_lng=77.6006,
        status="Active",
    )
    assert tender.tender_id == "AP-PWD-2026-TEST"
    assert tender.budget_inr == 5000000
    assert tender.status == "Active"


def test_haversine_distance():
    # Test distance between two known points in Anantapur (~180m apart)
    dist = _haversine_meters(14.6835, 77.6012, 14.6838, 77.6016)
    assert 0 < dist < 300  # Should be within reasonable radius (< 300m)
