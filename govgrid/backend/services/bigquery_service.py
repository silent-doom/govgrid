"""
BigQuery GIS Service — The spatial intelligence and reconciliation engine.
Handles:
  1. Ingestion of Grievances and Tenders into BigQuery
  2. Spatial Clustering using BigQuery GIS (ST_DISTANCE <= 500m)
  3. Reconciliation: Cross-referencing complaint clusters against tender work zones
     - High Priority Unfunded Liabilities (Complaints with NO tender coverage)
     - Potential Capital Leakage (Tender is funded/active, but severe complaints continue)
  4. Local resilient in-memory store for offline development/hackathon demos.
"""
import math
from datetime import datetime
from typing import Any, Dict, List, Optional
from loguru import logger

from config import settings
from models.grievance import GrievanceRecord
from models.tender import TenderRecord

# ── Local Demo Fallback Storage (Preserves state if BigQuery is not connected) ──
_LOCAL_GRIEVANCES: List[Dict[str, Any]] = [
    {
        "complaint_id": "c1a2b3c4-0001",
        "category": "Roads",
        "severity_score": 9,
        "extracted_location": "Main Market Road near Clock Tower",
        "lat": 14.6835,
        "lng": 77.6012,
        "damage_assessment": "Severe crater-like potholes causing major traffic choke and accidents during monsoon.",
        "original_language": "Telugu",
        "submitted_at": "2026-09-24T10:15:00",
    },
    {
        "complaint_id": "c1a2b3c4-0002",
        "category": "Roads",
        "severity_score": 8,
        "extracted_location": "Clock Tower Roundabout",
        "lat": 14.6838,
        "lng": 77.6016,
        "damage_assessment": "Broken asphalt and exposed rebar on pedestrian crossing.",
        "original_language": "Hindi",
        "submitted_at": "2026-09-24T11:20:00",
    },
    {
        "complaint_id": "c1a2b3c4-0003",
        "category": "Roads",
        "severity_score": 7,
        "extracted_location": "Opposite Gandhi Statue, Market Road",
        "lat": 14.6832,
        "lng": 77.6009,
        "damage_assessment": "Asphalt washed away, loose gravel dangerous for two-wheelers.",
        "original_language": "English",
        "submitted_at": "2026-09-25T09:00:00",
    },
    {
        "complaint_id": "c1a2b3c4-0004",
        "category": "Water",
        "severity_score": 9,
        "extracted_location": "Slum Colony B, Near Railway Line",
        "lat": 14.6710,
        "lng": 77.5890,
        "damage_assessment": "Drinking water pipeline ruptured, contaminated water mixing with sewage drainage.",
        "original_language": "Telugu",
        "submitted_at": "2026-09-25T14:40:00",
    },
    {
        "complaint_id": "c1a2b3c4-0005",
        "category": "Water",
        "severity_score": 8,
        "extracted_location": "Railway Gate Ward 4",
        "lat": 14.6715,
        "lng": 77.5895,
        "damage_assessment": "Zero water pressure for 4 days, pipeline burst underground.",
        "original_language": "Kannada",
        "submitted_at": "2026-09-26T08:15:00",
    },
    {
        "complaint_id": "c1a2b3c4-0006",
        "category": "Electricity",
        "severity_score": 8,
        "extracted_location": "Subhash Nagar 3rd Cross",
        "lat": 14.6920,
        "lng": 77.6105,
        "damage_assessment": "Transformer sparks regularly, low dangling high-voltage wire.",
        "original_language": "Hindi",
        "submitted_at": "2026-09-26T07:10:00",
    },
]

_LOCAL_TENDERS: List[Dict[str, Any]] = [
    {
        "tender_id": "AP-PWD-2025-RD-440",
        "department": "Public Works Department",
        "budget_inr": 8500000,
        "work_description": "Comprehensive resurfacing and drainage upgrade of Clock Tower Commercial Corridor.",
        "target_location": "Clock Tower to Old Bus Stand, Anantapur",
        "target_lat": 14.6835,
        "target_lng": 77.6012,
        "expected_completion_date": "2026-11-30",
        "status": "Active",
        "radius_meters": 600,
    },
    {
        "tender_id": "AP-MWSSB-2026-WTR-102",
        "department": "Municipal Water Supply & Sewerage Board",
        "budget_inr": 3200000,
        "work_description": "Laying of new DI trunk main pipeline along Collectorate bypass.",
        "target_location": "District Collectorate Circle, Anantapur",
        "target_lat": 14.6780,
        "target_lng": 77.5950,
        "expected_completion_date": "2027-03-31",
        "status": "Active",
        "radius_meters": 500,
    },
]


def _haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two points in meters."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ── BigQuery Ingestion ────────────────────────────────────────────────────────

