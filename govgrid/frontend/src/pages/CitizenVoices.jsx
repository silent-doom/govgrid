import React, { useState } from 'react';
import { 
  Mic, 
  Search, 
  Droplets, 
  AlertTriangle, 
  Zap, 
  TreePine, 
  Play, 
  Pause, 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  ShieldCheck, 
  Send, 
  Sparkles,
  ChevronRight,
  Info,
  MapPin,
  Camera,
  X,
  Radio,
  Layers,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function CitizenVoices({ complaints = [], onAddComplaint }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState('VOICE-1');
  const [selectedCaseId, setSelectedCaseId] = useState('VOICE-1');
  const [simulatedRecording, setSimulatedRecording] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [sanctionedCases, setSanctionedCases] = useState({});
  const [assignedEngineers, setAssignedEngineers] = useState({});
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0); // 0: idle, 1: STT, 2: Gemini, 3: BQ, 4: done

  const PRESET_AUDIO_CLIPS = [
    {
      id: 'WHATSAPP-VOICE-BLR',
      language: 'Kannada (ಕನ್ನಡ)',
      location: 'Ward 14 (Mahadevapura)',
      ward: 'Ward 14 (Mahadevapura)',
      transcript: 'ಸರ್, ಮಹದೇವಪುರ ಔಟರ್ ರಿಂಗ್ ರೋಡ್ ಹತ್ತಿರ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆ ಕುಸಿದಿದೆ. ಬೈಕ್ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ದುರಸ್ತಿ ಮಾಡಿ.',
      translation: 'Sir, near Mahadevapura Outer Ring Road the road has collapsed after water pipe burst. Commuters are falling. Please repair immediately.',
      category: 'Roads',
      severity: 9,
      lat: 12.9912,
      lng: 77.6974,
      author: 'Mahadevapura Ward Residents',
      duration: '0:22',
      quickCost: '₹3.4 Lakhs',
      commuters: '18,500 daily commuters',
      suggestedAction: 'Deploy Quick Asphalt Seal & Drainage Valve Repair',
      nearestTenderDist: '140m within funded PWD segment'
    },
    {
      id: 'WHATSAPP-VOICE-ATP',
      language: 'Telugu (తెలుగు)',
      location: 'Ward 22 (Kadugodi Urban Slum)',
      ward: 'Ward 22 (Kadugodi)',
      transcript: 'అనంతపురం కదిరి రోడ్డు వద్ద తాగునీటి మెయిన్ లైన్ పగిలింది. వేల లీటర్ల నీరు వృథా అవుతోంది. కాలనీకి నీటి సరఫరా నిలిచిపోయింది.',
      translation: 'Near Kadiri Road, the main drinking water pipe has ruptured. Thousands of liters of water being wasted and colony supply cut off.',
      category: 'Water',
      severity: 8,
      lat: 14.6738,
      lng: 77.6042,
      author: 'Kadugodi Community Action',
      duration: '0:29',
      quickCost: '₹2.8 Lakhs',
      commuters: '4,200 slum households',
      suggestedAction: 'Emergency Water Tanker Fleet + Pipe Sleeve Patch',
      nearestTenderDist: 'Zero funded tenders (Deficit Hotspot)'
    },
    {
      id: 'WHATSAPP-VOICE-DEL',
      language: 'Hindi (हिन्दी)',
      location: 'Ward 8 (Rohini East)',
      ward: 'Ward 8 (Rohini East)',
      transcript: 'रोहिणी सेक्टर 8 में बिजली का पोल झुक गया है और ट्रांसफार्मर से चिंगारी निकल रही है। बच्चों का स्कूल पास में है, तुरंत ठीक करें।',
      translation: 'In Rohini Sector 8, an electric pole has tilted and transformer is sparking. School children walk here, please fix immediately.',
      category: 'Electricity',
      severity: 9,
      lat: 28.6942,
      lng: 77.1124,
      author: 'Rohini Resident Welfare Assoc.',
      duration: '0:19',
      quickCost: '₹1.5 Lakhs',
      commuters: 'School zone (~3,000 children)',
      suggestedAction: 'DISCOM Priority Power Isolation & Pole Replacement',
      nearestTenderDist: '380m from Smart Grid Tender'
    }
  ];

  // Curated Stitch Citizen Stories
  const citizenStories = [
    {
      id: 'VOICE-1',
      title: 'Dharmavaram Road Crater Breach',
      caseNo: 'JAN-2024-884',
      author: 'Dharmavaram Residents Collective',
      authorInitials: 'DR',
      authorColor: 'bg-amber-100 text-amber-800',
      source: 'Verified WhatsApp Community',
      timeAgo: '18 min ago',
      ward: 'Ward 14 (Singanamala)',
      tag: 'High Impact',
      language: 'Telugu (తెలుగు)',
      duration: '0:34',
      accuracy: '98.2%',
      translation: 'The crater on Dharmavaram Bypass road has widened severely after last night’s rains. School buses are stranded each morning and children are forced to walk through slush. Please sanction repair immediately.',
      damageDetail: 'Pothole Depth: 38cm',
      locationRadial: 'Singanamala Junction Radial',
      category: 'Roads',
      reasonFlagged: 'Citizens reported a severe 38cm crater depth blocking school transit. Our AI capital audit found that no municipal road tender currently covers this 800m stretch.',
      quickCost: '₹3.40 Lakhs',
      commuters: '~4,200 Daily Commuters',
      suggestedAction: 'Pothole Filling Rapid Tender',
      coords: 'Lat 14.6819 • Lon 77.6006',
      nearestTenderDist: '1.2km away',
    },
    {
      id: 'VOICE-2',
      title: 'Kadugodi Drinking Water Main Breach',
      caseNo: 'JAN-2024-892',
      author: 'Lakshmi Narayana & Neighbors',
      authorInitials: 'LN',
      authorColor: 'bg-blue-100 text-blue-800',
      source: 'Jan-Vani IVR Call Center',
      timeAgo: '42 min ago',
      ward: 'Ward 7 (Railway Crossing)',
      tag: 'Water Pressure',
      language: 'Telugu (తెలుగు)',
      duration: '0:41',
      accuracy: '96.4%',
      translation: 'The pipeline line on 4th cross street hasn’t provided municipal drinking water for two consecutive days. Women in our lane are having to buy commercial cans at inflated prices.',
      damageDetail: 'Zero Pressure (48h)',
      locationRadial: '4th Cross Street Cluster',
      category: 'Water',
      reasonFlagged: '12 households co-signed water shortage. GIS audit shows water main pipeline fractured near culvert with zero repair ticket logged.',
      quickCost: '₹1.80 Lakhs',
      commuters: '12 Co-signed Households',
      suggestedAction: 'Valve Gasket Replacement & Tanker Supply',
      coords: 'Lat 14.6710 • Lon 77.5890',
      nearestTenderDist: 'Unsanctioned',
    },
    {
      id: 'VOICE-3',
      title: 'Canal Bund Solar Lighting Outage',
      caseNo: 'JAN-2024-905',
      author: 'M. Kesava (Gram Panchayat Rep)',
      authorInitials: 'MK',
      authorColor: 'bg-emerald-100 text-emerald-800',
      source: 'Rural Kiosk Submission',
      timeAgo: '2 hours ago',
      ward: 'Ward 19 (Canal Bund)',
      tag: 'Street Lighting',
      language: 'Telugu (తెలుగు)',
      duration: '0:22',
      accuracy: '99.1%',
      translation: 'Four new solar streetlight poles on the canal bund road are completely inactive since Friday night. Villagers returning from farm work feel unsafe in dark curves.',
      damageDetail: '4 Inactive Poles',
      locationRadial: 'Canal Bund Agricultural Road',
      category: 'Electricity',
      reasonFlagged: 'High-traffic evening agricultural corridor completely dark. Tenders show LED conversion certified 2 months ago by Laxmi Electricals.',
      quickCost: '₹65,000',
      commuters: '~850 Farm Workers',
      suggestedAction: 'Contractor Warranty Rectification Notice',
      coords: 'Lat 14.6890 • Lon 77.6050',
      nearestTenderDist: 'Warranty Active',
    },
  ];

  const [mobileTab, setMobileTab] = useState('feed'); // 'feed' | 'inspector'
  const [storiesList, setStoriesList] = useState(citizenStories);

  const filteredStories = storiesList.filter(story => {
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCase = storiesList.find(s => s.id === selectedCaseId) || storiesList[0];

  const handleSimulateVoiceSubmit = (e) => {
    e.preventDefault();
    if (!voiceInputText.trim()) return;
    setSimulatedRecording(true);
    setTimeout(() => {
      const newStory = {
        id: `VOICE-${Date.now()}`,
        title: `Citizen Grievance: ${voiceInputText.slice(0, 35)}...`,
        caseNo: `JAN-${Date.now().toString().slice(-4)}`,
        author: 'Verified Citizen (WhatsApp)',
        authorInitials: 'CW',
        authorColor: 'bg-emerald-100 text-emerald-800',
        source: 'WhatsApp Voice Inflow (Chirp 2 Verified)',
        timeAgo: 'Just now',
        ward: 'Ward 14 (Mahadevapura)',
        tag: 'P1 Urgent',
        language: 'Vernacular Input',
        duration: '0:18',
        accuracy: '98.9%',
        translation: voiceInputText,
        damageDetail: 'Reported damage undergoing automatic triage',
        locationRadial: 'Ward 14 Radial',
        category: 'Roads',
        reasonFlagged: 'Real-time distress call ingested via WhatsApp simulator.',
        quickCost: '₹1.2 Lakhs',
        commuters: '~4,200 Citizens',
        suggestedAction: 'Deploy Ward Emergency Team',
        coords: 'Lat 12.9912 • Lon 77.6974',
        nearestTenderDist: '340m ST_DWithin',
      };
      setStoriesList(prev => [newStory, ...prev]);
      setSelectedCaseId(newStory.id);
      setVoiceInputText('');
      setSimulatedRecording(false);
      setToastMessage('Voice report ingested & geocoded via Vertex AI!');
      setTimeout(() => setToastMessage(null), 5000);
      if (onAddComplaint) {
        onAddComplaint(newStory);
      }
    }, 1000);
  };

  const handleQuickSanction = (caseItem) => {
    setSanctionedCases(prev => ({ ...prev, [caseItem.id]: true }));
    setToastMessage(`Sanction Granted! Rapid order issued for ${caseItem.title} (${caseItem.quickCost}). Automated SMS dispatched to citizens.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleAssignEngineer = (caseItem) => {
    setAssignedEngineers(prev => ({ ...prev, [caseItem.id]: true }));
    setToastMessage(`Engineer Assigned! Ward Executive Officer notified for on-site inspection at ${caseItem.ward}.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const runSimulation = () => {
    setPipelineStep(1);
    setTimeout(() => {
      setPipelineStep(2);
      setTimeout(() => {
        setPipelineStep(3);
        setTimeout(() => {
          setPipelineStep(4);
          const chosen = PRESET_AUDIO_CLIPS[selectedPresetIndex];
          const newStory = {
            id: `LIVE-${Date.now()}`,
            title: `${chosen.category}: ${chosen.location}`,
            caseNo: `JAN-${Date.now().toString().slice(-4)}`,
            author: chosen.author,
            authorInitials: 'WA',
            authorColor: 'bg-emerald-100 text-emerald-800',
            source: 'WhatsApp Voice Inflow (Chirp 2 Verified)',
            timeAgo: 'Just now',
            ward: chosen.ward,
            tag: `Severity ${chosen.severity}/10`,
            language: chosen.language,
            duration: chosen.duration,
            accuracy: '99.1%',
            translation: chosen.translation,
            damageDetail: `AI Assessed Damage: Severity ${chosen.severity}/10`,
            locationRadial: `${chosen.location} Radial`,
            quickCost: chosen.quickCost,
            commuters: chosen.commuters,
            suggestedAction: chosen.suggestedAction,
            nearestTenderDist: chosen.nearestTenderDist,
            category: chosen.category,
            reasonFlagged: `Real-time WhatsApp audio grievance geocoded via Vertex AI Gemini and ST_GeogPoint. Location within 500m of active municipal jurisdiction.`
          };
          setStoriesList(prev => [newStory, ...prev]);
          setSelectedCaseId(newStory.id);
          if (onAddComplaint) {
            onAddComplaint({
              complaint_id: newStory.caseNo,
              category: chosen.category,
              severity_score: chosen.severity,
              extracted_location: chosen.location,
              lat: chosen.lat,
              lng: chosen.lng,
              damage_assessment: chosen.translation,
              original_language: chosen.language,
              submitted_at: new Date().toISOString()
            });
          }
          setToastMessage(`Voice grievance successfully ingested from WhatsApp via Google Speech-to-Text & Vertex AI! Ingested into BigQuery GIS.`);
          setTimeout(() => setToastMessage(null), 6000);
        }, 800);
      }, 900);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Subheader & Search Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2 border border-blue-200/60 dark:border-blue-800 font-display">
              <Mic size={14} className="text-blue-600 dark:text-blue-400" />
              Direct Citizen Ground-Truth
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {t('voicesTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {t('voicesSubtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* WhatsApp Simulator Trigger Button */}
            <button
              onClick={() => {
                setWhatsAppModalOpen(true);
                setPipelineStep(0);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition shrink-0"
              title="Test Google AI WhatsApp Audio Inflow"
            >
              <Mic size={15} className="animate-pulse text-emerald-200" />
              <span>{t('simWhatsAppBtn')}</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search voice notes, wards, keywords..."
                className="w-full bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs transition"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 border-b border-slate-200/60 dark:border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-primary text-white shadow-primary/20'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{t('filterAll')}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {filteredStories.length}
            </span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Water')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedCategory === 'Water'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Droplets size={13} className={selectedCategory === 'Water' ? 'text-white' : 'text-blue-500'} />
            <span>{t('filterWater')}</span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 rounded-full">340</span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Roads')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedCategory === 'Roads'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <AlertTriangle size={13} className={selectedCategory === 'Roads' ? 'text-white' : 'text-amber-600'} />
            <span>{t('filterRoads')}</span>
            <span className="bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] px-1.5 rounded-full">618</span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Electricity')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedCategory === 'Electricity'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Zap size={13} className={selectedCategory === 'Electricity' ? 'text-white' : 'text-amber-500'} />
            <span>{t('filterElectricity')}</span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 rounded-full">284</span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Sanitation')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedCategory === 'Sanitation'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <TreePine size={13} className={selectedCategory === 'Sanitation' ? 'text-white' : 'text-emerald-600'} />
            <span>{t('filterSanitation')}</span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 rounded-full">240</span>
          </button>
        </div>

        {/* Mobile View Toggle (Visible only on screens < lg) */}
        <div className="lg:hidden flex items-center p-1 bg-surface-dim rounded-2xl border border-slate-200 mt-3 shadow-2xs">
          <button
            onClick={() => setMobileTab('feed')}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'feed'
                ? 'bg-white text-primary shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic size={14} />
            <span>Voice Feed ({filteredStories.length})</span>
          </button>

          <button
            onClick={() => setMobileTab('inspector')}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'inspector'
                ? 'bg-white text-primary shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info size={14} />
            <span>Case #{selectedCase.caseNo}</span>
          </button>
        </div>
      </div>

      {/* Split Layout: Stories Feed (Left) & Focused Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Feed of Clean Story Cards (7 cols) */}
        <div className={`lg:col-span-7 space-y-4 ${mobileTab === 'feed' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Quick Voice Note Ingestion Simulator Input */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-secondary" />
              <h3 className="font-display font-bold text-sm text-slate-900">Citizen WhatsApp / Voice Simulator</h3>
            </div>
            <form onSubmit={handleSimulateVoiceSubmit} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                value={voiceInputText}
                onChange={(e) => setVoiceInputText(e.target.value)}
                placeholder="Simulate vernacular WhatsApp voice report (e.g., 'రోడ్డుపై భారీ గుంత ఉంది...')"
                className="flex-1 bg-surface-dim px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                type="submit"
                disabled={simulatedRecording}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <Mic size={14} />
                <span>{simulatedRecording ? 'Transcribing...' : 'Ingest Voice'}</span>
              </button>
            </form>
          </div>

          {filteredStories.map((story) => {
            const isSelected = selectedCaseId === story.id;
            const isAudioPlaying = playingId === story.id;

            return (
              <article 
                key={story.id}
                onClick={() => {
                  setSelectedCaseId(story.id);
                  setMobileTab('inspector');
                }}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition cursor-pointer shadow-xs hover:shadow-sm relative ${
                  isSelected 
                    ? 'border-2 border-primary/40 ring-4 ring-primary/5' 
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${story.authorColor}`}>
                      {story.authorInitials}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-slate-900">{story.author}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          {story.source}
                        </span>
                        <span className="text-xs text-slate-400">• {story.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60">
                    {story.ward} • {story.tag}
                  </span>
                </div>

                {/* Telugu Audio Player Pill */}
                <div className="bg-surface-dim rounded-2xl p-3 my-3 flex items-center gap-3 border border-slate-200/60">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingId(isAudioPlaying ? null : story.id);
                    }}
                    className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-primary/90 transition"
                    title={isAudioPlaying ? "Pause Voice Note" : "Play Voice Note"}
                  >
                    {isAudioPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <Mic size={13} /> {story.language}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {isAudioPlaying ? '0:18 / ' + story.duration : '0:00 / ' + story.duration}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: isAudioPlaying ? '55%' : '0%' }}
                      />
                    </div>
                  </div>

                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-secondary dark:text-emerald-400 font-semibold border border-slate-200 dark:border-slate-600 shadow-2xs">
                    {story.accuracy} Accurate
                  </span>
                </div>

                {/* English Translation Quote Block */}
                <blockquote className="bg-blue-50/50 dark:bg-slate-800/60 border-l-4 border-blue-400 dark:border-emerald-500 rounded-r-2xl p-3.5 my-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  “{story.translation}”
                </blockquote>

                {/* Attachments & Metadata Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                        <Camera size={20} />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">{story.damageDetail}</p>
                      <p className="text-slate-500 dark:text-slate-400">{story.locationRadial}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-emerald-400">
                    <span>{isSelected ? 'Active Selection' : 'Inspect Dossier'}</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              </article>
            );
          })}

        </div>

        {/* Right Column: Single Focused Detail View for Selected Report (5 cols) */}
        <div className={`lg:col-span-5 sticky top-24 ${mobileTab === 'inspector' ? 'block' : 'hidden lg:block'}`}>
          <aside className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            
            {/* Mobile Back to Feed Button */}
            <button 
              onClick={() => setMobileTab('feed')}
              className="lg:hidden text-xs font-bold text-primary flex items-center gap-1 hover:underline pb-1 border-b border-slate-100 w-full"
            >
              <ChevronRight size={15} className="rotate-180" />
              <span>Back to Citizen Voice Feed</span>
            </button>

            {/* Focused Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/80">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Action Required • No Tender Found
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  Case #{selectedCase.caseNo}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                {selectedCase.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {selectedCase.locationRadial}, {selectedCase.ward}
              </p>
            </div>

            {/* Empathetic Human Reason Why Flagged */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-xs text-amber-900 dark:text-amber-300">Why was this flagged?</h3>
                  <p className="text-xs text-amber-900/90 dark:text-amber-100 mt-1 leading-relaxed">
                    {selectedCase.reasonFlagged}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Friendly Satellite & Spatial Preview */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="p-3 bg-white flex items-center justify-between text-xs text-slate-600 border-b border-slate-200/80">
                <span className="font-semibold flex items-center gap-1.5 text-slate-800">
                  <MapPin size={14} className="text-secondary" />
                  Satellite Context Preview
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{selectedCase.coords}</span>
              </div>

              {/* Graphic Illustration of Road & Void */}
              <div className="h-44 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full object-cover opacity-90" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
                  <rect fill="#f1f5f9" height="180" width="400" />
                  <path d="M 0,40 Q 150,20 280,60 T 400,30 L 400,0 L 0,0 Z" fill="#e2e8f0" />
                  <path d="M 0,140 Q 180,160 300,130 T 400,150 L 400,180 L 0,180 Z" fill="#e2e8f0" />
                  <path d="M -10,100 C 120,95 240,85 410,95" fill="none" stroke="#cbd5e1" strokeWidth="28" />
                  <path d="M -10,100 C 120,95 240,85 410,95" fill="none" stroke="#94a3b8" strokeWidth="24" />
                  <path d="M -10,100 C 120,95 240,85 410,95" fill="none" stroke="#ffffff" strokeDasharray="6,6" strokeWidth="2" />
                  
                  {/* Unfunded Gap Highlight */}
                  <circle cx="210" cy="90" fill="#fee2e2" fillOpacity="0.7" r="46" stroke="#f87171" strokeDasharray="4,4" strokeWidth="2" />
                  <circle cx="210" cy="90" fill="#dc2626" r="8" />
                  <circle cx="210" cy="90" fill="#ffffff" r="3" />
                </svg>

                {/* Map Floating Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[11px] font-bold text-slate-900">800m Unsanctioned Corridor</p>
                  <p className="text-[10px] text-slate-500">Nearest active tender is {selectedCase.nearestTenderDist}</p>
                </div>
              </div>
            </div>

            {/* Community Voice Summary Details */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <span className="text-slate-500">Estimated Quick Repair Cost</span>
                <span className="font-display font-extrabold text-sm text-primary">{selectedCase.quickCost}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <span className="text-slate-500">Impacted Population</span>
                <span className="font-semibold text-slate-800">{selectedCase.commuters}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <span className="text-slate-500">Suggested Executive Action</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {selectedCase.suggestedAction}
                </span>
              </div>
            </div>

            {/* Two Action Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => handleQuickSanction(selectedCase)}
                disabled={sanctionedCases[selectedCase.id]}
                className={`w-full font-display font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition ${
                  sanctionedCases[selectedCase.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                    : 'bg-secondary hover:bg-emerald-800 text-white'
                }`}
              >
                {sanctionedCases[selectedCase.id] ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>Sanction Granted (SMS Dispatched)</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Sanction Quick Repair</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => handleAssignEngineer(selectedCase)}
                disabled={assignedEngineers[selectedCase.id]}
                className={`w-full font-display font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 border transition ${
                  assignedEngineers[selectedCase.id]
                    ? 'bg-blue-50 text-blue-800 border-blue-200 cursor-not-allowed'
                    : 'bg-surface-dim hover:bg-slate-200 text-primary border-slate-200'
                }`}
              >
                {assignedEngineers[selectedCase.id] ? (
                  <>
                    <CheckCircle2 size={16} className="text-blue-700" />
                    <span>Engineer Assigned (Inspection Queued)</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Assign Ward Engineer</span>
                  </>
                )}
              </button>
            </div>

            {/* Calming Assurance Footnote */}
            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              Notification automatically sends SMS update to citizens upon sanction.
            </p>

          </aside>
        </div>

      </div>

      {/* Floating Bottom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs font-bold text-slate-400 hover:text-white shrink-0">
            ✕
          </button>
        </div>
      )}

      {/* WhatsApp Voice Inflow Simulator Modal (Hackathon Evaluator Showcase) */}
      {whatsAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 font-display block">
                    Citizen WhatsApp Voice Gateway • Google AI Ingestion
                  </span>
                  <h3 className="font-display font-bold text-base text-white">
                    Live Grassroots Voice Note Simulator
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setWhatsAppModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                Select an authentic regional WhatsApp voice grievance below to simulate the end-to-end <strong>Cloud Speech-to-Text (Chirp 2)</strong> → <strong>Vertex AI (Gemini 2.5)</strong> → <strong>BigQuery GIS</strong> spatial pipeline:
              </p>

              {/* Scenario Preset Tabs */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block">
                  Select Regional Audio Clip:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESET_AUDIO_CLIPS.map((clip, idx) => (
                    <button
                      key={clip.id}
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        setPipelineStep(0);
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        selectedPresetIndex === idx
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                        {clip.language.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                        {clip.location.split(' ')[0]}
                      </span>
                      <span className="inline-block mt-1 text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                        Sev {clip.severity}/10
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Clip Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Mic size={14} className="text-emerald-600" />
                    {PRESET_AUDIO_CLIPS[selectedPresetIndex].language}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Duration: {PRESET_AUDIO_CLIPS[selectedPresetIndex].duration}
                  </span>
                </div>

                <blockquote className="italic text-slate-700 dark:text-slate-300 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  "{PRESET_AUDIO_CLIPS[selectedPresetIndex].transcript}"
                </blockquote>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>English Translation:</strong> {PRESET_AUDIO_CLIPS[selectedPresetIndex].translation}
                </p>
              </div>

              {/* Live Pipeline Tracker */}
              {pipelineStep > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700 space-y-2.5">
                  <span className="font-display font-bold text-xs text-blue-900 dark:text-blue-300 block">
                    Google AI Execution Pipeline
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {pipelineStep > 1 ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : (
                          <Sparkles size={15} className="animate-spin text-blue-600" />
                        )}
                        1. Cloud Speech-to-Text (Chirp 2) Regional Transcription
                      </span>
                      <span className="font-bold text-[10px] text-emerald-600">
                        {pipelineStep > 1 ? 'COMPLETE' : 'PROCESSING...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {pipelineStep > 2 ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : pipelineStep === 2 ? (
                          <Sparkles size={15} className="animate-spin text-blue-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block ml-0.5" />
                        )}
                        2. Vertex AI (Gemini 2.5) Severity Assessment &amp; Geo-Hint
                      </span>
                      <span className="font-bold text-[10px] text-emerald-600">
                        {pipelineStep > 2 ? 'COMPLETE (Sev ' + PRESET_AUDIO_CLIPS[selectedPresetIndex].severity + '/10)' : pipelineStep === 2 ? 'EVALUATING...' : 'QUEUED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {pipelineStep >= 4 ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : pipelineStep === 3 ? (
                          <Sparkles size={15} className="animate-spin text-blue-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block ml-0.5" />
                        )}
                        3. BigQuery GIS Native <code className="text-[10px]">ST_GeogPoint</code> Ingestion
                      </span>
                      <span className="font-bold text-[10px] text-emerald-600">
                        {pipelineStep >= 4 ? 'COMMITTED TO BQ' : pipelineStep === 3 ? 'INGESTING...' : 'QUEUED'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-surface-dim dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Connected to project: eventflow-e3c91
              </span>
              <div className="flex items-center gap-2">
                {pipelineStep >= 4 ? (
                  <button 
                    onClick={() => setWhatsAppModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition shadow-xs"
                  >
                    View Ingested Report
                  </button>
                ) : (
                  <button 
                    onClick={runSimulation}
                    disabled={pipelineStep > 0}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs disabled:opacity-60"
                  >
                    <Sparkles size={14} />
                    <span>Run Google AI Pipeline</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
