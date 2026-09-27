import React, { useState } from 'react';
import { FileText, CheckCircle2, IndianRupee, MapPin, Calendar, Building, Sparkles, Upload, AlertTriangle } from 'lucide-react';

const SAMPLE_GAZETTES = [
  {
    nitId: 'AP/R&B/2025-26/PKG-882',
    dept: 'Roads & Buildings Dept, Govt of AP',
    title: 'Resurfacing and stormwater drainage along Clock Tower Corridor',
    budgetFormatted: '₹75,00,000 (75 Lakhs)',
    budgetNum: 7500000,
    completionDate: '31-10-2026',
    location: 'Clock Tower to Old Bus Stand, Anantapur (14.6835 N, 77.6012 E)',
    contractor: 'M/s Sri Venkateswara Infra Projects Pvt Ltd',
    geminiHighlight: 'Extracted from 48-page state procurement schedule in 2.1s with 100% entity accuracy.',
    leakageFlag: true,
  },
  {
    nitId: 'AP/DMA/2026/SAN-104',
    dept: 'Directorate of Municipal Administration',
    title: 'Desilting and underground RCC pipeline boxing along Old Bus Stand Canal',
    budgetFormatted: '₹28,00,000 (28 Lakhs)',
    budgetNum: 2800000,
    completionDate: '15-01-2027',
    location: 'Old Bus Stand Canal, Anantapur (14.6865 N, 77.6035 E)',
    contractor: 'Rayalaseema Civil Works Corp',
    geminiHighlight: 'Identified ₹28 Lakhs capital outlay under Special Swachh Andhra Fund.',
    leakageFlag: false,
  },
];

export default function TenderManager({ tenders, onAddTender }) {
  const [selectedTender, setSelectedTender] = useState(SAMPLE_GAZETTES[0]);
  const [isIngesting, setIsIngesting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateIngest = () => {
    setIsIngesting(true);
    setUploadSuccess(false);

    setTimeout(() => {
      setIsIngesting(false);
      setUploadSuccess(true);
      if (onAddTender) {
        onAddTender({
          tender_id: 'AP-MWSSB-2026-WTR-204',
          department: 'Municipal Water Supply & Sewerage Board',
          budget_inr: 4200000,
          budget_formatted: '₹42.0 Lakhs',
          work_description: 'Emergency DI main pipeline replacement at Ward 12 Slum Cluster.',
          target_location: 'Ward 12 Slum Cluster, Anantapur',
          target_lat: 14.6710,
          target_lng: 77.5890,
          radius_meters: 500,
          status: 'Active',
          completion_date: '28 Feb 2027',
          contractor: 'Andhra Jal Infra Works Ltd',
          flagged_leakage: false,
        });
      }
    }, 1500);
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
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="var(--emerald)" />
            <span>State E-Tender & Budget Allocation Ingestion</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Vertex AI (Gemini Long-Context) parses multi-page PDF gazettes into structured BigQuery procurement tables.
          </p>
        </div>

        <button
          onClick={handleSimulateIngest}
          disabled={isIngesting}
          className="btn btn-primary"
        >
          <Upload size={16} />
          <span>{isIngesting ? 'Gemini Extracting PDF...' : 'Ingest State Tender PDF (Mock)'}</span>
        </button>
      </div>

      {uploadSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34D399',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle2 size={18} />
          <span>Successfully extracted <b>AP-MWSSB-2026-WTR-204 (₹42 Lakhs)</b> and updated BigQuery GIS spatial coverage!</span>
        </div>
      )}

      {/* Grid: Tender Documents List & Extraction Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
      }}>
        {/* Left: Active Tenders in District */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
            Sanctioned Public Infrastructure Works ({tenders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tenders.map((t) => (
              <div
                key={t.tender_id}
                onClick={() => setSelectedTender({
                  nitId: t.tender_id,
                  dept: t.department,
                  title: t.work_description,
                  budgetFormatted: t.budget_formatted || `₹${t.budget_inr.toLocaleString()}`,
                  budgetNum: t.budget_inr,
                  completionDate: t.completion_date || 'Target 2026',
                  location: t.target_location,
                  contractor: t.contractor || 'Registered State Contractor',
                  geminiHighlight: 'Extracted via Vertex AI Gemini Long-Context.',
                  leakageFlag: t.flagged_leakage,
                })}
                style={{
                  padding: '14px',
                  background: selectedTender.nitId === t.tender_id ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (selectedTender.nitId === t.tender_id ? 'var(--primary)' : 'var(--border-subtle)'),
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    <code>{t.tender_id}</code>
                  </span>
                  <span className="badge badge-success">
                    {t.budget_formatted || `₹${(t.budget_inr / 100000).toFixed(1)}L`}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.3 }}>
                  {t.work_description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={11} /> {t.target_location}
                  </span>
                  {t.flagged_leakage && (
                    <span style={{ color: 'var(--amber-bright)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <AlertTriangle size={11} /> Audit Alert
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Gemini Extraction Deep-Dive */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Gemini Structured PDF Extractor Output
            </h3>
            <span className="badge badge-ai">
              <Sparkles size={11} /> 100K Token Context
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFICIAL NIT NUMBER</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedTender.nitId}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEPARTMENT & CONTRACTOR</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTender.dept}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Awardee: {selectedTender.contractor}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.7rem', color: '#6EE7B7', fontWeight: 600 }}>ALLOCATED OUTLAY (INR)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>{selectedTender.budgetFormatted}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET COMPLETION</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTender.completionDate}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>GEO-SPATIAL WORK BUFFER</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {selectedTender.location}
              </div>
            </div>

            {selectedTender.leakageFlag && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                color: '#FCD34D',
                fontSize: '0.8rem',
              }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertTriangle size={15} />
                  <span>DPI Reconciliation Alert: Capital Leakage Risk</span>
                </div>
                Despite active ₹75L budget outlay, this exact 500m coordinate radius has generated 3 unaddressed Severity 9/10 pothole complaints on the ground.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
