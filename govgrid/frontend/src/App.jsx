import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DISTRICT_DATASETS } from './data/mockData';

// Layout
import Sidebar from './layout/Sidebar';
import TopBar from './layout/TopBar';

// Pages
import Dashboard from './pages/Dashboard';
import Grievances from './pages/Grievances';
import TenderIntel from './pages/TenderIntel';
import Reconciliation from './pages/Reconciliation';
import JanVaniPortal from './components/JanVaniPortal';
import Analytics from './pages/Analytics';
import DataPipeline from './pages/DataPipeline';
import ArchitectureFlow from './components/ArchitectureFlow';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('anantapur');

  const districtData = DISTRICT_DATASETS[selectedDistrict] || DISTRICT_DATASETS.anantapur;
  const [complaints, setComplaints] = useState(districtData.complaints);
  const [tenders, setTenders] = useState(districtData.tenders);

  useEffect(() => {
    const next = DISTRICT_DATASETS[selectedDistrict];
    if (next) {
      setComplaints(next.complaints);
      setTenders(next.tenders);
    }
  }, [selectedDistrict]);

  const unfundedCount = complaints.filter(c => c.severity_score >= 8).length;
  const leakageCount = tenders.filter(t => t.flagged_leakage).length;
  const alertCount = unfundedCount + leakageCount;

  const sharedProps = { complaints, tenders, districtData, unfundedCount, leakageCount };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        liveMode={liveMode}
        setLiveMode={setLiveMode}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar districtName={districtData.name} alertCount={alertCount} />

        <main style={{ flex: 1, overflowY: 'auto', paddingTop: '16px' }}>
          <Routes>
            <Route path="/"               element={<Dashboard {...sharedProps} />} />
            <Route path="/dashboard"      element={<Navigate to="/" replace />} />
            <Route path="/grievances"     element={<Grievances complaints={complaints} />} />
            <Route path="/tenders"        element={<TenderIntel tenders={tenders} />} />
            <Route path="/reconciliation" element={<Reconciliation complaints={complaints} tenders={tenders} />} />
            <Route path="/jan-vani"       element={<JanVaniPortal onAddComplaint={c => setComplaints(p => [c, ...p])} />} />
            <Route path="/analytics"      element={<Analytics complaints={complaints} tenders={tenders} />} />
            <Route path="/pipeline"       element={<DataPipeline />} />
            <Route path="/architecture"   element={<ArchitectureFlow />} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer style={{
          textAlign: 'center', padding: '10px 20px', fontSize: '0.7rem',
          color: 'var(--text-muted)', borderTop: '1px solid var(--border)',
          background: 'var(--bg-base)',
        }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>GovGrid</span> · Digital Public Infrastructure &amp; Budget Reconciliation Engine ·{' '}
          Jurisdiction: <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{districtData.name}</span> ·{' '}
          Powered by <b>Vertex AI (Gemini 1.5 Pro)</b>, <b>BigQuery GIS</b>, and <b>Cloud Run</b>
        </footer>
      </div>
    </div>
  );
}
