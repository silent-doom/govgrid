import React, { useState } from 'react';
import MapView from '../components/MapView';
import { 
  Map as MapIcon, 
  Layers, 
  MapPin, 
  Filter, 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export default function WardMap({ districtData, complaints = [], tenders = [] }) {
  const [selectedInspectNode, setSelectedInspectNode] = useState(null);

  const totalCapital = tenders.reduce((acc, t) => acc + (t.budget_inr || 0), 0);
  const capitalCrores = (totalCapital / 10000000).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200/80 font-display">
            <MapIcon size={14} className="text-secondary" />
            BigQuery GIS ST_DWithin Geospatial Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Ward Spatial Command Map
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time cross-referencing of citizen grievance clusters against sanctioned GeM public procurement buffers.
          </p>
        </div>

        {/* Quick Spatial Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase font-display">Monitored Jurisdiction</span>
            <span className="font-display font-bold text-slate-900">{districtData?.name || 'District Node'}</span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase font-display">Tender Capital Bound</span>
            <span className="font-display font-bold text-emerald-700">₹{capitalCrores} Cr</span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase font-display">Grievances Pinned</span>
            <span className="font-display font-bold text-rose-600">{complaints.length} Hotspots</span>
          </div>
        </div>
      </div>

      {/* Map & Inspector Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-4">
        <MapView 
          complaints={complaints}
          tenders={tenders}
          center={districtData?.center || [12.9716, 77.5946]}
          zoom={districtData?.zoom || 13}
        />
      </div>

      {/* GIS Footnote & Legend Card */}
      <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-2 ring-rose-200 inline-block" />
            <span className="font-medium text-slate-700">Critical Distress Signal (Severity 8-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-amber-200 inline-block" />
            <span className="font-medium text-slate-700">Medium Distress Signal (Severity 5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 inline-block" />
            <span className="font-medium text-slate-700">Sanctioned Public Tender Buffer</span>
          </div>
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          Spatial Index: WGS84 (EPSG:4326) • Spatial Join: ST_DWithin(500m)
        </span>
      </div>

    </div>
  );
}
