"""
Script to create the BigQuery dataset and tables with GIS Geography schemas.
Run:
    python scripts/setup_bigquery.py
"""
import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from google.cloud import bigquery
from google.cloud.exceptions import Conflict
from loguru import logger
from config import settings


def get_client(project_id: str):
    import google.auth
    try:
        credentials, _ = google.auth.default()
        return bigquery.Client(project=project_id, credentials=credentials)
    except Exception:
        import subprocess
        from google.oauth2.credentials import Credentials
        token = subprocess.check_output(["gcloud", "auth", "print-access-token"]).decode().strip()
        return bigquery.Client(project=project_id, credentials=Credentials(token))


def setup_bigquery():
    logger.info(f"Initializing BigQuery setup for project: {settings.gcp_project_id}")
    client = get_client(settings.gcp_project_id)

    # 1. Create Dataset
    dataset_id = f"{settings.gcp_project_id}.{settings.bigquery_dataset}"
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = settings.gcp_location
    dataset.labels = {"datacloud": "antigravity"}

    try:
        dataset = client.create_dataset(dataset, timeout=30)
        logger.info(f"Created dataset {dataset_id}")
    except Conflict:
        logger.info(f"Dataset {dataset_id} already exists.")

    # 2. Grievances Table Schema (GIS Geography point)
    grievances_table_id = settings.grievances_table_full
    grievance_schema = [
        bigquery.SchemaField("complaint_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("category", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("severity_score", "INTEGER", mode="NULLABLE"),
        bigquery.SchemaField("extracted_location", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("lat", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("lng", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("damage_assessment", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("original_language", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("audio_recording_uri", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("image_gcs_uri", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("status", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("geo_point", "GEOGRAPHY", mode="NULLABLE"),
        bigquery.SchemaField("submitted_at", "TIMESTAMP", mode="NULLABLE"),
    ]
    grievances_table = bigquery.Table(grievances_table_id, schema=grievance_schema)
    try:
        client.create_table(grievances_table)
        logger.info(f"Created table {grievances_table_id}")
    except Conflict:
        logger.info(f"Table {grievances_table_id} already exists.")

    # 3. Tenders Table Schema (GIS Geography target & buffer polygon)
    tenders_table_id = settings.tenders_table_full
    tenders_schema = [
        bigquery.SchemaField("tender_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("department", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("budget_inr", "INT64", mode="NULLABLE"),
        bigquery.SchemaField("budget_disbursed_inr", "INT64", mode="NULLABLE"),
        bigquery.SchemaField("pfms_transaction_id", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("milestone_progress", "INTEGER", mode="NULLABLE"),
        bigquery.SchemaField("work_description", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("target_location", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("target_lat", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("target_lng", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("target_geo_point", "GEOGRAPHY", mode="NULLABLE"),
        bigquery.SchemaField("buffer_polygon", "GEOGRAPHY", mode="NULLABLE"),
        bigquery.SchemaField("expected_completion_date", "DATE", mode="NULLABLE"),
        bigquery.SchemaField("status", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("contractor", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("source_pdf_uri", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("ingested_at", "TIMESTAMP", mode="NULLABLE"),
    ]
    tenders_table = bigquery.Table(tenders_table_id, schema=tenders_schema)
    try:
        client.create_table(tenders_table)
        logger.info(f"Created table {tenders_table_id}")
    except Conflict:
        logger.info(f"Table {tenders_table_id} already exists.")

    logger.info("BigQuery GIS setup completed successfully!")


if __name__ == "__main__":
    setup_bigquery()
