import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DISTRICT_DATASETS } from './data/mockData';

// Stitch Revamped Layout
import StitchHeader from './layout/StitchHeader';

// Stitch Pages
import ExecutiveBriefing from './pages/ExecutiveBriefing';
import CitizenVoices from './pages/CitizenVoices';
import TenderAudits from './pages/TenderAudits';
import WardMap from './pages/WardMap';

// Retained DPI Pages
import Analytics from './pages/Analytics';
import DataPipeline from './pages/DataPipeline';
import ArchitectureFlow from './components/ArchitectureFlow';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState('bengaluru');
  const districtData = DISTRICT_DATASETS[selectedDistrict] || DISTRICT_DATASETS.bengaluru || DISTRICT_DATASETS.anantapur;
  
  const [complaints, setComplaints] = useState(districtData.complaints || []);
  const [tenders, setTenders] = useState(districtData.tenders || []);

  useEffect(() => {
    const next = DISTRICT_DATASETS[selectedDistrict];
    if (next) {
      setComplaints(next.complaints || []);
      setTenders(next.tenders || []);
    }
  }, [selectedDistrict]);

  const unfundedCount = complaints.filter(c => c.severity_score >= 8).length;
  const leakageCount = tenders.filter(t => t.flagged_leakage).length;
  const alertCount = unfundedCount + leakageCount;

  const sharedProps = { complaints, tenders, districtData, unfundedCount, leakageCount };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans text-on-surface antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Stitch Civic Modernism Header */}
      <StitchHeader
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        alertCount={alertCount}
        onRefresh={() => {
          const next = DISTRICT_DATASETS[selectedDistrict];
          if (next) {
            setComplaints([...next.complaints]);
            setTenders([...next.tenders]);
          }
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full overflow-y-auto pb-20 lg:pb-0">
        <Routes>
          {/* Primary Stitch Revamped Views */}
          <Route path="/" element={<ExecutiveBriefing {...sharedProps} />} />
          <Route path="/briefing" element={<ExecutiveBriefing {...sharedProps} />} />
          <Route path="/voices" element={<CitizenVoices complaints={complaints} onAddComplaint={c => setComplaints(p => [c, ...p])} />} />
          <Route path="/audits" element={<TenderAudits tenders={tenders} complaints={complaints} />} />
          <Route path="/map" element={<WardMap {...sharedProps} />} />
          <Route path="/analytics" element={<Analytics complaints={complaints} tenders={tenders} />} />
          <Route path="/pipeline" element={<DataPipeline />} />
          <Route path="/architecture" element={<ArchitectureFlow />} />

          {/* Legacy / Direct Aliases for complete backward compatibility */}
          <Route path="/jan-vani" element={<Navigate to="/voices" replace />} />
          <Route path="/grievances" element={<Navigate to="/voices" replace />} />
          <Route path="/reconciliation" element={<Navigate to="/audits" replace />} />
          <Route path="/tenders" element={<Navigate to="/audits" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/command" element={<Dashboard {...sharedProps} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Stitch Clean Uncluttered Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">GovGrid DPI v2.4</span>
            <span className="text-slate-400">•</span>
            <span>Municipal Urban Infrastructure &amp; Finance Reconciliation</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-semibold text-slate-600">{districtData.name} Command</span>
            <span>•</span>
            <span>Powered by Vertex AI &amp; BigQuery GIS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
