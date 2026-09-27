"""
Seed Mock Data Script — Ingests realistic test complaints and tenders.
Can be executed to seed BigQuery or tested locally.
"""
import sys
import os
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from models.grievance import GrievanceRecord
from models.tender import TenderRecord
from services.bigquery_service import insert_grievance, insert_tender, run_clustering
from loguru import logger

SAMPLE_GRIEVANCES = [
    GrievanceRecord(
        complaint_id="GRV-2026-AP-001",
        category="Roads",
        severity_score=9,
        extracted_location="Clock Tower, Post Office Junction, Anantapur",
        lat=14.6835,
        lng=77.6012,
        damage_assessment="Large 3-meter pothole after heavy rain causing severe traffic accidents. Two motorists injured.",
        original_language="Telugu",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-002",
        category="Roads",
        severity_score=8,
        extracted_location="100m West of Clock Tower Junction, Anantapur",
        lat=14.6839,
        lng=77.6018,
        damage_assessment="Crumbling asphalt and water pooling on main commercial thoroughfare.",
        original_language="Hindi",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-003",
        category="Roads",
        severity_score=8,
        extracted_location="Near Gandhi Statue, Market Road, Anantapur",
        lat=14.6831,
        lng=77.6008,
        damage_assessment="Road surface completely stripped away exposing gravel and sharp stones.",
        original_language="Telugu",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-004",
        category="Water",
        severity_score=9,
        extracted_location="Slum Cluster Ward 12, Anantapur",
        lat=14.6710,
        lng=77.5890,
        damage_assessment="Main water distribution pipe burst, sewage mixing into potable water supply. Severe health hazard.",
        original_language="Telugu",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-005",
        category="Water",
        severity_score=7,
        extracted_location="Railway Gate Ward 12, Anantapur",
        lat=14.6714,
        lng=77.5894,
        damage_assessment="Drinking water supply disrupted for the last 5 days due to pipe crack.",
        original_language="Kannada",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-006",
        category="Electricity",
        severity_score=8,
        extracted_location="Subhash Road Cross 4, Anantapur",
        lat=14.6920,
        lng=77.6105,
        damage_assessment="Distribution transformer catching fire intermittently with low hanging wires.",
        original_language="Hindi",
    ),
    GrievanceRecord(
        complaint_id="GRV-2026-AP-007",
        category="Sanitation",
        severity_score=7,
        extracted_location="Old Bus Stand Sanitary Canal, Anantapur",
        lat=14.6865,
        lng=77.6035,
        damage_assessment="Open municipal drain choked with plastic refuse causing stagnant toxic backflow.",
        original_language="Telugu",
    ),
]

SAMPLE_TENDERS = [
    TenderRecord(
        tender_id="AP-R&B-2025-PKG-882",
        department="Roads and Buildings Department, Govt of AP",
        budget_inr=7500000,  # 75 Lakhs
        work_description="Bituminous resurfacing, pothole remediation and concrete paver installation at Clock Tower Junction.",
        target_location="Clock Tower, Anantapur",
        target_lat=14.6835,
        target_lng=77.6012,
        expected_completion_date="2026-10-31",
        status="Active",
    ),
    TenderRecord(
        tender_id="AP-DMA-2026-SAN-104",
        department="Directorate of Municipal Administration",
        budget_inr=2800000,  # 28 Lakhs
        work_description="Desilting and underground RCC pipeline boxing along Old Bus Stand Canal.",
        target_location="Old Bus Stand, Anantapur",
        target_lat=14.6865,
        target_lng=77.6035,
        expected_completion_date="2027-01-15",
        status="Active",
    ),
]


async def seed_data():
    logger.info("Seeding realistic GovGrid demo data...")
    for grv in SAMPLE_GRIEVANCES:
        await insert_grievance(grv)
        logger.info(f"Seeded Grievance: {grv.complaint_id} ({grv.category}, Sev {grv.severity_score})")

    for tnd in SAMPLE_TENDERS:
        await insert_tender(tnd)
        logger.info(f"Seeded Tender: {tnd.tender_id} (₹{tnd.budget_inr:,})")

    await run_clustering()
    logger.info("Data seeding and clustering complete! Open the dashboard or query the API.")


if __name__ == "__main__":
    asyncio.run(seed_data())
