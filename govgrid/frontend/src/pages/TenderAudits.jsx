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
  ExternalLink 
} from 'lucide-react';

export default function TenderAudits({ tenders = [], complaints = [] }) {
  const [activeTab, setActiveTab] = useState('attention');
  const [frozenCases, setFrozenCases] = useState({});
  const [summonedCases, setSummonedCases] = useState({});
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const attentionCases = [
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Toast Alert */}
      {feedbackNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-rose-400" />
            <div>
              <p className="font-display font-bold text-xs">{feedbackNotice.title}</p>
              <p className="text-xs text-slate-300 mt-0.5">{feedbackNotice.text}</p>
            </div>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-xs font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Filter Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2 font-display">
            <ShieldAlert size={14} className="text-secondary" />
            Spatial Discrepancy Resolution Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
            Tender Reconciliation &amp; Audit Dossier
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Compare what citizens report on the ground against contractor billing milestones in real time.
          </p>
        </div>

        {/* 2-Option Status Selector */}
        <div className="flex items-center p-1.5 bg-surface-dim rounded-2xl border border-slate-200 shadow-2xs shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('attention')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'attention'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Needs Attention</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {attentionCases.length}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('clean')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'clean'
                ? 'bg-white text-secondary shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Verified Clean</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
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
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm border border-rose-200">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-base text-slate-900">{item.title}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.flagColor}`}>
                        {item.flagType}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-mono font-semibold text-slate-700">{item.tenderId}</span>
                      <span>•</span>
                      <span>{item.department}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin size={12} className="text-secondary" /> {item.ward} ({item.spatialBuffer})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider font-display">
                    Public Capital Outlay
                  </span>
                  <span className="text-lg font-display font-extrabold text-slate-900">{item.budget}</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200/80">
                {/* Left: Citizen Distress Reality */}
                <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 font-display">
                      <AlertOctagon size={14} className="text-rose-600" />
                      Citizen Ground Reality (Jan-Vani)
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md">
                      {item.complaintCount} Distress Signals
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {item.citizenReport}
                  </p>
                  <div className="text-xs text-rose-900 font-medium flex items-center gap-2 pt-1 border-t border-rose-200/60">
                    <span>Severity Rating: <strong className="font-bold">{item.severityAvg}</strong></span>
                    <span>•</span>
                    <span>Deadline: <strong>{item.deadline}</strong></span>
                  </div>
                </div>

                {/* Right: Contractor Billing Claim */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-display">
                      <Building size={14} className="text-primary" />
                      Contractor Claim &amp; Billing
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md">
                      {item.contractor}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {item.contractorClaim}
                  </p>
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-2 pt-1 border-t border-slate-200">
                    <span>Total Disbursed: <strong className="font-bold text-slate-900">{item.disbursed}</strong></span>
                  </div>
                </div>
              </div>

              {/* Physical vs Financial Completion Gap Meter */}
              <div className="p-6 bg-white border-b border-slate-200/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold font-display text-slate-800">
                    Physical Ground Audit: <strong className="text-emerald-700">{item.physicalCertified}% Certified</strong>
                  </span>
                  <span className="font-bold font-display text-rose-600">
                    Discrepancy Gap: -{item.discrepancyGap}% Phantom Progress
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
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
              <div className="p-6 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <BrainCircuit size={20} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">
                      Vertex AI Gemini Forensic Audit Recommendation
                    </span>
                    <p className="text-xs text-slate-800 mt-0.5 leading-relaxed font-medium">
                      {item.aiRecommendation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      alert(`Generating Official State Audit Dossier PDF for Case ${item.id} (${item.tenderId})... Download starting.`);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileDown size={14} />
                    <span>Dossier PDF</span>
                  </button>

                  <button 
                    onClick={() => handleSummonContractor(item.id, item.contractor)}
                    disabled={summonedCases[item.id]}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs ${
                      summonedCases[item.id]
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-white text-primary hover:bg-slate-100 border border-slate-200'
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
                    onClick={() => alert(`Opening GeM verified audit certificate for ${c.tenderId}...`)}
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

    </div>
  );
}
