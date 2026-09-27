import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, HelpCircle, RefreshCw, Command } from 'lucide-react';

const PAGE_META = {
  '/':               { title: 'Command Center',            sub: 'Geospatial cross-audit between citizen distress signals and public capital allocation' },
  '/grievances':     { title: 'Citizen Grievance Ledger',  sub: 'Verified multichannel citizen complaints ingested via Jan Vani and CPGRAMS' },
  '/tenders':        { title: 'Tender & Procurement Intel',sub: 'Public works procurement tracking, contractor milestones, and expenditure leakage' },
  '/reconciliation': { title: 'AI Reconciliation Matrix',  sub: 'Cross-verification engine flagging ghost worksites, delay penalties, and unfunded wards' },
  '/jan-vani':       { title: 'Jan Vani Intake Simulator', sub: 'Multilingual speech and WhatsApp complaint intake with Vertex AI reasoning' },
  '/analytics':      { title: 'Fiscal & Spatial Analytics',sub: 'Budget allocation trends, resolution velocity, and ward vulnerability rankings' },
  '/pipeline':       { title: 'Data Pipeline & Ingestion', sub: 'BigQuery GIS sync status, open government data connectors, and scheduled audit crawlers' },
  '/architecture':   { title: 'Google Cloud DPI Stack',    sub: 'Production reference architecture — Vertex AI, BigQuery GIS, Cloud Run, Cloud Storage' },
};

export default function TopBar({ districtName, alertCount = 0 }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || PAGE_META['/'];
  const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <header style={{
      height: '60px',
      background: 'var(--bg-base)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 22px', gap: '18px',
      position: 'sticky', top: 0, zIndex: 30,
      flexShrink: 0,
    }}>
      {/* Page Title & Breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.05rem',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
        }}>
          {meta.title}
        </h2>
        <p style={{
          margin: 0,
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{districtName}</span> · {meta.sub}
        </p>
      </div>

      {/* Quick Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '6px 12px',
        width: '230px',
      }}>
        <Search size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', flex: 1 }}>Search records…</span>
        <span style={{
          fontSize: '0.62rem',
          color: 'var(--text-dim)',
          background: 'var(--bg-elevated)',
          padding: '2px 5px',
          borderRadius: '4px',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
        }}>
          Ctrl+K
        </span>
      </div>

      {/* Timestamp */}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
        {now}
      </span>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          title="Refresh Data"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            padding: '7px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <RefreshCw size={14} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            title="System Alerts"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              padding: '7px',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <Bell size={14} />
          </button>
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              minWidth: '15px', height: '15px', borderRadius: '4px',
              background: 'var(--rose-dark)',
              border: '1px solid var(--rose)',
              color: '#ffffff',
              fontSize: '0.58rem',
              fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 2px',
            }}>
              {alertCount}
            </span>
          )}
        </div>

        <button
          title="Help & Documentation"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            padding: '7px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <HelpCircle size={14} />
        </button>
      </div>
    </header>
  );
}
