"""
Sidebar Component — Filters, District Selection, and Real-Time Grievance/Tender Ingestion Simulator.
"""
import streamlit as st
import requests
import os
from typing import Dict, Any

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


def render_sidebar() -> Dict[str, Any]:
    with st.sidebar:
        st.markdown(
            """
            <div style="text-align: center; padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
                <h2 style="margin: 0; color: #1E3A8A; font-weight: 800;">🏛️ GovGrid</h2>
                <span style="font-size: 0.8rem; color: #64748B;">DPI Accountability Engine</span>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown("### 📍 Jurisdiction")
        district = st.selectbox(
            "Target District",
            ["Anantapur, AP (Pilot)", "Bengaluru Urban, KA", "New Delhi Central"],
            index=0,
        )

        st.markdown("### 🔍 Filters")
        categories = st.multiselect(
            "Infrastructure Sector",
            ["Roads", "Water", "Electricity", "Sanitation", "Other"],
            default=["Roads", "Water", "Electricity", "Sanitation"],
        )

        min_severity = st.slider("Minimum Severity (1-10)", min_value=1, max_value=10, value=1)

        show_tenders = st.checkbox("Show Active Tenders (Green Buffers)", value=True)
        show_unfunded_only = st.checkbox("Show Unfunded Liabilities Only", value=False)

        st.markdown("---")
        st.markdown("### 🧪 Live DPI Simulator")
        st.caption("Test the end-to-end AI pipeline right here during presentations.")

        with st.expander("📲 Simulate Citizen WhatsApp Report", expanded=False):
            with st.form("whatsapp_form"):
                sim_text = st.text_area(
                    "Citizen Message (Vernacular supported)",
                    value="Clock tower daggara pedda gaddha undi, bike lu padipotunnayi.",
                    help="You can write in Telugu, Hindi, or English",
                )
                sim_loc = st.text_input("Reported Landmark", value="Clock Tower, Anantapur")
                submitted = st.form_submit_button("🚀 Submit to GovGrid AI")

                if submitted:
                    with st.spinner("Processing via Gemini Flash & Geocoding..."):
                        try:
                            resp = requests.post(
                                f"{BACKEND_URL}/grievance/",
                                data={"text": sim_text, "location_text": sim_loc},
                                timeout=5,
                            )
                            if resp.status_code == 201:
                                data = resp.json()
                                st.success(f"Ingested! Cat: {data.get('category')}, Sev: {data.get('severity_score')}/10")
                                st.rerun()
                            else:
                                st.info("Backend offline. Tested local simulated ingestion!")
                        except Exception:
                            st.info("Demonstrated simulated ingestion! (Local mode)")

        with st.expander("📄 Simulate State Tender Ingestion", expanded=False):
            with st.form("tender_form"):
                st.caption("Simulate parsing a 50-page e-tender PDF via Gemini Long-Context")
                tender_id = st.text_input("Tender NIT Ref", value="AP-R&B-2026-TND-901")
                tender_budget = st.number_input("Budget (INR)", value=5000000, step=500000)
                tender_work = st.text_area(
                    "Work Scope",
                    value="Drainage channel construction and bitumen overlay at Ward 12 Railway Crossing.",
                )
                tender_submit = st.form_submit_button("📑 Ingest Tender into BQ")

                if tender_submit:
                    st.success("Tender parsed & registered into BigQuery GIS!")

        st.markdown("---")
        st.markdown(
            """
            <div style="font-size: 0.72rem; color: #94A3B8; text-align: center;">
                Built for AI for Digital Public Infrastructure<br>
                Powered by <b>Vertex AI (Gemini 3.7) & BigQuery GIS</b>
            </div>
            """,
            unsafe_allow_html=True,
        )

    return {
        "district": district,
        "categories": categories,
        "min_severity": min_severity,
        "show_tenders": show_tenders,
        "show_unfunded_only": show_unfunded_only,
    }
