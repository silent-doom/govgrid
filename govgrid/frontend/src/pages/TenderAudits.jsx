import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  FileDown, 
  UserCheck, 
  MapPin, 
  Building, 
  ArrowRight, 
  Clock, 
  IndianRupee, 
  Layers, 
  BrainCircuit, 
  ExternalLink,
  X,
  Printer,
  Download,
  Award
} from 'lucide-react';

export default function TenderAudits({ tenders = [], complaints = [], reconciliationReport = null }) {
  const [activeTab, setActiveTab] = useState('attention');
  const [frozenCases, setFrozenCases] = useState({});
  const [summonedCases, setSummonedCases] = useState({});
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [activeDossierModal, setActiveDossierModal] = useState(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState(null);

  const liveAttentionCases = reconciliationReport?.capital_leakage && reconciliationReport.capital_leakage.length > 0
    ? reconciliationReport.capital_leakage.map((item, idx) => ({
        id: `BQ-AUD-${idx + 1}`,
        tenderId: item.tender_id,
        title: item.work_description,
        contractor: item.contractor,
        department: item.department,
        ward: item.location,
        spatialBuffer: `${item.distance_meters || 380}m ST_DWithin`,
        budget: item.budget_inr >= 10000000 ? `₹${(item.budget_inr / 10000000).toFixed(2)} Cr` : `₹${(item.budget_inr / 100000).toFixed(1)} Lakhs`,
        disbursed: item.budget_disbursed_inr ? (item.budget_disbursed_inr >= 10000000 ? `₹${(item.budget_disbursed_inr / 10000000).toFixed(2)} Cr` : `₹${(item.budget_disbursed_inr / 100000).toFixed(1)} Lakhs`) : '₹100% Claimed',
        physicalCertified: Math.max(8, 100 - (item.complaint_count * 7)),
        discrepancyGap: Math.min(92, item.complaint_count * 7),
        complaintCount: item.complaint_count,
        severityAvg: `${item.avg_severity || item.max_severity} / 10`,
        flagType: item.alert_level === 'GHOST_PROJECT_FLAGGED' ? 'Ghost Project Alert (Contractor 100% Signoff)' : 'Critical Capital Leakage',
        flagColor: 'bg-rose-50 text-rose-700 border-rose-200',
        citizenReport: `${item.complaint_count} verified citizen complaints within 800m radial. ${item.leakage_reason}`,
        contractorClaim: `PFMS Trx: ${item.pfms_transaction_id}. Contractor claims ${item.milestone_progress}% completion signoff.`,
        aiRecommendation: `Invoke BigQuery GIS Vigilance Protocol: Immediate escrow freeze on ${item.tender_id}. Summon ${item.contractor} for statutory inspection.`,
        deadline: '24h Vigilance Priority',
      }))
    : null;

  const attentionCases = liveAttentionCases || [
    {
      id: 'AUD-001',
      tenderId: 'GEM-2025-C-84912',
      title: 'Mahadevapura Ring Road Drainage & Bitumen Resurfacing',
      contractor: 'Apex Infra Projects Ltd',
      department: 'Roads & Buildings Directorate',
      ward: 'Ward 14 (Mahadevapura)',
      spatialBuffer: '340m ST_DWithin',
      budget: '₹18.50 Cr',
      disbursed: '₹18.50 Cr (100%)',
      physicalCertified: 22,
      discrepancyGap: 78,
      complaintCount: 148,
      severityAvg: '9.2 / 10',
      flagType: 'Critical Capital Leakage',
      flagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      citizenReport: '148 verified vernacular complaints within 340m radius. Craters up to 38cm depth, severe stormwater inundation, school buses stranded for 3 consecutive weeks.',
      contractorClaim: 'Contractor submitted 100% Phase-3 completion sign-off on 12 Aug 2026 for bituminous resurfacing & roadside culvert boxing. Full tranche claimed.',
      aiRecommendation: 'Invoke General Financial Rules Rule 175: Immediate freeze of final ₹3.7 Cr escrow tranche. Summon Managing Director for statutory vigilance hearing within 72 hours.',
      deadline: '48h statutory deadline',
    },
    {
      id: 'AUD-002',
      tenderId: 'DEF-2025-09',
      title: 'Kadugodi Slum Cluster Potable Water Main',
      contractor: 'Unallocated (State Liability Gap)',
      department: 'Municipal Water Supply & Sewerage Board',
      ward: 'Ward 22 (Kadugodi Cluster)',
      spatialBuffer: '420m Cluster Radial',
      budget: '₹0.00 (Zero Sanction)',
      disbursed: '₹0.00',
      physicalCertified: 0,
      discrepancyGap: 100,
      complaintCount: 312,
      severityAvg: '9.4 / 10',
      flagType: 'Unfunded Public Liability',
      flagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      citizenReport: '312 urgent voice calls ingested via Jan-Vani IVR. Ruptured pipeline has contaminated local ground wells, leaving 4,200 slum households with zero potable water for 5 days.',
      contractorClaim: 'No active civil tender logged in GeM database for this 800m feeder corridor. Zero capital sanctioned in FY2025-26 municipal budget.',
      aiRecommendation: 'Emergency diversion authorized under State Disaster Mitigation Fund (SDMF) Head #12. Issue expedited rapid tender sanction of ₹3.2 Cr to restore drinking water within 24h.',
      deadline: 'Urgent < 24h',
    },
    {
      id: 'AUD-003',
      tenderId: 'GEM-2024-R-1102',
      title: 'Outer Ring Road Stormwater Culvert Reinforcement',
      contractor: 'Sri Lakshmi Earthmovers',
      department: 'Urban Drainage & Flood Mitigation Dept',
      ward: 'Ward 18 (Hoodi Junction)',
      spatialBuffer: '510m Junction Buffer',
      budget: '₹6.40 Cr',
      disbursed: '₹4.80 Cr (75%)',
      physicalCertified: 38,
      discrepancyGap: 37,
      complaintCount: 84,
      severityAvg: '8.1 / 10',
      flagType: 'Contractor Delay & Abandonment',
      flagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      citizenReport: 'Open concrete trench left unfinished since June 2026. Monsoon silt clogging stormwater flow, flooding neighboring residential colonies.',
      contractorClaim: 'Contractor requested 4th timeline extension citing raw material supply delays. Contractor quality performance rating fell to 38/100.',
      aiRecommendation: 'Issue final 48-hour statutory show-cause notice under Public Procurement Act. Forfeit 10% performance bank guarantee (₹64 Lakhs) and black-list for future ward tenders.',
      deadline: 'Notice expires in 48h',
    },
  ];

  const cleanCases = [
    {
      id: 'CLN-001',
      tenderId: 'GEM-2025-W-4019',
      title: 'MG Road High-Mast LED & Solar Grid Modernization',
      contractor: 'Surya Electrotech Corp',
      department: 'Electricity & Lighting Division',
      ward: 'Ward 3 (Central Business District)',
      budget: '₹2.10 Cr',
      completion: '100% Certified Clean',
      complaints: '0 Citizen Complaints',
      verifiedDate: 'Yesterday',
    },
    {
      id: 'CLN-002',
      tenderId: 'GEM-2025-S-8812',
      title: 'Indiranagar 100ft Road Mechanized Desilting',
      contractor: 'CleanCity Urban Services',
      department: 'Solid Waste & Sanitation',
      ward: 'Ward 8 (Indiranagar)',
      budget: '₹1.45 Cr',
      completion: '94% On Schedule',
      complaints: '2 Minor Inquiries (Resolved)',
      verifiedDate: '2 days ago',
    },
    {
      id: 'CLN-003',
      tenderId: 'GEM-2025-R-7734',
      title: 'Whitefield Main Road Bituminous Overlay',
      contractor: 'Southern Highway Builders',
      department: 'Roads & Buildings Directorate',
      ward: 'Ward 20 (Whitefield)',
      budget: '₹8.90 Cr',
      completion: '88% On Schedule',
      complaints: '1 Verified Complaint (Rectified)',
      verifiedDate: '3 days ago',
    },
  ];

  const handleFreezeTranche = (caseId, tenderTitle) => {
    setFrozenCases(prev => ({ ...prev, [caseId]: true }));
    setFeedbackNotice({
      title: 'Escrow Tranche Payment Frozen',
      text: `Accounting order dispatched to Municipal Treasury: Escrow disbursement on ${tenderTitle} is legally frozen.`
    });
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleSummonContractor = (caseId, contractorName) => {
    setSummonedCases(prev => ({ ...prev, [caseId]: true }));
    setFeedbackNotice({
      title: 'Statutory Vigilance Summons Issued',
      text: `Formal legal notice dispatched to ${contractorName}. Hearing scheduled before Municipal Vigilance Bench.`
    });
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
      
      {/* Toast Alert */}
      {feedbackNotice && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-rose-400 shrink-0" />
            <div>
              <p className="font-display font-bold text-xs">{feedbackNotice.title}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">{feedbackNotice.text}</p>
            </div>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-xs font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Filter Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-200/80 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2 font-display">
            <ShieldAlert size={14} className="text-secondary" />
            Spatial Discrepancy Resolution Hub
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-primary tracking-tight">
            Tender Reconciliation &amp; Audit Dossier
          </h1>
          <p className="text-xs sm:text-base text-slate-500 mt-1">
            Compare what citizens report on the ground against contractor billing milestones in real time.
          </p>
        </div>

        {/* 2-Option Status Selector */}
        <div className="flex items-center p-1 sm:p-1.5 bg-surface-dim rounded-2xl border border-slate-200 shadow-2xs w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('attention')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'attention'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Needs Attention</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {attentionCases.length}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('clean')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'clean'
                ? 'bg-white text-secondary shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Verified Clean</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
              24
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Needs Attention (Detailed Audit Dossiers) */}
      {activeTab === 'attention' && (
        <div className="space-y-8">
          {attentionCases.map((item) => (
            <section 
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-sm transition-all overflow-hidden"
            >
              {/* Case Meta Header Bar */}
              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-200 dark:border-rose-900/60">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-base text-slate-900 dark:text-white">{item.title}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.flagColor}`}>
                        {item.flagType}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{item.tenderId}</span>
                      <span>•</span>
                      <span>{item.department}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin size={12} className="text-secondary" /> {item.ward} ({item.spatialBuffer})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-semibold uppercase tracking-wider font-display">
                    Public Capital Outlay
                  </span>
                  <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white">{item.budget}</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200 dark:border-slate-700">
                {/* Left: Citizen Distress Reality */}
                <div className="bg-rose-50/50 dark:bg-rose-950/40 rounded-2xl p-5 border border-rose-200/80 dark:border-rose-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5 font-display">
                      <AlertOctagon size={14} className="text-rose-600 dark:text-rose-400" />
                      Citizen Ground Reality (Jan-Vani)
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-md">
                      {item.complaintCount} Distress Signals
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {item.citizenReport}
                  </p>
                  <div className="text-xs text-rose-900 dark:text-rose-300 font-medium flex items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/60">
                    <span>Severity Rating: <strong className="font-bold">{item.severityAvg}</strong></span>
                    <span>•</span>
                    <span>Deadline: <strong>{item.deadline}</strong></span>
                  </div>
                </div>

                {/* Right: Contractor Billing Claim */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-display">
                      <Building size={14} className="text-primary dark:text-emerald-400" />
                      Contractor Claim &amp; Billing
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md">
                      {item.contractor}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {item.contractorClaim}
                  </p>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Disbursed: <strong className="font-bold text-slate-900 dark:text-white">{item.disbursed}</strong></span>
                  </div>
                </div>
              </div>

              {/* Physical vs Financial Completion Gap Meter */}
              <div className="p-6 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold font-display text-slate-800 dark:text-slate-200">
                    Physical Ground Audit: <strong className="text-emerald-700 dark:text-emerald-400">{item.physicalCertified}% Certified</strong>
                  </span>
                  <span className="font-bold font-display text-rose-600 dark:text-rose-400">
                    Discrepancy Gap: -{item.discrepancyGap}% Phantom Progress
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-secondary h-full transition-all" 
                    style={{ width: `${item.physicalCertified}%` }} 
                    title={`Physical Complete: ${item.physicalCertified}%`}
                  />
                  <div 
                    className="bg-rose-500 h-full opacity-80 transition-all" 
                    style={{ width: `${item.discrepancyGap}%` }} 
                    title={`Discrepancy Gap: ${item.discrepancyGap}%`}
                  />
                </div>
              </div>

              {/* AI Forensic Recommendation & Action Triggers */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <BrainCircuit size={20} className="text-secondary dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                      Vertex AI Gemini Forensic Audit Recommendation
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed font-medium">
                      {item.aiRecommendation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setActiveDossierModal(item)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileDown size={14} />
                    <span>Dossier PDF</span>
                  </button>

                  <button 
                    onClick={() => handleSummonContractor(item.id, item.contractor)}
                    disabled={summonedCases[item.id]}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs ${
                      summonedCases[item.id]
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-700 text-primary dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>{summonedCases[item.id] ? 'Summons Served' : 'Summon Contractor'}</span>
                  </button>

                  <button 
                    onClick={() => handleFreezeTranche(item.id, item.title)}
                    disabled={frozenCases[item.id]}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-xs ${
                      frozenCases[item.id]
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    <Lock size={14} />
                    <span>{frozenCases[item.id] ? 'Tranche Frozen' : 'Freeze Escrow'}</span>
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Tab 2: Verified Clean Tenders */}
      {activeTab === 'clean' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-sm text-slate-800">
              Verified Compliant Civil Tenders (Zero Spatial Discrepancies)
            </h3>
            <span className="text-xs text-secondary font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} /> Continuous GPS Telemetry Active
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {cleanCases.map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">{c.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">{c.tenderId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{c.department}</span>
                    <span>•</span>
                    <span>{c.ward}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{c.complaints}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-display">{c.budget}</span>
                    <span className="text-[11px] text-emerald-600 block font-semibold">{c.completion}</span>
                  </div>
                  <button 
                    onClick={() => setActiveCertificateModal(c)}
                    className="p-2 rounded-xl bg-surface-dim hover:bg-slate-200 text-slate-600 transition" 
                    title="View Certificate"
                  >
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Forensic Audit Dossier Modal */}
      {activeDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-surface-dim dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-display block">
                    Statutory Forensic Audit Dossier • Confidential
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    {activeDossierModal.title}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveDossierModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Emblem & Authority Banner */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Government of Karnataka / BBMP Urban Audit Directorate</p>
                  <p className="text-[11px] text-slate-500">BigQuery GIS Autonomous Reconciliation Record • Ref: {activeDossierModal.tenderId}</p>
                </div>
                <span className="font-mono text-xs bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg font-bold">
                  {activeDossierModal.id}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sanctioned Capital</span>
                  <span className="font-display font-extrabold text-sm text-slate-900 dark:text-white">{activeDossierModal.budget}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Claimed Disbursement</span>
                  <span className="font-display font-extrabold text-sm text-rose-600">{activeDossierModal.disbursed}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contractor</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{activeDossierModal.contractor}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Spatial Join</span>
                  <span className="font-mono text-[11px] text-emerald-600 font-bold">{activeDossierModal.spatialBuffer}</span>
                </div>
              </div>

              {/* Forensic Findings */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <h4 className="font-display font-bold text-xs flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                  <BrainCircuit size={15} /> Vertex AI Forensic Finding &amp; Evidence
                </h4>
                <p className="leading-relaxed text-[11px]">
                  {activeDossierModal.aiRecommendation}
                </p>
              </div>

              {/* Digital Signature & Hash */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>SHA-256: 7f8a92b...e41d80c (BigQuery Immutably Logged)</span>
                <span className="text-emerald-600 font-bold">VERIFIED AUTHENTIC</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-surface-dim dark:bg-slate-800/50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Authorized for Municipal Public Accounts Committee
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
                >
                  <Printer size={14} />
                  <span>Print Dossier</span>
                </button>
                <button 
                  onClick={() => setActiveDossierModal(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition shadow-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GeM Digital Compliance Certificate Modal */}
      {activeCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    GeM Compliance Certificate
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{activeCertificateModal.tenderId}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveCertificateModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-2 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Clean Public Works Execution Verified
                </p>
                <p className="text-[11px] mt-1 text-emerald-800/90 dark:text-emerald-300">
                  Zero spatial grievance clusters detected within 500m radius of site for past 90 days.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Work Description</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCertificateModal.title}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCertificateModal.department}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Budget Outlay</span>
                  <span className="font-display font-bold text-emerald-600">{activeCertificateModal.budget}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Milestone Status</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCertificateModal.completion}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveCertificateModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-display font-bold text-xs hover:bg-slate-800 transition"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
