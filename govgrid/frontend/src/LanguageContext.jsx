import React, { createContext, useContext, useState, useEffect } from 'react';

export const TRANSLATIONS = {
  en: {
    // Navigation
    navExecutive: 'Executive Brief',
    navVoices: 'Citizen Voices',
    navAudits: 'Tender Audits',
    navMap: 'Ward Map',
    navAnalytics: 'Analytics',
    navPipeline: 'Pipeline',
    
    // Header
    jurisdictionLabel: 'Jurisdiction Node',
    liveSyncNotice: 'Last automated sync: 8:45 AM (CPGRAMS + GeM)',
    judgingGuideBtn: 'Judging Guide',

    // Executive Briefing
    greeting: 'Good morning, Commissioner Desai',
    summaryAttention: '3 critical spatial items require your attention today across ₹42.8 Cr in municipal capital.',
    metricCitizenReports: 'Citizen Reports',
    metricReconciled: 'Capital Reconciled',
    metricHotspots: 'Pending Attention',
    actionFreeze: 'Review & Freeze Payment',
    actionFrozen: 'Escrow Frozen',
    actionApproveFund: 'Approve ₹3.2 Cr Emergency Fund',
    actionFundApproved: 'Sanctioned ₹3.2 Cr',
    actionInspectGIS: 'Inspect GIS Evidence',
    actionDispatchTankers: 'Dispatch Tankers',
    actionCallDesk: 'Call Desk (104)',
    
    // Citizen Voices
    voicesTitle: 'Citizen Voice Ledger',
    voicesSubtitle: 'Ingested gently from WhatsApp Audio, grassroots townhalls & local grievance hubs.',
    simWhatsAppBtn: 'Simulate WhatsApp Voice Inflow',
    filterAll: 'All Reports',
    filterWater: 'Water Supply',
    filterRoads: 'Roads & Potholes',
    filterElectricity: 'Electricity & Lighting',
    filterSanitation: 'Parks & Sanitation',
    btnSanctionRepair: 'Sanction Quick Repair',
    btnAssignEngineer: 'Assign Ward Engineer',
    
    // Tender Audits
    auditsTitle: 'Civic Tender Accountability Ledger',
    tabAttention: 'Forensic Discrepancies',
    tabClean: 'Verified Clean Tenders',
    btnDossierPDF: 'Dossier PDF',
    btnSummon: 'Summon Contractor',
    btnFreezeEscrow: 'Freeze Escrow'
  },
  kn: {
    // Navigation
    navExecutive: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ವರದಿ',
    navVoices: 'ನಾಗರಿಕರ ಧ್ವನಿ',
    navAudits: 'ಟೆಂಡರ್ ಪರಿಶೋಧನೆ',
    navMap: 'ವಾರ್ಡ್ ನಕ್ಷೆ',
    navAnalytics: 'ವಿಶ್ಲೇಷಣೆ',
    navPipeline: 'ದತ್ತಾಂಶ ಪೈಪ್‌ಲೈನ್',
    
    // Header
    jurisdictionLabel: 'ವ್ಯಾಪ್ತಿ ವಲಯ',
    liveSyncNotice: 'ಸ್ವಯಂಚಾಲಿತ ಸಿಂಕ್: ಬೆಳಗ್ಗೆ 8:45 (CPGRAMS + GeM)',
    judgingGuideBtn: 'ಮೌಲ್ಯಮಾಪನ ಕೈಪಿಡಿ',

    // Executive Briefing
    greeting: 'ಶುಭೋದಯ, ಆಯುಕ್ತರಾದ ದೇಸಾಯಿ',
    summaryAttention: 'ರೂ 42.8 ಕೋಟಿ ಪುರಸಭೆಯ ಬಂಡವಾಳದಲ್ಲಿ ಇಂದು 3 ನಿರ್ಣಾಯಕ ವಿಷಯಗಳಿಗೆ ನಿಮ್ಮ ಗಮನ ಅಗತ್ಯವಿದೆ.',
    metricCitizenReports: 'ನಾಗರಿಕ ದೂರುಗಳು',
    metricReconciled: 'ಹೊಂದಾಣಿಕೆಯಾದ ಬಂಡವಾಳ',
    metricHotspots: 'ತಕ್ಷಣದ ಗಮನ ಅಗತ್ಯ',
    actionFreeze: 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ & ತಡೆಹಿಡಿಯಿರಿ',
    actionFrozen: 'ಖಾತೆ ತಡೆಹಿಡಿಯಲಾಗಿದೆ',
    actionApproveFund: 'ರೂ 3.2 ಕೋಟಿ ತುರ್ತು ನಿಧಿ ಅನುಮೋದಿಸಿ',
    actionFundApproved: 'ರೂ 3.2 ಕೋಟಿ ಮಂಜೂರಾಗಿದೆ',
    actionInspectGIS: 'GIS ಪುರಾವೆ ಪರಿಶೀಲಿಸಿ',
    actionDispatchTankers: 'ಟ್ಯಾಂಕರ್‌ಗಳನ್ನು ರವಾನಿಸಿ',
    actionCallDesk: 'ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕಿಸಿ (104)',
    
    // Citizen Voices
    voicesTitle: 'ನಾಗರಿಕರ ಧ್ವನಿಗಳ ದಾಖಲೆ',
    voicesSubtitle: 'WhatsApp ಆಡಿಯೊ, ಗ್ರಾಮಸಭೆಗಳು ಮತ್ತು ಕುಂದುಕೊರತೆ ಕೇಂದ್ರಗಳಿಂದ ನೇರ ಸಂಗ್ರಹ.',
    simWhatsAppBtn: 'WhatsApp ಧ್ವನಿ ಸಂದೇಶ ಸಿಮ್ಯುಲೇಟರ್',
    filterAll: 'ಎಲ್ಲಾ ವರದಿಗಳು',
    filterWater: 'ನೀರು ಸರಬರಾಜು',
    filterRoads: 'ರಸ್ತೆ ಮತ್ತು ಗುಂಡಿಗಳು',
    filterElectricity: 'ವಿದ್ಯುತ್ & ದೀಪಗಳು',
    filterSanitation: 'ಉದ್ಯಾನ & ನೈರ್ಮಲ್ಯ',
    btnSanctionRepair: 'ತ್ವರಿತ ದುರಸ್ತಿ ಮಂಜೂರು ಮಾಡಿ',
    btnAssignEngineer: 'ವಾರ್ಡ್ ಎಂಜಿನಿಯರ್ ನಿಯೋಜಿಸಿ',
    
    // Tender Audits
    auditsTitle: 'ನಾಗರಿಕ ಟೆಂಡರ್ ಹೊಣೆಗಾರಿಕೆ ವಹಿ',
    tabAttention: 'ವಿಧಿವಿಜ್ಞಾನ ವ್ಯತ್ಯಾಸಗಳು',
    tabClean: 'ಪರಿಶೀಲಿಸಿದ ಸ್ವಚ್ಛ ಟೆಂಡರ್‌ಗಳು',
    btnDossierPDF: 'ದಾಖಲೆ PDF',
    btnSummon: 'ಗುತ್ತಿಗೆದಾರರಿಗೆ ಸಮನ್ಸ್ ಜಾರಿ',
    btnFreezeEscrow: 'ಎಸ್ಕ್ರೋ ತಡೆಹಿಡಿಯಿರಿ'
  },
  te: {
    // Navigation
    navExecutive: 'ఎగ్జిక్యూటివ్ బ్రీఫింగ్',
    navVoices: 'ప్రజా వాణి',
    navAudits: 'టెండర్ ఆడిట్',
    navMap: 'వార్డ్ మ్యాప్',
    navAnalytics: 'విశ్లేషణ',
    navPipeline: 'డేటా పైప్‌లైన్',
    
    // Header
    jurisdictionLabel: 'పరిధి నోడ్',
    liveSyncNotice: 'ఆటోమేటెడ్ సింక్: ఉదయం 8:45 (CPGRAMS + GeM)',
    judgingGuideBtn: 'మూల్యాంకన మార్గదర్శి',

    // Executive Briefing
    greeting: 'శుభోదయం, కమిషనర్ దేశాయ్',
    summaryAttention: '₹42.8 కోట్ల మున్సిపల్ మూలధనంలో నేడు 3 అంశాలపై మీ తక్షణ శ్రద్ధ అవసరం.',
    metricCitizenReports: 'పౌరుల ఫిర్యాదులు',
    metricReconciled: 'సమన్వయ మూలధనం',
    metricHotspots: 'తక్షణ ప్రాధాన్యత',
    actionFreeze: 'చెల్లింపును నిలిపివేయండి',
    actionFrozen: 'ఎస్క్రో నిలిపివేయబడింది',
    actionApproveFund: '₹3.2 కోట్ల నిధిని ఆమోదించండి',
    actionFundApproved: '₹3.2 కోట్లు మంజూరయ్యాయి',
    actionInspectGIS: 'GIS ఆధారాలు పరిశీలించండి',
    actionDispatchTankers: 'ట్యాంకర్లను పంపండి',
    actionCallDesk: 'కాల్ డెస్క్ (104)',
    
    // Citizen Voices
    voicesTitle: 'ప్రజా వాణి రికార్డు',
    voicesSubtitle: 'WhatsApp ఆడియో మరియు ఫిర్యాదుల కేంద్రాల నుండి నేరుగా నమోదు.',
    simWhatsAppBtn: 'WhatsApp వాయిస్ సిమ్యులేటర్',
    filterAll: 'అన్ని నివేదికలు',
    filterWater: 'నీటి సరఫరా',
    filterRoads: 'రహదారులు & గుంతలు',
    filterElectricity: 'విద్యుత్ & లైట్లు',
    filterSanitation: 'పారిశుధ్యం',
    btnSanctionRepair: 'త్వరిత మరమ్మతు మంజూరు',
    btnAssignEngineer: 'వార్డు ఇంజనీర్‌ను కేటాయించండి',
    
    // Tender Audits
    auditsTitle: 'పౌర టెండర్ జవాబుదారీ లెడ్జర్',
    tabAttention: 'ఆడిట్ వ్యత్యాసాలు',
    tabClean: 'ధృవీకరించబడిన టెండర్లు',
    btnDossierPDF: 'డాక్యుమెంట్ PDF',
    btnSummon: 'కాంట్రాక్టర్‌కు నోటీసు',
    btnFreezeEscrow: 'ఎస్క్రోను నిలిపివేయండి'
  },
  hi: {
    // Navigation
    navExecutive: 'कार्यकारी ब्रीफिंग',
    navVoices: 'नागरिक आवाज़ें',
    navAudits: 'निविदा ऑडिट',
    navMap: 'वार्ड मानचित्र',
    navAnalytics: 'विश्लेषण',
    navPipeline: 'डेटा पाइपलाइन',
    
    // Header
    jurisdictionLabel: 'अधिकार क्षेत्र',
    liveSyncNotice: 'अंतिम स्वचालित सिंक: सुबह 8:45 (CPGRAMS + GeM)',
    judgingGuideBtn: 'मूल्यांकन गाइड',

    // Executive Briefing
    greeting: 'शुभ प्रभात, कमिश्नर देसाई',
    summaryAttention: '₹42.8 करोड़ की नगरपालिका पूंजी में आज 3 महत्वपूर्ण मामलों पर आपका ध्यान आवश्यक है।',
    metricCitizenReports: 'नागरिक शिकायतें',
    metricReconciled: 'समायोजित पूंजी',
    metricHotspots: 'तत्काल ध्यान अपेक्षित',
    actionFreeze: 'समीक्षा करें और भुगतान रोकें',
    actionFrozen: 'एस्क्रो रोक दिया गया',
    actionApproveFund: '₹3.2 करोड़ आपातकालीन निधि स्वीकृत करें',
    actionFundApproved: '₹3.2 करोड़ स्वीकृत',
    actionInspectGIS: 'GIS साक्ष्य का निरीक्षण करें',
    actionDispatchTankers: 'टैंकर रवाना करें',
    actionCallDesk: 'हेल्पलाइन कॉल (104)',
    
    // Citizen Voices
    voicesTitle: 'नागरिक आवाज़ रजिस्टर',
    voicesSubtitle: 'व्हाट्सएप ऑडियो, जनसुनवाई और नागरिक शिकायत केंद्रों से संकलित।',
    simWhatsAppBtn: 'व्हाट्सएप वॉयस सिम्युलेटर',
    filterAll: 'सभी रिपोर्ट',
    filterWater: 'जल आपूर्ति',
    filterRoads: 'सड़कें और गड्ढे',
    filterElectricity: 'बिजली और प्रकाश',
    filterSanitation: 'स्वच्छता और पार्क',
    btnSanctionRepair: 'त्वरित मरम्मत स्वीकृत करें',
    btnAssignEngineer: 'वार्ड इंजीनियर नियुक्त करें',
    
    // Tender Audits
    auditsTitle: 'नागरिक निविदा जवाबदेही खाता',
    tabAttention: 'फॉरेंसिक विसंगतियाँ',
    tabClean: 'सत्यापित स्वच्छ निविदाएँ',
    btnDossierPDF: 'डॉक्यूमेंट PDF',
    btnSummon: 'ठेकेदार को समन जारी करें',
    btnFreezeEscrow: 'एस्क्रो फंड रोकें'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('govgrid_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('govgrid_lang', language);
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: [
      { code: 'en', label: 'English' },
      { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
      { code: 'te', label: 'తెలుగు (Telugu)' },
      { code: 'hi', label: 'हिन्दी (Hindi)' }
    ] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
