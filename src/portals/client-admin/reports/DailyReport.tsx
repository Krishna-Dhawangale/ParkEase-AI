import { Download, FileText, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenantStore } from '../../../store';

const DailyReport = () => {
  const { currentTenant } = useTenantStore();
  const isDraft = currentTenant?.status === 'DRAFT' || currentTenant?.status === 'TRIAL';

  return (
    <div className="min-h-screen space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Reports</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate and export operational reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button disabled={isDraft} className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </motion.div>

      <div className="card flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <FileText className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">No reports available</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {isDraft 
            ? "Your facility is currently in DRAFT status. Operational reports will be generated automatically once your facility is LIVE and processing bookings."
            : "No operational data found for the selected date range. Reports are generated at the end of each business day."}
        </p>
      </div>
    </div>
  );
};

export default DailyReport;
