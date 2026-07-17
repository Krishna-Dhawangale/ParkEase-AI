import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Camera,
  ShieldAlert,
  Wifi,
  CreditCard,
  Brain,
  MoreHorizontal,
} from 'lucide-react';
import { recentAlerts, type AlertPriority, type AlertStatus, type AlertType } from './data';

// ─── Priority Styles ────────────────────────────────────────────────────────────

const priorityStyles: Record<AlertPriority, string> = {
  Critical: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  High:     'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  Medium:   'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Low:      'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400',
};

// ─── Status Styles ──────────────────────────────────────────────────────────────

const alertStatusStyles: Record<AlertStatus, string> = {
  Active:       'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  Acknowledged: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  Resolved:     'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
};

// ─── Alert Icon Map ─────────────────────────────────────────────────────────────

const alertIconMap: Record<AlertType, { icon: React.ElementType; color: string; bg: string }> = {
  'Parking Full':   { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  'Camera Offline': { icon: Camera, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  'Barrier Error':  { icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'Sensor Offline': { icon: Wifi, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700/50' },
  'Payment Failed': { icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  'AI Warning':     { icon: Brain, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
};

// ─── Recent Alerts ──────────────────────────────────────────────────────────────

const RecentAlerts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Alerts</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {recentAlerts.filter((a) => a.status === 'Active').length} active alerts
            </p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Alert List */}
      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
        {recentAlerts.map((alert, index) => {
          const { icon: AlertIcon, color, bg } = alertIconMap[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.04 }}
              className="flex items-start gap-3 px-6 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
            >
              {/* Icon */}
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <AlertIcon className={`h-4 w-4 ${color}`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {alert.type}
                  </p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[alert.priority]}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {alert.message}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {alert.timestamp}
                  </span>
                  <span className="text-[11px] text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {alert.location}
                  </span>
                </div>
              </div>

              {/* Status */}
              <span className={`mt-1 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${alertStatusStyles[alert.status]}`}>
                {alert.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentAlerts;
