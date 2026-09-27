import React, { useState } from 'react';
import { GCP_SERVICES } from '../data/mockData';
import { Sparkles, Database, Mic, Cloud, CheckCircle2, ArrowRight, ShieldCheck, Terminal, Server } from 'lucide-react';

export default function ArchitectureFlow() {
  const [selectedService, setSelectedService] = useState(GCP_SERVICES[0]);

  const PIPELINE_STEPS = [
    {
      step: '1. Ingestion',
      title: 'WhatsApp JanVani Gateway',
      description: 'Citizen uploads Telugu/Hindi voice note & damage photo via Cloud Run webhook.',
      gcp: 'Cloud Run + GCS',
      color: '#dc2626',
    },
    {
      step: '2. Transcription',
      title: 'Vernacular Speech Recognition',
      description: 'Chirp-2 model transcribes regional dialect into standardized text.',
      gcp: 'Cloud Speech-to-Text V2',
      color: '#f59e0b',
    },
    {
      step: '3. Reasoning',
      title: 'Multimodal AI Reasoning',
      description: 'Gemini evaluates visual damage, calculates 1-10 severity score & extracts geo coordinates.',
      gcp: 'Vertex AI: Gemini 1.5 Pro',
      color: '#10b981',
    },
    {
      step: '4. Spatial GIS',
      title: '500m Clustering & Reconciliation',
      description: 'ST_CLUSTERDBSCAN groups complaints and cross-matches active tender polygons.',
      gcp: 'BigQuery GIS',
      color: '#059669',
    },
    {
      step: '5. Action',
      title: 'Executive Redressal Console',
      description: 'Instant automated flagging of Unfunded Liabilities and Potential Capital Leakage.',
      gcp: 'GovGrid React Web App',
      color: '#d97706',
    },
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto 30px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Overview Banner (Pure Solid Colors) */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '8px',
        borderLeft: '5px solid var(--emerald)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
              Reference DPI Stack Specification
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
              Native Google Cloud DPI Architecture
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '780px' }}>
              GovGrid bridges citizen inputs directly with municipal public budget execution by orchestrating Vertex AI multimodal models, BigQuery GIS spatial mathematics, and Cloud Speech-to-Text.
            </p>
          </div>
          <div style={{
            background: 'var(--emerald-bg)',
            padding: '12px 18px',
            borderRadius: '6px',
            border: '1px solid var(--emerald-border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 700 }}>SERVERLESS RUNTIME</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>GCP Cloud Run</div>
          </div>
        </div>
      </div>

      {/* Step Pipeline (Solid Colors) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {PIPELINE_STEPS.map((s, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '16px',
              borderTop: `4px solid ${s.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                {s.step}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '12px' }}>
                {s.description}
              </p>
            </div>

            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: s.color,
              background: 'var(--bg-elevated)',
              border: `1px solid ${s.color}`,
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}>
              {s.gcp}
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Grid: Google Cloud Services Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {GCP_SERVICES.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '18px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'var(--bg-elevated)',
                border: `1px solid ${item.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
              }}>
                <Server size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {item.service}
                </h4>
                <span style={{ fontSize: '0.7rem', color: item.color, fontWeight: 700 }}>
                  {item.role}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '8px 0 12px 0' }}>
              {item.detail}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: 'var(--emerald)',
              fontWeight: 600,
              borderTop: '1px solid var(--border)',
              paddingTop: '8px',
            }}>
              <CheckCircle2 size={13} />
              <span>Implemented in <code>backend/services/</code></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
