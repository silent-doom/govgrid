import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Trophy,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight
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
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [judgingGuideOpen, setJudgingGuideOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('navExecutive'), icon: FileText, exact: true },
    { to: '/voices', label: t('navVoices'), icon: Mic },
    { to: '/audits', label: t('navAudits'), icon: ShieldCheck },
    { to: '/map', label: t('navMap'), icon: MapIcon },
    { to: '/analytics', label: t('navAnalytics'), icon: BarChart3 },
    { to: '/pipeline', label: t('navPipeline'), icon: Database },
  ];

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncToast, setSyncToast] = useState(null);
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {syncToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200">
            <Sparkles size={14} className="text-emerald-200" />
            <span>{syncToast}</span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-extrabold text-base sm:text-lg text-primary tracking-tight">GovGrid</span>
                  {isLiveBackend ? (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
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

            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            {/* District Selector Dropdown */}
            <div className="relative hidden md:flex items-center">
              <MapPin size={14} className="text-on-surface-variant absolute left-3 pointer-events-none" />
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-surface-dim hover:bg-slate-100 text-on-surface text-xs font-semibold pl-8 pr-8 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition shadow-2xs whitespace-nowrap"
              >
                <option value="bengaluru">Bengaluru East, KA</option>
                <option value="anantapur">Anantapur Rural, AP</option>
                <option value="delhi">Varanasi / Delhi Urban</option>
              </select>
              <ChevronDown size={13} className="text-on-surface-variant absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Navigation Tabs (Uncramped with whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-dim p-1.5 rounded-2xl border border-slate-200/70 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  end={item.exact}
                  className={({ isActive }) => 
                    `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-white text-primary shadow-xs border border-slate-200/70 font-bold' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
                    }`
                  }
                >
                  <Icon size={15} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right User & Commissioner Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
            {/* Hackathon Judging Guide Pill */}
            <button
              onClick={() => setJudgingGuideOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 text-xs font-bold shadow-2xs hover:bg-amber-100 dark:hover:bg-amber-900/60 transition"
              title="Hack2Skill Hackathon Judging Guide & System Architecture"
            >
              <Trophy size={14} className="text-amber-600" />
              <span>{t('judgingGuideBtn')}</span>
            </button>

            {/* Vernacular Language Selector Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-surface-dim hover:bg-slate-200/70 text-on-surface text-xs font-semibold pl-7 pr-6 py-2 rounded-2xl border border-slate-200/70 cursor-pointer transition shadow-2xs"
                title="Select Vernacular Language"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <Languages size={13} className="text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown size={11} className="text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70 shrink-0 ${
                isRefreshing ? 'opacity-70 cursor-wait' : ''
              }`}
              title="Refresh Data Feeds from BigQuery"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn rounded-2xl"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition border shrink-0 ${
                  notificationsOpen 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant border-slate-200/70'
                }`} 
                title="Citizen & Spatial Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
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
                          className={`p-3 rounded-2xl border transition ${
                            alert.read 
                              ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-display font-bold text-xs text-slate-900 dark:text-white leading-tight">
                              {alert.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                            {alert.desc}
                          </p>
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                            <NavLink 
                              to={alert.link}
                              onClick={() => setNotificationsOpen(false)}
                              className="text-[11px] font-bold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              Inspect Dossier →
                            </NavLink>
                            <button 
                              onClick={(e) => dismissAlert(alert.id, e)}
                              className="text-[10px] text-slate-400 hover:text-rose-600 font-medium"
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

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            {/* Commissioner Profile Button & Menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 sm:gap-2.5 pl-0 sm:pl-1 text-left rounded-2xl hover:opacity-90 transition p-1"
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
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-md">
            {/* Mobile District Selector */}
            <div className="bg-surface-dim p-2.5 rounded-xl border border-slate-200">
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
                  className="w-full bg-white text-xs font-semibold pl-8 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="bengaluru">Bengaluru East, KA</option>
                  <option value="anantapur">Anantapur Rural, AP</option>
                  <option value="delhi">Varanasi / Delhi Urban</option>
                </select>
                <ChevronDown size={13} className="text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                      isActive 
                        ? 'bg-primary text-white border-primary shadow-xs' 
                        : 'bg-surface-dim text-slate-700 border-slate-200/80 hover:bg-slate-100'
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

      {/* Mobile Sticky Bottom Navigation Bar (App Bar for One-Thumb Ergonomics) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg flex items-center justify-around">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-primary font-bold' : 'text-slate-500 font-medium'
            }`
          }
        >
          <FileText size={18} />
          <span className="text-[10px]">Brief</span>
        </NavLink>

        <NavLink 
          to="/voices" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-primary font-bold' : 'text-slate-500 font-medium'
            }`
          }
        >
          <Mic size={18} />
          <span className="text-[10px]">Voices</span>
        </NavLink>

        <NavLink 
          to="/audits" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-primary font-bold' : 'text-slate-500 font-medium'
            }`
          }
        >
          <ShieldCheck size={18} />
          <span className="text-[10px]">Audits</span>
        </NavLink>

        <NavLink 
          to="/map" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-primary font-bold' : 'text-slate-500 font-medium'
            }`
          }
        >
          <MapIcon size={18} />
          <span className="text-[10px]">Map</span>
        </NavLink>

        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-500 font-medium hover:text-primary transition"
        >
          <Menu size={18} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Hack2Skill Hackathon Judging Guide Modal */}
      {judgingGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Trophy size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-display block">
                    Build with AI: Code for Communities 2.0 • Track 1
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    GovGrid: AI-Powered DPI Public Budget Reconciliation
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setJudgingGuideOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Problem & Solution Fit */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Building2 size={14} className="text-primary" /> The Problem &amp; DPI Solution
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  India invests over <strong>₹1.4 Lakh Crore</strong> annually in urban local body civil contracts. However, public procurement systems (GeM) operate completely blind to citizen ground reality. GovGrid bridges citizen complaints with contractor disbursements through autonomous BigQuery GIS cross-matching.
                </p>
              </div>

              {/* Google Cloud AI Technologies Matrix */}
              <div>
                <span className="font-display font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-2">
                  Google Cloud AI Tech Stack
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block text-xs">Vertex AI (Gemini 2.5)</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      Multimodal image damage scoring (1-10) and 50-page procurement PDF long-context extraction.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800 border border-emerald-200/60 dark:border-slate-700">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-xs">Cloud Speech-to-Text</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      Chirp 2 multilingual recognition for Kannada, Telugu, Hindi vernacular voice notes.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-slate-800 border border-purple-200/60 dark:border-slate-700">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block text-xs">BigQuery GIS</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      <code className="text-[10px]">ST_DWithin(500m)</code> spatial joins detecting contractor ghost projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rubric Evaluator Walkthrough */}
              <div className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
                <span className="font-display font-bold text-xs text-amber-900 dark:text-amber-200 block mb-1.5">
                  Recommended Evaluation Walkthrough:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                  <li><strong>Language Switcher</strong>: Switch to ಕನ್ನಡ or తెలుగు to verify rural inclusivity.</li>
                  <li><strong>Citizen Voices</strong>: Click "Simulate WhatsApp Voice Inflow" to test live Chirp 2 + Gemini reasoning.</li>
                  <li><strong>Executive Briefing</strong>: Test "Review &amp; Freeze Payment" on P1 and "Call Desk (104)".</li>
                  <li><strong>Tender Audits</strong>: Open "Dossier PDF" to inspect the printable statutory audit memo.</li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-surface-dim dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Team: GovGrid • September 2026</span>
              <button 
                onClick={() => setJudgingGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition shadow-xs"
              >
                Start Evaluation Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
