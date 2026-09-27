"""
GovGrid Public Data Ingestion Service
======================================
Pulls real publicly available Indian government datasets and prepares them for
frontend visualization and BigQuery analysis.

Data Sources:
  1. data.gov.in OGD API  — Central government spending / grievances
  2. OpenStreetMap Overpass API  — Infrastructure features (hospitals, schools, roads)
  3. World Bank Open Data API  — Development indicators for Indian states
  4. CPGRAMS-style synthetic fallback  — When live APIs are unavailable

Usage:
  python -m backend.services.data_ingestion_service --district anantapur --output data/ingested/

Author: GovGrid DPI Team
"""

import json
import logging
import os
import time
import hashlib
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
import urllib.request
import urllib.error
import urllib.parse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")

# ──────────────────────────────────────────────────────────────
#  Configuration
# ──────────────────────────────────────────────────────────────

OGD_BASE = "https://api.data.gov.in/resource"
WORLD_BANK_BASE = "https://api.worldbank.org/v2"
OVERPASS_BASE = "https://overpass-api.de/api/interpreter"

DISTRICTS = {
    "anantapur": {
        "name": "Anantapur, Andhra Pradesh",
        "state": "IN.AP",
        "wb_state": "IND",
        "bbox": "14.1,77.0,15.0,77.8",
        "center": [14.685, 77.600],
        "lgd_code": "28001",
    },
    "bengaluru": {
        "name": "Bengaluru Urban, Karnataka",
        "state": "IN.KA",
        "wb_state": "IND",
        "bbox": "12.7,77.4,13.2,77.8",
        "center": [12.971, 77.594],
        "lgd_code": "29024",
    },
    "delhi": {
        "name": "New Delhi, NCT",
        "state": "IN.DL",
        "wb_state": "IND",
        "bbox": "28.4,76.8,28.9,77.4",
        "center": [28.614, 77.209],
        "lgd_code": "07001",
    },
}

# Public OGD datasets (resource IDs from data.gov.in)
OGD_DATASETS = {
    "cpgrams_grievances": {
        "resource_id": "e4e8ead7-f342-4e40-8e52-29d7985e6b1c",
        "desc": "CPGRAMS Grievance Redressal Data",
        "fallback": True,
    },
    "municipal_budget": {
        "resource_id": "7eef3297-8df1-4e4a-90c2-d8a8c90a6b9e",
        "desc": "Municipal Corporation Budget Allocation",
        "fallback": True,
    },
    "infrastructure_projects": {
        "resource_id": "9b0e5f1a-c7a3-4b8d-8d0e-0f2d6e3a9c1b",
        "desc": "Central Sector Infrastructure Projects (MoSPI)",
        "fallback": True,
    },
}

# ──────────────────────────────────────────────────────────────
#  HTTP Helpers
# ──────────────────────────────────────────────────────────────

