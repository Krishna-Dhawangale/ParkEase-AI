import { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Building2,
  Car,
  Download,
  IndianRupee,
  Plus,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import AddParking from './AddParking';
import { mockParkingZones, type ParkingZone, type ZoneStatus } from './data';
import EditParking from './EditParking';
import type { ParkingFormData } from './ParkingForm';
import ParkingDetails from './ParkingDetails';
import ParkingTable from './ParkingTable';

export default function ParkingList() {
  const [zones, setZones] = useState<ParkingZone[]>(mockParkingZones);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editZone, setEditZone] = useState<ParkingZone | null>(null);
  const [viewZone, setViewZone] = useState<ParkingZone | null>(null);
  const [deleteZone, setDeleteZone] = useState<ParkingZone | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  };

  const stats = useMemo(() => {
    const totalSlots = zones.reduce((sum, zone) => sum + zone.totalSlots, 0);
    const occupiedSlots = zones.reduce((sum, zone) => sum + zone.occupiedSlots, 0);
    const revenueMonth = zones.reduce((sum, zone) => sum + zone.revenueMonth, 0);
    const evSlots = zones.reduce((sum, zone) => sum + zone.evSlots, 0);

    return {
      totalLocations: zones.length,
      totalSlots,
      occupiedSlots,
      occupancy: totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0,
      revenueMonth,
      evSlots,
      activeLocations: zones.filter((zone) => zone.status === 'Active').length,
    };
  }, [zones]);

  const chartData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((day, index) => ({
      day,
      occupancy: Math.round(zones.reduce((sum, zone) => sum + zone.occupancyHistory[index], 0) / zones.length),
      revenue: Math.round(zones.reduce((sum, zone) => sum + zone.revenueToday * (0.72 + index * 0.06), 0) / 1000),
    }));
  }, [zones]);

  const createZoneFromForm = (data: ParkingFormData, existing?: ParkingZone): ParkingZone => {
    const occupiedSlots = Math.min(data.occupiedSlots, data.totalSlots);
    const occupancy = data.totalSlots ? Math.round((occupiedSlots / data.totalSlots) * 100) : 0;
    const features = data.features?.split(',').map((feature) => feature.trim()).filter(Boolean) ?? [];

    return {
      id: existing?.id ?? `PK-${Math.floor(Math.random() * 9000) + 2000}`,
      name: data.name,
      type: data.type,
      city: data.city,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      status: data.status,
      totalSlots: data.totalSlots,
      availableSlots: Math.max(0, data.totalSlots - occupiedSlots),
      occupiedSlots,
      evSlots: data.evSlots,
      vipSlots: data.vipSlots,
      disabledSlots: data.disabledSlots,
      emergencySlots: data.emergencySlots,
      basePrice: data.basePrice,
      weekdayRate: data.weekdayRate,
      weekendRate: data.weekendRate,
      monthlyPass: data.monthlyPass,
      revenueToday: existing?.revenueToday ?? occupiedSlots * data.basePrice,
      revenueMonth: existing?.revenueMonth ?? occupiedSlots * data.basePrice * 24,
      workingHoursOpen: data.workingHoursOpen,
      workingHoursClose: data.workingHoursClose,
      manager: data.manager,
      imageUrl: data.imageUrl,
      features,
      occupancyHistory: existing ? [...existing.occupancyHistory.slice(-6), occupancy] : [42, 48, 55, 61, 67, 70, occupancy],
      lastUpdated: 'Just now',
    };
  };

  const handleAdd = (data: ParkingFormData) => {
    setZones((current) => [createZoneFromForm(data), ...current]);
    showToast('Parking location created.');
  };

  const handleEdit = (id: string, data: ParkingFormData) => {
    setZones((current) => current.map((zone) => zone.id === id ? createZoneFromForm(data, zone) : zone));
    showToast('Parking location updated.');
  };

  const handleDelete = () => {
    if (!deleteZone) return;
    setZones((current) => current.filter((zone) => zone.id !== deleteZone.id));
    setDeleteZone(null);
    showToast(`${deleteZone.name} deleted.`);
  };

  const handleBulkDelete = () => {
    setZones((current) => current.filter((zone) => !bulkDeleteIds.includes(zone.id)));
    showToast(`${bulkDeleteIds.length} parking locations deleted.`);
    setBulkDeleteIds([]);
  };

  const handleBulkStatusChange = (ids: string[], status: ZoneStatus) => {
    setZones((current) => current.map((zone) => ids.includes(zone.id) ? { ...zone, status, lastUpdated: 'Just now' } : zone));
    showToast(`${ids.length} locations moved to ${status}.`);
  };

  const handleExport = (rows: ParkingZone[]) => {
    const headers = ['ID', 'Name', 'City', 'Type', 'Status', 'Total Slots', 'Occupied', 'EV Slots', 'VIP Slots', 'Revenue Month'];
    const csvRows = rows.map((zone) => [
      zone.id,
      zone.name,
      zone.city,
      zone.type,
      zone.status,
      zone.totalSlots,
      zone.occupiedSlots,
      zone.evSlots,
      zone.vipSlots,
      zone.revenueMonth,
    ]);
    const csv = [headers, ...csvRows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parkease-parking-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length} rows.`);
  };

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setLoading(false);
    showToast('Parking data refreshed.');
  };

  const statCards = [
    { label: 'Locations', value: stats.totalLocations, detail: `${stats.activeLocations} active`, icon: Building2 },
    { label: 'Total Capacity', value: formatNumber(stats.totalSlots), detail: `${formatNumber(stats.occupiedSlots)} occupied`, icon: Car },
    { label: 'Occupancy', value: `${stats.occupancy}%`, detail: 'Across all cities', icon: TrendingUp },
    { label: 'Monthly Revenue', value: formatCurrency(stats.revenueMonth), detail: `${stats.evSlots} EV-ready slots`, icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl px-4 py-3 text-sm font-bold shadow-xl ${toast.type === 'success' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-rose-600 text-white'}`}
            role="status"
          >
            {toast.message}
          </motion.div>
        </div>
      )}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <Zap className="h-3.5 w-3.5 text-brand-600" />
            Live parking operations
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Parking Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage enterprise parking locations, capacity, pricing, availability, and operational status.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setLoading(true); window.setTimeout(() => { setLoading(false); showToast('Latest parking telemetry loaded.'); }, 650); }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => handleExport(zones)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export all
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400"
          >
            <Plus className="h-4 w-4" />
            Add parking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">+8.4%</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.detail}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Occupancy and Revenue Trend</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Seven-day operational trend across filtered portfolio.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="parkingOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => name === 'revenue' ? [`Rs. ${value}K`, 'Revenue'] : [`${value}%`, 'Occupancy']} />
                <Area type="monotone" dataKey="occupancy" stroke="#2563eb" strokeWidth={2.5} fill="url(#parkingOccupancy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Operational Mix</h2>
          <div className="mt-5 space-y-4">
            {[
              ['EV Slots', stats.evSlots, stats.totalSlots, 'bg-emerald-500'],
              ['VIP Slots', zones.reduce((sum, zone) => sum + zone.vipSlots, 0), stats.totalSlots, 'bg-violet-500'],
              ['Accessible Slots', zones.reduce((sum, zone) => sum + zone.disabledSlots, 0), stats.totalSlots, 'bg-sky-500'],
              ['Emergency Slots', zones.reduce((sum, zone) => sum + zone.emergencySlots, 0), stats.totalSlots, 'bg-rose-500'],
            ].map(([label, value, total, color]) => {
              const pct = Math.round((Number(value) / Number(total)) * 100);
              return (
                <div key={String(label)}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="text-slate-500 dark:text-slate-400">{value} slots</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setError('Mock telemetry service timed out while loading the city capacity feed.')}
            className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Simulate error state
          </button>
        </div>
      </div>

      <ParkingTable
        data={zones}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onEdit={setEditZone}
        onDelete={setDeleteZone}
        onView={setViewZone}
        onExport={handleExport}
        onBulkDelete={setBulkDeleteIds}
        onBulkStatusChange={handleBulkStatusChange}
      />

      <AddParking open={isAddOpen} onOpenChange={setIsAddOpen} onAdd={handleAdd} />
      <EditParking open={!!editZone} onOpenChange={(open) => !open && setEditZone(null)} zone={editZone} onSave={handleEdit} />
      <ParkingDetails open={!!viewZone} onOpenChange={(open) => !open && setViewZone(null)} zone={viewZone} />

      <Dialog.Root open={!!deleteZone || bulkDeleteIds.length > 0} onOpenChange={(open) => { if (!open) { setDeleteZone(null); setBulkDeleteIds([]); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <Dialog.Title className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Delete parking {bulkDeleteIds.length > 0 ? 'locations' : 'location'}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {bulkDeleteIds.length > 0
                ? `This will delete ${bulkDeleteIds.length} selected parking locations from the mock data.`
                : `This will delete ${deleteZone?.name}. This action cannot be undone.`}
            </Dialog.Description>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => { setDeleteZone(null); setBulkDeleteIds([]); }} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
              <button type="button" onClick={bulkDeleteIds.length > 0 ? handleBulkDelete : handleDelete} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">Delete</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
