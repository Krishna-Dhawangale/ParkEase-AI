import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, ZoomIn, ZoomOut, RotateCcw, Thermometer, Eye, Camera,
  AlertTriangle, Info, X, Car, Zap, Crown, Wrench, Shield,
  Navigation, Clock, ChevronUp, ChevronDown, Activity, BarChart3
} from 'lucide-react';
import { mockFloors } from '../../lib/data';
import { cn } from '../../lib/utils';

const slotConfig = {
  available: { color: '#16A34A', bgColor: '#DCFCE7', label: 'Available', textColor: '#15803d' },
  occupied: { color: '#DC2626', bgColor: '#FEE2E2', label: 'Occupied', textColor: '#b91c1c' },
  reserved: { color: '#F59E0B', bgColor: '#FEF3C7', label: 'Reserved', textColor: '#d97706' },
  ev: { color: '#2563EB', bgColor: '#DBEAFE', label: 'EV', textColor: '#1d4ed8' },
  vip: { color: '#7C3AED', bgColor: '#EDE9FE', label: 'VIP', textColor: '#6d28d9' },
  emergency: { color: '#EA580C', bgColor: '#FFEDD5', label: 'Emergency', textColor: '#c2410c' },
  maintenance: { color: '#6B7280', bgColor: '#F3F4F6', label: 'Maintenance', textColor: '#4B5563' },
};

type SlotStatus = keyof typeof slotConfig;

interface Slot {
  id: string;
  number: string;
  status: SlotStatus;
  vehicle: string | null;
  entryTime: string | null;
  reservedUntil: string | null;
}

