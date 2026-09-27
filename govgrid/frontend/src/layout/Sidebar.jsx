import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareWarning,
  FileSearch2,
  GitCompare,
  Smartphone,
  BarChart3,
  Database,
  GitBranch,
  ChevronLeft,
  Globe2,
  ChevronDown,
  Activity,
  Landmark,
  ShieldCheck
} from 'lucide-react';

const NAV = [
  { path: '/',               label: 'Command Center',  icon: LayoutDashboard,      color: 'emerald', desc: 'District Spatial Grid' },
  { path: '/grievances',     label: 'Grievances',      icon: MessageSquareWarning, color: 'rose',    desc: 'Citizen Reports' },
  { path: '/tenders',        label: 'Tender Intel',    icon: FileSearch2,          color: 'amber',   desc: 'Procurement Audit' },
  { path: '/reconciliation', label: 'Reconciliation',  icon: GitCompare,           color: 'emerald', desc: 'Discrepancy Engine' },
  { path: '/jan-vani',       label: 'Jan Vani Intake', icon: Smartphone,           color: 'amber',   desc: 'Multilingual Voice/SMS' },
  { path: '/analytics',      label: 'Analytics',       icon: BarChart3,            color: 'slate',   desc: 'Fiscal & Trends' },
  { path: '/pipeline',       label: 'Data Pipeline',   icon: Database,             color: 'slate',   desc: 'BigQuery GIS & GeM' },
  { path: '/architecture',   label: 'Architecture',    icon: GitBranch,            color: 'emerald', desc: 'Google Cloud DPI' },
];

const DISTRICTS = [
  { value: 'anantapur', label: 'Anantapur', state: 'AP', code: 'District Pilot' },
  { value: 'bengaluru', label: 'Bengaluru', state: 'KA', code: 'BBMP Zone' },
  { value: 'delhi',     label: 'New Delhi',  state: 'DL', code: 'MCD / NDMC' },
];

const COLOR_MAP = {
  emerald: { icon: 'var(--emerald)', bg: '#0c261e', border: '#059669' },
  rose:    { icon: 'var(--rose)',    bg: '#341214', border: '#dc2626' },
  amber:   { icon: 'var(--amber)',   bg: '#331e08', border: '#d97706' },
  slate:   { icon: '#94a3b8',        bg: '#18212f', border: '#475569' },
};

export default function Sidebar({ collapsed, setCollapsed, selectedDistrict, setSelectedDistrict, liveMode, setLiveMode }) {
  const [distOpen, setDistOpen] = useState(false);
  const location = useLocation();
  const currentDist = DISTRICTS.find(d => d.value === selectedDistrict) || DISTRICTS[0];

  return (
    <aside style={{
      width: collapsed ? '68px' : '230px',
      minHeight: '100vh',
      background: 'var(--bg-base)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh',
      zIndex: 40,
    }}>

      {/* Brand Header (NO EMOJIS, NO GRADIENTS) */}
      <div style={{
        padding: collapsed ? '18px 12px' : '18px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '10px',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '68px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '6px', flexShrink: 0,
            background: 'var(--emerald-deep)',
            border: '1px solid var(--emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Landmark size={18} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                Gov<span style={{ color: 'var(--emerald)' }}>Grid</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600, letterSpacing: '0.04em' }}>
                PUBLIC DPI AUDIT MATRIX
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '4px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* District Selector (Solid colors) */}
      {!collapsed && (
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 700 }}>
            Active Jurisdiction
          </div>
          <button
            onClick={() => setDistOpen(!distOpen)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 10px', borderRadius: '6px', cursor: 'pointer',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe2 size={13} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.1 }}>{currentDist.label}</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', lineHeight: 1.1 }}>{currentDist.state} · {currentDist.code}</div>
              </div>
            </div>
            <ChevronDown size={12} style={{ color: 'var(--text-muted)', transform: distOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
          </button>

          {distOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% - 4px)', left: '14px', right: '14px', zIndex: 100,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>
              {DISTRICTS.map(d => (
                <button
                  key={d.value}
                  onClick={() => { setSelectedDistrict(d.value); setDistOpen(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '7px 9px', borderRadius: '4px', border: 'none',
                    background: selectedDistrict === d.value ? 'var(--emerald-bg)' : 'transparent',
                    color: selectedDistrict === d.value ? 'var(--emerald)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600,
                  }}
                >
                  {d.label} <span style={{ opacity: 0.6, fontWeight: 400 }}>({d.state})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, padding: '6px 8px 3px' }}>
            System Navigation
          </div>
        )}
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const colors = COLOR_MAP[item.color] || COLOR_MAP.emerald;

          return (
            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: collapsed ? '9px' : '8px 10px',
                  borderRadius: '6px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? colors.bg : 'transparent',
                  border: `1px solid ${isActive ? colors.border : 'transparent'}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '5px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? colors.bg : 'var(--bg-surface)',
                  color: isActive ? colors.icon : 'var(--text-muted)',
                }}>
                  <Icon size={15} />
                </div>
                {!collapsed && (
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {item.desc}
                    </div>
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Live Sync Status (Solid colors) */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => setLiveMode(!liveMode)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : '8px', justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
            background: liveMode ? 'var(--emerald-bg)' : 'var(--amber-subtle)',
            border: `1px solid ${liveMode ? 'var(--emerald-border)' : 'var(--amber-border)'}`,
            fontFamily: 'var(--font-body)',
          }}
        >
          <Activity size={14} style={{ color: liveMode ? 'var(--emerald)' : 'var(--amber)', flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: liveMode ? 'var(--emerald)' : 'var(--amber-bright)', lineHeight: 1.1 }}>
                {liveMode ? 'BigQuery Stream Active' : 'Sandbox Verification'}
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                {liveMode ? 'Sync interval: 30s' : 'Click to connect stream'}
              </div>
            </div>
          )}
        </button>

        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 8px 2px', opacity: 0.6 }}>
            <ShieldCheck size={11} style={{ color: 'var(--emerald)' }} />
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Vertex AI + BigQuery GIS</span>
          </div>
        )}
      </div>
    </aside>
  );
}
