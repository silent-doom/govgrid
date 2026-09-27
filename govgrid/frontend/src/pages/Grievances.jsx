import React, { useState, useMemo } from 'react';
import { Search, MapPin, SortAsc, SortDesc, Clock, AlertOctagon, CheckCircle2, BarChart3, FileSpreadsheet } from 'lucide-react';

const CATEGORIES = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Healthcare', 'Other'];
const STATUS_OPTS = ['All', 'Verified', 'Urgent', 'In Progress', 'Resolved'];

function SeverityBar({ score }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? 'var(--rose)' : score >= 5 ? 'var(--amber)' : 'var(--emerald)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="progress-bar-track" style={{ width: '60px' }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: '0.76rem', fontWeight: 700, color, width: '22px' }}>{score}</span>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className={`metric-card ${color}`} style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div className={`icon-box icon-box-sm ${color}`}><Icon size={14} /></div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div className="stat-number" style={{ color: `var(--${color === 'teal' ? 'emerald' : color})`, fontSize: '1.7rem' }}>{value}</div>
    </div>
  );
}

export default function Grievances({ complaints }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortField, setSortField] = useState('severity_score');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    return complaints
      .filter(c => {
        if (search && !c.extracted_location?.toLowerCase().includes(search.toLowerCase()) && !c.category?.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== 'All' && c.category !== category) return false;
        if (status !== 'All' && c.status !== status) return false;
        return true;
      })
      .sort((a, b) => {
        const av = a[sortField] ?? 0, bv = b[sortField] ?? 0;
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
  }, [complaints, search, category, status, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const urgent = complaints.filter(c => c.severity_score >= 8).length;
  const open   = complaints.filter(c => c.status !== 'Resolved').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const statusColor = s => ({ Verified: 'teal', Urgent: 'rose', 'In Progress': 'amber', Resolved: 'green', Escalated: 'rose' }[s] || 'teal');

  const SortIcon = ({ field }) => sortField === field ? (sortDir === 'asc' ? <SortAsc size={13} /> : <SortDesc size={13} />) : null;

  return (
    <div style={{ padding: '0 22px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Summary Stats (Solid colors) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard label="Total Grievances" value={complaints.length} color="teal" icon={BarChart3} />
        <StatCard label="Urgent (≥8 Severity)" value={urgent} color="rose" icon={AlertOctagon} />
        <StatCard label="Open Cases" value={open} color="amber" icon={Clock} />
        <StatCard label="Resolved & Audited" value={resolved} color="green" icon={CheckCircle2} />
      </div>

      {/* Filters row */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by location or category…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', width: '100%' }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              style={{
                padding: '5px 11px', borderRadius: '4px', border: '1px solid',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.76rem', fontWeight: 600,
                background: category === cat ? 'var(--emerald-bg)' : 'var(--bg-elevated)',
                color: category === cat ? 'var(--emerald)' : 'var(--text-secondary)',
                borderColor: category === cat ? 'var(--emerald)' : 'var(--border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="form-input"
          style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
        >
          {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
        </select>

        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }}>
          {filtered.length} records found
        </span>
      </div>

      {/* Table (Solid Colors) */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="govgrid-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '18px' }}>Complaint ID</th>
                <th>Ward / Location</th>
                <th>Sector</th>
                <th onClick={() => toggleSort('severity_score')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Severity <SortIcon field="severity_score" />
                  </span>
                </th>
                <th>Status</th>
                <th>AI Damage Assessment</th>
                <th>Reported At</th>
                <th style={{ paddingRight: '18px' }}>Cluster ID</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c, i) => {
                const sc = statusColor(c.status);
                return (
                  <tr key={c.complaint_id || i}>
                    <td style={{ paddingLeft: '18px' }}>
                      <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                        {c.complaint_id?.slice(-8) || `GRV-${i+1}`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.extracted_location}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="data-tag">{c.category}</span>
                    </td>
                    <td><SeverityBar score={c.severity_score} /></td>
                    <td>
                      <span className={`badge badge-${sc}`}>{c.status}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '260px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.damage_assessment}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.74rem', whiteSpace: 'nowrap' }}>
                      {c.submitted_at || 'Recently'}
                    </td>
                    <td style={{ paddingRight: '18px' }}>
                      <span className="chip" style={{ fontFamily: 'var(--font-mono)' }}>{c.cluster_id || 'CLS-01'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="btn btn-secondary btn-sm"
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className="btn btn-secondary btn-sm"
                style={{ opacity: page === totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
