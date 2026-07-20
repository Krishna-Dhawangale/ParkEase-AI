import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility, Bolt, Building2, Camera, Car, Check, ChevronDown, Clock3, DoorOpen,
  MapPin, Navigation, RotateCcw, ShieldCheck, Sparkles, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { readDigitalTwinLiveState } from '../../modules/admin/digitalTwin/sync';
import {
  twinStatusConfig,
  type TwinCanvasObject,
  type TwinFloorPlan,
  type TwinObjectStatus,
} from '../../modules/admin/digitalTwin/data';

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

function MapObject({ item, selected, dimmed, onSelect, canvas }: { item: TwinCanvasObject; selected: boolean; dimmed: boolean; onSelect: (item: TwinCanvasObject) => void; canvas: { width: number; height: number } }) {
  const status = item.status ? twinStatusConfig[item.status] : undefined;
  const position = {
    left: `${(item.x / canvas.width) * 100}%`, top: `${(item.y / canvas.height) * 100}%`,
    width: `${(item.width / canvas.width) * 100}%`, height: `${(item.height / canvas.height) * 100}%`,
    transform: `rotate(${item.rotation}deg)`, zIndex: item.zIndex,
  };
  if (isInfrastructure(item)) {
    const icon = item.type === 'camera' ? <Camera className="h-3.5 w-3.5" /> : item.type === 'lift' ? <Building2 className="h-3.5 w-3.5" /> : <DoorOpen className="h-3.5 w-3.5" />;
    return <span className="pointer-events-none absolute grid place-items-center rounded-md border border-slate-300/90 bg-white/90 text-slate-500 shadow-sm dark:border-white/15 dark:bg-slate-950/85 dark:text-slate-300" style={position}>{icon}<span className="sr-only">{item.name}</span></span>;
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
      selected && 'ring-4 ring-[#0F766E]/30 ring-offset-2', dimmed && 'opacity-20',
    )}
    style={{ ...position, backgroundColor: status?.bg ?? item.fill, borderColor: status?.color ?? item.stroke, color: status?.color ?? '#475569' }}
  >
    {icon}
    <span className="mt-1 max-w-full truncate text-[clamp(7px,0.65vw,10px)] font-semibold leading-none">{labelFor(item)}</span>
  </button>;
}

