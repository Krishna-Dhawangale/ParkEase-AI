import { Link } from 'react-router-dom';
import { Server } from 'lucide-react';
import type { SADashboardSystemHealth } from '../../types/super-admin.types';

interface Props {
  health: SADashboardSystemHealth[];
}

export function SystemHealthList({ health }: Props) {
  return (
    <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm">
      <div>
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-5">System Health</h2>
        <div className="flex flex-col gap-4">
          {health.map((svc, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Server className="w-[18px] h-[18px] stroke-[1.5]" />
                <span className="text-[13px]">{svc.service}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${
                  svc.status === 'Operational' ? 'bg-emerald-500' :
                  svc.status === 'Degraded' ? 'bg-amber-500' :
                  svc.status === 'Offline' ? 'bg-red-500' :
                  'bg-slate-300 dark:bg-slate-600'
                }`}></div>
                <span className={`text-[12px] font-medium ${
                  svc.status === 'Operational' ? 'text-emerald-600 dark:text-emerald-400' :
                  svc.status === 'Degraded' ? 'text-amber-600 dark:text-amber-400' :
                  svc.status === 'Offline' ? 'text-red-600 dark:text-red-400' :
                  'text-slate-500'
                }`}>
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/super-admin/system-health" className="text-[13px] text-brand-600 hover:text-brand-700 font-medium flex items-center mt-6">
        View all system statuses <span className="ml-1">→</span>
      </Link>
    </div>
  );
}
