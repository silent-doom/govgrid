import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  ArrowRight, 
  Lock, 
  Shield, 
  Clock, 
  Building, 
  Zap, 
  BrainCircuit, 
  PhoneCall, 
  Play, 
  Pause, 
  ExternalLink, 
  FileCheck,
  AlertCircle
} from 'lucide-react';

export default function ExecutiveBriefing({ districtData, complaints = [], tenders = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [frozenTenders, setFrozenTenders] = useState({});
  const [approvedFunds, setApprovedFunds] = useState({});
  const [selectedPin, setSelectedPin] = useState(1);
  const [mobileTab, setMobileTab] = useState('priorities'); // 'priorities' | 'spatial'

  const handleFreeze = (tenderId, title) => {
    setFrozenTenders(prev => ({ ...prev, [tenderId]: true }));
    setActionNotice({
      type: 'frozen',
      title: 'Escrow Tranche Payment Frozen',
      message: `Directive issued to Municipal Accounts Office: Payment on ${title} (${tenderId}) is frozen pending physical vigilance inspection.`
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleApproveFund = (fundId, amount, title) => {
    setApprovedFunds(prev => ({ ...prev, [fundId]: true }));
    setActionNotice({
      type: 'approved',
      title: 'Emergency Capital Sanctioned',
      message: `₹${amount} emergency allocation approved under SDMF Head for ${title}. Municipal tanker dispatch initiated.`
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full flex-1">
      
      {/* Toast Notification Alert */}
      {actionNotice && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-md ${
          actionNotice.type === 'frozen' 
            ? 'bg-rose-50 border-rose-200 text-rose-900' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-start gap-3">
            {actionNotice.type === 'frozen' ? (
              <Lock className="text-rose-600 shrink-0 mt-0.5" size={20} />
            ) : (
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            )}
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm">{actionNotice.title}</h4>
              <p className="text-[11px] sm:text-xs mt-0.5 opacity-90">{actionNotice.message}</p>
            </div>
          </div>
          <button 
            onClick={() => setActionNotice(null)}
            className="text-xs font-semibold px-2 py-1 rounded-md hover:bg-black/5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Warm Welcoming Banner */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Good morning, Commissioner Desai
              </h1>
              <span className="text-xl sm:text-2xl" role="img" aria-label="sun">☀️</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-base mt-1.5 font-normal">
              <strong className="font-semibold text-rose-700">3 critical spatial items</strong> require your attention today across <strong className="text-slate-900 font-semibold">₹42.8 Cr</strong> in municipal capital.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-3 sm:px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Last automated sync: <strong>8:45 AM</strong> (CPGRAMS + GeM)</span>
          </div>
        </div>

        {/* 3 Clean Highlight Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5 sm:mt-6">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">Citizen Reports</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">1,428</span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  92% Vernacular
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MessageSquare size={20} className="text-primary" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">Capital Reconciled</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">84.2%</span>
                <span className="text-xs font-medium text-slate-500">₹141.8 / 184.6 Cr</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-secondary" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">Pending Attention</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-rose-600">3 Hotspots</span>
                <span className="text-[11px] sm:text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                  Immediate
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={22} className="text-rose-600" />
            </div>
          </div>
        </div>

        {/* Mobile View Switcher (Visible only on mobile/tablet < lg) */}
        <div className="lg:hidden flex items-center p-1 bg-surface-dim rounded-2xl border border-slate-200 mt-4 shadow-2xs">
          <button
            onClick={() => setMobileTab('priorities')}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'priorities'
                ? 'bg-white text-primary shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle size={14} className="text-rose-600" />
            <span>Top Priorities (3)</span>
          </button>

          <button
            onClick={() => setMobileTab('spatial')}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'spatial'
                ? 'bg-white text-primary shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin size={14} className="text-secondary" />
            <span>Ward Map &amp; Audio</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Today's Top 3 Spatial Priorities (7 Cols) */}
        <section className={`lg:col-span-7 space-y-5 ${mobileTab === 'priorities' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-bold text-slate-900">Today's Top 3 Spatial Priorities</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">Sorted by urgency</span>
            </div>
            <NavLink to="/audits" className="text-xs font-semibold text-primary hover:text-secondary transition flex items-center gap-1">
              <span>View All 14 Audits</span>
              <ArrowRight size={14} />
            </NavLink>
          </div>

          {/* Priority Card 1: Mahadevapura Ring Road Drainage & Sinkhole */}
          <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-sm transition relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Critical Mismatch
                  </span>
                  <span className="text-xs font-medium text-slate-500">Ward 14 (Mahadevapura)</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-mono text-slate-500">GEM-2025-C-84912</span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary transition">
                  Mahadevapura Ring Road Drainage &amp; Sinkhole
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Disbursed</span>
                <span className="text-base font-display font-bold text-slate-900">₹18.50 Cr</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Satellite imagery confirms only <strong>22% physical completion</strong>, while contractor received 100% milestone sign-off. Road severely submerged with 148 citizen distress calls.
            </p>

            {/* Quick tags badge ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 148 Citizen Complaints
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <MapPin size={12} className="text-slate-400" /> ST_DWithin: 340m
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <Building size={12} className="text-slate-400" /> Apex Infra Ltd
              </span>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Suggested: Hold final escrow tranche
              </span>
              <div className="flex items-center gap-2">
                <NavLink 
                  to="/map" 
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition border border-slate-200"
                >
                  Inspect GIS Evidence
                </NavLink>
                <button 
                  onClick={() => handleFreeze('GEM-2025-C-84912', 'Mahadevapura Ring Road')}
                  disabled={frozenTenders['GEM-2025-C-84912']}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                    frozenTenders['GEM-2025-C-84912'] 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  <Lock size={13} />
                  {frozenTenders['GEM-2025-C-84912'] ? 'Escrow Frozen' : 'Review & Freeze Payment'}
                </button>
              </div>
            </div>
          </article>

          {/* Priority Card 2: Kadugodi Urban Slum Water Main Breach */}
          <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-sm transition relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Unfunded Deficit
                  </span>
                  <span className="text-xs font-medium text-slate-500">Ward 22 (Kadugodi Slum Cluster)</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-mono text-slate-500">DEF-2025-09</span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary transition">
                  Kadugodi Urban Slum Water Main Breach
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Budget Allocated</span>
                <span className="text-base font-display font-bold text-rose-600">₹0.00 (Zero)</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Severe clean drinking water disruption impacting ~4,200 households for 48 hours. Rapid citizen inflow with 312 vernacular calls via Jan-Vani voice channel.
            </p>

            {/* Quick tags badge ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 312 Inquiries (48 hrs)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                <Shield size={12} className="text-emerald-600" /> SDMF Fund Eligible
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <Clock size={12} className="text-slate-400" /> Urgent &lt; 24h
              </span>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <BrainCircuit size={14} className="text-emerald-600" />
                Vertex AI: Reallocate from Contingency Head #12
              </span>
              <div className="flex items-center gap-2">
                <NavLink 
                  to="/voices"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition border border-slate-200"
                >
                  Dispatch Tankers
                </NavLink>
                <button 
                  onClick={() => handleApproveFund('DEF-2025-09', '3.2 Cr', 'Kadugodi Water Main')}
                  disabled={approvedFunds['DEF-2025-09']}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                    approvedFunds['DEF-2025-09'] 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  {approvedFunds['DEF-2025-09'] ? 'Sanctioned ₹3.2 Cr' : 'Approve ₹3.2 Cr Emergency Fund'}
                </button>
              </div>
            </div>
          </article>

          {/* Priority Card 3: Outer Ring Road Culvert Reinforcement */}
          <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-sm transition relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Contractor Delay
                  </span>
                  <span className="text-xs font-medium text-slate-500">Ward 18 (Hoodi Junction)</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-mono text-slate-500">GEM-2024-R-1102</span>
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary transition">
                  Outer Ring Road Culvert Reinforcement
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Sanctioned Outlay</span>
                <span className="text-base font-display font-bold text-slate-900">₹6.40 Cr</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Project delayed by 184 days. Sri Lakshmi Earthmovers performance index dropped to 38/100 across 4 civil wards. Notice deadline expires in 48 hours.
            </p>

            {/* Quick tags badge ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <Clock size={12} className="text-slate-400" /> 184 Days Overdue
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200/60">
                <Building size={12} className="text-slate-400" /> Sri Lakshmi Earthmovers
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-medium border border-rose-200/60">
                Score: 38/100
              </span>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Auto show-cause notice drafted &amp; queued</span>
              <div className="flex items-center gap-2">
                <NavLink 
                  to="/audits"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition border border-slate-200"
                >
                  View Contractor History
                </NavLink>
                <button 
                  onClick={() => {
                    setActionNotice({
                      type: 'frozen',
                      title: 'Statutory Penalty Notice Dispatched',
                      message: 'Formal 48-hour show-cause penalty notice served to Sri Lakshmi Earthmovers with 10% performance guarantee forfeiture warning.'
                    });
                    setTimeout(() => setActionNotice(null), 5000);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
                >
                  Issue Final Penalty Notice
                </button>
              </div>
            </div>
          </article>
        </section>

        {/* Right Column: Ward Spatial Overview & Community Voice Note (5 Cols) */}
        <section className={`lg:col-span-5 space-y-6 ${mobileTab === 'spatial' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Ward Spatial Overview Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-bold text-slate-900">Ward Spatial Overview</h3>
                <p className="text-xs text-slate-500">{districtData?.name || 'District Jurisdiction'} • 3 Active Hotspots</p>
              </div>
              <NavLink to="/map" className="text-xs font-semibold text-primary hover:text-secondary flex items-center gap-1">
                <span>Full Map</span>
                <ExternalLink size={12} />
              </NavLink>
            </div>

            {/* Stylized Light Map Vector Backdrop with Interactive Pins */}
            <div className="relative w-full h-56 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden">
              <svg className="w-full h-full object-cover" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#f8fafc" height="240" width="400" />
                <path d="M 0,80 Q 120,70 190,130 T 400,110 L 400,0 L 0,0 Z" fill="#f1f5f9" opacity="0.8" />
                <path d="M 120,240 Q 220,160 300,200 T 400,220 L 400,240 Z" fill="#e2e8f0" opacity="0.5" />
                <path d="M -10,140 Q 100,110 220,150 T 420,130" fill="none" stroke="#ffffff" strokeWidth="8" />
                <path d="M -10,140 Q 100,110 220,150 T 420,130" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                <path d="M 160,-10 L 170,120 L 250,250" fill="none" stroke="#ffffff" strokeWidth="6" />
                <path d="M 160,-10 L 170,120 L 250,250" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 280,30 Q 230,100 320,180" fill="none" stroke="#ffffff" strokeWidth="5" />
                
                {/* 500m Buffer Circle around Priority 1 */}
                <circle cx="210" cy="140" fill="#fee2e2" fillOpacity="0.5" r="32" stroke="#fca5a5" strokeDasharray="3 3" strokeWidth="1" />
                <circle cx="280" cy="170" fill="#fef3c7" fillOpacity="0.5" r="26" stroke="#fcd34d" strokeDasharray="3 3" strokeWidth="1" />
              </svg>

              {/* Pin 1: Mahadevapura (Red Alert) */}
              <button 
                onClick={() => setSelectedPin(1)}
                className="absolute top-[55%] left-[52%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full bg-rose-600 text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 1 ? 'ring-rose-200 scale-110' : 'ring-rose-100 hover:scale-105'
                }`}>
                  1
                </div>
                <div className="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium">
                  Mahadevapura (P1 Sinkhole)
                </div>
              </button>

              {/* Pin 2: Kadugodi Slum (Amber Alert) */}
              <button 
                onClick={() => setSelectedPin(2)}
                className="absolute top-[70%] left-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full bg-amber-500 text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 2 ? 'ring-amber-200 scale-110' : 'ring-amber-100 hover:scale-105'
                }`}>
                  2
                </div>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium">
                  Kadugodi (Water Main)
                </div>
              </button>

              {/* Pin 3: Hoodi (Blue Note) */}
              <button 
                onClick={() => setSelectedPin(3)}
                className="absolute top-[32%] left-[38%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full bg-primary text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 3 ? 'ring-blue-200 scale-110' : 'ring-blue-100 hover:scale-105'
                }`}>
                  3
                </div>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium">
                  Hoodi Culvert Delay
                </div>
              </button>

              {/* Gentle bottom badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 shadow-2xs">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> GIS Auto-Matched
                </span>
                <span className="font-mono text-slate-500">500m Buffer Zone</span>
              </div>
            </div>

            {/* Pin Legend List */}
            <div className="mt-3.5 space-y-2">
              <div 
                onClick={() => setSelectedPin(1)}
                className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition cursor-pointer ${
                  selectedPin === 1 ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center">1</span>
                  <span className="font-medium text-slate-800">Mahadevapura Ring Rd</span>
                </div>
                <span className="text-rose-600 font-semibold text-[11px]">₹18.5 Cr Flagged</span>
              </div>

              <div 
                onClick={() => setSelectedPin(2)}
                className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition cursor-pointer ${
                  selectedPin === 2 ? 'bg-amber-50 border border-amber-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center">2</span>
                  <span className="font-medium text-slate-800">Kadugodi Water Breach</span>
                </div>
                <span className="text-amber-700 font-semibold text-[11px]">312 Complaints</span>
              </div>

              <div 
                onClick={() => setSelectedPin(3)}
                className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition cursor-pointer ${
                  selectedPin === 3 ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">3</span>
                  <span className="font-medium text-slate-800">Hoodi Culvert Work</span>
                </div>
                <span className="text-slate-500 text-[11px]">184d Overdue</span>
              </div>
            </div>
          </div>

          {/* Recent Community Voice Note Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageSquare size={17} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-900">Recent Citizen Voice Note</h3>
                  <p className="text-[11px] text-slate-500">Jan-Vani IVR • Auto-transcribed</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                Kannada (ಕನ್ನಡ)
              </span>
            </div>

            {/* Playable Audio Waveform Player */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary/90 transition shrink-0" 
                  title={isPlaying ? "Pause voice note" : "Play voice note"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                {/* Waveform bars */}
                <div className="flex-1 flex items-center gap-1 h-8 px-1">
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-6' : 'bg-slate-300 h-3'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-7' : 'bg-primary h-5'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-4' : 'bg-primary h-7'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-8' : 'bg-primary h-4'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-5' : 'bg-primary h-6'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-7' : 'bg-primary h-8'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-6' : 'bg-primary h-5'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-8' : 'bg-primary h-7'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-4' : 'bg-slate-300 h-4'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-7' : 'bg-slate-300 h-6'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-5' : 'bg-slate-300 h-3'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-6' : 'bg-slate-300 h-5'}`} />
                  <div className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary h-3' : 'bg-slate-300 h-2'}`} />
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 shrink-0">
                  {isPlaying ? '0:22 / 0:38' : '0:14 / 0:38'}
                </span>
              </div>
            </div>

            {/* Plain English Vernacular Translation */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed">
              <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1">
                <span>English Translation:</span>
              </div>
              <p className="italic text-slate-800 font-sans">
                "For three days, the water line beside the government school in Kadugodi has burst open. Drinking water is flooding into houses and the kids cannot walk to school. Please send repair teams immediately."
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Verified Resident • Anjanappa Layout</span>
                <span className="text-amber-800 font-semibold">Confidence: 98%</span>
              </div>
            </div>
          </div>

          {/* Quick District Helpdesk Note */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shadow-xs">
                <PhoneCall size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Executive Briefing Helpline</p>
                <p className="text-[11px] text-slate-600">Disaster Management Cell: Extension 104</p>
              </div>
            </div>
            <button 
              onClick={() => {
                alert("Initiating secure audio conference with Municipal Disaster Management Desk (Ext 104)...");
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-primary hover:bg-slate-50 shadow-2xs border border-slate-200 transition"
            >
              Call Desk
            </button>
          </div>

        </section>
      </div>

    </div>
  );
}
