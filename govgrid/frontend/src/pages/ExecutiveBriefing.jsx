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
  PhoneOff,
  Radio,
  X,
  Play, 
  Pause, 
  ExternalLink, 
  FileCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Compass,
  Database,
  ShieldCheck,
  Mic,
  FileText,
  BarChart3,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function ExecutiveBriefing({ districtData, complaints = [], tenders = [], reconciliationReport = null }) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [frozenTenders, setFrozenTenders] = useState({});
  const [approvedFunds, setApprovedFunds] = useState({});
  const [selectedPin, setSelectedPin] = useState(1);
  const [mobileTab, setMobileTab] = useState('priorities'); // 'priorities' | 'spatial'
  const [callingHelpline, setCallingHelpline] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                {t('greeting')}
              </h1>
              <span className="text-xl sm:text-2xl" role="img" aria-label="sun">☀️</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base mt-1.5 font-normal">
              {t('summaryAttention')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('liveSyncNotice')}</span>
          </div>
        </div>

        {/* 3 Clean Highlight Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5 sm:mt-6">
          {/* Metric 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                {t('metricCitizenReports')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">1,428</span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                  92% Vernacular
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <MessageSquare size={20} className="text-primary dark:text-emerald-400" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                {t('metricReconciled')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">84.2%</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">₹141.8 / 184.6 Cr</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-secondary dark:text-emerald-400" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                {t('metricHotspots')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-display font-extrabold text-rose-600">3 Hotspots</span>
                <span className="text-[11px] sm:text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800">
                  Immediate
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 dark:bg-slate-700 text-rose-600 flex items-center justify-center">
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
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
                >
                  {t('actionInspectGIS')}
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
                  {frozenTenders['GEM-2025-C-84912'] ? t('actionFrozen') : t('actionFreeze')}
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
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
                >
                  {t('actionDispatchTankers')}
                </NavLink>
                <button 
                  onClick={() => handleApproveFund('DEF-2025-09', '3.2 Cr', 'Kadugodi Water Main')}
                  disabled={approvedFunds['DEF-2025-09']}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                    approvedFunds['DEF-2025-09'] 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  {approvedFunds['DEF-2025-09'] ? t('actionFundApproved') : t('actionApproveFund')}
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

            {/* Stylized Map Vector Backdrop with Interactive Pins */}
            <div className="relative w-full h-56 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <svg className="w-full h-full object-cover" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                <rect fill="currentColor" className="text-slate-50 dark:text-slate-900" height="240" width="400" />
                <path d="M 0,80 Q 120,70 190,130 T 400,110 L 400,0 L 0,0 Z" fill="currentColor" className="text-slate-100 dark:text-slate-800" opacity="0.8" />
                <path d="M 120,240 Q 220,160 300,200 T 400,220 L 400,240 Z" fill="currentColor" className="text-slate-200 dark:text-slate-800" opacity="0.5" />
                <path d="M -10,140 Q 100,110 220,150 T 420,130" fill="none" stroke="currentColor" className="text-white dark:text-slate-700" strokeWidth="8" />
                <path d="M -10,140 Q 100,110 220,150 T 420,130" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="2.5" />
                <path d="M 160,-10 L 170,120 L 250,250" fill="none" stroke="currentColor" className="text-white dark:text-slate-700" strokeWidth="6" />
                <path d="M 160,-10 L 170,120 L 250,250" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="2" />
                <path d="M 280,30 Q 230,100 320,180" fill="none" stroke="currentColor" className="text-white dark:text-slate-700" strokeWidth="5" />
                
                {/* 500m Buffer Circle around Priority 1 */}
                <circle cx="210" cy="140" fill="#fee2e2" fillOpacity="0.4" r="32" stroke="#fca5a5" strokeDasharray="3 3" strokeWidth="1" />
                <circle cx="280" cy="170" fill="#fef3c7" fillOpacity="0.4" r="26" stroke="#fcd34d" strokeDasharray="3 3" strokeWidth="1" />
              </svg>

              {/* Pin 1: Mahadevapura (Red Alert) */}
              <button 
                onClick={() => setSelectedPin(1)}
                className="absolute top-[55%] left-[52%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full bg-rose-600 text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 1 ? 'ring-rose-200 dark:ring-rose-900 scale-110' : 'ring-rose-100 dark:ring-rose-950 hover:scale-105'
                }`}>
                  1
                </div>
                <div className="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium border border-slate-700">
                  Mahadevapura (P1 Sinkhole)
                </div>
              </button>

              {/* Pin 2: Kadugodi Slum (Amber Alert) */}
              <button 
                onClick={() => setSelectedPin(2)}
                className="absolute top-[70%] left-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full bg-amber-500 text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 2 ? 'ring-amber-200 dark:ring-amber-900 scale-110' : 'ring-amber-100 dark:ring-amber-950 hover:scale-105'
                }`}>
                  2
                </div>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium border border-slate-700">
                  Kadugodi (Water Main)
                </div>
              </button>

              {/* Pin 3: Hoodi (Blue Note) */}
              <button 
                onClick={() => setSelectedPin(3)}
                className="absolute top-[32%] left-[38%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full bg-primary text-white shadow-md flex items-center justify-center font-bold text-xs ring-4 transition-transform ${
                  selectedPin === 3 ? 'ring-blue-200 dark:ring-slate-700 scale-110' : 'ring-blue-100 dark:ring-slate-800 hover:scale-105'
                }`}>
                  3
                </div>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-medium border border-slate-700">
                  Hoodi Culvert Delay
                </div>
              </button>

              {/* Gentle bottom badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 shadow-2xs">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> GIS Auto-Matched
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">500m Buffer Zone</span>
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
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-xs text-slate-700 dark:text-amber-100 leading-relaxed">
              <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1">
                <span>English Translation:</span>
              </div>
              <p className="italic text-slate-800 dark:text-slate-200 font-sans">
                "For three days, the water line beside the government school in Kadugodi has burst open. Drinking water is flooding into houses and the kids cannot walk to school. Please send repair teams immediately."
              </p>
              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Verified Resident • Anjanappa Layout</span>
                <span className="text-amber-800 dark:text-amber-400 font-semibold">Confidence: 98%</span>
              </div>
            </div>
          </div>

          {/* Quick District Helpdesk Note */}
          <div className="p-4 rounded-2xl bg-surface-dim dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-primary flex items-center justify-center shadow-xs">
                <PhoneCall size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Executive Briefing Helpline</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Disaster Management Cell: Extension 104</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setCallingHelpline(true);
                setCallDuration(1);
              }}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-2xs transition flex items-center gap-1.5"
            >
              <PhoneCall size={13} />
              <span>{t('actionCallDesk')}</span>
            </button>
          </div>

        </section>
      </div>

      {/* Platform Quicklinks & Direct Navigation Grid */}
      <div className="mt-10 sm:mt-14 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500/20" size={18} />
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Platform Quicklinks & Accessibility Directives
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Press ⌘K anywhere for fast dispatch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <NavLink 
            to="/voices"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Jan-Vani Citizen Voices
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Native Kannada, Telugu & Hindi audio transcript playback with automated WhatsApp simulation.
              </p>
            </div>
          </NavLink>

          <NavLink 
            to="/audits"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Tender Accountability Audits
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Discrepancy dossiers, GFR Rule 175 escrow freeze orders, and contractor show-cause notices.
              </p>
            </div>
          </NavLink>

          <NavLink 
            to="/map"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapIcon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Interactive Ward GIS Map
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Uber H3 hexbins, ST_DWithin 500m contractor buffer rings, and satellite visual overlays.
              </p>
            </div>
          </NavLink>

          <NavLink 
            to="/analytics"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BarChart3 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Spatial Variance Analytics
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ward contractor compliance ratios, capital leakage trends, and cross-district benchmarks.
              </p>
            </div>
          </NavLink>

          <NavLink 
            to="/pipeline"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Database size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  BigQuery GIS Pipeline Telemetry
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ingested GeM e-Tenders, CPGRAMS grievances, and live SQL reconciliation queries.
              </p>
            </div>
          </NavLink>

          <div 
            onClick={() => window.print()}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-2xs hover:shadow-xs transition group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Print Statutory Gazette Dossier
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Official PDF export containing Commissioner audit memos and certified telemetry hashes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Civic Knowledge & FAQ Section */}
      <div className="mt-8 mb-12 bg-surface-dim dark:bg-slate-900/60 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-emerald-950 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                GovGrid Civic FAQ & Technical Methodology
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground-truth reconciliation architecture, AI verification standards & regulatory protocols
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            DPI Verified Standard
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 0,
              cat: 'Spatial Reconciliation',
              q: 'How does GovGrid reconcile citizen ground truth against GeM e-Tender disbursements?',
              a: 'GovGrid executes automated BigQuery GIS spatial queries using ST_DWithin with dynamic 500m to 1.5km buffer rings around civil contract milestone coordinates. When incoming CPGRAMS or WhatsApp voice grievances intersect spatially with a 100% billed contractor milestone, an automated discrepancy anomaly is flagged with an auditable forensic checksum.'
            },
            {
              id: 1,
              cat: 'Vertex AI & Gemini',
              q: 'What role does Vertex AI & Gemini 1.5 Pro play in multimodal audit verification?',
              a: 'Gemini 1.5 Pro performs multimodal cross-matching by analyzing contractor milestone submission photos, drone photogrammetry, and citizen ground evidence. It detects physical progress discrepancies (such as 22% actual concrete pour vs 100% billed completion) with verifiable 98% forensic accuracy.'
            },
            {
              id: 2,
              cat: 'Enforcement Directives',
              q: 'What happens when an Unfunded Liability or Capital Leakage anomaly is flagged?',
              a: 'The system initiates a three-tier statutory response: (1) Temporary PFMS escrow tranche freeze under GFR Rule 175, (2) Automated dispatch of a third-party municipal vigilance inspector within 24 hours, and (3) Automated Kannada/Telugu/Hindi SMS notification to citizen complainants with a public grievance tracking hash.'
            },
            {
              id: 3,
              cat: 'Vernacular DPI',
              q: 'How does Jan-Vani support multiple regional languages and dialects?',
              a: 'Jan-Vani incorporates speech-to-text models calibrated for colloquial Indic dialects in Kannada, Telugu, Tamil, and Hindi. Voice notes submitted via WhatsApp or IVR line 104 are normalized, phonetically transcribed, translated to English for administrative review, and geocoded to the nearest municipal ward node.'
            },
            {
              id: 4,
              cat: 'Statutory Authority',
              q: 'Who has statutory authority to execute PFMS payment freeze orders?',
              a: 'Only credentialed Municipal Commissioners (IAS) and District Magistrates holding hardware-authenticated cryptographic tokens can freeze or reallocate contingency funds under Section 71(b) of the Municipal Financial Governance Act.'
            },
            {
              id: 5,
              cat: 'Citizen Transparency',
              q: 'Can ordinary citizens verify whether contractor repair works were validated?',
              a: 'Yes. Every audit decision produces a verifiable SHA-256 telemetry hash published to the GovGrid open ledger. Citizens can view whether their ward defect was addressed, inspect before/after satellite imagery, and track fund allocations transparently without bureaucratic friction.'
            }
          ].map((item) => {
            const isOpen = activeFaq === item.id;
            return (
              <div 
                key={item.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? -1 : item.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-emerald-400 block mb-1 font-display">
                      {item.cat}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary dark:text-emerald-400' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Disaster Management Hotline Audio Conference Modal */}
      {callingHelpline && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
            {/* Header Glow */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <Radio size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Municipal Disaster Desk (Ext 104)</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Connected • Secure Encrypted Line</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setCallingHelpline(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Call State & Audio Visualizer */}
            <div className="py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
                <PhoneCall size={28} />
              </div>
              <h4 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                Nodal Officer: M. Raghavan
              </h4>
              <p className="text-xs text-slate-500 mt-1">Disaster Relief Operations • Bangalore Urban HQ</p>

              {/* Simulated Frequency Waves */}
              <div className="flex items-center justify-center gap-1.5 h-10 mt-5">
                {[14, 28, 20, 36, 16, 32, 24, 18, 30, 15].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-emerald-500 rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions to dispatch via desk */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-display">
                Immediate Directives (One-Touch)
              </span>
              <button 
                onClick={() => {
                  setActionNotice({
                    type: 'approved',
                    title: '10 Water Tankers Dispatched',
                    message: 'Emergency priority water tanker fleet assigned to Kadugodi slum cluster via Disaster Management Cell.'
                  });
                  setCallingHelpline(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-300 text-xs font-semibold text-left flex items-center justify-between border border-blue-200/60 dark:border-slate-700 transition"
              >
                <span>Dispatch 10 Tankers to Ward 22</span>
                <span className="text-[10px] bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded font-bold">SEND</span>
              </button>

              <button 
                onClick={() => {
                  setActionNotice({
                    type: 'frozen',
                    title: 'P1 Sinkhole Hazard Cordoned',
                    message: 'Traffic police & barricade teams deployed along Mahadevapura Ring Road segment.'
                  });
                  setCallingHelpline(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-900 dark:text-rose-300 text-xs font-semibold text-left flex items-center justify-between border border-rose-200/60 dark:border-slate-700 transition"
              >
                <span>Deploy Emergency Barricade to P1</span>
                <span className="text-[10px] bg-rose-200 dark:bg-rose-900 px-2 py-0.5 rounded font-bold">DISPATCH</span>
              </button>
            </div>

            {/* End Call Button */}
            <button 
              onClick={() => setCallingHelpline(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <PhoneOff size={16} />
              <span>Disconnect Audio Conference</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
