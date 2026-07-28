import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility, Bolt, Building2, Camera, Car, Check, ChevronDown, Clock3, DoorOpen,
  MapPin, Navigation, RotateCcw, ShieldCheck, Sparkles, X, ZoomIn, ZoomOut, Thermometer, Layers, Info, Zap, Crown, Wrench, AlertTriangle, Shield, MousePointer2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { readDigitalTwinLiveState } from '../../client-admin/digitalTwin/sync';
import {
  twinStatusConfig,
  type TwinCanvasObject,
  type TwinFloorPlan,
  type TwinObjectStatus,
} from '../../client-admin/digitalTwin/data';
import { useTenantStore } from '../../../store';
import { useBookingStore } from '../store/useBookingStore';

type Filter = 'all' | 'bookable' | 'ev' | 'vip';
type BookableStatus = Extract<TwinObjectStatus, 'available' | 'ev' | 'vip' | 'disabled'>;

const isSpace = (item: TwinCanvasObject) => item.type.endsWith('-slot') || item.type === 'parking-slot';
const isBookable = (item: TwinCanvasObject) => isSpace(item) && ['available', 'ev', 'vip', 'disabled'].includes(item.status ?? '');
const isInfrastructure = (item: TwinCanvasObject) => ['entry-gate', 'exit-gate', 'camera', 'lift', 'stairs', 'charging-station'].includes(item.type);

const labelFor = (item: TwinCanvasObject) => {
  if (item.name.includes('Parking Slot')) return `Space ${item.id.split('-').at(-1)?.toUpperCase() ?? '01'}`;
  return item.name.replace(/^(North Row|South Row|East Bay) /, 'B1-');
};

const getStats = (floor: TwinFloorPlan) => {
  const spaces = floor.objects.filter(isSpace);
  return { total: spaces.length, available: spaces.filter(isBookable).length, occupied: spaces.filter((item) => item.status === 'occupied').length };
};

function MapObject({ item, selected, dimmed, onSelect, canvas, viewMode }: { item: TwinCanvasObject; selected: boolean; dimmed: boolean; onSelect: (item: TwinCanvasObject) => void; canvas: { width: number; height: number }, viewMode: '2d' | '3d' }) {
  const status = item.status ? twinStatusConfig[item.status] : undefined;
  const position = {
    left: `${(item.x / canvas.width) * 100}%`, top: `${(item.y / canvas.height) * 100}%`,
    width: `${(item.width / canvas.width) * 100}%`, height: `${(item.height / canvas.height) * 100}%`,
    transform: `rotate(${item.rotation}deg) ${viewMode === '3d' ? 'translateZ(10px)' : ''}`, zIndex: item.zIndex,
    transformStyle: 'preserve-3d' as const,
  };
  if (isInfrastructure(item)) {
    const icon = item.type === 'camera' ? <Camera className="h-3.5 w-3.5" /> : item.type === 'lift' ? <Building2 className="h-3.5 w-3.5" /> : <DoorOpen className="h-3.5 w-3.5" />;
    return <span className="pointer-events-none absolute grid place-items-center rounded-md border border-slate-300/90 bg-white/90 text-slate-500 shadow-sm transition-all duration-300 dark:border-white/15 dark:bg-slate-950/85 dark:text-slate-300" style={position}>{icon}<span className="sr-only">{item.name}</span>
      {viewMode === '3d' && <div className="absolute inset-0 bg-black/10 -z-10 translate-y-2 blur-sm" style={{ transform: 'translateZ(-10px)' }} />}
    </span>;
  }
  if (!isSpace(item)) return null;
  const bookable = isBookable(item);
  const icon = item.type === 'ev-slot' ? <Bolt className="h-3.5 w-3.5" /> : item.type === 'disabled-slot' ? <Accessibility className="h-3.5 w-3.5" /> : <Car className="h-3.5 w-3.5" />;
  return <button
    type="button"
    disabled={!bookable}
    onClick={() => bookable && onSelect(item)}
    aria-label={`${labelFor(item)}: ${status?.label ?? 'Parking space'}`}
    className={cn(
      'absolute flex flex-col items-center justify-center rounded-md border-[1.5px] px-0.5 text-center shadow-sm transition duration-150',
      bookable ? 'cursor-pointer hover:-translate-y-0.5 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2' : 'cursor-not-allowed',
      selected && 'ring-4 ring-[#0F766E]/30 ring-offset-2', dimmed && 'opacity-20 pointer-events-none',
      useBookingStore.getState().isSlotHeld(item.id) && 'ring-2 ring-yellow-400 animate-pulse'
    )}
    style={{ ...position, backgroundColor: status?.bg ?? item.fill, borderColor: status?.color ?? item.stroke, color: status?.color ?? '#475569' }}
  >
    {icon}
    <span className="mt-1 max-w-full truncate text-[clamp(7px,0.65vw,10px)] font-semibold leading-none">{labelFor(item)}</span>
    {viewMode === '3d' && <div className="absolute inset-0 bg-black/5 -z-10 translate-y-1 blur-sm" style={{ transform: 'translateZ(-10px)' }} />}
  </button>;
}

