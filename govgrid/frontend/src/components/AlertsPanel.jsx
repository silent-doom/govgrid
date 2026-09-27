import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Ban, TrendingDown, MapPin, Building2, IndianRupee } from 'lucide-react';

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function AlertsPanel({ complaints = [], tenders = [] }) {
  const [resolved, setResolved] = useState({});

  const unfundedLiabilities = [];
  const capitalLeakageAlerts = [];

  complaints.forEach(c => {
    if (c.severity_score >= 7) {
      const nearTender = tenders.find(t => {
        if (!t.target_lat || !t.target_lng) return false;
        return haversineMeters(c.lat, c.lng, t.target_lat, t.target_lng) <= (t.radius_meters || 500);
      });
      if (!nearTender) {
        unfundedLiabilities.push({
          id: `UNFUNDED-${c.complaint_id}`,
          clusterId: c.cluster_id || 'CLUST-DEF',
          location: c.extracted_location,
          category: c.category,
          severity: c.severity_score,
          impact: c.damage_assessment,
          action: `Execute urgent municipal disaster sanction for ${c.category} repair under Section 43 Municipal Act.`,
        });
      }
    }
  });

  tenders.forEach(t => {
    if (t.status === 'Active' && t.target_lat && t.target_lng) {
      const overlapping = complaints.filter(c => haversineMeters(c.lat, c.lng, t.target_lat, t.target_lng) <= (t.radius_meters || 500) && c.severity_score >= 7);
      if (overlapping.length > 0 || t.flagged_leakage) {
        capitalLeakageAlerts.push({
          id: `LEAKAGE-${t.tender_id}`,
          tenderId: t.tender_id,
          department: t.department,
          budget: t.budget_formatted || `₹${(t.budget_inr / 100000).toFixed(1)}L`,
          contractor: t.contractor || 'Contract Awardee',
          worksite: t.work_description,
          unresolvedCount: Math.max(overlapping.length, 1),
          maxSeverity: overlapping.length > 0 ? Math.max(...overlapping.map(o => o.severity_score)) : 9,
          finding: `Active tender with ${t.budget_formatted || 'substantial'} budget, yet severe citizen complaints persist inside contracted worksite.`,
          action: 'Hold Milestone Payment; issue show-cause notice and forensic engineering audit.',
        });
      }
    }
  });

  const handleAction = (id, label) => setResolved(prev => ({ ...prev, [id]: label }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>

      {/* Unfunded Liabilities */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="icon-box icon-box-md rose">
              <AlertOctagon size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--rose-bright)', margin: 0, letterSpacing: '-0.02em' }}>
                High-Priority Unfunded Liabilities
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Critical distress with zero sanctioned budget within 500m
              </p>
            </div>
          </div>
          <span className="badge badge-rose">
            {unfundedLiabilities.length} Urgent
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
          {unfundedLiabilities.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--emerald)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={26} style={{ marginBottom: '8px', opacity: 0.7 }} />
              <div>All high-severity complaints covered by active public tenders.</div>
            </div>
          ) : (
            unfundedLiabilities.slice(0, 5).map(item => {
              const done = resolved[item.id];
              return (
                <div key={item.id} className="alert-item rose" style={{ opacity: done ? 0.65 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} style={{ color: 'var(--rose)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>{item.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span className="badge badge-rose">Sev {item.severity}/10</span>
                      <span className="chip">{item.clusterId}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span className="data-tag">{item.category}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>{item.impact}</p>

                  <div className="highlight-box rose" style={{ marginBottom: '10px' }}>
                    <b>Recommended:</b> {item.action}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {done ? (
                      <span style={{ fontSize: '0.76rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <CheckCircle2 size={13} /> {done}
                      </span>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(item.id, 'Emergency Fund Sanctioned')}>
                        Sanction Emergency Fund <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Capital Leakage Alerts */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="icon-box icon-box-md amber">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--amber-bright)', margin: 0, letterSpacing: '-0.02em' }}>
                Potential Capital Leakage
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Active tenders where severe complaints persist inside worksite
              </p>
            </div>
          </div>
          <span className="badge badge-amber">
            {capitalLeakageAlerts.length} Audit
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
          {capitalLeakageAlerts.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--emerald)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={26} style={{ marginBottom: '8px', opacity: 0.7 }} />
              <div>No capital leakage discrepancies in active tender buffers.</div>
            </div>
          ) : (
            capitalLeakageAlerts.map(item => {
              const done = resolved[item.id];
              return (
                <div key={item.id} className="alert-item amber" style={{ opacity: done ? 0.65 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={12} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        Tender <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{item.tenderId}</span>
                      </span>
                    </div>
                    <span className="badge badge-amber">
                      <IndianRupee size={10} /> {item.budget}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="data-tag" style={{ color: 'var(--amber)', borderColor: 'var(--amber-border)', background: 'var(--amber-subtle)' }}>{item.department}</span>
                    <span className="chip">{item.contractor}</span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--amber-bright)', marginBottom: '10px', lineHeight: 1.4, opacity: 0.9 }}>
                    <TrendingDown size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {item.finding}
                  </p>

                  <div className="highlight-box amber" style={{ marginBottom: '10px' }}>
                    <b>Action:</b> {item.action}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {item.unresolvedCount} unresolved in buffer · Max Sev {item.maxSeverity}/10
                    </span>
                    {done ? (
                      <span style={{ fontSize: '0.76rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <CheckCircle2 size={13} /> {done}
                      </span>
                    ) : (
                      <button
                        className="btn btn-amber btn-sm"
                        onClick={() => handleAction(item.id, 'Vigilance Inspection Ordered')}
                      >
                        <Ban size={12} /> Freeze & Audit
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
