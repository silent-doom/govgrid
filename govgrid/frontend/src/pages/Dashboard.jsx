import React from 'react';
import MetricsBar from '../components/MetricsBar';
import MapView from '../components/MapView';
import AlertsPanel from '../components/AlertsPanel';
import { TrendingUp, Clock, Users, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

function ActivityFeed({ complaints }) {
  const recent = [...complaints].sort(() => Math.random() - 0.5).slice(0, 6);
  const sevColor = s => s >= 8 ? 'var(--rose)' : s >= 5 ? 'var(--amber)' : 'var(--emerald)';
  return (
    <div className="glass-panel" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} style={{ color: 'var(--emerald)' }} /> Live Ingestion Feed
        </h3>
        <span className="badge badge-teal" style={{ fontSize: '0.6rem' }}>STREAM ACTIVE</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {recent.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 10px', borderRadius: '6px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: sevColor(c.severity_score), flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.extracted_location}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{c.category} · {c.submitted_at || 'Recently'}</div>
            </div>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, color: sevColor(c.severity_score),
              background: 'var(--bg-surface)', border: `1px solid ${sevColor(c.severity_score)}`,
              borderRadius: '4px', padding: '1px 5px', flexShrink: 0,
            }}>
              {c.severity_score}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStats({ complaints, tenders }) {
  const open = complaints.filter(c => c.status !== 'Resolved').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const active = tenders.filter(t => t.status === 'Active').length;
  const flagged = tenders.filter(t => t.flagged_leakage).length;

  const stats = [
    { label: 'Open Cases', value: open, icon: ShieldAlert, color: 'rose' },
    { label: 'Audited Redressal', value: resolved, icon: CheckCircle2, color: 'teal' },
    { label: 'Active Tenders', value: active, icon: TrendingUp, color: 'green' },
    { label: 'Flagged Tenders', value: flagged, icon: Zap, color: 'amber' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '16px 18px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.92rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={15} style={{ color: 'var(--emerald)' }} /> District At a Glance
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: '6px',
              background: 'var(--bg-elevated)', border: `1px solid var(--border)`,
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={13} style={{ color: `var(--${s.color === 'teal' ? 'emerald' : s.color})` }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 900, color: `var(--${s.color === 'teal' ? 'emerald' : s.color})`, lineHeight: 1.1 }}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard({ complaints, tenders, districtData, unfundedCount, leakageCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%' }}>
      <MetricsBar complaints={complaints} tenders={tenders} unfundedCount={unfundedCount} leakageCount={leakageCount} />

      {/* Two-column layout: map + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', padding: '0 22px 16px', minHeight: 0 }}>
        <div>
          <MapView complaints={complaints} tenders={tenders} center={districtData.center} zoom={districtData.zoom} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <QuickStats complaints={complaints} tenders={tenders} />
          <ActivityFeed complaints={complaints} />
        </div>
      </div>

      <div style={{ padding: '0 22px 24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.92rem', margin: '0 0 12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          AI-Detected District Anomalies
        </h3>
        <AlertsPanel complaints={complaints} tenders={tenders} />
      </div>
    </div>
  );
}
