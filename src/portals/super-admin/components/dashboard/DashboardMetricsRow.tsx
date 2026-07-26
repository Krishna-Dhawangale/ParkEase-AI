import { 
  Building2, Server, CheckSquare, CreditCard, Wifi, FileText
} from 'lucide-react';
import { SAMetric } from '../SAMetric';
import type { SADashboardData } from '../../types/super-admin.types';

interface Props {
  data: SADashboardData;
}

export function DashboardMetricsRow({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <SAMetric 
        label="Organizations" 
        value={data.organizations.total.toString()}
        iconContainerClass="bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400"
        prefix={<Building2 className="w-5 h-5 stroke-[1.5]" />} 
      />
      <SAMetric 
        label="Active Subscriptions" 
        value={data.subscriptions.active.toString()}
        iconContainerClass="bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400"
        prefix={<FileText className="w-5 h-5 stroke-[1.5]" />} 
      />
      <SAMetric 
        label="Total Facilities" 
        value={data.facilities.total.toString()}
        iconContainerClass="bg-purple-50 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400"
        prefix={<Server className="w-5 h-5 stroke-[1.5]" />} 
      />
      <SAMetric 
        label="Live Facilities" 
        value={data.facilities.live.toString()}
        iconContainerClass="bg-green-50 text-green-500 dark:bg-green-900/30 dark:text-green-400"
        prefix={<Wifi className="w-5 h-5 stroke-[1.5]" />} 
      />
      <SAMetric 
        label="Pending Approvals" 
        value={data.facilities.pendingApproval.toString()}
        iconContainerClass="bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400"
        prefix={<CheckSquare className="w-5 h-5 stroke-[1.5]" />} 
      />
      <SAMetric 
        label="SaaS Revenue" 
        value={formatCurrency(data.revenue.currentPeriod)}
        iconContainerClass="bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400"
        prefix={<CreditCard className="w-5 h-5 stroke-[1.5]" />} 
      />
    </div>
  );
}
