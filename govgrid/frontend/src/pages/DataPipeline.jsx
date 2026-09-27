import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
  ArrowRight,
  HardDrive,
  Cpu,
  Server,
  Terminal,
  Activity,
  Calendar
} from 'lucide-react';

const TABLES = [
  {
    name: 'govgrid_dpi.citizen_grievances_raw',
    rows: '14,892',
    size: '42.8 MB',
    partition: 'PARTITION BY DATE(submitted_at)',
    clustering: 'CLUSTER BY category, district_code',
    status: 'Healthy',
    lastSync: '2 mins ago',
  },
  {
    name: 'govgrid_dpi.gem_public_tenders_curated',
    rows: '2,410',
    size: '18.4 MB',
    partition: 'PARTITION BY DATE(sanction_date)',
    clustering: 'CLUSTER BY department, contractor_gst',
    status: 'Healthy',
    lastSync: '14 mins ago',
  },
  {
    name: 'govgrid_dpi.gis_ward_boundaries',
    rows: '840',
    size: '64.2 MB',
    partition: 'GEOMETRY / POLYGON (EPSG:4326)',
    clustering: 'SPATIAL INDEX ON boundary_polygon',
    status: 'Healthy',
    lastSync: '1 day ago',
  },
  {
    name: 'govgrid_dpi.audit_discrepancy_results',
    rows: '388',
    size: '3.1 MB',
    partition: 'PARTITION BY DATE(audit_timestamp)',
    clustering: 'CLUSTER BY anomaly_class, risk_severity',
    status: 'Synced',
    lastSync: '5 mins ago',
  },
];

const CONNECTORS = [
  {
    name: 'Jan Vani Voice & WhatsApp Gateway',
    source: 'Twilio Webhook / Bhashini Speech API',
    destination: 'Cloud Run -> Vertex AI -> BigQuery',
    rate: '45 events/min',
    status: 'Active',
    uptime: '99.98%',
  },
  {
    name: 'GeM Procurement Crawler',
    source: 'e-Procurement Public Tender Feed',
    destination: 'Cloud Storage (JSON) -> Dataform -> BigQuery',
    rate: 'Hourly Batch Sync',
    status: 'Active',
    uptime: '99.94%',
  },
  {
    name: 'CPGRAMS Central Citizen Inflow',
    source: 'National Grievance Portal API',
    destination: 'Pub/Sub -> Cloud Run Ingestion Worker',
    rate: 'Continuous Stream',
    status: 'Active',
    uptime: '100%',
  },
  {
    name: 'Vertex AI Anomaly Inference Engine',
    source: 'BigQuery GIS Spatial Join',
    destination: 'govgrid_dpi.audit_discrepancy_results',
    rate: 'Hourly Scheduled Query',
    status: 'Active',
    uptime: '99.99%',
  },
];

export default function DataPipeline() {
  const [syncing, setSyncing] = useState(false);
  const [logOutput, setLogOutput] = useState([
    '[22:34:02] [INFO] BigQuery GIS spatial reconciliation completed in 1.42s.',
    '[22:34:02] [INFO] Processed 14,892 complaints against 2,410 active public tenders.',
    '[22:34:03] [AUDIT] 18 ghost worksite anomalies flagged for manual verification.',
    '[22:34:03] [STATUS] Pipeline state: NORMAL | Next scheduled run in 25m.',
  ]);

  const handleManualTrigger = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLogOutput(prev => [
        `[${new Date().toLocaleTimeString()}] [TRIGGER] Manual BigQuery GIS reconciliation triggered.`,
        `[${new Date().toLocaleTimeString()}] [VERTEX-AI] Ingestion batch validated with 0 schema errors.`,
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div style={{ padding: '0 22px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Header Stat Strip (Solid Colors) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              BigQuery Records
            </span>
            <Database size={15} style={{ color: 'var(--emerald)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>
            18,530
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Partitioned geospatial rows</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Pipeline Ingestion Latency
            </span>
            <Activity size={15} style={{ color: 'var(--emerald)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            1.42s
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>ST_DWITHIN spatial query time</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Connectors
            </span>
            <Server size={15} style={{ color: 'var(--amber)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-bright)' }}>
            4 / 4 Online
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>100% uptime SLA</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Ingestion Status
            </span>
            <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>
            OPERATIONAL
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>All data sync triggers active</div>
        </div>
      </div>

      {/* Trigger Sync Banner */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Automated Discrepancy Reconciliation Cron
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Runs every 60 minutes via Cloud Scheduler to cross-match citizen complaints with public expenditure.
          </div>
        </div>
        <button
          onClick={handleManualTrigger}
          disabled={syncing}
          className="btn btn-primary"
          style={{ opacity: syncing ? 0.7 : 1 }}
        >
          <RefreshCw size={14} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Running BigQuery GIS Sync…' : 'Trigger Immediate Sync'}
        </button>
      </div>

      {/* BigQuery Table Catalog */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} style={{ color: 'var(--emerald)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', margin: 0, color: 'var(--text-primary)' }}>
            Google BigQuery DPI Schema & Table Registry
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="govgrid-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '18px' }}>Table Identifier</th>
                <th>Rows</th>
                <th>Storage Size</th>
                <th>Partition Specification</th>
                <th>Clustering / Index</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '18px' }}>Last Synchronized</th>
              </tr>
            </thead>
            <tbody>
              {TABLES.map((t, idx) => (
                <tr key={idx}>
                  <td style={{ paddingLeft: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HardDrive size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--emerald)' }}>
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{t.rows}</span></td>
                  <td><span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{t.size}</span></td>
                  <td><span className="chip" style={{ fontSize: '0.68rem' }}>{t.partition}</span></td>
                  <td><span className="chip" style={{ fontSize: '0.68rem' }}>{t.clustering}</span></td>
                  <td>
                    <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle2 size={11} /> {t.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '18px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {t.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connectors & Live Terminal Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        
        {/* Connectors */}
        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Server size={15} style={{ color: 'var(--amber-bright)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', margin: 0 }}>
              Ingestion Connectors & Webhooks
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CONNECTORS.map((c, i) => (
              <div key={i} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {c.name}
                  </span>
                  <span className="badge badge-teal" style={{ fontSize: '0.62rem' }}>
                    {c.uptime} Uptime
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{c.source}</span>
                  <ArrowRight size={11} style={{ color: 'var(--emerald)' }} />
                  <span>{c.destination}</span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Throughput: <b style={{ color: 'var(--text-primary)' }}>{c.rate}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal Audit Logs */}
        <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Terminal size={15} style={{ color: 'var(--emerald)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', margin: 0 }}>
              Live BigQuery Audit Telemetry
            </h3>
          </div>
          <div style={{
            flex: 1, background: '#080c12', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '12px', fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem', color: 'var(--emerald)', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '220px',
          }}>
            {logOutput.map((log, i) => (
              <div key={i} style={{ lineHeight: 1.4 }}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