export function CustomerDigitalTwin() {
  const navigate = useNavigate();
  const activeTenantId = useTenantStore((s) => s.currentTenant?.id ?? undefined);
  const [{ project, activeFloorId, updatedAt }, setLiveState] = useState(() => readDigitalTwinLiveState(activeTenantId));
  const [floorId, setFloorId] = useState(activeFloorId);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<TwinCanvasObject | null>(null);
  const [toast, setToast] = useState('');
  
  const selectSlot = useBookingStore((s) => s.selectSlot);
  const isSlotHeld = useBookingStore((s) => s.isSlotHeld);
  
  // From main: Zoom and heatmap state
  const [zoom, setZoom] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [cameraOrbit, setCameraOrbit] = useState({ x: 55, z: -45 });
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number, panX: number, panY: number, orbitX: number, orbitZ: number } | null>(null);

  const floor = project.floors.find((item) => item.id === floorId) ?? project.floors[0];
  const stats = useMemo(() => getStats(floor), [floor]);

  useEffect(() => {
    const refresh = () => { const next = readDigitalTwinLiveState(activeTenantId); setLiveState(next); setFloorId((current) => next.project.floors.some((item) => item.id === current) ? current : next.activeFloorId); };
    window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh);
  }, [activeTenantId]);

  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);

  if (!floor) return null;
  const isDimmed = (item: TwinCanvasObject) => {
    if (!isSpace(item)) return false;
    if (isSlotHeld(item.id)) return false; // Don't dim our held slot
    if (filter === 'all') return false;
    if (filter === 'bookable') return !isBookable(item);
    return item.status !== filter;
  };
  const refreshLayout = () => { const next = readDigitalTwinLiveState(activeTenantId); setLiveState(next); setFloorId(next.activeFloorId); setSelected(null); setPan({x: 0, y: 0}); setCameraOrbit({x: 55, z: -45}); setZoom(1); };
  
  const reserve = () => {
    if (!selected) return;
    if (selectSlot(selected.id)) {
      setToast(`${labelFor(selected)} is temporarily held for 5 minutes.`);
      setTimeout(() => navigate(`/book?slot=${encodeURIComponent(labelFor(selected))}&floor=${encodeURIComponent(floor.name)}`), 1000);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only start drag if clicking on the background, not on a parking slot
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
    
    if (viewMode === '3d' && !e.shiftKey) {
      setIsOrbiting(true);
    } else {
      setIsPanning(true);
    }
    setDragStart({
      x: e.clientX, y: e.clientY,
      panX: pan.x, panY: pan.y,
      orbitX: cameraOrbit.x, orbitZ: cameraOrbit.z
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isOrbiting && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCameraOrbit({
        x: Math.max(0, Math.min(85, dragStart.orbitX - dy * 0.4)),
        z: dragStart.orbitZ + dx * 0.4
      });
    } else if (isPanning && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan({
        x: dragStart.panX + dx,
        y: dragStart.panY + dy
      });
    }
  };

  const handlePointerUp = () => {
    setIsOrbiting(false);
    setIsPanning(false);
    setDragStart(null);
  };

  const transformStyle = viewMode === '3d' 
    ? `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom}) rotateX(${cameraOrbit.x}deg) rotateZ(${cameraOrbit.z}deg)`
    : `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`;

  return (
    <div className="flex flex-col h-full bg-[#EAF0F5] dark:bg-[#060E19]">
      {/* Header from main + ours */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-white/10 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] uppercase tracking-wider">{updatedAt === 'mock' ? 'Digital Twin – Mock' : 'Digital Twin – Live'}</span>
            </div>
            <h1 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight">{project.mallName} · {project.parkingName}</h1>
            <div className="flex items-center mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
               <MapPin className="mr-1 inline h-3.5 w-3.5 text-[#0F766E]" /> {project.location}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={refreshLayout} className="btn-ghost p-2 text-[#475569] dark:text-[#CBD5E1]" title="Refresh">
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* View mode */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-1">
              {(['2d', '3d'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize',
                    viewMode === mode ? 'bg-[#0F766E] text-white' : 'text-[#64748B] dark:text-[#94A3B8]'
                  )}
                >
                  {mode}
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
                  : 'bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-white/10 text-[#64748B]'
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
              <span className="text-xs font-semibold text-[#64748B] w-8 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="btn-ghost p-2">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => { setZoom(1); setPan({x: 0, y: 0}); setCameraOrbit({x: 55, z: -45}); }} className="btn-ghost p-2" title="Reset View">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Floor selector */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E2E8F0] dark:border-white/10">
          <Layers className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs font-medium text-[#64748B] mr-1">Floor:</span>
          {project.floors.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFloorId(f.id); setSelected(null); }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                floorId === f.id
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white dark:bg-transparent border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-[#94A3B8]'
              )}
            >
              {f.name}
            </button>
          ))}
          
          <div className="ml-auto flex gap-2">
            {(['all', 'bookable', 'ev', 'vip'] as Filter[]).map((key) => <button key={key} onClick={() => setFilter(key)} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition', filter === key ? 'bg-[#0F766E] text-white shadow-sm' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] dark:bg-white/5 dark:text-[#CBD5E1] dark:hover:bg-white/10')}>{key === 'bookable' ? 'Available' : key}</button>)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Twin Visualization (Ours) */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-[1440px] space-y-5">
            {/* Stats row */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Available now', stats.available, 'text-emerald-600 dark:text-emerald-400'], 
                ['Occupied', stats.occupied, 'text-rose-600 dark:text-rose-400'], 
                ['Total spaces', stats.total, 'text-blue-600 dark:text-blue-400'], 
                ['Starting from', 'Rs 90/hr', 'text-violet-600 dark:text-violet-400']
              ].map(([label, value, tone]) => (
                <motion.div whileHover={{ y: -2 }} key={label as string} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#0F172A]/75">
                  <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{label}</p>
                  <p className={cn('mt-1 text-xl font-bold', tone)}>{value}</p>
                </motion.div>
              ))}
            </section>
            
            {/* Canvas */}
            <div 
              className="relative overflow-hidden rounded-xl border border-white/70 bg-slate-100 shadow-[0_20px_50px_rgba(15,23,42,.08)] dark:border-white/10 dark:bg-[#08101C] p-0 h-[600px] cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey || viewMode === '3d') {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -0.1 : 0.1;
                  setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
                }
              }}
              style={{ perspective: '2000px' }}
            >
              
              {/* Controls Hint */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5">
                <div className="flex items-center gap-2 rounded-lg bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur">
                  <MousePointer2 className="w-3.5 h-3.5" />
                  {viewMode === '3d' ? 'Drag to rotate • Shift+Drag to pan' : 'Drag to pan'}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Scroll to zoom
                </div>
              </div>

              <div className="w-full h-full flex items-center justify-center transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative mx-auto w-full max-w-[1000px] transform-gpu transition-transform duration-75 ease-out shadow-2xl" 
                     style={{ 
                       transform: transformStyle, 
                       aspectRatio: `${project.canvas.width} / ${project.canvas.height}`, 
                       transformStyle: 'preserve-3d',
                       backgroundColor: viewMode === '3d' ? '#475569' : '#F8FAFC',
                       backgroundImage: viewMode === '3d' ? 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)' : 'linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)', 
                       backgroundSize: '24px 24px',
                       borderRadius: viewMode === '3d' ? '12px' : '0px',
                       border: viewMode === '3d' ? '8px solid #334155' : '1px solid #E2E8F0',
                     }}>
                  
                  {/* Base Platform (3D Depth) */}
                  {viewMode === '3d' && (
                    <div className="absolute inset-0 rounded-xl bg-slate-800 -z-10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transform-gpu" style={{ transform: 'translateZ(-10px)' }} />
                  )}

                  <div className="absolute inset-[3%] rounded-lg border border-slate-400/30 dark:border-white/10" />
                  <div className="absolute left-[8%] right-[8%] top-[25%] h-[10%] rounded bg-slate-200/90 shadow-inner" />
                  <div className="absolute left-[18%] right-[18%] top-[52%] h-[9%] rounded bg-slate-200/90 shadow-inner" />
                  <div className="absolute bottom-[5%] left-[8%] right-[8%] h-[7%] rounded bg-slate-300/90 shadow-inner" />
                  <div className="absolute left-[34%] top-[34%] h-[20%] w-[28%] rounded-lg border border-slate-400/60 bg-slate-100/95 shadow-md" />
                  
                  {floor.objects.filter((item) => !item.hidden && (isSpace(item) || isInfrastructure(item))).sort((a, b) => a.zIndex - b.zIndex).map((item) => (
                    <MapObject key={item.id} item={item} canvas={project.canvas} selected={selected?.id === item.id} dimmed={isDimmed(item)} onSelect={setSelected} viewMode={viewMode} />
                  ))}
                  
                  <div className="pointer-events-none absolute bottom-[2%] left-[11%] rounded-md bg-emerald-600 px-2.5 py-1 text-[clamp(7px,.7vw,10px)] font-bold text-white shadow">ENTRY</div>
                  <div className="pointer-events-none absolute right-[3%] top-[3%] rounded-md bg-white/95 px-2.5 py-1.5 text-[clamp(8px,.75vw,11px)] font-semibold text-slate-600 shadow-sm">{floor.name} · Select a green space</div>
                  <div className="pointer-events-none absolute bottom-[4%] right-[4%] flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2 py-1 text-[clamp(7px,.65vw,9px)] font-medium text-white"><Navigation className="h-3 w-3 text-emerald-300" /> Follow marked lanes</div>
                  
                  {showHeatmap && (
                    <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply pointer-events-none transition-opacity" style={{ opacity: showHeatmap ? 1 : 0 }} />
                  )}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 pt-4 border-t border-[#E2E8F0] dark:border-white/10 text-xs text-[#475569] dark:text-[#CBD5E1]">
              {(['available', 'occupied', 'reserved', 'ev', 'vip', 'disabled'] as TwinObjectStatus[]).map((status) => (
                <span key={status} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm shadow-sm" style={{ backgroundColor: twinStatusConfig[status].color }} />{twinStatusConfig[status].label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Theirs) */}
        <div className="hidden xl:flex flex-col w-72 border-l border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0F172A] overflow-y-auto">
          {/* Slot Details */}
          <div className="p-4 border-b border-[#E2E8F0] dark:border-white/10">
            <h3 className="font-bold text-[#111827] dark:text-white text-sm mb-3">Slot Inspector</h3>
            {selected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: twinStatusConfig[selected.status as TwinObjectStatus]?.bg || '#f1f5f9', border: `2px solid ${twinStatusConfig[selected.status as TwinObjectStatus]?.color || '#94a3b8'}` }}>
                     <Car className="w-5 h-5" style={{ color: twinStatusConfig[selected.status as TwinObjectStatus]?.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-[#111827] dark:text-white text-sm">{labelFor(selected)}</div>
                    <div className="text-[11px]" style={{ color: twinStatusConfig[selected.status as TwinObjectStatus]?.color }}>{twinStatusConfig[selected.status as TwinObjectStatus]?.label}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748B]">Type</span>
                    <span className="font-semibold text-[#111827] dark:text-white">{selected.type.replace('-slot', '')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748B]">Price</span>
                    <span className="font-semibold text-[#111827] dark:text-white">Rs {selected.price ?? 90}/hr</span>
                  </div>
                </div>
                {isBookable(selected) && (
                  <button onClick={reserve} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5F59] mt-2">
                    <Check className="h-4 w-4" /> Book This Space
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-2xl bg-[#F1F5F9] dark:bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <Info className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <p className="text-xs text-[#9CA3AF]">Click on any slot to inspect it</p>
              </div>
            )}
          </div>

          {/* Camera Feeds */}
          <div className="p-4 border-b border-[#E2E8F0] dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] dark:text-white text-sm">Camera Feeds</h3>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">8 Online</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['CAM 1', 'CAM 2', 'CAM 3', 'CAM 4'].map(cam => (
                <div key={cam} className="aspect-video rounded-xl bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                  <Camera className="w-4 h-4 text-white/40 mb-1" />
                  <span className="text-[9px] text-white/40 font-bold">{cam}</span>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                    <span className="text-xs text-[#64748B]">{item.label}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    item.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelected(null)}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="slot-dialog-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .98 }} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl dark:bg-[#101B2D]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">Available to book</p>
                  <h2 id="slot-dialog-title" className="mt-1 text-xl font-bold text-[#0F172A] dark:text-white">{labelFor(selected)}</h2>
                  <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{floor.name} · {twinStatusConfig[selected.status as BookableStatus]?.label}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] dark:hover:bg-white/10" aria-label="Close booking dialog"><X className="h-5 w-5" /></button>
              </div>
              <div className="my-5 grid grid-cols-3 gap-3 rounded-lg bg-[#F8FAFC] p-3 dark:bg-white/5">
                <div><Clock3 className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Hold time</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">5 min</p></div>
                <div><Car className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Vehicle</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">Sedan</p></div>
                <div><Sparkles className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Rate</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">Rs {selected.price ?? 90}/hr</p></div>
              </div>
              <button onClick={reserve} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5F59]">
                <Check className="h-4 w-4" /> Book this space
              </button>
              <button onClick={() => navigate(`/book?slot=${encodeURIComponent(labelFor(selected))}&floor=${encodeURIComponent(floor.name)}`)} className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#0F766E]/8">Continue to checkout</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-5 right-5 z-[60] rounded-lg bg-[#0F172A] px-4 py-3 text-sm font-medium text-white shadow-xl"><Check className="mr-2 inline h-4 w-4 text-emerald-400" />{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
