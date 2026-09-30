import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  MapPin,
  Building2,
  AlertTriangle,
  ShieldAlert,
  Moon,
  Sun,
  Filter,
  Circle as CircleIcon
} from 'lucide-react';

// Helper component to center map dynamically when district changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 14);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ complaints, tenders, center, zoom }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComplaints, setShowComplaints] = useState(true);
  const [showTenders, setShowTenders] = useState(true);
  const [basemapDark, setBasemapDark] = useState(true);

  const categories = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Healthcare'];

  const filteredComplaints = complaints.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top Filter and Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} /> Filter Sector:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: selectedCategory === cat ? 'var(--emerald-bg)' : 'var(--bg-elevated)',
                  borderColor: selectedCategory === cat ? 'var(--emerald)' : 'var(--border)',
                  color: selectedCategory === cat ? 'var(--emerald)' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Toggles & Legend (Zero Emojis - Proper SVG Icons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--rose-bright)' }}>
            <input
              type="checkbox"
              checked={showComplaints}
              onChange={(e) => setShowComplaints(e.target.checked)}
              style={{ accentColor: 'var(--rose)' }}
            />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rose)', display: 'inline-block' }} />
            Citizen Grievances ({filteredComplaints.length})
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--emerald)' }}>
            <input
              type="checkbox"
              checked={showTenders}
              onChange={(e) => setShowTenders(e.target.checked)}
              style={{ accentColor: 'var(--emerald)' }}
            />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
            Active Tenders ({tenders.length})
          </label>

          <button
            onClick={() => setBasemapDark(!basemapDark)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 9px' }}
          >
            {basemapDark ? <Moon size={12} /> : <Sun size={12} />}
            {basemapDark ? 'Dark Grid' : 'Light Grid'}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div style={{ height: '480px', width: '100%', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', zIndex: 1, isolation: 'isolate' }}>
        <MapContainer center={center} zoom={zoom || 14} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={center} zoom={zoom || 14} />

          {/* Dark Canvas / OSM Map Tiles (No API key watermarks) */}
          {basemapDark ? (
            <TileLayer
              attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          ) : (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Sanctioned Tender Worksites (Emerald Buffers) */}
          {showTenders && tenders.map((tender) => {
            const tLat = tender.target_lat ?? tender.lat;
            const tLng = tender.target_lng ?? tender.lng;
            if (!tLat || !tLng) return null;

            const isLeakage = tender.flagged_leakage;
            const bufferColor = isLeakage ? '#d97706' : '#059669';
            const radius = tender.radius_meters || tender.buffer_meters || 500;

            return (
              <Circle
                key={tender.tender_id}
                center={[tLat, tLng]}
                radius={radius}
                pathOptions={{
                  color: bufferColor,
                  fillColor: bufferColor,
                  fillOpacity: 0.18,
                  weight: 2,
                  dashArray: isLeakage ? '6, 6' : undefined,
                }}
              >
                <Tooltip direction="top" opacity={0.9}>
                  <span>{tender.tender_id} ({tender.budget_formatted})</span>
                </Tooltip>
                <Popup>
                  <div style={{ color: 'var(--text-primary)', minWidth: '220px', fontFamily: 'sans-serif' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--emerald)', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '6px' }}>
                      {tender.department}
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      <b>NIT ID:</b> <code style={{ color: 'var(--text-primary)' }}>{tender.tender_id}</code>
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      <b>Sanctioned Budget:</b> <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{tender.budget_formatted}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      <b>Target Worksite:</b> {tender.target_location}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <b>Scope:</b> {tender.work_description}
                    </div>
                    {isLeakage && (
                      <div style={{
                        background: 'var(--amber-subtle)',
                        color: 'var(--amber-bright)',
                        border: '1px solid var(--amber-border)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        CAPITAL LEAKAGE: Complaints persist in active worksite!
                      </div>
                    )}
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Citizen Grievance Points (Crimson Solid Markers Sized by Severity) */}
          {showComplaints && filteredComplaints.map((c) => {
            const cLat = c.lat ?? c.target_lat;
            const cLng = c.lng ?? c.target_lng;
            if (!cLat || !cLng) return null;

            const isCritical = c.severity_score >= 8;
            const markerColor = isCritical ? '#dc2626' : '#ef4444';
            const radius = 7 + (c.severity_score * 1.4);

            return (
              <CircleMarker
                key={c.complaint_id}
                center={[cLat, cLng]}
                radius={radius}
                pathOptions={{
                  color: isCritical ? '#991b1b' : '#b91c1c',
                  fillColor: markerColor,
                  fillOpacity: 0.9,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" opacity={0.9}>
                  <span>Severity {c.severity_score}/10: {c.category}</span>
                </Tooltip>
                <Popup>
                  <div style={{ color: 'var(--text-primary)', minWidth: '240px', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--rose-bright)' }}>
                        {c.category} Grievance
                      </span>
                      <span style={{ background: 'var(--rose-subtle)', color: 'var(--rose-bright)', border: '1px solid var(--rose-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {c.severity_score}/10 SEV
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      <b>Location:</b> {c.extracted_location}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <b>AI Assessment:</b> {c.damage_assessment}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Reported: {c.submitted_at || 'Recently'}</span>
                      <span>Cluster: <code>{c.cluster_id}</code></span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Spatial Audit Interpretation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            Crimson Circle: Citizen distress node (size denotes 1-10 severity)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            Emerald Polygon: Sanctioned public works buffer zone (GeM tenders)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
            Amber Dashed: Audit leakage hotspot (unresolved distress in funded zone)
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          BigQuery GIS: ST_DWITHIN spatial match
        </div>
      </div>
    </div>
  );
}
