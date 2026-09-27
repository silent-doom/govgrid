"""
GovGrid Dashboard — Streamlit Executive Presentation Application.
Theme: AI for Digital Public Infrastructure and Governance.
Features:
  - Geospatial Intelligence Map (Red Dots vs Green Polygons)
  - Glaring Alert Panels: Unfunded Liabilities & Potential Capital Leakage
  - BigQuery GIS Spatial Clustering Visualization
  - District Magistrate KPI Metrics
"""
import streamlit as st
from streamlit_folium import st_folium
import pandas as pd

from components.sidebar import render_sidebar
from components.map_view import create_govgrid_map
from components.alerts import render_alerts
from data.mock_data import (
    fetch_summary,
    fetch_clusters,
    fetch_tenders,
    fetch_reconciliation,
)

# ── Streamlit Page Configuration ─────────────────────────────────────────────
st.set_page_config(
    page_title="GovGrid | DPI Accountability Engine",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS for High-Aesthetics Polish ─────────────────────────────────────
st.markdown(
    """
    <style>
    .metric-card {
        background: white;
        padding: 16px 20px;
        border-radius: 10px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        text-align: center;
    }
    .metric-val {
        font-size: 2rem;
        font-weight: 800;
        color: #1E293B;
        margin: 4px 0;
    }
    .metric-lbl {
        font-size: 0.82rem;
        color: #64748B;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
    }
    .stTabs [data-baseweb="tab"] {
        font-weight: 600;
        font-size: 1rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Sidebar & Filter Controls ────────────────────────────────────────────────
filters = render_sidebar()

# ── Data Ingestion ────────────────────────────────────────────────────────────
summary = fetch_summary()
raw_clusters = fetch_clusters()
raw_tenders = fetch_tenders()
reconciliation = fetch_reconciliation()

# ── Filter Logic ─────────────────────────────────────────────────────────────
filtered_clusters = [
    c for c in raw_clusters
    if any(cat in filters["categories"] for cat in c.get("categories", []))
    and c.get("max_severity", 1) >= filters["min_severity"]
]

unfunded_ids = {u["cluster_id"] for u in reconciliation.get("unfunded_liabilities", [])}
leakage_tender_ids = {l["tender_id"] for l in reconciliation.get("capital_leakage", [])}

if filters["show_unfunded_only"]:
    filtered_clusters = [c for c in filtered_clusters if c["cluster_id"] in unfunded_ids]

filtered_tenders = raw_tenders if filters["show_tenders"] else []

# ── Executive Header ─────────────────────────────────────────────────────────
st.markdown(
    f"""
    <div style="margin-bottom: 20px;">
        <h1 style="margin: 0; color: #0F172A; font-size: 2.2rem; font-weight: 800;">
            🏛️ GovGrid <span style="font-weight: 400; color: #475569; font-size: 1.4rem;">| DPI Public Budget Reconciliation</span>
        </h1>
        <p style="color: #64748B; font-size: 1rem; margin: 4px 0 0 0;">
            Monitoring jurisdiction: <b>{filters['district']}</b> • Live spatial deduplication across citizen grievances and government e-tenders.
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ── Top KPI Bar ──────────────────────────────────────────────────────────────
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.markdown(
        f"""
        <div class="metric-card">
            <div class="metric-lbl">Total Grievances</div>
            <div class="metric-val" style="color: #2563EB;">{summary.get('total_complaints', 0)}</div>
            <div style="font-size: 0.75rem; color: #64748B;">Grouped into {len(raw_clusters)} GIS zones</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col2:
    budget_cr = round(summary.get("total_budget_allocated_inr", 0) / 10000000, 2)
    st.markdown(
        f"""
        <div class="metric-card">
            <div class="metric-lbl">Sanctioned Budget</div>
            <div class="metric-val" style="color: #059669;">₹{budget_cr} Cr</div>
            <div style="font-size: 0.75rem; color: #64748B;">{len(raw_tenders)} Active Tenders</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col3:
    unfunded_count = reconciliation.get("unfunded_liabilities_count", 0)
    st.markdown(
        f"""
        <div class="metric-card" style="border-top: 4px solid #DC2626;">
            <div class="metric-lbl">Unfunded Liabilities</div>
            <div class="metric-val" style="color: #DC2626;">{unfunded_count}</div>
            <div style="font-size: 0.75rem; color: #DC2626; font-weight: 600;">Zero Budget Allocated</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col4:
    leakage_count = reconciliation.get("capital_leakage_count", 0)
    st.markdown(
        f"""
        <div class="metric-card" style="border-top: 4px solid #D97706;">
            <div class="metric-lbl">Capital Leakage</div>
            <div class="metric-val" style="color: #D97706;">{leakage_count}</div>
            <div style="font-size: 0.75rem; color: #D97706; font-weight: 600;">Funded yet Distressed</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col5:
    accountability = summary.get("accountability_index_pct", 50.0)
    color = "#059669" if accountability >= 70 else "#D97706" if accountability >= 40 else "#DC2626"
    st.markdown(
        f"""
        <div class="metric-card">
            <div class="metric-lbl">Accountability Index</div>
            <div class="metric-val" style="color: {color};">{accountability}%</div>
            <div style="font-size: 0.75rem; color: #64748B;">Spatial Matching Score</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

st.markdown("<br>", unsafe_allow_html=True)

# ── Main Content Area ─────────────────────────────────────────────────────────
tab_map, tab_alerts, tab_data, tab_arch = st.tabs([
    "🗺️ Geospatial Accountability Map",
    "🚨 Glaring Audit Alerts",
    "📊 Spatial Clustering & Tenders Data",
    "⚙️ GCP Architecture & Technical Design",
])

with tab_map:
    st.markdown(
        """
        <div style="display: flex; gap: 18px; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600;">
            <span style="color: #DC2626;">🔴 Red Circles: Citizen Complaint Clusters (500m BigQuery ST_DISTANCE)</span>
            <span style="color: #15803D;">🟢 Green Zones: Sanctioned Government Tender Work Areas</span>
            <span style="color: #B45309;">⚠️ Yellow Border: Tender under Capital Leakage Audit</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    folium_map = create_govgrid_map(
        clusters=filtered_clusters,
        tenders=filtered_tenders,
        unfunded_ids=unfunded_ids,
        leakage_tender_ids=leakage_tender_ids,
    )
    st_folium(folium_map, width="100%", height=550)

with tab_alerts:
    st.markdown("### Executive Action Dashboard for District Magistrate")
    render_alerts(reconciliation)

with tab_data:
    col_d1, col_d2 = st.columns(2)

    with col_d1:
        st.markdown("#### 🔴 Spatial Infrastructure Deficit Clusters")
        if filtered_clusters:
            df_clusters = pd.DataFrame([
                {
                    "Cluster ID": c.get("cluster_id"),
                    "Location": c.get("primary_location"),
                    "Complaints": c.get("total_complaints"),
                    "Max Severity": f"{c.get('max_severity')}/10",
                    "Categories": ", ".join(c.get("categories", [])),
                    "Status": "🚨 Unfunded" if c.get("cluster_id") in unfunded_ids else "✓ Covered",
                }
                for c in filtered_clusters
            ])
            st.dataframe(df_clusters, use_container_width=True, hide_index=True)
        else:
            st.info("No clusters match the selected filter criteria.")

    with col_d2:
        st.markdown("#### 🟢 Active Sanctioned Government Tenders")
        if raw_tenders:
            df_tenders = pd.DataFrame([
                {
                    "Tender ID": t.get("tender_id"),
                    "Department": t.get("department"),
                    "Budget (INR)": f"₹{t.get('budget_inr', 0):,}",
                    "Target Area": t.get("target_location"),
                    "Status": t.get("status"),
                    "Audit Flag": "⚠️ Leakage Alert" if t.get("tender_id") in leakage_tender_ids else "Clean",
                }
                for t in raw_tenders
            ])
            st.dataframe(df_tenders, use_container_width=True, hide_index=True)
        else:
            st.info("No tenders available.")

with tab_arch:
    st.markdown("### 🏛️ GovGrid Architecture & Google Cloud DPI Integration")
    st.markdown(
        """
        GovGrid is designed for the **AI for Digital Public Infrastructure and Governance** hackathon theme.
        
        | Google Cloud Service | Role in GovGrid Architecture | Scoring Rubric Alignment |
        |---|---|---|
        | **Vertex AI (Gemini 3.7 Flash)** | Multimodal image damage assessment & structured grievance parsing | Multimodal AI Reasoning |
        | **Vertex AI (Gemini Long-Context)** | Parsing 50-page complex state government e-tender PDFs | Long-context Document Understanding |
        | **Google Cloud Speech-to-Text V2** | JanVani layer: Regional dialect voice messages &rarr; text transcription | Vernacular Inclusion |
        | **BigQuery GIS (`ST_DISTANCE`)** | Spatial clustering of complaints within 500m & tender overlap analysis | Scalable DPI Spatial Deduplication |
        | **Google Cloud Storage (GCS)** | Object store landing zone for tender PDFs and citizen photo evidence | Secure Cloud Infrastructure |
        | **Google Maps Geocoding API** | Vernacular landmark descriptions to precise geographic coordinates | Location Intelligence |
        | **Cloud Run** | Fully containerized, autoscaling backend API gateway | Production Deployment |
        """
    )
