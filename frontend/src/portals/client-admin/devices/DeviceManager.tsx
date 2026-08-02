import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Camera,
  ScanLine,
  Gauge,
  Server,
  Plus,
  RefreshCw,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Signal,
  Battery,
  Thermometer,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

type DeviceStatus = 'Online' | 'Offline' | 'Warning';
type DeviceType = 'Camera' | 'Sensor' | 'Barrier' | 'Display' | 'Controller';

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  lastPing: string;
  firmware: string;
  uptime: string;
  signal: number;
  battery?: number;
  temperature?: number;
}

const mockDevices: Device[] = [];

const typeIcons: Record<DeviceType, React.ElementType> = {
  Camera: Camera,
  Sensor: ScanLine,
  Barrier: Gauge,
  Display: Server,
  Controller: Server,
};

const statusConfig: Record<DeviceStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Online: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Offline: { icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  Warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
};

// ─── Component ──────────────────────────────────────────────────────────────────

const DeviceManager = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | DeviceStatus>('All');

  const filtered = mockDevices.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: mockDevices.length,
    online: mockDevices.filter((d) => d.status === 'Online').length,
    offline: mockDevices.filter((d) => d.status === 'Offline').length,
    warning: mockDevices.filter((d) => d.status === 'Warning').length,
  };

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">IoT & Devices</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor and manage all connected parking infrastructure devices.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:bg-blue-800 sm:flex">
            <Plus className="h-3.5 w-3.5" />
            Add Device
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Devices', value: counts.total, icon: Server, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Online', value: counts.online, icon: Wifi, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Offline', value: counts.offline, icon: WifiOff, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { label: 'Warnings', value: counts.warning, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {(['All', 'Online', 'Offline', 'Warning'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterStatus === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-64"
          />
        </div>
      </div>

      {/* Device Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Signal</th>
                <th className="px-6 py-4">Last Ping</th>
                <th className="px-6 py-4">Uptime</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((device) => {
                const TypeIcon = typeIcons[device.type];
                const statusCfg = statusConfig[device.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={device.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                          <TypeIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{device.name}</p>
                          <p className="text-xs text-slate-500">{device.id} · FW {device.firmware}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{device.type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{device.location}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", statusCfg.bg, statusCfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Signal className={cn("h-3.5 w-3.5", device.signal > 70 ? "text-emerald-500" : device.signal > 30 ? "text-amber-500" : "text-rose-500")} />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{device.signal}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{device.lastPing}</td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{device.uptime}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-500">
                    No devices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceManager;
