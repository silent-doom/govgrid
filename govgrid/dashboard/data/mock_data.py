"""
Mock Data & API client wrapper for the GovGrid Streamlit Dashboard.
Retrieves live data from FastAPI backend if running, or falls back to demo datasets.
"""
import os
import requests
from typing import Any, Dict, List

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

FALLBACK_SUMMARY = {
    "total_complaints": 7,
    "active_clusters": 4,
    "total_tenders": 2,
    "total_budget_allocated_inr": 10300000,
    "unfunded_liabilities_count": 2,
    "capital_leakage_alerts": 1,
    "accountability_index_pct": 50.0,
}

FALLBACK_CLUSTERS = [
    {
        "cluster_id": "CLUST-1",
        "primary_location": "Clock Tower Commercial Corridor",
        "total_complaints": 3,
        "max_severity": 9,
        "avg_severity": 8.3,
        "categories": ["Roads"],
        "centroid_lat": 14.6835,
        "centroid_lng": 77.6013,
        "details": "High crash rate reported. Potholes spanning 3m.",
    },
    {
        "cluster_id": "CLUST-2",
        "primary_location": "Ward 12 Slum Settlement & Railway Crossing",
        "total_complaints": 2,
        "max_severity": 9,
        "avg_severity": 8.5,
        "categories": ["Water"],
        "centroid_lat": 14.6712,
        "centroid_lng": 77.5892,
        "details": "Potable water pipeline rupture mixing with sewage outflow.",
    },
    {
        "cluster_id": "CLUST-3",
        "primary_location": "Subhash Road 4th Cross",
        "total_complaints": 1,
        "max_severity": 8,
        "avg_severity": 8.0,
        "categories": ["Electricity"],
        "centroid_lat": 14.6920,
        "centroid_lng": 77.6105,
        "details": "Transformer short circuit spark hazard near school.",
    },
    {
        "cluster_id": "CLUST-4",
        "primary_location": "Old Bus Stand Canal",
        "total_complaints": 1,
        "max_severity": 7,
        "avg_severity": 7.0,
        "categories": ["Sanitation"],
        "centroid_lat": 14.6865,
        "centroid_lng": 77.6035,
        "details": "Blocked drainage channel with toxic overflow.",
    },
]

FALLBACK_TENDERS = [
    {
        "tender_id": "AP-R&B-2025-PKG-882",
        "department": "Roads & Buildings Department",
        "budget_inr": 7500000,
        "work_description": "Comprehensive Bituminous Resurfacing and Stormwater Drainage from Clock Tower to Old Bus Stand.",
        "target_location": "Clock Tower, Anantapur",
        "target_lat": 14.6835,
        "target_lng": 77.6012,
        "radius_meters": 600,
        "status": "Active",
        "expected_completion_date": "2026-10-31",
    },
    {
        "tender_id": "AP-DMA-2026-SAN-104",
        "department": "Directorate of Municipal Administration",
        "budget_inr": 2800000,
        "work_description": "Desilting and underground RCC pipeline installation along Old Bus Stand Canal.",
        "target_location": "Old Bus Stand, Anantapur",
        "target_lat": 14.6865,
        "target_lng": 77.6035,
        "radius_meters": 450,
        "status": "Active",
        "expected_completion_date": "2027-01-15",
    },
]

FALLBACK_RECONCILIATION = {
    "unfunded_liabilities_count": 2,
    "capital_leakage_count": 1,
    "unfunded_liabilities": [
        {
            "cluster_id": "CLUST-2",
            "location": "Ward 12 Slum Settlement & Railway Crossing",
            "total_complaints": 2,
            "severity": 9,
            "categories": ["Water"],
            "lat": 14.6712,
            "lng": 77.5892,
            "alert_level": "CRITICAL",
            "recommended_action": "NO ACTIVE TENDER FOUND: Immediate emergency sanction required for drinking water pipeline replacement.",
        },
        {
            "cluster_id": "CLUST-3",
            "location": "Subhash Road 4th Cross",
            "total_complaints": 1,
            "severity": 8,
            "categories": ["Electricity"],
            "lat": 14.6920,
            "lng": 77.6105,
            "alert_level": "CRITICAL",
            "recommended_action": "NO ACTIVE TENDER FOUND: Immediate DISCOM dispatch for transformer replacement and cable tensioning.",
        },
    ],
    "capital_leakage": [
        {
            "tender_id": "AP-R&B-2025-PKG-882",
            "department": "Roads & Buildings Department",
            "budget_inr": 7500000,
            "work_description": "Comprehensive Bituminous Resurfacing at Clock Tower.",
            "location": "Clock Tower Commercial Corridor",
            "complaint_count": 3,
            "max_severity": 9,
            "distance_meters": 12,
            "alert_level": "AUDIT_REQUIRED",
            "leakage_reason": "₹75 Lakhs allocated and marked 'Active' for road resurfacing, yet 3 critical citizen complaints (Severity 9/10) reported in the exact worksite corridor.",
        }
    ],
}


def fetch_summary() -> Dict[str, Any]:
    try:
        res = requests.get(f"{BACKEND_URL}/query/summary", timeout=2)
        if res.status_code == 200:
            return res.json()
    except Exception:
        pass
    return FALLBACK_SUMMARY


def fetch_clusters() -> List[Dict[str, Any]]:
    try:
        res = requests.get(f"{BACKEND_URL}/query/clusters", timeout=2)
        if res.status_code == 200:
            return res.json().get("clusters", [])
    except Exception:
        pass
    return FALLBACK_CLUSTERS


def fetch_tenders() -> List[Dict[str, Any]]:
    try:
        res = requests.get(f"{BACKEND_URL}/query/tenders", timeout=2)
        if res.status_code == 200:
            return res.json().get("tenders", [])
    except Exception:
        pass
    return FALLBACK_TENDERS


def fetch_reconciliation() -> Dict[str, Any]:
    try:
        res = requests.get(f"{BACKEND_URL}/query/reconciliation", timeout=2)
        if res.status_code == 200:
            return res.json()
    except Exception:
        pass
    return FALLBACK_RECONCILIATION
