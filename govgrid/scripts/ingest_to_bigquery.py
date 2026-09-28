"""
GovGrid BigQuery Live Ingestion & GIS Spatial Analysis Pipeline
===============================================================
Populates `eventflow-e3c91.govgrid_dpi.grievances` and
`eventflow-e3c91.govgrid_dpi.tenders` with geocoded public civic records
and executes spatial reconciliation queries.
"""
import sys
import os
import subprocess

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from google.cloud import bigquery
from loguru import logger
from config import settings
from services.data_ingestion_service import (
    generate_synthetic_grievances,
    generate_synthetic_tenders,
)


def get_client() -> bigquery.Client:
    """Returns BigQuery client using ADC or gcloud auth token."""
    import google.auth
    try:
        credentials, _ = google.auth.default()
        return bigquery.Client(project=settings.gcp_project_id, credentials=credentials)
    except Exception:
        from google.oauth2.credentials import Credentials
        token = subprocess.check_output(["gcloud", "auth", "print-access-token"]).decode().strip()
        return bigquery.Client(project=settings.gcp_project_id, credentials=Credentials(token))


def ingest_data():
    client = get_client()
    logger.info(f"Connected to BigQuery project: {client.project}")

    grievances_table_id = f"{settings.gcp_project_id}.{settings.bigquery_dataset}.{settings.bigquery_grievances_table}"
    tenders_table_id = f"{settings.gcp_project_id}.{settings.bigquery_dataset}.{settings.bigquery_tenders_table}"

    # Category mapping helper
    def map_category(raw_cat: str) -> str:
        raw = raw_cat.lower()
        if "road" in raw or "pothole" in raw:
            return "Roads"
        elif "water" in raw or "drainage" in raw or "sewer" in raw:
            return "Water"
        elif "light" in raw or "power" in raw or "discom" in raw:
            return "Electricity"
        elif "garbage" in raw or "sanitat" in raw or "toilet" in raw:
            return "Sanitation"
        return "Other"

    all_grievance_rows = []
    all_tender_rows = []

    # Generate multi-district civic dataset
    for dk in ["anantapur", "bengaluru", "delhi"]:
        logger.info(f"Generating geocoded civic datasets for district: {dk}")
        raw_grievances = generate_synthetic_grievances(dk, count=40)
        raw_tenders = generate_synthetic_tenders(dk, count=15)

        for g in raw_grievances:
            submitted_str = g.get("submitted_date", "2024-06-01")
            submitted_ts = f"{submitted_str}T10:00:00Z"
            row = {
                "complaint_id": g["complaint_id"],
                "category": map_category(g["category"]),
                "severity_score": int(g["severity_score"]),
                "extracted_location": g.get("extracted_location", "Urban Corridor"),
                "lat": float(g["lat"]),
                "lng": float(g["lng"]),
                "damage_assessment": g.get("damage_assessment", "Infrastructure damage reported."),
                "original_language": "English",
                "image_gcs_uri": None,
                "geo_point": f"POINT({g['lng']} {g['lat']})",
                "submitted_at": submitted_ts,
            }
            all_grievance_rows.append(row)

        for t in raw_tenders:
            award_str = t.get("award_date", "2024-01-01")
            ingested_ts = f"{award_str}T09:00:00Z"
            completion_str = t.get("completion_target", "2025-12-31")
            row = {
                "tender_id": t["tender_id"],
                "department": t.get("department", "Public Works Department"),
                "budget_inr": int(t["budget_inr"]),
                "work_description": t.get("work_description", "Civil works"),
                "target_location": t.get("district", "Urban Ward"),
                "target_lat": float(t["target_lat"]),
                "target_lng": float(t["target_lng"]),
                "target_geo_point": f"POINT({t['target_lng']} {t['target_lat']})",
                "expected_completion_date": completion_str,
                "status": t.get("status", "Active"),
                "source_pdf_uri": None,
                "ingested_at": ingested_ts,
            }
            all_tender_rows.append(row)

    # 1. Batch load into grievances table (WRITE_TRUNCATE replaces DELETE DML for free-tier sandbox compatibility)
    logger.info(f"Batch loading {len(all_grievance_rows)} grievances into BigQuery...")
    job_config_g = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )
    load_job_g = client.load_table_from_json(
        all_grievance_rows, grievances_table_id, job_config=job_config_g
    )
    load_job_g.result()
    logger.info(f" Successfully loaded {load_job_g.output_rows} complaints into {grievances_table_id}")

    # 2. Batch load into tenders table
    logger.info(f"Batch loading {len(all_tender_rows)} tenders into BigQuery...")
    job_config_t = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )
    load_job_t = client.load_table_from_json(
        all_tender_rows, tenders_table_id, job_config=job_config_t
    )
    load_job_t.result()
    logger.info(f" Successfully loaded {load_job_t.output_rows} tenders into {tenders_table_id}")

    # 3. Run GIS Spatial Discrepancy & Reconciliation Query
    logger.info("═══ Executing BigQuery GIS Spatial Reconciliation Query (ST_DWithin 800m) ═══")
    spatial_query = f"""
    SELECT
        t.tender_id,
        t.department,
        t.budget_inr,
        t.work_description,
        t.status AS tender_status,
        COUNT(g.complaint_id) AS unresolved_complaints_in_buffer,
        ROUND(AVG(g.severity_score), 1) AS avg_complaint_severity
    FROM `{tenders_table_id}` t
    JOIN `{grievances_table_id}` g
        ON ST_DWITHIN(
            ST_GEOGPOINT(t.target_lng, t.target_lat),
            ST_GEOGPOINT(g.lng, g.lat),
            800
        )
    GROUP BY
        t.tender_id,
        t.department,
        t.budget_inr,
        t.work_description,
        t.status
    HAVING unresolved_complaints_in_buffer >= 2
    ORDER BY avg_complaint_severity DESC, unresolved_complaints_in_buffer DESC
    LIMIT 10;
    """
    job_config_q = bigquery.QueryJobConfig(labels={"datacloud": "antigravity"})
    query_job = client.query(spatial_query, location=settings.gcp_location, job_config=job_config_q)
    results = list(query_job.result())

    print("\n" + "=" * 90)
    print("  GOVGRID BIGQUERY GIS SPATIAL AUDIT REPORT (800m DISCREPANCY MATRIX)")
    print("=" * 90)
    print(f"{'TENDER ID':<18} | {'DEPARTMENT':<24} | {'BUDGET (INR)':<14} | {'STATUS':<9} | {'COMPLAINTS':<10} | {'AVG SEV'}")
    print("-" * 90)
    for r in results:
        budget_str = f"₹{r['budget_inr']:,}"
        print(f"{r['tender_id']:<18} | {r['department'][:24]:<24} | {budget_str:<14} | {r['tender_status']:<9} | {r['unresolved_complaints_in_buffer']:<10} | {r['avg_complaint_severity']}")
    print("=" * 90)
    print(f"Total Flagged Spatial Discrepancies in BigQuery: {len(results)}\n")


if __name__ == "__main__":
    ingest_data()
