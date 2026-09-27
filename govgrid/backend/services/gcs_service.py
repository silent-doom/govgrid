"""
Google Cloud Storage (GCS) Service.
Handles object uploads for citizen complaint photos and government tender PDFs.
"""
from typing import Optional
from loguru import logger
from config import settings


async def upload_file(
    file_bytes: bytes,
    destination_blob: str,
    content_type: Optional[str] = None,
) -> str:
    """
    Uploads bytes to Google Cloud Storage bucket.
    Returns gs:// URI (or simulated path if running in offline development mode).
    """
    bucket_name = settings.gcs_bucket_name
    try:
        from google.cloud import storage

        client = storage.Client(project=settings.gcp_project_id)
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(destination_blob)

        blob.upload_from_string(
            file_bytes,
            content_type=content_type or "application/octet-stream",
        )
        gcs_uri = f"gs://{bucket_name}/{destination_blob}"
        logger.info(f"File uploaded to {gcs_uri}")
        return gcs_uri

    except Exception as e:
        logger.warning(f"GCS upload unavailable ({e}). Using simulated storage URI.")
        return f"gs://{bucket_name}/{destination_blob}"


async def get_file_bytes(gcs_uri: str) -> Optional[bytes]:
    """
    Downloads object bytes from a gs:// URI.
    """
    try:
        from google.cloud import storage

        parts = gcs_uri.replace("gs://", "").split("/", 1)
        bucket_name, blob_name = parts[0], parts[1]

        client = storage.Client(project=settings.gcp_project_id)
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        return blob.download_as_bytes()
    except Exception as e:
        logger.warning(f"GCS download failed for {gcs_uri}: {e}")
        return None