async def insert_grievance(record: GrievanceRecord) -> bool:
    """Inserts a structured grievance record into BigQuery."""
    data = record.model_dump(mode="json")
    _LOCAL_GRIEVANCES.append(data)

    try:
        from google.cloud import bigquery

        client = bigquery.Client(project=settings.gcp_project_id)
        table_id = settings.grievances_table_full

        # Add BQ GIS Geography point if coords available
        bq_row = dict(data)
        if record.lat and record.lng:
            bq_row["geo_point"] = f"POINT({record.lng} {record.lat})"

        errors = client.insert_rows_json(table_id, [bq_row])
        if errors:
            logger.error(f"BigQuery grievance insert errors: {errors}")
            return False
        logger.info(f"BigQuery grievance inserted: {record.complaint_id}")
        return True
    except Exception as e:
        logger.warning(f"BigQuery not available or insert skipped ({e}). Saved in-memory.")
        return True


async def insert_tender(record: TenderRecord) -> bool:
    """Inserts a structured tender record into BigQuery."""
    data = record.model_dump(mode="json")
    _LOCAL_TENDERS.append(data)

    try:
        from google.cloud import bigquery

        client = bigquery.Client(project=settings.gcp_project_id)
        table_id = settings.tenders_table_full

        bq_row = dict(data)
        if record.target_lat and record.target_lng:
            bq_row["target_geo_point"] = f"POINT({record.target_lng} {record.target_lat})"

        errors = client.insert_rows_json(table_id, [bq_row])
        if errors:
            logger.error(f"BigQuery tender insert errors: {errors}")
            return False
        logger.info(f"BigQuery tender inserted: {record.tender_id}")
        return True
    except Exception as e:
        logger.warning(f"BigQuery not available or insert skipped ({e}). Saved in-memory.")
        return True


# ── BigQuery GIS Spatial Clustering ──────────────────────────────────────────

async def run_clustering() -> None:
    """
    Executes BigQuery GIS spatial clustering.
    Uses ST_CLUSTERDBSCAN with 500m radius threshold to identify Infrastructure Deficit Zones.
    """
    query = f"""
    CREATE OR REPLACE TABLE `{settings.clusters_table_full}` AS
    WITH ClusteredComplaints AS (
      SELECT
        complaint_id,
        category,
        severity_score,
        extracted_location,
        lat,
        lng,
        ST_GEOGPOINT(lng, lat) AS point,
        ST_CLUSTERDBSCAN(ST_GEOGPOINT(lng, lat), 500, 1) OVER () AS cluster_id
      FROM `{settings.grievances_table_full}`
      WHERE lat IS NOT NULL AND lng IS NOT NULL
    )
    SELECT
      cluster_id,
      COUNT(1) as total_complaints,
      MAX(severity_score) as max_severity,
      AVG(severity_score) as avg_severity,
      ARRAY_AGG(DISTINCT category) as categories,
      ST_CENTROID(ST_UNION_AGG(point)) as centroid_point,
      ST_Y(ST_CENTROID(ST_UNION_AGG(point))) as centroid_lat,
      ST_X(ST_CENTROID(ST_UNION_AGG(point))) as centroid_lng,
      ANY_VALUE(extracted_location) as primary_location
    FROM ClusteredComplaints
    GROUP BY cluster_id;
    """
    try:
        from google.cloud import bigquery

        client = bigquery.Client(project=settings.gcp_project_id)
        job = client.query(query)
        job.result()
        logger.info("BigQuery GIS clustering job successfully completed.")
    except Exception as e:
        logger.info(f"Using local spatial clustering engine (BigQuery offline/mock mode: {e})")


async def get_complaint_clusters(min_complaints: int = 1) -> List[Dict[str, Any]]:
    """
    Returns spatial clusters of complaints with aggregated statistics.
    Falls back to local Haversine clustering when BigQuery is offline.
    """
    try:
        from google.cloud import bigquery

        client = bigquery.Client(project=settings.gcp_project_id)
        query = f"""
        SELECT
          cluster_id,
          total_complaints,
          max_severity,
          avg_severity,
          categories,
          centroid_lat,
          centroid_lng,
          primary_location
        FROM `{settings.clusters_table_full}`
        WHERE total_complaints >= {min_complaints}
        ORDER BY max_severity DESC, total_complaints DESC;
        """
        rows = client.query(query).result()
        return [dict(row) for row in rows]
    except Exception:
        # Local clustering algorithm (500m radius threshold)
        clusters: List[Dict[str, Any]] = []
        visited = set()

        valid_complaints = [g for g in _LOCAL_GRIEVANCES if g.get("lat") and g.get("lng")]

        for i, c1 in enumerate(valid_complaints):
            if i in visited:
                continue

            current_group = [c1]
            visited.add(i)

            for j, c2 in enumerate(valid_complaints):
                if j not in visited:
                    dist = _haversine_meters(c1["lat"], c1["lng"], c2["lat"], c2["lng"])
                    if dist <= 500:
                        current_group.append(c2)
                        visited.add(j)

            total = len(current_group)
            if total >= min_complaints:
                avg_lat = sum(c["lat"] for c in current_group) / total
                avg_lng = sum(c["lng"] for c in current_group) / total
                max_sev = max(c["severity_score"] for c in current_group)
                avg_sev = round(sum(c["severity_score"] for c in current_group) / total, 1)
                categories = list({c["category"] for c in current_group})

                clusters.append({
                    "cluster_id": f"CLUST-{len(clusters) + 1}",
                    "total_complaints": total,
                    "max_severity": max_sev,
                    "avg_severity": avg_sev,
                    "categories": categories,
                    "centroid_lat": avg_lat,
                    "centroid_lng": avg_lng,
                    "primary_location": current_group[0].get("extracted_location", "Unknown Location"),
                    "complaints": current_group,
                })

        clusters.sort(key=lambda x: (x["max_severity"], x["total_complaints"]), reverse=True)
        return clusters


