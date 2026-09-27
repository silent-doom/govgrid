"""
GovGrid Configuration — loads environment variables with Pydantic Settings.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── GCP Core ──────────────────────────────────────────────────────────────
    gcp_project_id: str = "your-gcp-project-id"
    gcp_region: str = "asia-south1"

    # ── BigQuery ──────────────────────────────────────────────────────────────
    bigquery_dataset: str = "govgrid"
    bigquery_grievances_table: str = "grievances"
    bigquery_tenders_table: str = "tenders"
    bigquery_clusters_table: str = "complaint_clusters"

    # ── GCS ───────────────────────────────────────────────────────────────────
    gcs_bucket_name: str = "govgrid-documents"

    # ── Vertex AI / Gemini ────────────────────────────────────────────────────
    vertex_ai_model: str = "gemini-1.5-flash-002"
    vertex_ai_location: str = "us-central1"

    # ── Google Maps ───────────────────────────────────────────────────────────
    google_maps_api_key: str = ""

    # ── Twilio ────────────────────────────────────────────────────────────────
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = "whatsapp:+14155238886"

    # ── App ───────────────────────────────────────────────────────────────────
    app_env: str = "development"
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    @property
    def grievances_table_full(self) -> str:
        return f"{self.gcp_project_id}.{self.bigquery_dataset}.{self.bigquery_grievances_table}"

    @property
    def tenders_table_full(self) -> str:
        return f"{self.gcp_project_id}.{self.bigquery_dataset}.{self.bigquery_tenders_table}"

    @property
    def clusters_table_full(self) -> str:
        return f"{self.gcp_project_id}.{self.bigquery_dataset}.{self.bigquery_clusters_table}"


settings = Settings()
