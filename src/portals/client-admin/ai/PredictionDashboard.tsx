import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Clock, EyeOff, Search, ChevronRight, Activity } from 'lucide-react';
import { useTenantStore } from '../../../store';
import { cn } from '../../../lib/utils';

type ConflictStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

interface OccupancyConflict {
  id: string;
  slot: string;
  expectedVehicle: string;
  detectedVehicle: string;
  time: string;
  camera: string;
  status: ConflictStatus;
}

const mockConflicts: OccupancyConflict[] = [];

const PredictionDashboard = () => {
  const { currentTenant } = useTenantStore();
  const isDraft = currentTenant?.status === 'DRAFT' || currentTenant?.status === 'TRIAL';
  
  const [filterStatus, setFilterStatus] = useState<'All' | ConflictStatus>('All');
  const [search, setSearch] = useState('');

  const filteredConflicts = mockConflicts.filter((c) => {
    const matchSearch = c.slot.toLowerCase().includes(search.toLowerCase()) || c.expectedVehicle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Operations</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor computer vision events, anomalies, and observed operational risks.</p>
        </div>
      </motion.div>

      {/* Intelligence Summary Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Occupancy Conflicts</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">0</h3>
          <p className="mt-1 text-xs text-slate-500">Observed mismatch in slots</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Overstay Detection</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">0</h3>
          <p className="mt-1 text-xs text-slate-500">Vehicles beyond grace period</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Camera Anomalies</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <EyeOff className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">0</h3>
          <p className="mt-1 text-xs text-slate-500">Vision obstructed or offline</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Capacity Forecast</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Low Risk</h3>
          <p className="mt-1 text-xs text-slate-500">Predicted for next 4 hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Main Conflicts Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Observed Conflicts</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search slot or vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Slot</th>
                    <th className="px-6 py-4">Expected</th>
                    <th className="px-6 py-4">Detected</th>
                    <th className="px-6 py-4">Camera</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredConflicts.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-slate-500">{c.time}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.slot}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.expectedVehicle}</td>
                      <td className="px-6 py-4 font-medium text-rose-600 dark:text-rose-400">{c.detectedVehicle}</td>
                      <td className="px-6 py-4 text-slate-500">{c.camera}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                          c.status === 'OPEN' ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" :
                          c.status === 'ACKNOWLEDGED' ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredConflicts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="mx-auto max-w-sm">
                          <Brain className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No active anomalies</h3>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {isDraft ? "AI Operations will begin analyzing camera feeds once the facility is LIVE." : "All systems normal. No occupancy conflicts or anomalies detected at this time."}
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

        {/* Operational Recommendations */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Operational Recommendations</h2>
          <div className="card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Brain className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gathering Intelligence</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {isDraft 
                ? "Recommendations will appear after your facility goes live and begins processing bookings." 
                : "Not enough historical data to provide confident recommendations. Check back after 7 days of operation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboard;
