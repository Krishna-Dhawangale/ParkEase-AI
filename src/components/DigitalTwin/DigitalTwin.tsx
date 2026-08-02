import React, { useEffect, useState } from 'react';
import { useDigitalTwinStore } from './store';
import { DigitalTwinEngine } from './DigitalTwinEngine';
import { Search, Filter, Layers, Video, Map, Info, Maximize, CheckCircle2, AlertCircle } from 'lucide-react';
import { WebSocketProvider } from './WebSocketProvider';
import { RightPanel } from './RightPanel';

export function DigitalTwinContent() {
  const setLayout = useDigitalTwinStore((state) => state.setLayout);
  const layout = useDigitalTwinStore((state) => state.layout);
  const viewMode = useDigitalTwinStore((state) => state.viewMode);
  const setViewMode = useDigitalTwinStore((state) => state.setViewMode);
  const setCameraTarget = useDigitalTwinStore((state) => state.setCameraTarget);
  const filters = useDigitalTwinStore((state) => state.filters);
  const toggleFilter = useDigitalTwinStore((state) => state.toggleFilter);
  const layers = useDigitalTwinStore((state) => state.layers);
  const toggleLayer = useDigitalTwinStore((state) => state.toggleLayer);
  const liveData = useDigitalTwinStore((state) => state.liveData);
  const updateLiveData = useDigitalTwinStore((state) => state.updateLiveData);

  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial Layout Fetch
  useEffect(() => {
    // Layout and Initial Hydration are strictly managed by WebSocketProvider now!
    // No mock data allowed.
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const slot = layout?.parkingSlots.find(s => s.id.toLowerCase() === searchQuery.toLowerCase());
    if (slot) {
      setCameraTarget([slot.position[0], slot.position[1], slot.position[2]]);
    }
  };

  const handlePresetCamera = (preset: 'Isometric' | '2D' | 'Entry') => {
    if (preset === '2D') setViewMode('2D');
    else if (preset === 'Isometric') setViewMode('3D');
    else if (preset === 'Entry') {
      const entry = layout?.gates.find(g => g.type === 'Entry');
      if (entry) setCameraTarget([entry.position[0], entry.position[1], entry.position[2]]);
    }
  };

  if (!layout) return <div className="flex h-full items-center justify-center text-white font-inter">Initializing Digital Twin Workspace...</div>;

  const totalSlots = layout.parkingSlots.length;
  const occupiedCount = Object.values(liveData).filter(d => d.status === 'Occupied').length;
  const availableCount = Object.values(liveData).filter(d => d.status === 'Available' || d.status === 'EV').length;

  const isEmpty = totalSlots === 0 && layout.roads.length === 0 && layout.gates.length === 0;

  return (
    <div className="relative w-full h-full bg-[#070B17] overflow-hidden font-inter text-slate-200">
      
      {/* --- Core 3D Engine --- */}
      <div className="absolute inset-0 z-0">
        <DigitalTwinEngine />
      </div>

      {/* --- Empty State Overlay --- */}
      {isEmpty && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-[#0F172A]/95 backdrop-blur-2xl border border-[#8B5CF6]/30 rounded-3xl p-10 max-w-md text-center shadow-[0_0_60px_rgba(139,92,246,0.15)]">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
              <Layers className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Digital Twin Not Configured</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The parking layout hasn't been built yet. Once the facility admin designs the parking layout in the Client Portal, it will appear here automatically in real-time.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8B5CF6] font-semibold">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </div>
              Waiting for layout sync...
            </div>
          </div>
        </div>
      )}

      {/* --- Right Information Panel --- */}
      <RightPanel />

      {/* --- Top UI Bar (Search & Presets) --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex gap-4 w-full max-w-4xl px-4 pointer-events-none">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative pointer-events-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Slot, Vehicle or Booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] shadow-2xl transition-all"
          />
        </form>

        {/* Camera Controls */}
        <div className="flex bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-xl p-1 pointer-events-auto shadow-2xl">
          <button onClick={() => handlePresetCamera('Isometric')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === '3D' ? 'bg-[#8B5CF6] text-white' : 'text-slate-400 hover:text-white'}`}>3D Iso</button>
          <button onClick={() => handlePresetCamera('2D')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === '2D' ? 'bg-[#8B5CF6] text-white' : 'text-slate-400 hover:text-white'}`}>2D Top</button>
          <div className="w-px bg-white/10 mx-1" />
          <button onClick={() => handlePresetCamera('Entry')} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all">Focus Entry</button>
        </div>
      </div>

      {/* --- Live Status Cards (Bottom Left) --- */}
      <div className="absolute bottom-8 left-8 z-10 flex gap-4 pointer-events-none">
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col min-w-[140px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Available</span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <span className="text-3xl font-extrabold text-white">{availableCount}</span>
          <span className="text-xs text-slate-500 mt-1">/ {totalSlots}</span>
        </div>
        
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col min-w-[140px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Occupied</span>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <span className="text-3xl font-extrabold text-white">{occupiedCount}</span>
          <span className="text-xs text-slate-500 mt-1">{totalSlots > 0 ? ((occupiedCount / totalSlots) * 100).toFixed(1) : '0'}% Full</span>
        </div>
      </div>

      {/* --- Legend & Minimap Container (Bottom Right) --- */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Small Minimap */}
        <div className="w-48 h-32 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative pointer-events-auto cursor-pointer" onClick={() => handlePresetCamera('2D')}>
           <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-slate-300 backdrop-blur-sm border border-white/10">
             <Map className="w-3 h-3" /> MAP
           </div>
           {/* Abstract minimap layout */}
           <div className="absolute inset-0 p-4 flex flex-col justify-center gap-1 opacity-50">
             <div className="h-1.5 w-full bg-[#1E293B] rounded-full" />
             <div className="h-1.5 w-full bg-[#1E293B] rounded-full" />
             <div className="h-1.5 w-full bg-[#1E293B] rounded-full" />
             <div className="h-1.5 w-3/4 bg-[#1E293B] rounded-full self-end" />
           </div>
        </div>

        {/* Legend */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-xs font-semibold">
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" /> Available</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" /> Occupied</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]" /> EV</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" /> Reserved</div>
        </div>
      </div>
    </div>
  );
}
interface DigitalTwinProps {
  facilityId?: string;
}

export function DigitalTwin({ facilityId }: DigitalTwinProps) {
  return (
    <WebSocketProvider facilityId={facilityId}>
      <DigitalTwinContent />
    </WebSocketProvider>
  );
}
