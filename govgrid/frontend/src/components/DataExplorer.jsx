import React, { useState } from 'react';
import { Database, Search, Filter, Download, ExternalLink, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function DataExplorer({ complaints, tenders, districtInfo }) {
  const [activeSubTab, setActiveSubTab] = useState('complaints');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.extracted_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.damage_assessment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredTenders = tenders.filter((t) => {
    return (
      t.tender_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.work_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.target_location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const categories = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Healthcare'];

  const exportCSV = () => {
    const dataToExport = activeSubTab === 'complaints' ? complaints : tenders;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `govgrid_${activeSubTab}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto 30px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} color="var(--emerald)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              DPI Public & Synthetic Data Repository
            </h2>
            <span className="badge badge-primary">BigQuery Ready</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Authentic municipal records synthesized across {districtInfo.name} ({districtInfo.wards} Wards, {districtInfo.population} population).
          </p>
        </div>

        <button onClick={exportCSV} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={14} />
          <span>Export JSON / CSV</span>
        </button>
      </div>

      {/* Sub Tabs: Complaints vs Tenders */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveSubTab('complaints')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeSubTab === 'complaints' ? 'var(--emerald-dark)' : 'transparent',
              color: activeSubTab === 'complaints' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rose)' }} />
            Citizen Grievances ({complaints.length})
          </button>

          <button
            onClick={() => setActiveSubTab('tenders')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeSubTab === 'tenders' ? 'var(--emerald-dark)' : 'transparent',
              color: activeSubTab === 'tenders' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }} />
            Sanctioned e-Tenders ({tenders.length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '6px 12px',
          }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search location, ID, or scope..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none',
                minWidth: '200px',
              }}
            />
          </div>

          {activeSubTab === 'complaints' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                background: '#1E293B',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{ padding: '0', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
        {activeSubTab === 'complaints' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px' }}>ID & Time</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Severity</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Language</th>
                <th style={{ padding: '12px 16px' }}>AI Assessment</th>
                <th style={{ padding: '12px 16px' }}>Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.complaint_id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    <code>{c.complaint_id}</code>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.submitted_at}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-primary">{c.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge" style={{
                      background: c.severity_score >= 8 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: c.severity_score >= 8 ? '#EF4444' : '#F59E0B',
                    }}>
                      {c.severity_score}/10
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.extracted_location}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {c.original_language}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '320px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {c.damage_assessment}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94A3B8' }}>
                    {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px' }}>NIT Reference</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Budget</th>
                <th style={{ padding: '12px 16px' }}>Target Worksite</th>
                <th style={{ padding: '12px 16px' }}>Scope of Work</th>
                <th style={{ padding: '12px 16px' }}>Contractor</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((t) => (
                <tr key={t.tender_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                    <code>{t.tender_id}</code>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {t.department}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {t.budget_formatted || `₹${(t.budget_inr / 100000).toFixed(1)}L`}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                      {t.target_location}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '300px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {t.work_description}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {t.contractor || 'State Empaneled Vendor'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{t.status}</span>
                    {t.flagged_leakage && (
                      <div style={{ color: 'var(--amber-bright)', fontSize: '0.68rem', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={11} /> Audit Flag
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
