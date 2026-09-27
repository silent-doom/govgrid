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


def setup_bigquery():
    logger.info(f"Initializing BigQuery setup for project: {settings.gcp_project_id}")
    client = bigquery.Client(project=settings.gcp_project_id)

    # 1. Create Dataset
    dataset_id = f"{settings.gcp_project_id}.{settings.bigquery_dataset}"
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = settings.gcp_location

    try:
        dataset = client.create_dataset(dataset, timeout=30)
        logger.info(f"Created dataset {dataset_id}")
    except Conflict:
        logger.info(f"Dataset {dataset_id} already exists.")

    # 2. Grievances Table Schema
    grievances_table_id = settings.grievances_table_full
    grievance_schema = [
        bigquery.SchemaField("complaint_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("category", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("severity_score", "INTEGER", mode="REQUIRED"),
        bigquery.SchemaField("extracted_location", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("lat", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("lng", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("damage_assessment", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("original_language", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("image_gcs_uri", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("geo_point", "GEOGRAPHY", mode="NULLABLE"),
        bigquery.SchemaField("submitted_at", "TIMESTAMP", mode="REQUIRED"),
    ]
    grievances_table = bigquery.Table(grievances_table_id, schema=grievance_schema)
    try:
        client.create_table(grievances_table)
        logger.info(f"Created table {grievances_table_id}")
    except Conflict:
        logger.info(f"Table {grievances_table_id} already exists.")

    # 3. Tenders Table Schema
    tenders_table_id = settings.tenders_table_full
    tenders_schema = [
        bigquery.SchemaField("tender_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("department", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("budget_inr", "INT64", mode="REQUIRED"),
        bigquery.SchemaField("work_description", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("target_location", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("target_lat", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("target_lng", "FLOAT", mode="NULLABLE"),
        bigquery.SchemaField("target_geo_point", "GEOGRAPHY", mode="NULLABLE"),
        bigquery.SchemaField("expected_completion_date", "DATE", mode="NULLABLE"),
        bigquery.SchemaField("status", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("source_pdf_uri", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("ingested_at", "TIMESTAMP", mode="REQUIRED"),
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
