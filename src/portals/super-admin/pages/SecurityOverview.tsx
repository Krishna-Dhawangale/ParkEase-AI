import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';

export function SecurityOverview() {
  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Security Overview" 
        description="Monitor platform security posture, active threats, and access anomalies."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Platform Security Score</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">98/100</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Active Staff Sessions</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">24</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Failed Logins (24h)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Active Threats</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 text-center text-slate-500 min-h-[300px] flex items-center justify-center">
        Detailed security logs and threat intelligence charts will appear here.
      </div>
    </div>
  );
}
