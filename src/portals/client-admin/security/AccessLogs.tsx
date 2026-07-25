import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Download, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useTenantStore } from '../../../store';
import { cn } from '../../../lib/utils';

type AccessStatus = 'GRANTED' | 'DENIED' | 'PENDING';
type AccessType = 'ENTRY' | 'EXIT' | 'MANUAL_OVERRIDE';

interface AccessLog {
  id: string;
  timestamp: string;
  type: AccessType;
  vehicle: string;
  credentialType: 'OTP' | 'QR' | 'ALPR' | 'MANUAL';
  camera: string;
  status: AccessStatus;
  reason?: string;
}

const mockLogs: AccessLog[] = [];

const statusConfig: Record<AccessStatus, { color: string; bg: string; icon: any }> = {
  GRANTED: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: CheckCircle2 },
  DENIED: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', icon: XCircle },
  PENDING: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: ShieldAlert },
};

const AccessLogs = () => {
  const { currentTenant } = useTenantStore();
  const isDraft = currentTenant?.status === 'DRAFT' || currentTenant?.status === 'TRIAL';
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | AccessType>('All');

  const filteredLogs = mockLogs.filter((log) => {
    const matchSearch = log.vehicle.toLowerCase().includes(search.toLowerCase()) || log.id.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || log.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Access Logs</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor barrier events, OTP/QR validations, and ALPR reads.</p>
        </div>
        <div className="flex gap-3">
          <button disabled={isDraft} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'ENTRY', 'EXIT', 'MANUAL_OVERRIDE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterType === type
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-72"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Event ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Credential</th>
                <th className="px-6 py-4">Camera / Device</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => {
                const sc = statusConfig[log.status];
                const Icon = sc.icon;
                return (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{log.id}</td>
                    <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{log.type}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{log.vehicle}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {log.credentialType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{log.camera}</td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <div className="flex items-center gap-2">
                        {log.reason && <span className="text-[11px] text-slate-400">{log.reason}</span>}
                        <span className={cn("flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", sc.bg, sc.color)}>
                          <Icon className="h-3 w-3" />
                          {log.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <Shield className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No Access Logs</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {isDraft 
                          ? "Logs will appear here once your facility is live and users begin authenticating at the entry/exit barriers." 
                          : "No barrier access events recorded for this facility."}
                      </p>
                    </div>
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

export default AccessLogs;
