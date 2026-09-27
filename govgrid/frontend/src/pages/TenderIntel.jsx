import React, { useState, useMemo } from 'react';
import { IndianRupee, Search, Building2, AlertTriangle, CheckCircle2, TrendingUp, Clock, Ban } from 'lucide-react';

const STATUS_COLORS = { Active: 'teal', Pending: 'amber', Completed: 'green', Cancelled: 'rose' };

function BudgetBar({ value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-bar-track" style={{ width: '80px' }}>
      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--emerald)' }} />
    </div>
  );
}

function MilestoneRing({ pct }) {
  const color = pct >= 80 ? 'var(--emerald)' : pct >= 40 ? 'var(--amber)' : 'var(--rose)';
  const r = 14, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
      />
      <text
        x="18" y="18" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: '8px', fontWeight: 700, fill: color, fontFamily: 'var(--font-display)', transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}
      >
        {pct}%
      </text>
    </svg>
  );
}

export default function TenderIntel({ tenders }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const totalBudget = tenders.reduce((a, t) => a + (t.budget_inr || 0), 0);
  const activeBudget = tenders.filter(t => t.status === 'Active').reduce((a, t) => a + (t.budget_inr || 0), 0);
  const flaggedTenders = tenders.filter(t => t.flagged_leakage);
  const completedPct = tenders.length ? Math.round((tenders.filter(t => t.status === 'Completed').length / tenders.length) * 100) : 0;
  const maxBudget = Math.max(...tenders.map(t => t.budget_inr || 0), 1);

  const filtered = useMemo(() => tenders.filter(t => {
    if (flaggedOnly && !t.flagged_leakage) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (search && !t.work_description?.toLowerCase().includes(search.toLowerCase()) && !t.department?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tenders, search, statusFilter, flaggedOnly]);

  return (
    <div style={{ padding: '0 22px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Summary cards (Solid colors) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Sanctioned', value: `₹${(totalBudget/10000000).toFixed(1)}Cr`, icon: IndianRupee, color: 'teal', sub: `${tenders.length} tenders` },
          { label: 'Active Budget', value: `₹${(activeBudget/10000000).toFixed(1)}Cr`, icon: TrendingUp, color: 'green', sub: `${tenders.filter(t=>t.status==='Active').length} active` },
          { label: 'Leakage Flags', value: flaggedTenders.length, icon: AlertTriangle, color: 'amber', sub: 'Audit required' },
          { label: 'Completion Rate', value: `${completedPct}%`, icon: CheckCircle2, color: 'teal', sub: 'Of all tenders' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`metric-card ${s.color}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div className={`icon-box icon-box-sm ${s.color}`}><Icon size={14} /></div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: `var(--${s.color})`, lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ color: 'var(--text-dim)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by work or department…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Active', 'Pending', 'Completed', 'Cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '5px 12px', borderRadius: '4px', border: '1px solid',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.76rem', fontWeight: 600,
                background: statusFilter === s ? `var(--${STATUS_COLORS[s] || 'teal'}-subtle)` : 'var(--bg-elevated)',
                color: statusFilter === s ? `var(--${STATUS_COLORS[s] || 'teal'})` : 'var(--text-secondary)',
                borderColor: statusFilter === s ? `var(--${STATUS_COLORS[s] || 'teal'}-border)` : 'var(--border)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
          fontSize: '0.8rem', color: flaggedOnly ? 'var(--amber-bright)' : 'var(--text-secondary)',
          fontWeight: 600, padding: '5px 10px', borderRadius: '4px',
          border: `1px solid ${flaggedOnly ? 'var(--amber-border)' : 'var(--border)'}`,
          background: flaggedOnly ? 'var(--amber-subtle)' : 'transparent',
        }}>
          <input type="checkbox" checked={flaggedOnly} onChange={e => setFlaggedOnly(e.target.checked)} style={{ accentColor: 'var(--amber)' }} />
          <AlertTriangle size={13} /> Flagged Only
        </label>
      </div>

      {/* Tender cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
        {filtered.map((t, i) => {
          const sc = STATUS_COLORS[t.status] || 'teal';
          return (
            <div
              key={t.tender_id || i}
              className="glass-card"
              style={{
                padding: '16px',
                borderLeft: t.flagged_leakage ? '3px solid var(--amber)' : '1px solid var(--border)',
                position: 'relative',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', marginBottom: '4px', display: 'inline-block' }}>{t.tender_id}</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, maxWidth: '240px' }}>{t.work_description}</div>
                </div>
                <span className={`badge badge-${sc}`}>{t.status}</span>
              </div>

              {/* Dept + contractor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <Building2 size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.department}</span>
                </div>
                {t.contractor && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contractor: <span style={{ color: 'var(--text-secondary)' }}>{t.contractor}</span></div>
                )}
              </div>

              {/* Budget + milestone */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <IndianRupee size={12} style={{ color: 'var(--emerald)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>
                      {t.budget_formatted || `₹${((t.budget_inr||0)/100000).toFixed(1)}L`}
                    </span>
                  </div>
                  <BudgetBar value={t.budget_inr || 0} max={maxBudget} />
                </div>
                {t.milestone_pct !== undefined && (
                  <div style={{ textAlign: 'center' }}>
                    <MilestoneRing pct={t.milestone_pct || 0} />
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>Progress</div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: t.flagged_leakage ? '10px' : '0' }}>
                <span><Clock size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />Awarded: {t.award_date || '—'}</span>
                <span>Target: {t.completion_target || '—'}</span>
              </div>

              {/* Leakage banner */}
              {t.flagged_leakage && (
                <div className="highlight-box amber" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 10px' }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0, color: 'var(--amber-bright)' }} />
                  <span style={{ fontSize: '0.74rem' }}>Capital leakage flag — ongoing distress in worksite buffer. Audit recommended.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          <Ban size={28} style={{ marginBottom: '10px', opacity: 0.4 }} />
          <div>No tenders match the current filter selection.</div>
        </div>
      )}
    </div>
  );
}