async def get_tenders(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fetches all tenders."""
    try:
        from google.cloud import bigquery

        client = bigquery.Client(project=settings.gcp_project_id)
        where = f"WHERE status = '{status_filter}'" if status_filter else ""
        query = f"SELECT * FROM `{settings.tenders_table_full}` {where}"
        return [dict(r) for r in client.query(query).result()]
    except Exception:
        if status_filter:
            return [t for t in _LOCAL_TENDERS if t.get("status") == status_filter]
        return list(_LOCAL_TENDERS)


# ── DPI Reconciliation Engine ────────────────────────────────────────────────

async def get_reconciliation_report() -> Dict[str, Any]:
    """
    Reconciles citizen complaint clusters against active government tenders.
    Outputs:
      1. Unfunded Liabilities: High severity complaint clusters with 0 active tenders within 500m.
      2. Capital Leakage: Active tenders within 500m of recurring severe complaints.
    """
    clusters = await get_complaint_clusters(min_complaints=1)
    tenders = await get_tenders()

    unfunded_liabilities = []
    capital_leakage = []

    for cluster in clusters:
        c_lat = cluster["centroid_lat"]
        c_lng = cluster["centroid_lng"]

        # Find matching tenders within 500m
        matched_tenders = []
        for tender in tenders:
            t_lat = tender.get("target_lat")
            t_lng = tender.get("target_lng")
            if t_lat and t_lng:
                dist = _haversine_meters(c_lat, c_lng, t_lat, t_lng)
                if dist <= 600:  # Within tender impact buffer
                    matched_tenders.append({**tender, "distance_meters": round(dist)})

        if not matched_tenders:
            # Unfunded Liability: Citizens suffering, NO budget allocated!
            unfunded_liabilities.append({
                "cluster_id": cluster["cluster_id"],
                "location": cluster["primary_location"],
                "total_complaints": cluster["total_complaints"],
                "severity": cluster["max_severity"],
                "categories": cluster["categories"],
                "lat": c_lat,
                "lng": c_lng,
                "alert_level": "CRITICAL" if cluster["max_severity"] >= 8 else "WARNING",
                "recommended_action": "Issue urgent municipal spot-tender or disaster fund allocation.",
            })
        else:
            # Tender exists! If complaints are severe, this is Potential Capital Leakage
            for mt in matched_tenders:
                if cluster["max_severity"] >= 7:
                    capital_leakage.append({
                        "tender_id": mt["tender_id"],
                        "department": mt.get("department", "Public Works Department"),
                        "budget_inr": mt.get("budget_inr", 0),
                        "work_description": mt.get("work_description"),
                        "cluster_id": cluster["cluster_id"],
                        "location": cluster["primary_location"],
                        "complaint_count": cluster["total_complaints"],
                        "max_severity": cluster["max_severity"],
                        "distance_meters": mt["distance_meters"],
                        "alert_level": "AUDIT_REQUIRED",
                        "leakage_reason": "High-budget active tender is on record, but severe unresolved citizen complaints continue in the exact worksite radius.",
                    })

    return {
        "generated_at": datetime.utcnow().isoformat(),
        "unfunded_liabilities_count": len(unfunded_liabilities),
        "capital_leakage_count": len(capital_leakage),
        "unfunded_liabilities": unfunded_liabilities,
        "capital_leakage": capital_leakage,
    }


async def get_district_summary() -> Dict[str, Any]:
    """Returns high level DPI accountability metrics for executive dashboards."""
    clusters = await get_complaint_clusters()
    tenders = await get_tenders()
    reconciliation = await get_reconciliation_report()

    total_complaints = sum(c["total_complaints"] for c in clusters)
    total_budget = sum(t.get("budget_inr", 0) for t in tenders)

    return {
        "total_complaints": total_complaints,
        "active_clusters": len(clusters),
        "total_tenders": len(tenders),
        "total_budget_allocated_inr": total_budget,
        "unfunded_liabilities_count": reconciliation["unfunded_liabilities_count"],
        "capital_leakage_alerts": reconciliation["capital_leakage_count"],
        "accountability_index_pct": round(
            max(0, 100 - (reconciliation["unfunded_liabilities_count"] * 15 + reconciliation["capital_leakage_count"] * 20)), 1
        ),
    }
