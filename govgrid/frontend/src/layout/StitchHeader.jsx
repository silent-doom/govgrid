import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  FileText, 
  Mic, 
  ShieldCheck, 
  Map as MapIcon, 
  BarChart3, 
  Database, 
  Bell, 
  RefreshCw,
  Menu, 
  X, 
  Sparkles, 
  Sun, 
  Moon, 
  Languages, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  ArrowRight,
  Zap,
  Search,
  ChevronRight,
  FileDown,
  ExternalLink,
  BookOpen,
  Volume2
} from 'lucide-react';

export default function StitchHeader({ 
  selectedDistrict, 
  setSelectedDistrict, 
  alertCount = 3,
  isLiveBackend = false,
  onRefresh
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  
  // Modals & Drawers
  const [tourOpen, setTourOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [faqDrawerOpen, setFaqDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(1); // default expand first FAQ
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncToast, setSyncToast] = useState(null);

  const navItems = [
    { to: '/', label: t('navExecutive'), enSubtitle: 'Executive Brief', icon: FileText, exact: true },
    { to: '/voices', label: t('navVoices'), enSubtitle: 'Citizen Voices', icon: Mic },
    { to: '/audits', label: t('navAudits'), enSubtitle: 'Tender Audits', icon: ShieldCheck },
    { to: '/map', label: t('navMap'), enSubtitle: 'Ward Map', icon: MapIcon },
    { to: '/analytics', label: t('navAnalytics'), enSubtitle: 'Analytics', icon: BarChart3 },
    { to: '/pipeline', label: t('navPipeline'), enSubtitle: 'Pipeline', icon: Database },
  ];

  // Quick Links items for Cmd+K palette
  const quickJumpItems = [
    {
      id: 'exec',
      title: 'Executive Briefing & Priorities',
      desc: 'Real-time DPI Budget Reconciliation & Key Performance Indices',
      path: '/',
      category: 'Primary Navigation',
      icon: FileText,
      badge: 'Main'
    },
    {
      id: 'voices',
      title: 'Jan-Vani Citizen Voice Ledger',
      desc: 'Multilingual audio transcripts, WhatsApp simulations & defect scoring',
      path: '/voices',
      category: 'Primary Navigation',
      icon: Mic,
      badge: 'Audio'
    },
    {
      id: 'audits',
      title: 'Civic Tender Accountability Ledger',
      desc: 'Disbursed ₹18.5 Cr milestone vs satellite photogrammetry logs & GFR 175 freeze',
      path: '/audits',
      category: 'Primary Navigation',
      icon: ShieldCheck,
      badge: 'Audit'
    },
    {
      id: 'map',
      title: 'Interactive Ward GIS Map',
      desc: 'Uber H3 resolution 9 zero-budget distress clusters & contractor buffer rings',
      path: '/map',
      category: 'Primary Navigation',
      icon: MapIcon,
      badge: 'GIS'
    },
    {
      id: 'analytics',
      title: 'Spatial Variance Analytics',
      desc: 'Ward-by-ward contractor compliance metrics & budget variance heatmaps',
      path: '/analytics',
      category: 'Primary Navigation',
      icon: BarChart3,
      badge: 'Metrics'
    },
    {
      id: 'pipeline',
      title: 'BigQuery Spatial GIS Pipeline',
      desc: 'ST_DWithin spatial buffers & disbursement cross-verification telemetry',
      path: '/pipeline',
      category: 'Primary Navigation',
      icon: Database,
      badge: 'Data'
    },
    {
      id: 'sync',
      title: 'Trigger Live BigQuery Spatial Sync',
      desc: 'Pull latest 1,428 GeM tender & CPGRAMS records from BigQuery dataset',
      action: 'sync',
      category: 'System Directives',
      icon: RefreshCw,
      badge: 'Action'
    },
    {
      id: 'tour',
      title: 'Platform Onboarding Tour',
      desc: 'Interactive 3-step walkthrough explaining DPI budget reconciliation',
      action: 'tour',
      category: 'Help & Knowledge',
      icon: Compass,
      badge: 'Guide'
    },
    {
      id: 'faq',
      title: 'DPI Governance FAQ & Knowledge Base',
      desc: 'Regulatory protocols, ST_DWithin algorithms, and escrow freezing rules',
      action: 'faq',
      category: 'Help & Knowledge',
      icon: HelpCircle,
      badge: 'FAQ'
    }
  ];

  // Comprehensive FAQ knowledge entries
  const faqItems = [
    {
      id: 1,
      q: 'How does GovGrid reconcile citizen ground truth against GeM e-Tender disbursements?',
      category: 'Spatial Reconciliation',
      a: 'GovGrid executes automated BigQuery GIS spatial queries using ST_DWithin with dynamic 500m to 1.5km buffer rings around civil contract milestone coordinates. When incoming CPGRAMS or WhatsApp voice grievances intersect spatially with a 100% billed contractor milestone, an automated discrepancy anomaly is flagged with an auditable forensic checksum.'
    },
    {
      id: 2,
      q: 'What role does Vertex AI & Gemini 1.5 Pro play in multimodal audit verification?',
      category: 'AI Verification',
      a: 'Gemini 1.5 Pro performs multimodal cross-matching by analyzing contractor milestone submission photos, drone photogrammetry, and citizen ground evidence. It detects physical progress discrepancies (such as 22% actual concrete pour vs 100% billed completion) with verifiable 98% forensic accuracy.'
    },
    {
      id: 3,
      q: 'What happens when an Unfunded Liability or Capital Leakage anomaly is flagged?',
      category: 'Enforcement Protocols',
      a: 'The system initiates a three-tier statutory response: (1) Temporary PFMS escrow tranche freeze under GFR Rule 175, (2) Automated dispatch of a third-party municipal vigilance inspector within 24 hours, and (3) Automated Kannada/Telugu/Hindi SMS notification to citizen complainants with a public grievance tracking hash.'
    },
    {
      id: 4,
      q: 'How does Jan-Vani support multiple regional languages and dialects?',
      category: 'Vernacular DPI',
      a: 'Jan-Vani incorporates speech-to-text models calibrated for colloquial Indic dialects in Kannada, Telugu, Tamil, and Hindi. Voice notes submitted via WhatsApp or IVR line 104 are normalized, phonetically transcribed, translated to English for administrative review, and geocoded to the nearest municipal ward node.'
    },
    {
      id: 5,
      q: 'Who has statutory authority to execute PFMS payment freeze orders?',
      category: 'Statutory Authority',
      a: 'Only credentialed Municipal Commissioners (IAS) and District Magistrates holding hardware-authenticated cryptographic tokens can freeze or reallocate contingency funds under Section 71(b) of the Municipal Financial Governance Act.'
    },
    {
      id: 6,
      q: 'Can ordinary citizens verify whether contractor repair works were validated?',
      category: 'Public Transparency',
      a: 'Yes. Every audit decision produces a verifiable SHA-256 telemetry hash published to the GovGrid open ledger. Citizens can view whether their ward defect was addressed, inspect before/after satellite imagery, and track fund allocations transparently without bureaucratic friction.'
    }
  ];

  // Filtered quick jump items based on live search query
  const filteredQuickLinks = quickJumpItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.desc.toLowerCase().includes(q) ||
           item.category.toLowerCase().includes(q);
  });

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickLinksOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setQuickLinksOpen(false);
        setFaqDrawerOpen(false);
        setTourOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      title: 'Mahadevapura Ring Road (Ward 14)',
      desc: '₹18.5 Cr flagged with 142 citizen defect clusters within 500m buffer.',
      time: '12m ago',
      type: 'critical',
      link: '/map',
      read: false
    },
    {
      id: 2,
      title: 'Kadugodi Slum Water Main Breach',
      desc: '312 citizen voice inquiries in 48 hours. Zero capital allocated.',
      time: '34m ago',
      type: 'warning',
      link: '/voices',
      read: false
    },
    {
      id: 3,
      title: 'Outer Ring Road Culvert Delay',
      desc: '184 days overdue. 48-hour show-cause notice queued.',
      time: '1h ago',
      type: 'info',
      link: '/audits',
      read: false
    }
  ]);

  const unreadCount = activeAlerts.filter(a => !a.read).length;

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    setSyncToast('Syncing BigQuery GIS records with GeM & CPGRAMS...');
    try {
      if (onRefresh) await onRefresh();
      setTimeout(() => {
        setIsRefreshing(false);
        setSyncToast('BigQuery GIS spatial sync complete (1,428 live records refreshed)');
        setTimeout(() => setSyncToast(null), 3500);
      }, 700);
    } catch {
      setIsRefreshing(false);
      setSyncToast('Refreshed local telemetry');
      setTimeout(() => setSyncToast(null), 2500);
    }
  };

  const markAllRead = () => {
    setActiveAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id, e) => {
    e.stopPropagation();
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleQuickLinkClick = (item) => {
    setQuickLinksOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.action === 'sync') {
      handleRefreshClick();
    } else if (item.action === 'tour') {
      setTourOpen(true);
    } else if (item.action === 'faq') {
      setFaqDrawerOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {syncToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200">
            <Sparkles size={14} className="text-emerald-200" />
            <span>{syncToast}</span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand & District Selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-extrabold text-base sm:text-lg text-primary tracking-tight">GovGrid</span>
                  {isLiveBackend ? (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      BigQuery GIS
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-secondary-container text-secondary border border-secondary/20 hidden xs:inline-block">
                      Civic Audit
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-on-surface-variant font-medium hidden sm:block">Digital Public Infrastructure</p>
              </div>
            </NavLink>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            {/* District Selector Dropdown */}
            <div className="relative hidden md:flex items-center">
              <MapPin size={14} className="text-on-surface-variant absolute left-3 pointer-events-none" />
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-surface-dim hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface text-xs font-semibold pl-8 pr-8 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition shadow-2xs whitespace-nowrap"
              >
                <option value="bengaluru">Bengaluru East, KA</option>
                <option value="anantapur">Anantapur Rural, AP</option>
                <option value="delhi">Varanasi / Delhi Urban</option>
              </select>
              <ChevronDown size={13} className="text-on-surface-variant absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Spacious & Prominent Desktop Navigation Tabs (Uncramped with No Scrollbar Cuts) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  end={item.exact}
                  className={({ isActive }) => 
                    `px-3.5 sm:px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 group ${
                      isActive 
                        ? 'bg-white dark:bg-slate-900 text-primary dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700 font-bold' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-emerald-400 hover:bg-white/70 dark:hover:bg-slate-700/60 font-semibold'
                    }`
                  }
                >
                  <Icon size={15} className="shrink-0 transition-transform group-hover:scale-110" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs">{item.label}</span>
                    {language !== 'en' && (
                      <span className="text-[9px] opacity-70 font-normal tracking-wide">{item.enSubtitle}</span>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Tools: Quick Links, FAQ, Language, Theme, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative">
            
            {/* Quick Links Jump Button (Cmd+K) */}
            <button
              id="open-quick-links-btn"
              onClick={() => setQuickLinksOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-700/60 text-xs font-bold transition shadow-2xs group"
              title="Open Quick Navigation & Search (Cmd+K / Ctrl+K)"
            >
              <Zap size={14} className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform fill-amber-500/20" />
              <span className="hidden sm:inline">{t('quickLinks') || 'Quick Links'}</span>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-amber-200 dark:border-slate-700 ml-0.5 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Civic Knowledge & FAQ Drawer Trigger */}
            <button
              id="open-faq-btn"
              onClick={() => setFaqDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-dim hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface border border-slate-200/80 dark:border-slate-700 text-xs font-semibold shadow-2xs transition group"
              title="GovGrid Civic FAQ & Technical Methodology"
            >
              <HelpCircle size={14} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">{t('faqHelp') || 'FAQ & Help'}</span>
            </button>

            {/* Vernacular Language Selector Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-surface-dim hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface text-xs font-semibold pl-7 pr-6 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700 cursor-pointer transition shadow-2xs"
                title="Select Vernacular Language"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <Languages size={13} className="text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown size={11} className="text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* BigQuery Refresh Button */}
            <button 
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-dim hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70 dark:border-slate-700 shrink-0 ${
                isRefreshing ? 'opacity-70 cursor-wait' : ''
              }`}
              title="Refresh Data Feeds from BigQuery"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn rounded-xl"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition border shrink-0 ${
                  notificationsOpen 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-surface-dim hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface-variant border-slate-200/70 dark:border-slate-700'
                }`} 
                title="Citizen & Spatial Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-4 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Spatial Alerts & Notices</span>
                      {unreadCount > 0 && (
                        <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-[11px] font-semibold text-primary dark:text-emerald-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {activeAlerts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No pending spatial anomalies. All tenders compliant!
                      </div>
                    ) : (
                      activeAlerts.map(alert => (
                        <div 
                          key={alert.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate(alert.link);
                          }}
                          className={`p-3 rounded-2xl border transition cursor-pointer ${
                            alert.read 
                              ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-70' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{alert.title}</span>
                            <span className="text-[10px] text-slate-400">{alert.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{alert.desc}</p>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                            <span className="text-[10px] font-semibold text-primary dark:text-emerald-400 flex items-center gap-1">
                              View Spatial Evidence <ArrowRight size={11} />
                            </span>
                            <button 
                              onClick={(e) => dismissAlert(alert.id, e)}
                              className="text-[10px] text-slate-400 hover:text-rose-500"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Commissioner Authority Profile Badge */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-2xl hover:bg-surface-dim dark:hover:bg-slate-800 transition"
                title="View Commissioner Authority Profile"
              >
                <img 
                  alt="Commissioner Sarita Desai" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-xs shrink-0" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1V0FdREEs6ZThX9EGReDYLBX3kP7-xhoSw4t77SKzUtphw_F5uQQ-CkDigK3Mztxzhe8LHp0tBQEzigg___D8S1tEgt50-yzw-nMyRKHv8Sar5r7jBMONXH8Qr6TAYezR08pX4jj6nAF-DJxBBfUTN4jMzkHrIkZ8ySTbjQvFfDQ7c2GQeAnl_5SI5oodamJaioWwqMYko20rexb_tbOF8nb8tjDlrcDJK-Uc2zLONmTosUBw80971wLus"
                />
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-display font-bold text-xs text-on-surface leading-tight whitespace-nowrap">Sarita Desai, IAS</span>
                  <span className="text-[10px] text-on-surface-variant whitespace-nowrap">Municipal Commissioner</span>
                </div>
                <ChevronDown size={13} className="text-slate-400 hidden xl:block" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-4 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <img 
                      alt="Commissioner Sarita Desai" 
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs" 
                      src="https://lh3.googleusercontent.com/aida/AEtjO1V0FdREEs6ZThX9EGReDYLBX3kP7-xhoSw4t77SKzUtphw_F5uQQ-CkDigK3Mztxzhe8LHp0tBQEzigg___D8S1tEgt50-yzw-nMyRKHv8Sar5r7jBMONXH8Qr6TAYezR08pX4jj6nAF-DJxBBfUTN4jMzkHrIkZ8ySTbjQvFfDQ7c2GQeAnl_5SI5oodamJaioWwqMYko20rexb_tbOF8nb8tjDlrcDJK-Uc2zLONmTosUBw80971wLus"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Sarita Desai, IAS</h4>
                      <p className="text-[11px] text-slate-500">2012 Cadre • Principal Commissioner</p>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                        Escrow Signatory Level 4
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-400">Jurisdiction</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">BBMP East &amp; Anantapur</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-400">Discretionary Fund</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">₹25.0 Cr Authorized</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Digital Key Status</span>
                      <span className="font-mono text-emerald-600 font-bold">SHA-256 Active</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      setSyncToast('Commissioner digital signature authenticated for 24 hours.');
                      setTimeout(() => setSyncToast(null), 4000);
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-display font-bold text-xs hover:bg-slate-800 transition"
                  >
                    Authenticate Audit Seal
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-md">
            {/* Mobile District Selector */}
            <div className="bg-surface-dim dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-display block mb-1">
                Select Jurisdiction Node
              </label>
              <div className="relative">
                <MapPin size={14} className="text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select 
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-white dark:bg-slate-900 text-xs font-semibold pl-8 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="bengaluru">Bengaluru East, KA</option>
                  <option value="anantapur">Anantapur Rural, AP</option>
                  <option value="delhi">Varanasi / Delhi Urban</option>
                </select>
                <ChevronDown size={13} className="text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuickLinksOpen(true);
                }}
                className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Zap size={14} className="text-amber-600 fill-amber-500/20" />
                <span>Quick Links (⌘K)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFaqDrawerOpen(true);
                }}
                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <HelpCircle size={14} className="text-blue-600" />
                <span>Civic FAQ</span>
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? location.pathname === item.to 
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold border transition ${
                      isActive 
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-emerald-400 border-primary/20 font-bold' 
                        : 'bg-surface-dim dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Quick Links Jump Modal (Cmd+K) */}
      {quickLinksOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 animate-in fade-in duration-150"
          onClick={() => setQuickLinksOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-800/50">
              <Search className="text-slate-400 shrink-0" size={18} />
              <input 
                type="text"
                autoFocus
                placeholder="Search GIS pipeline, anomalies, citizen voice recordings, or gazettes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-medium"
              />
              <button 
                onClick={() => setQuickLinksOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Links Jump Options List */}
            <div className="p-3 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredQuickLinks.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No quick actions found matching "{searchQuery}". Try "map", "voices", or "audits".
                </div>
              ) : (
                filteredQuickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleQuickLinkClick(item)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-left group pt-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-emerald-950/60 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2 truncate">
                            <span>{item.title}</span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-primary shrink-0 flex items-center gap-1 font-semibold">
                        Jump <ChevronRight size={13} />
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Links Footer with Hotkey Tips */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span>Press <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">Esc</kbd> to dismiss</span>
                <span>•</span>
                <span><kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">⌘K</kbd> to toggle</span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">GovGrid Fast Dispatch</span>
            </div>
          </div>
        </div>
      )}

      {/* Civic Knowledge & FAQ Drawer Modal */}
      {faqDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
          onClick={() => setFaqDrawerOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">GovGrid Civic Knowledge & FAQ</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reconciliation Methodology & Regulatory Protocols</p>
                </div>
              </div>
              <button 
                onClick={() => setFaqDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Accordion FAQ Items */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {faqItems.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 overflow-hidden transition shadow-2xs"
                  >
                    <button 
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-emerald-400 block mb-1 font-display">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-primary dark:text-emerald-400' : ''
                        }`} 
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer with Escalation and Tour Links */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Need platform walkthrough?</span>
              <button 
                onClick={() => {
                  setFaqDrawerOpen(false);
                  setTourOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5"
              >
                <Compass size={13} />
                <span>Launch Tour</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Platform Tour & Onboarding Walkthrough Modal */}
      {tourOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-primary/5 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-emerald-950 text-secondary dark:text-emerald-400 flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary dark:text-emerald-400 font-display block">
                    GovGrid User Guide &amp; Platform Tour
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    How GovGrid Reconciles Public Infrastructure Capital
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setTourOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                aria-label="Close tour"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Introduction Banner */}
              <div className="p-3.5 rounded-2xl bg-surface-dim dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Building2 size={14} className="text-secondary" /> Institutional Purpose
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  GovGrid bridges the gap between what citizens experience on the ground and what municipal contractors bill the public treasury. By cross-matching e-procurement contract boundaries with grassroots distress signals in real time, administrators can verify ground reality before public funds are disbursed.
                </p>
              </div>

              {/* 3-Step Core Workflow */}
              <div>
                <span className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-2.5">
                  The 3-Step Accountability Cycle
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs">Citizen Inflow</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Grassroots complaints from WhatsApp voice notes, CPGRAMS, and townhalls are transcribed in regional languages and geocoded automatically.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs">Spatial Cross-Match</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Automated BigQuery GIS queries check if unfulfilled defects exist within 500m of active or claimed completed civil tenders.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs">Executive Action</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Commissioners freeze delinquent escrow payments under GFR Rule 175, summon contractors, or fast-track emergency repairs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Features to Try */}
              <div className="p-3.5 rounded-2xl bg-primary/5 dark:bg-slate-800/60 border border-primary/15 dark:border-slate-700">
                <span className="font-display font-bold text-xs text-primary dark:text-emerald-400 block mb-2">
                  Key Features to Explore in this Demo:
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-secondary shrink-0 mt-0.5" />
                    <span><strong>Vernacular Language Switching</strong>: Use the language dropdown in the header to switch to Kannada (ಕನ್ನಡ), Telugu (తెలుగు), or Hindi (हिन्दी).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-secondary shrink-0 mt-0.5" />
                    <span><strong>Citizen Voices (<NavLink to="/voices" onClick={() => setTourOpen(false)} className="text-secondary underline font-semibold">/voices</NavLink>)</strong>: Click "Simulate WhatsApp Voice Inflow" to test speech transcription, damage scoring, and GIS registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-secondary shrink-0 mt-0.5" />
                    <span><strong>Tender Audits (<NavLink to="/audits" onClick={() => setTourOpen(false)} className="text-secondary underline font-semibold">/audits</NavLink>)</strong>: Inspect discrepancy dossiers, freeze escrow payments, and generate official statutory audit memos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-secondary shrink-0 mt-0.5" />
                    <span><strong>Ward Map (<NavLink to="/map" onClick={() => setTourOpen(false)} className="text-secondary underline font-semibold">/map</NavLink>)</strong>: Visualize live GIS spatial buffers and defect clusters across Bengaluru, Anantapur, and Delhi.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-surface-dim dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Institutional Governance Portal • GovGrid DPI</span>
              <button 
                onClick={() => setTourOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition shadow-xs flex items-center gap-1.5"
              >
                <span>Start Exploring</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
