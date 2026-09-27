import React from 'react';
import { NavLink } from 'react-router-dom';
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
  RefreshCw 
} from 'lucide-react';

export default function StitchHeader({ 
  selectedDistrict, 
  setSelectedDistrict, 
  alertCount = 3,
  onRefresh
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & District Selector */}
        <div className="flex items-center gap-5">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg text-primary tracking-tight">GovGrid</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-secondary-container text-secondary border border-secondary/20">
                  Civic Audit
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Digital Public Infrastructure</p>
            </div>
          </NavLink>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* District Selector Dropdown */}
          <div className="relative hidden sm:flex items-center">
            <MapPin size={15} className="text-on-surface-variant absolute left-3 pointer-events-none" />
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="appearance-none bg-surface-dim hover:bg-slate-100 text-on-surface text-xs font-semibold pl-8 pr-8 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition shadow-2xs"
            >
              <option value="bengaluru">Bengaluru East, KA</option>
              <option value="anantapur">Anantapur Rural, AP</option>
              <option value="delhi">Varanasi / Delhi Urban</option>
            </select>
            <ChevronDown size={14} className="text-on-surface-variant absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-dim p-1.5 rounded-2xl border border-slate-200/60">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <FileText size={15} />
            <span>Executive Brief</span>
          </NavLink>

          <NavLink 
            to="/voices" 
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <Mic size={15} />
            <span>Citizen Voices</span>
          </NavLink>

          <NavLink 
            to="/audits" 
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <ShieldCheck size={15} />
            <span>Tender Audits</span>
          </NavLink>

          <NavLink 
            to="/map" 
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <MapIcon size={15} />
            <span>Ward Map</span>
          </NavLink>

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <BarChart3 size={15} />
            <span>Analytics</span>
          </NavLink>

          <NavLink 
            to="/pipeline" 
            className={({ isActive }) => 
              `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-primary shadow-xs border border-slate-200/60 font-bold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60 font-medium'
              }`
            }
          >
            <Database size={15} />
            <span>Pipeline</span>
          </NavLink>
        </nav>

        {/* Right User & Commissioner Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh}
            className="w-10 h-10 rounded-2xl bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70"
            title="Refresh Data Feeds"
          >
            <RefreshCw size={17} />
          </button>

          <button 
            className="relative w-10 h-10 rounded-2xl bg-surface-dim hover:bg-slate-200/70 text-on-surface-variant flex items-center justify-center transition border border-slate-200/70" 
            title="Citizen Notifications"
          >
            <Bell size={18} />
            {alertCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Commissioner Sarita Desai Profile */}
          <div className="flex items-center gap-3 pl-1">
            <img 
              alt="Commissioner Sarita Desai" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-xs" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1V0FdREEs6ZThX9EGReDYLBX3kP7-xhoSw4t77SKzUtphw_F5uQQ-CkDigK3Mztxzhe8LHp0tBQEzigg___D8S1tEgt50-yzw-nMyRKHv8Sar5r7jBMONXH8Qr6TAYezR08pX4jj6nAF-DJxBBfUTN4jMzkHrIkZ8ySTbjQvFfDQ7c2GQeAnl_5SI5oodamJaioWwqMYko20rexb_tbOF8nb8tjDlrcDJK-Uc2zLONmTosUBw80971wLus"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-display font-bold text-xs text-on-surface leading-tight">Sarita Desai, IAS</span>
              <span className="text-[11px] text-on-surface-variant">Municipal Commissioner</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
