"""
Map View Component — Folium visualization of complaints and active tenders.
Renders:
  - Red circles: Citizen complaints / clusters (scaled by complaint count, colored by severity)
  - Green polygons/circles: Active tender worksite zones (with budget & timeline tooltip)
  - Visual flags for Unfunded Liabilities and Potential Capital Leakage.
"""
import folium
from folium.plugins import MiniMap, Fullscreen
from typing import Any, Dict, List


def create_govgrid_map(
    clusters: List[Dict[str, Any]],
    tenders: List[Dict[str, Any]],
    unfunded_ids: set,
    leakage_tender_ids: set,
    center_lat: float = 14.6819,
    center_lng: float = 77.6006,
    zoom_start: int = 14,
) -> folium.Map:
    """Creates a responsive Folium map showing DPI spatial accountability layers."""
    m = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=zoom_start,
        tiles="CartoDB positron",
        control_scale=True,
    )

    # Tender Coverage Zones (Green Polygons / Buffers)
    tender_group = folium.FeatureGroup(name="🟢 Active Government Tenders", show=True)
    for t in tenders:
        t_lat = t.get("target_lat")
        t_lng = t.get("target_lng")
        if not t_lat or not t_lng:
            continue

        radius = t.get("radius_meters", 500)
        t_id = t.get("tender_id", "TNDR")
        is_leakage = t_id in leakage_tender_ids

        # Border color: yellow warning if flagged for capital leakage, else crisp green
        stroke_color = "#E65100" if is_leakage else "#2E7D32"
        fill_color = "#FF9800" if is_leakage else "#4CAF50"

        popup_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; min-width: 220px; font-size: 13px;">
            <div style="font-weight: 700; color: #1B5E20; border-bottom: 2px solid #A5D6A7; padding-bottom: 4px; margin-bottom: 6px;">
                🏛️ {t.get('department', 'Govt Department')}
            </div>
            <div><b>Tender ID:</b> <code>{t_id}</code></div>
            <div><b>Budget:</b> <span style="color: #2E7D32; font-weight: 600;">₹{t.get('budget_inr', 0):,}</span></div>
            <div><b>Scope:</b> {t.get('work_description', 'Infrastructure works')}</div>
            <div><b>Target Loc:</b> {t.get('target_location', 'District Zone')}</div>
            <div><b>Status:</b> <span style="background: #E8F5E9; color: #2E7D32; padding: 2px 6px; border-radius: 4px; font-weight: 600;">{t.get('status', 'Active')}</span></div>
            {f'<div style="margin-top: 6px; background: #FFF3E0; color: #D84315; padding: 4px; border-radius: 4px; font-weight: 600;">⚠️ Capital Leakage Audit Flagged</div>' if is_leakage else ''}
        </div>
        """

        folium.Circle(
            location=[t_lat, t_lng],
            radius=radius,
            color=stroke_color,
            weight=2,
            fill=True,
            fill_color=fill_color,
            fill_opacity=0.25,
            popup=folium.Popup(popup_html, max_width=320),
            tooltip=f"Tender: {t_id} (₹{t.get('budget_inr', 0):,})",
        ).add_to(tender_group)

    tender_group.add_to(m)

    # Citizen Complaint Clusters (Red Circles)
    complaint_group = folium.FeatureGroup(name="🔴 Citizen Grievance Clusters", show=True)
    for c in clusters:
        c_lat = c.get("centroid_lat")
        c_lng = c.get("centroid_lng")
        if not c_lat or not c_lng:
            continue

        c_id = c.get("cluster_id", "")
        count = c.get("total_complaints", 1)
        severity = c.get("max_severity", 5)
        is_unfunded = c_id in unfunded_ids

        # Size circle based on count, color by severity
        radius_pixels = 10 + min(count * 5, 25)
        color = "#B71C1C" if severity >= 8 else "#E53935" if severity >= 5 else "#FB8C00"

        cats = ", ".join(c.get("categories", ["Infrastructure"]))

        popup_html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; min-width: 220px; font-size: 13px;">
            <div style="font-weight: 700; color: #B71C1C; border-bottom: 2px solid #FFCDD2; padding-bottom: 4px; margin-bottom: 6px;">
                🚨 Citizen Complaint Cluster ({c_id})
            </div>
            <div><b>Location:</b> {c.get('primary_location', 'Reported site')}</div>
            <div><b>Categories:</b> {cats}</div>
            <div><b>Complaints Grouped:</b> <span style="font-weight: 700;">{count}</span> (500m radius)</div>
            <div><b>Max Severity:</b> <span style="background: #FFEBEE; color: #C62828; padding: 2px 6px; border-radius: 4px; font-weight: 700;">{severity}/10</span></div>
            {f'<div style="margin-top: 6px; background: #FFEBEE; color: #B71C1C; padding: 4px; border-radius: 4px; font-weight: 700;">🚨 HIGH PRIORITY: Unfunded Liability</div>' if is_unfunded else '<div style="margin-top: 6px; background: #E8F5E9; color: #2E7D32; padding: 4px; border-radius: 4px; font-weight: 600;">✓ Covered by Active Tender</div>'}
        </div>
        """

        folium.CircleMarker(
            location=[c_lat, c_lng],
            radius=radius_pixels,
            color="#880E4F" if is_unfunded else "#B71C1C",
            weight=2,
            fill=True,
            fill_color=color,
            fill_opacity=0.85,
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=f"Cluster {c_id}: {count} complaint(s) (Severity {severity}/10)",
        ).add_to(complaint_group)

    complaint_group.add_to(m)

    folium.LayerControl(position="topright").add_to(m)
    Fullscreen().add_to(m)
    MiniMap(toggle_display=True).add_to(m)

    return m
