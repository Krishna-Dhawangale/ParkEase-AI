import { Link } from 'react-router-dom';
import { WifiOff, AlertTriangle, CheckSquare, CreditCard, ShieldAlert, BellRing } from 'lucide-react';
import type { SADashboardAlert } from '../../types/super-admin.types';
import { SAEmptyState } from '../SAEmptyState';
import { cn } from '../../../../lib/utils';

interface Props {
  alerts: SADashboardAlert[];
}

export function RecentAlertsList({ alerts }: Props) {
  const hasAlerts = alerts.length > 0;

  const getAlertIcon = (type: SADashboardAlert['type']) => {
    switch (type) {
      case 'DIGITAL_TWIN': return WifiOff;
      case 'DEVICE': return AlertTriangle;
      case 'APPROVAL': return CheckSquare;
      case 'SUBSCRIPTION':
      case 'PAYMENT': return CreditCard;
      case 'SECURITY': return ShieldAlert;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (severity: SADashboardAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH': return 'text-red-500';
      case 'WARNING': return 'text-amber-500';
      case 'INFO': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">Recent Alerts</h2>
        {hasAlerts && (
          <Link to="/super-admin/operations" className="text-[12px] text-brand-600 hover:text-brand-700 font-medium">
            View all
          </Link>
        )}
      </div>
      
      <div className="flex flex-col gap-5 flex-1">
        {hasAlerts ? (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const color = getAlertColor(alert.severity);
            
            return (
              <div key={alert.id} className="flex gap-3 items-start">
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0 stroke-[2]", color)} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-slate-700 dark:text-slate-300 leading-tight">{alert.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{alert.resource}</div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap ml-2">
                  {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <SAEmptyState 
              icon={BellRing}
              title="No alerts"
              description="System is healthy. No action required."
            />
          </div>
        )}
      </div>
    </div>
  );
}
