import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
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
  Moon
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

  const navItems = [
    { to: '/', label: 'Executive Brief', icon: FileText, exact: true },
    { to: '/voices', label: 'Citizen Voices', icon: Mic },
    { to: '/audits', label: 'Tender Audits', icon: ShieldCheck },
    { to: '/map', label: 'Ward Map', icon: MapIcon },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/pipeline', label: 'Pipeline', icon: Database },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70 shrink-0"
              title="Refresh Data Feeds"
            >
              <RefreshCw size={16} />
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
            <button 
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70 shrink-0" 
              title="Citizen Notifications"
            >
              <Bell size={17} />
              {alertCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            <div className="h-7 w-px bg-slate-200 hidden sm:block" />

            {/* Commissioner Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5 pl-0 sm:pl-1">
              <img 
                alt="Commissioner Sarita Desai" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-xs shrink-0" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1V0FdREEs6ZThX9EGReDYLBX3kP7-xhoSw4t77SKzUtphw_F5uQQ-CkDigK3Mztxzhe8LHp0tBQEzigg___D8S1tEgt50-yzw-nMyRKHv8Sar5r7jBMONXH8Qr6TAYezR08pX4jj6nAF-DJxBBfUTN4jMzkHrIkZ8ySTbjQvFfDQ7c2GQeAnl_5SI5oodamJaioWwqMYko20rexb_tbOF8nb8tjDlrcDJK-Uc2zLONmTosUBw80971wLus"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-display font-bold text-xs text-on-surface leading-tight whitespace-nowrap">Sarita Desai, IAS</span>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">Municipal Commissioner</span>
              </div>
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
    </>
  );
}
