import React, { useState } from 'react';
import { Map, Smartphone, FileSpreadsheet, Radio, Cpu, ChevronDown, Globe2, Activity, Zap, Landmark } from 'lucide-react';

const DISTRICTS = [
  { value: 'anantapur', label: 'Anantapur, AP', sub: 'District Pilot' },
  { value: 'bengaluru', label: 'Bengaluru Urban, KA', sub: 'BBMP Zone' },
  { value: 'delhi', label: 'New Delhi Central', sub: 'MCD / NDMC' },
];

const TABS = [
  { id: 'command-center',  label: 'Command Center',  icon: Map,            badge: null },
  { id: 'jan-vani',        label: 'Jan Vani Portal', icon: Smartphone,     badge: 'AI' },
  { id: 'tender-parser',   label: 'Tender Gazette',  icon: FileSpreadsheet,badge: 'Gemini' },
  { id: 'data-explorer',   label: 'Data Repository', icon: Radio,          badge: 'Live' },
  { id: 'architecture',    label: 'Cloud DPI Arch',  icon: Cpu,            badge: '25%' },
];

export default function Header({ activeTab, setActiveTab, liveMode, setLiveMode, selectedDistrict, setSelectedDistrict }) {
  const [distOpen, setDistOpen] = useState(false);
  const currentDist = DISTRICTS.find(d => d.value === selectedDistrict) || DISTRICTS[0];

  return (
    <header style={{
      margin: '14px 20px 0',
      borderRadius: '8px',
      background: 'var(--bg-base)',
      border: '1px solid var(--border)',
      overflow: 'visible',
      position: 'sticky',
      top: '14px',
      zIndex: 100,
    }}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '6px',
            background: 'var(--emerald-bg)',
            border: '1px solid var(--emerald-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--emerald)', flexShrink: 0,
          }}>
            <Landmark size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                Gov<span style={{ color: 'var(--emerald)' }}>Grid</span>
              </h1>
              <span className="badge badge-teal" style={{ fontSize: '0.62rem' }}>
                <Zap size={9} /> DPI AI Engine
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Citizen Grievance × Budget Execution Intelligence
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'var(--bg-surface)', padding: '4px',
          borderRadius: '6px', border: '1px solid var(--border)',
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-pill ${isActive ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* District Selector */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setLiveMode(!liveMode)}
            style={{
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
              background: liveMode ? 'var(--emerald-bg)' : 'var(--amber-subtle)',
              border: `1px solid ${liveMode ? 'var(--emerald-border)' : 'var(--amber-border)'}`,
              color: liveMode ? 'var(--emerald)' : 'var(--amber-bright)',
              fontSize: '0.76rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Activity size={13} />
            <span>{liveMode ? 'BigQuery Live' : 'Sandbox Verification'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