export function DigitalTwinPage() {
  const [activeFloor, setActiveFloor] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'2d' | 'isometric'>('2d');
  const [animTick, setAnimTick] = useState(0);

  // Live animation tick
  useEffect(() => {
    const interval = setInterval(() => setAnimTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const floor = mockFloors[activeFloor];
  const slots = (floor?.slots ?? []) as Slot[];

  const available = slots.filter(s => s.status === 'available').length;
  const occupied = slots.filter(s => s.status === 'occupied').length;
  const reserved = slots.filter(s => s.status === 'reserved').length;
  const ev = slots.filter(s => s.status === 'ev').length;

  const COLS = 8;
  const SLOT_W = 52;
  const SLOT_H = 36;
  const LANE_H = 28;
  const PAD = 16;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 bg-white dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="live-dot" />
              <span className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] uppercase tracking-wider">Digital Twin – Live</span>
            </div>
            <h1 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight">Central Metro Parking Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode */}
            <div className="flex items-center bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl p-1">
              {(['2d', 'isometric'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    viewMode === mode ? 'bg-[#0F766E] text-white' : 'text-[#6B7280] dark:text-[#94A3B8]'
                  )}
                >
                  {mode === '2d' ? '2D' : '3D'}
                </button>
              ))}
            </div>

            {/* Heatmap toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                showHeatmap
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155] text-[#6B7280]'
              )}
            >
              <Thermometer className="w-3.5 h-3.5" />
              Heatmap
            </button>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(Math.max(0.6, zoom - 0.2))} className="btn-ghost p-2">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#6B7280] w-8 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="btn-ghost p-2">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoom(1)} className="btn-ghost p-2">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Floor selector */}
        <div className="flex items-center gap-2 mt-3">
          <Layers className="w-4 h-4 text-[#6B7280]" />
          <span className="text-xs font-medium text-[#6B7280] mr-1">Floor:</span>
          {mockFloors.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(idx)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                activeFloor === idx
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white dark:bg-[#334155] border-[#E5E7EB] dark:border-[#475569] text-[#6B7280] dark:text-[#94A3B8]'
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Twin Visualization */}
        <div className="flex-1 overflow-auto bg-[#EEF2F7] dark:bg-[#0F172A] p-4">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Available', value: available, color: '#16A34A', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Occupied', value: occupied, color: '#DC2626', bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'Reserved', value: reserved, color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'EV Slots', value: ev, color: '#2563EB', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            ].map(stat => (
              <div key={stat.label} className={cn('rounded-xl p-3 text-center', stat.bg)}>
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[11px] text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Parking Layout SVG */}
          <div className="card overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}>
            <div className="p-4">
              {/* Facility label */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#111827] dark:text-white">{floor?.name}</span>
                  <span className="badge badge-brand">{available} slots free</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" />8 cameras</div>
                  <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />All secure</div>
                </div>
              </div>

              {/* Entry gate */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-24 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">↓ ENTRY GATE</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-24 bg-[#DC2626] rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">EXIT GATE ↑</span>
                  </div>
                </div>
              </div>

              {/* Drive lane - top */}
              <div className="h-7 bg-[#E5E7EB] dark:bg-[#334155] rounded-xl mb-3 relative overflow-hidden flex items-center">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="flex items-center gap-4 px-4 w-full">
                    <div className="flex gap-2">
                      {[0,1,2,3,4,5].map(i => (
                        <div key={i} className="w-6 h-1 bg-white/60 rounded-sm" />
                      ))}
                    </div>
                    <div className="flex-1" />
                    <span className="text-[10px] font-bold text-[#9CA3AF]">DRIVE LANE →</span>
                  </div>
                </div>
                {/* Animated vehicle */}
                <motion.div
                  className="absolute top-1 left-0"
                  animate={{ x: ['-100%', '110%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1 }}
                >
                  <div className="w-8 h-5 bg-[#0F766E] rounded-md opacity-80 flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Slot grid - Row A */}
              <div className="mb-2">
                <div className="text-[10px] font-bold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#F8FAFC] dark:bg-[#334155] flex items-center justify-center text-[9px]">A</span>
                  Row A
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-[repeat(20,1fr)] gap-1.5">
                  {slots.slice(0, 20).map((slot, idx) => (
                    <ParkingSlot
                      key={slot.id}
                      slot={slot}
                      showHeatmap={showHeatmap}
                      onClick={() => setSelectedSlot(slot)}
                      isSelected={selectedSlot?.id === slot.id}
                    />
                  ))}
                </div>
              </div>

              {/* Middle drive lane */}
              <div className="h-7 bg-[#E5E7EB] dark:bg-[#334155] rounded-xl my-3 relative overflow-hidden flex items-center">
                <div className="absolute inset-0 flex items-center px-4 justify-between">
                  <span className="text-[10px] font-bold text-[#9CA3AF]">← DRIVE LANE</span>
                  <div className="flex gap-2">
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className="w-6 h-1 bg-white/60 rounded-sm" />
                    ))}
                  </div>
                </div>
                <motion.div
                  className="absolute top-1 right-0"
                  animate={{ x: ['0%', '-220%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 3 }}
                >
                  <div className="w-8 h-5 bg-[#DC2626] rounded-md opacity-70 flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Slot grid - Row B */}
              <div className="mb-2">
                <div className="text-[10px] font-bold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#F8FAFC] dark:bg-[#334155] flex items-center justify-center text-[9px]">B</span>
                  Row B
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-[repeat(20,1fr)] gap-1.5">
                  {slots.slice(20, 40).map((slot, idx) => (
                    <ParkingSlot
                      key={slot.id}
                      slot={slot}
                      showHeatmap={showHeatmap}
                      onClick={() => setSelectedSlot(slot)}
                      isSelected={selectedSlot?.id === slot.id}
                    />
                  ))}
                </div>
              </div>

              {/* Exit lane */}
              <div className="h-7 bg-[#E5E7EB] dark:bg-[#334155] rounded-xl mt-3 relative overflow-hidden flex items-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#9CA3AF]">← EXIT LANE →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card p-4 mt-4">
            <div className="flex flex-wrap gap-3">
              {Object.entries(slotConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-4 h-3 rounded-sm border" style={{ backgroundColor: cfg.bgColor, borderColor: cfg.color }} />
                  <span className="text-xs text-[#6B7280]">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Slot Inspector + Camera Panel */}
        <div className="hidden xl:flex flex-col w-72 border-l border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] overflow-y-auto">
          {/* Slot Details */}
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <h3 className="font-bold text-[#111827] dark:text-white text-sm mb-3">Slot Inspector</h3>
            {selectedSlot ? (
              <SlotDetails slot={selectedSlot} />
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] dark:bg-[#334155] flex items-center justify-center mx-auto mb-2">
                  <Info className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <p className="text-xs text-[#9CA3AF]">Click on any slot to inspect it</p>
              </div>
            )}
          </div>

          {/* Camera Feeds */}
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] dark:text-white text-sm">Camera Feeds</h3>
              <span className="badge badge-success">8 Online</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['CAM 1', 'CAM 2', 'CAM 3', 'CAM 4'].map(cam => (
                <div key={cam} className="aspect-video rounded-xl bg-[#1E293B] dark:bg-[#0F172A] flex flex-col items-center justify-center relative overflow-hidden">
                  <Camera className="w-4 h-4 text-white/40 mb-1" />
                  <span className="text-[9px] text-white/40 font-bold">{cam}</span>
                  {/* Simulated camera feed lines */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 20}%` }} />
                    ))}
                  </div>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="p-4">
            <h3 className="font-bold text-[#111827] dark:text-white text-sm mb-3">System Health</h3>
            <div className="space-y-2">
              {[
                { label: 'Entry Barrier', status: 'online', icon: '🚧' },
                { label: 'Exit Barrier', status: 'online', icon: '🚧' },
                { label: 'AI Engine', status: 'online', icon: '🧠' },
                { label: 'Payment System', status: 'online', icon: '💳' },
                { label: 'ANPR Camera', status: 'online', icon: '📷' },
                { label: 'Emergency Alert', status: 'standby', icon: '🚨' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs text-[#6B7280] dark:text-[#94A3B8]">{item.label}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    item.status === 'online' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParkingSlot({ slot, showHeatmap, onClick, isSelected }: {
  slot: Slot;
  showHeatmap: boolean;
  onClick: () => void;
  isSelected: boolean;
}) {
  const cfg = slotConfig[slot.status];
  const heatOpacity = showHeatmap ? (slot.status === 'occupied' ? 0.6 : slot.status === 'reserved' ? 0.35 : 0.1) : 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative aspect-[3/2] rounded-md border-2 flex flex-col items-center justify-center overflow-hidden transition-all"
      style={{
        backgroundColor: showHeatmap
          ? `rgba(220, 38, 38, ${heatOpacity})`
          : cfg.bgColor,
        borderColor: isSelected ? '#0F766E' : cfg.color,
        boxShadow: isSelected ? `0 0 0 2px #0F766E` : undefined,
      }}
      title={slot.id}
    >
      {/* Status icon */}
      {slot.status === 'occupied' && (
        <motion.div
          className="w-4/5 h-3/5 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: cfg.color, opacity: 0.7 }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Car size={8} className="text-white" />
        </motion.div>
      )}
      {slot.status === 'ev' && <span className="text-[10px]">⚡</span>}
      {slot.status === 'vip' && <span className="text-[8px] font-bold" style={{ color: cfg.textColor }}>VIP</span>}
      {slot.status === 'maintenance' && <Wrench size={8} style={{ color: cfg.textColor }} />}
      {slot.status === 'emergency' && <AlertTriangle size={8} style={{ color: cfg.textColor }} />}
      {slot.status === 'available' && (
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color, opacity: 0.8 }} />
      )}

      {/* Slot number */}
      <div className="text-[8px] font-bold absolute bottom-0.5" style={{ color: cfg.textColor }}>
        {slot.number}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-[#0F766E] rounded-md" />
      )}
    </motion.button>
  );
}

function SlotDetails({ slot }: { slot: Slot }) {
  const cfg = slotConfig[slot.status];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bgColor, borderColor: cfg.color, border: '2px solid' }}>
          {slot.status === 'occupied' ? <Car className="w-5 h-5" style={{ color: cfg.color }} /> :
           slot.status === 'ev' ? <Zap className="w-5 h-5" style={{ color: cfg.color }} /> :
           slot.status === 'vip' ? <Crown className="w-5 h-5" style={{ color: cfg.color }} /> :
           slot.status === 'maintenance' ? <Wrench className="w-5 h-5" style={{ color: cfg.color }} /> :
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />}
        </div>
        <div>
          <div className="font-bold text-[#111827] dark:text-white text-sm">Slot {slot.number}</div>
          <div className="text-[11px]" style={{ color: cfg.color }}>{cfg.label}</div>
        </div>
      </div>

      <div className="space-y-2">
        {slot.vehicle && (
          <div className="flex justify-between text-xs">
            <span className="text-[#6B7280]">Vehicle</span>
            <span className="font-semibold text-[#111827] dark:text-white">{slot.vehicle}</span>
          </div>
        )}
        {slot.entryTime && (
          <div className="flex justify-between text-xs">
            <span className="text-[#6B7280]">Entry</span>
            <span className="font-semibold text-[#111827] dark:text-white">{slot.entryTime}</span>
          </div>
        )}
        {slot.reservedUntil && (
          <div className="flex justify-between text-xs">
            <span className="text-[#6B7280]">Reserved until</span>
            <span className="font-semibold text-[#111827] dark:text-white">{slot.reservedUntil}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-[#6B7280]">Slot ID</span>
          <span className="font-semibold text-[#111827] dark:text-white">{slot.id}</span>
        </div>
      </div>

      {slot.status === 'available' && (
        <button className="btn-primary w-full text-xs py-2">
          Reserve this Slot
        </button>
      )}
    </div>
  );
}
