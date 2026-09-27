"""
Alerts Component — Glaring Executive Section for District Magistrates.
Highlights:
  1. High Priority Unfunded Liabilities (Citizen suffering + 0 Tenders)
  2. Potential Capital Leakage (Active Government Tenders with persistent severe complaints)
"""
import streamlit as st
from typing import Any, Dict, List


def render_alerts(reconciliation_data: Dict[str, Any]):
    unfunded = reconciliation_data.get("unfunded_liabilities", [])
    leakage = reconciliation_data.get("capital_leakage", [])

    col_alert1, col_alert2 = st.columns(2)

    with col_alert1:
        st.markdown(
            f"""
            <div style="background-color: #FFF5F5; border-left: 6px solid #E53E3E; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: #9B2C2C; margin: 0; font-size: 1.15rem; font-weight: 700;">
                        🚨 High-Priority Unfunded Liabilities ({len(unfunded)})
                    </h3>
                    <span style="background: #FEB2B2; color: #742A2A; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: bold;">
                        ZERO BUDGET ALLOCATED
                    </span>
                </div>
                <p style="color: #742A2A; font-size: 0.88rem; margin: 6px 0 0 0;">
                    Citizen complaint clusters (Severity &ge; 7/10) with <b>no sanctioned tender</b> within 500m.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        if not unfunded:
            st.success("✅ No unfunded critical infrastructure deficits detected.")
        else:
            for item in unfunded:
                with st.expander(
                    f"🔴 {item.get('location', 'Site')} — Severity: {item.get('severity')}/10 ({item.get('total_complaints')} complaints)",
                    expanded=True,
                ):
                    st.markdown(f"**Categories:** `{', '.join(item.get('categories', []))}`")
                    st.markdown(f"**Cluster ID:** `{item.get('cluster_id')}`")
                    st.markdown(f"**Coordinates:** `{item.get('lat')}, {item.get('lng')}`")
                    st.warning(f"**Action Required:** {item.get('recommended_action')}")

    with col_alert2:
        st.markdown(
            f"""
            <div style="background-color: #FFFDF0; border-left: 6px solid #D69E2E; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: #744210; margin: 0; font-size: 1.15rem; font-weight: 700;">
                        ⚠️ Potential Capital Leakage ({len(leakage)})
                    </h3>
                    <span style="background: #FEEBC8; color: #7B341E; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: bold;">
                        AUDIT DISCREPANCY
                    </span>
                </div>
                <p style="color: #7B341E; font-size: 0.88rem; margin: 6px 0 0 0;">
                    Active high-budget tenders in zones that continue to receive severe citizen distress reports.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        if not leakage:
            st.success("✅ No capital leakage patterns detected in current tender zones.")
        else:
            for item in leakage:
                with st.expander(
                    f"⚠️ Tender `{item.get('tender_id')}` — ₹{item.get('budget_inr', 0):,} ({item.get('department')})",
                    expanded=True,
                ):
                    st.markdown(f"**Location:** {item.get('location')}")
                    st.markdown(f"**Scope:** {item.get('work_description')}")
                    st.markdown(f"**Unresolved Complaints in Works Buffer:** `{item.get('complaint_count')}` (Max Severity: `{item.get('max_severity')}/10`)")
                    st.error(f"**Audit Alert:** {item.get('leakage_reason')}")