def _safe_get(url: str, timeout: int = 15) -> Optional[dict]:
    """Simple HTTP GET returning parsed JSON or None on error."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "GovGrid-DPI/1.0 (+hackathon)"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, json.JSONDecodeError, Exception) as e:
        logger.warning("HTTP fetch failed for %s: %s", url, e)
        return None


# ──────────────────────────────────────────────────────────────
#  1. World Bank Development Indicators
# ──────────────────────────────────────────────────────────────

WB_INDICATORS = {
    "SP.URB.TOTL.IN.ZS": "urban_population_pct",
    "SL.UEM.TOTL.ZS":    "unemployment_rate",
    "SI.POV.DDAY":        "poverty_headcount_ratio",
    "SH.STA.BASS.ZS":    "sanitation_access_pct",
    "SH.H2O.BASW.ZS":   "water_access_pct",
    "SE.PRM.ENRR":        "primary_school_enrollment",
    "SH.MED.BEDS.ZS":    "hospital_beds_per_1000",
    "EN.ATM.PM25.MC.ZS": "pm25_exposure",
}


def fetch_world_bank_indicators(country: str = "IND") -> dict:
    """Fetch World Bank indicators for India. Returns flat dict of latest values."""
    results = {}
    for indicator_code, field_name in WB_INDICATORS.items():
        url = (
            f"{WORLD_BANK_BASE}/country/{country}/indicator/{indicator_code}"
            f"?format=json&mrv=5&per_page=5"
        )
        data = _safe_get(url)
        if data and len(data) > 1 and data[1]:
            for entry in data[1]:
                if entry.get("value") is not None:
                    results[field_name] = {
                        "value": round(float(entry["value"]), 2),
                        "year": entry.get("date", "N/A"),
                        "indicator": indicator_code,
                    }
                    break
        time.sleep(0.1)  # Respect rate limits

    logger.info("World Bank: fetched %d indicators for %s", len(results), country)
    return results


# ──────────────────────────────────────────────────────────────
#  2. OpenStreetMap Infrastructure Data
# ──────────────────────────────────────────────────────────────

OSM_QUERIES = {
    "hospitals": '[out:json];(node["amenity"="hospital"]({bbox});way["amenity"="hospital"]({bbox}););out center;',
    "schools":   '[out:json];(node["amenity"="school"]({bbox});way["amenity"="school"]({bbox}););out center;',
    "roads_km":  '[out:json];way["highway"~"primary|secondary|tertiary"]({bbox});out count;',
    "water_sources": '[out:json];(node["amenity"="water_point"]({bbox});node["man_made"="water_well"]({bbox}););out;',
}


def fetch_osm_infrastructure(district_key: str) -> dict:
    """Query OSM Overpass API for infrastructure features in a district bounding box."""
    d = DISTRICTS.get(district_key)
    if not d:
        return {}

    bbox = d["bbox"]
    infra = {}

    for feature, template in OSM_QUERIES.items():
        query = template.replace("{bbox}", bbox)
        encoded = urllib.parse.urlencode({"data": query})
        url = f"{OVERPASS_BASE}?{encoded}"
        data = _safe_get(url, timeout=25)
        if data and "elements" in data:
            infra[feature] = {
                "count": len(data["elements"]),
                "elements": [
                    {
                        "id": el.get("id"),
                        "lat": el.get("lat") or el.get("center", {}).get("lat"),
                        "lon": el.get("lon") or el.get("center", {}).get("lon"),
                        "name": el.get("tags", {}).get("name", "Unknown"),
                        "type": el.get("type"),
                    }
                    for el in data["elements"][:50]  # Cap at 50 per feature
                ],
            }
            logger.info("OSM %s: %d %s found in %s", district_key, len(data["elements"]), feature, bbox)
        else:
            infra[feature] = {"count": 0, "elements": []}
        time.sleep(1)  # Overpass rate limit: 1 request/sec

    return infra


# ──────────────────────────────────────────────────────────────
#  3. OGD Platform India (data.gov.in)
# ──────────────────────────────────────────────────────────────

def fetch_ogd_dataset(resource_id: str, api_key: str = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b",
                       limit: int = 100, offset: int = 0) -> Optional[list]:
    """
    Fetch records from data.gov.in open API.
    The default API key is the public demo key; replace with registered key for production.
    """
    url = (
        f"{OGD_BASE}/{resource_id}"
        f"?api-key={api_key}&format=json&limit={limit}&offset={offset}"
    )
    data = _safe_get(url)
    if data and "records" in data:
        return data["records"]
    return None


# ──────────────────────────────────────────────────────────────
#  4. Synthetic CPGRAMS-style Fallback Generator
# ──────────────────────────────────────────────────────────────

import random
import math

CATEGORIES = [
    "Road & Pothole Repair", "Water Supply Failure", "Sewerage Overflow",
    "Streetlight Malfunction", "Garbage Collection Backlog", "Drainage Blockage",
    "Hospital Infrastructure", "School Building Damage", "Park Encroachment",
    "Public Toilet Non-Functional", "Illegal Construction", "Air Pollution",
]

DEPARTMENTS = [
    "PWD – Roads & Bridges", "PHE – Water Supply", "Municipal Corp. Sanitation",
    "BESCOM / DISCOM", "BBMP Solid Waste Mgmt", "Urban Development Authority",
    "Panchayati Raj", "Health & Family Welfare", "Revenue Department",
]

STATUS_WEIGHTS = [("Open", 0.38), ("In Progress", 0.30), ("Resolved", 0.22), ("Escalated", 0.10)]


def _weighted_choice(options_weights):
    r = random.random()
    cumulative = 0
    for val, w in options_weights:
        cumulative += w
        if r <= cumulative:
            return val
    return options_weights[-1][0]


def _jitter_coord(base_lat: float, base_lng: float, radius_km: float = 15) -> tuple:
    r = radius_km / 111.0
    angle = random.uniform(0, 2 * math.pi)
    dist = random.uniform(0, r)
    return round(base_lat + dist * math.cos(angle), 6), round(base_lng + dist * math.sin(angle), 6)


def generate_synthetic_grievances(district_key: str, count: int = 60) -> list:
    """Generate realistic CPGRAMS-style grievance records for a district."""
    d = DISTRICTS.get(district_key, DISTRICTS["anantapur"])
    base_lat, base_lng = d["center"]
    records = []
    base_date = datetime(2024, 1, 1)

    for i in range(count):
        lat, lng = _jitter_coord(base_lat, base_lng, 12)
        submitted_days_ago = random.randint(1, 365)
        submitted_date = base_date + timedelta(days=365 - submitted_days_ago)
        severity = random.choices(range(1, 11), weights=[5,8,10,12,15,14,12,10,8,6])[0]
        category = random.choice(CATEGORIES)
        status = _weighted_choice(STATUS_WEIGHTS)

        records.append({
            "complaint_id": f"CPGR-{district_key[:3].upper()}-{2024}-{1000+i:04d}",
            "district": d["name"],
            "lgd_code": d["lgd_code"],
            "category": category,
            "department": random.choice(DEPARTMENTS),
            "status": status,
            "severity_score": severity,
            "lat": lat,
            "lng": lng,
            "extracted_location": f"Ward {random.randint(1,50)}, {d['name'].split(',')[0]}",
            "submitted_date": submitted_date.strftime("%Y-%m-%d"),
            "days_pending": submitted_days_ago if status != "Resolved" else 0,
            "cluster_id": f"CLUST-{random.randint(1,8):02d}",
            "damage_assessment": f"Estimated ₹{random.randint(2,80)}L infrastructure damage; {random.randint(50,5000)} residents affected.",
            "source": "synthetic_cpgrams",
            "ai_processed": True,
        })

    logger.info("Generated %d synthetic grievances for %s", count, district_key)
    return records


def generate_synthetic_tenders(district_key: str, count: int = 20) -> list:
    """Generate realistic e-tender records for a district."""
    d = DISTRICTS.get(district_key, DISTRICTS["anantapur"])
    base_lat, base_lng = d["center"]
    records = []
    base_date = datetime(2024, 1, 1)

    WORK_TYPES = [
        "Resurfacing of Road", "Underground Drainage Pipeline Replacement",
        "Solar Street Lighting Installation", "Water Treatment Plant Upgradation",
        "Multi-Level Car Parking Construction", "Park & Recreational Area Development",
        "School Building Renovation", "Primary Health Centre Construction",
        "Storm Water Drain Widening", "Heritage Building Restoration",
    ]

    for i in range(count):
        lat, lng = _jitter_coord(base_lat, base_lng, 10)
        budget = random.choice([500000, 1000000, 2500000, 5000000, 10000000, 25000000, 50000000])
        status = random.choices(["Active", "Pending", "Completed", "Cancelled"],
                                weights=[0.45, 0.25, 0.20, 0.10])[0]
        work = random.choice(WORK_TYPES)
        award_days_ago = random.randint(30, 300)
        award_date = base_date + timedelta(days=365 - award_days_ago)

        records.append({
            "tender_id": f"TND-{district_key[:3].upper()}-{2024}-{200+i:03d}",
            "district": d["name"],
            "lgd_code": d["lgd_code"],
            "department": random.choice(DEPARTMENTS),
            "work_description": f"{work} – Phase {random.randint(1,3)}",
            "budget_inr": budget,
            "budget_formatted": f"₹{budget/100000:.1f}L" if budget < 10000000 else f"₹{budget/10000000:.1f}Cr",
            "status": status,
            "contractor": f"{'ABCDE'[i%5]}{'MNPQR'[i%5]} Constructions Pvt. Ltd.",
            "award_date": award_date.strftime("%Y-%m-%d"),
            "completion_target": (award_date + timedelta(days=random.randint(180, 540))).strftime("%Y-%m-%d"),
            "target_lat": lat,
            "target_lng": lng,
            "radius_meters": random.choice([300, 500, 750, 1000]),
            "flagged_leakage": random.random() < 0.25 and status == "Active",
            "milestone_pct": random.randint(0, 100) if status == "Active" else (100 if status == "Completed" else 0),
            "source": "synthetic_etender",
        })

    logger.info("Generated %d synthetic tenders for %s", count, district_key)
    return records


# ──────────────────────────────────────────────────────────────
#  5. Main Orchestration Pipeline
# ──────────────────────────────────────────────────────────────

def run_ingestion_pipeline(district_key: str, output_dir: str, use_live_apis: bool = True) -> dict:
    """
    Orchestrates the full ingestion pipeline for a given district.

    Steps:
      1. Attempt to fetch live data from OGD / World Bank / OSM APIs
      2. Fall back to high-quality synthetic data if APIs fail (common in hackathons without a key)
      3. Merge all sources into a unified district data object
      4. Write output JSON files for frontend consumption
    """
    logger.info("═══ Starting GovGrid Ingestion Pipeline for: %s ═══", district_key)
    start_ts = time.time()

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    result = {
        "district_key": district_key,
        "district_info": DISTRICTS.get(district_key, {}),
        "ingested_at": datetime.utcnow().isoformat() + "Z",
        "pipeline_version": "2.0.0",
        "sources": [],
    }

    # ── Step 1: World Bank Indicators ──────────────────────────
    logger.info("Step 1/4 — Fetching World Bank Development Indicators …")
    wb_data = {}
    if use_live_apis:
        wb_data = fetch_world_bank_indicators("IND")
    if wb_data:
        result["sources"].append("world_bank_api")
        result["development_indicators"] = wb_data
        logger.info("  ✔ World Bank: %d indicators", len(wb_data))
    else:
        # Fallback with representative values
        result["development_indicators"] = {
            "urban_population_pct": {"value": 34.9, "year": "2022", "indicator": "SP.URB.TOTL.IN.ZS"},
            "unemployment_rate":    {"value": 7.6,  "year": "2022", "indicator": "SL.UEM.TOTL.ZS"},
            "sanitation_access_pct":{"value": 58.0, "year": "2020", "indicator": "SH.STA.BASS.ZS"},
            "water_access_pct":     {"value": 93.2, "year": "2022", "indicator": "SH.H2O.BASW.ZS"},
            "primary_school_enrollment": {"value": 94.3, "year": "2020", "indicator": "SE.PRM.ENRR"},
            "hospital_beds_per_1000":    {"value": 0.53, "year": "2017", "indicator": "SH.MED.BEDS.ZS"},
        }
        result["sources"].append("world_bank_fallback")
        logger.warning("  ⚠  Using World Bank fallback data")

    # ── Step 2: OSM Infrastructure ─────────────────────────────
    logger.info("Step 2/4 — Fetching OpenStreetMap Infrastructure Data …")
    osm_data = {}
    if use_live_apis:
        osm_data = fetch_osm_infrastructure(district_key)
    if osm_data:
        result["sources"].append("openstreetmap_overpass")
        result["osm_infrastructure"] = osm_data
        total_infra = sum(v.get("count", 0) for v in osm_data.values())
        logger.info("  ✔ OSM: %d total infrastructure features", total_infra)
    else:
        result["osm_infrastructure"] = {
            "hospitals": {"count": random.randint(4, 18), "elements": []},
            "schools":   {"count": random.randint(20, 120), "elements": []},
            "water_sources": {"count": random.randint(5, 40), "elements": []},
        }
        result["sources"].append("osm_fallback")
        logger.warning("  ⚠  Using OSM fallback data")

    # ── Step 3: Grievance Records ──────────────────────────────
    logger.info("Step 3/4 — Fetching Grievance / CPGRAMS Records …")
    grievances = None
    if use_live_apis:
        for ds_name, ds_info in OGD_DATASETS.items():
            if not ds_info["fallback"]:
                grievances = fetch_ogd_dataset(ds_info["resource_id"])
                if grievances:
                    result["sources"].append(f"ogd_{ds_name}")
                    logger.info("  ✔ OGD %s: %d records", ds_name, len(grievances))
                    break

    if not grievances:
        grievances = generate_synthetic_grievances(district_key, count=random.randint(50, 80))
        result["sources"].append("synthetic_cpgrams")
        logger.warning("  ⚠  Using synthetic CPGRAMS data (%d records)", len(grievances))

    result["grievances"] = grievances

    # ── Step 4: Tender Records ─────────────────────────────────
    logger.info("Step 4/4 — Fetching e-Tender Records …")
    tenders = generate_synthetic_tenders(district_key, count=random.randint(18, 28))
    result["sources"].append("synthetic_etender")
    result["tenders"] = tenders
    logger.info("  ✔ Tenders: %d records", len(tenders))

    # ── Compute Summary Statistics ─────────────────────────────
    open_grievances = sum(1 for g in grievances if g.get("status") in ("Open", "Escalated"))
    high_sev = sum(1 for g in grievances if g.get("severity_score", 0) >= 7)
    total_budget = sum(t.get("budget_inr", 0) for t in tenders)
    flagged = sum(1 for t in tenders if t.get("flagged_leakage"))

    result["summary"] = {
        "total_grievances": len(grievances),
        "open_grievances": open_grievances,
        "high_severity_grievances": high_sev,
        "total_tenders": len(tenders),
        "total_budget_inr": total_budget,
        "total_budget_crores": round(total_budget / 10000000, 2),
        "flagged_leakage_tenders": flagged,
        "data_sources": result["sources"],
        "pipeline_duration_sec": round(time.time() - start_ts, 2),
    }

    # ── Write output files ──────────────────────────────────────
    out_file = output_path / f"{district_key}_ingested_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    # Also write a "latest" symlink-style file for easy consumption
    latest_file = output_path / f"{district_key}_latest.json"
    with open(latest_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    logger.info("═══ Pipeline complete. Written to: %s (%.1fs) ═══", latest_file, time.time() - start_ts)
    return result


# ──────────────────────────────────────────────────────────────
#  CLI Entry Point
# ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GovGrid Public Data Ingestion Pipeline")
    parser.add_argument("--district", choices=list(DISTRICTS.keys()), default="anantapur",
                        help="District to ingest data for")
    parser.add_argument("--all", action="store_true", help="Ingest all districts")
    parser.add_argument("--output", default="data/ingested", help="Output directory for JSON files")
    parser.add_argument("--offline", action="store_true", help="Skip live API calls, use synthetic data only")
    args = parser.parse_args()

    if args.all:
        for dk in DISTRICTS:
            run_ingestion_pipeline(dk, args.output, use_live_apis=not args.offline)
    else:
        result = run_ingestion_pipeline(args.district, args.output, use_live_apis=not args.offline)
        print(json.dumps(result["summary"], indent=2))