export function DigitalTwinPage() {
  const navigate = useNavigate();
  const [{ project, activeFloorId, updatedAt }, setLiveState] = useState(readDigitalTwinLiveState);
  const [floorId, setFloorId] = useState(activeFloorId);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<TwinCanvasObject | null>(null);
  const [reserved, setReserved] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const floor = project.floors.find((item) => item.id === floorId) ?? project.floors[0];
  const stats = useMemo(() => getStats(floor), [floor]);

  useEffect(() => {
    const refresh = () => { const next = readDigitalTwinLiveState(); setLiveState(next); setFloorId((current) => next.project.floors.some((item) => item.id === current) ? current : next.activeFloorId); };
    window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh);
  }, []);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);

  if (!floor) return null;
  const isDimmed = (item: TwinCanvasObject) => {
    if (!isSpace(item)) return false;
    if (reserved.includes(item.id)) return true;
    if (filter === 'all') return false;
    if (filter === 'bookable') return !isBookable(item);
    return item.status !== filter;
  };
  const refreshLayout = () => { const next = readDigitalTwinLiveState(); setLiveState(next); setFloorId(next.activeFloorId); setSelected(null); };
  const reserve = () => { if (!selected) return; setReserved((items) => [...items, selected.id]); setToast(`${labelFor(selected)} is held for 10 minutes.`); setSelected(null); };

  return <div className="min-h-full p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-[1440px] space-y-5">
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {updatedAt === 'mock' ? 'Live layout' : 'Live layout synced'}</div><h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-3xl">Choose your parking space</h1><p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{project.mallName} · {project.parkingName}</p></div>
      <div className="flex flex-wrap gap-2"><div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#334155] shadow-sm dark:border-white/10 dark:bg-[#0F172A] dark:text-white"><MapPin className="mr-1.5 inline h-4 w-4 text-[#0F766E]" />{project.location}</div><button onClick={refreshLayout} className="rounded-lg border border-[#E2E8F0] bg-white p-2.5 text-[#475569] shadow-sm transition hover:border-[#0F766E]/40 hover:text-[#0F766E] dark:border-white/10 dark:bg-[#0F172A] dark:text-[#CBD5E1]" aria-label="Refresh parking layout"><RotateCcw className="h-4 w-4" /></button></div>
    </header>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Available now', stats.available, 'text-emerald-600 dark:text-emerald-400'], ['Occupied', stats.occupied, 'text-rose-600 dark:text-rose-400'], ['Total spaces', stats.total, 'text-blue-600 dark:text-blue-400'], ['Starting from', 'Rs 90/hr', 'text-violet-600 dark:text-violet-400']].map(([label, value, tone]) => <motion.div whileHover={{ y: -2 }} key={label} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#0F172A]/75"><p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{label}</p><p className={cn('mt-1 text-xl font-bold', tone)}>{value}</p></motion.div>)}</section>
    <section className="overflow-hidden rounded-xl border border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,.08)] backdrop-blur dark:border-white/10 dark:bg-[#0F172A]/80">
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-4 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-2"><label className="relative"><span className="sr-only">Choose floor</span><select value={floorId} onChange={(event) => { setFloorId(event.target.value); setSelected(null); }} className="appearance-none rounded-lg border border-[#CBD5E1] bg-white py-2 pl-3 pr-9 text-sm font-semibold text-[#1E293B] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 dark:border-white/15 dark:bg-[#162033] dark:text-white">{project.floors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-[#64748B]" /></label>{(['all', 'bookable', 'ev', 'vip'] as Filter[]).map((key) => <button key={key} onClick={() => setFilter(key)} className={cn('rounded-lg px-3 py-2 text-xs font-semibold capitalize transition', filter === key ? 'bg-[#0F766E] text-white shadow-sm' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] dark:bg-white/5 dark:text-[#CBD5E1] dark:hover:bg-white/10')}>{key === 'bookable' ? 'Available' : key}</button>)}</div><div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Sensor-confirmed availability</div></div>
      <div className="bg-[#EAF0F5] p-3 dark:bg-[#060E19] sm:p-5"><div className="relative mx-auto w-full max-w-[1160px] overflow-hidden rounded-xl border-[6px] border-slate-300 bg-[#66778D] shadow-[0_18px_45px_rgba(15,23,42,.22)] dark:border-slate-600" style={{ aspectRatio: `${project.canvas.width} / ${project.canvas.height}`, backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '18px 18px' }}><div className="absolute inset-[3%] rounded-lg border border-white/30" /><div className="absolute left-[8%] right-[8%] top-[25%] h-[10%] rounded bg-slate-200/90 shadow-inner" /><div className="absolute left-[18%] right-[18%] top-[52%] h-[9%] rounded bg-slate-200/90 shadow-inner" /><div className="absolute bottom-[5%] left-[8%] right-[8%] h-[7%] rounded bg-slate-300/90 shadow-inner" /><div className="absolute left-[34%] top-[34%] h-[20%] w-[28%] rounded-lg border border-slate-400/60 bg-slate-100/95 shadow-md" />{floor.objects.filter((item) => !item.hidden && (isSpace(item) || isInfrastructure(item))).sort((a, b) => a.zIndex - b.zIndex).map((item) => <MapObject key={item.id} item={item} canvas={project.canvas} selected={selected?.id === item.id} dimmed={isDimmed(item)} onSelect={setSelected} />)}<div className="pointer-events-none absolute bottom-[2%] left-[11%] rounded-md bg-emerald-600 px-2.5 py-1 text-[clamp(7px,.7vw,10px)] font-bold text-white shadow">ENTRY</div><div className="pointer-events-none absolute right-[3%] top-[3%] rounded-md bg-white/95 px-2.5 py-1.5 text-[clamp(8px,.75vw,11px)] font-semibold text-slate-600 shadow-sm">{floor.name} · Select a green space</div><div className="pointer-events-none absolute bottom-[4%] right-[4%] flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2 py-1 text-[clamp(7px,.65vw,9px)] font-medium text-white"><Navigation className="h-3 w-3 text-emerald-300" /> Follow marked lanes</div></div></div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E2E8F0] p-4 text-xs text-[#475569] dark:border-white/10 dark:text-[#CBD5E1]">{(['available', 'occupied', 'reserved', 'ev', 'vip', 'disabled'] as TwinObjectStatus[]).map((status) => <span key={status} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: twinStatusConfig[status].color }} />{twinStatusConfig[status].label}</span>)}</div>
    </section>
  </div>
  <AnimatePresence>{selected && <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelected(null)}><motion.section role="dialog" aria-modal="true" aria-labelledby="slot-dialog-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .98 }} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl dark:bg-[#101B2D]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">Available to book</p><h2 id="slot-dialog-title" className="mt-1 text-xl font-bold text-[#0F172A] dark:text-white">{labelFor(selected)}</h2><p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{floor.name} · {twinStatusConfig[selected.status as BookableStatus]?.label}</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] dark:hover:bg-white/10" aria-label="Close booking dialog"><X className="h-5 w-5" /></button></div><div className="my-5 grid grid-cols-3 gap-3 rounded-lg bg-[#F8FAFC] p-3 dark:bg-white/5"><div><Clock3 className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Hold time</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">10 min</p></div><div><Car className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Vehicle</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">Sedan</p></div><div><Sparkles className="mb-1 h-4 w-4 text-[#0F766E]" /><p className="text-xs text-[#64748B]">Rate</p><p className="text-sm font-bold text-[#0F172A] dark:text-white">Rs {selected.price ?? 90}/hr</p></div></div><button onClick={reserve} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5F59]"><Check className="h-4 w-4" /> Reserve this space</button><button onClick={() => navigate(`/book?slot=${encodeURIComponent(labelFor(selected))}&floor=${encodeURIComponent(floor.name)}`)} className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#0F766E]/8">Continue to full booking</button></motion.section></motion.div>}</AnimatePresence>
  <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-5 right-5 z-[60] rounded-lg bg-[#0F172A] px-4 py-3 text-sm font-medium text-white shadow-xl"><Check className="mr-2 inline h-4 w-4 text-emerald-400" />{toast}</motion.div>}</AnimatePresence>
  </div>;
}
