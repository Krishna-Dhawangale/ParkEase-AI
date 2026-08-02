import { 
  Building2, Server, CheckSquare, CreditCard, Wifi, FileText
} from 'lucide-react';
import { SAMetric } from '../SAMetric';
import type { SADashboardData } from '../../types/super-admin.types';
import { BentoGrid, BentoGridItem } from '../../../../components/magicui/bento-grid';

interface Props {
  data: SADashboardData;
}

export function DashboardMetricsRow({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <BentoGrid className="grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 max-w-none">
      <BentoGridItem 
        title="Organizations" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{data.organizations.total}</div>}
        icon={<div className="bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-lg inline-flex"><Building2 className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
      <BentoGridItem 
        title="Active Subscriptions" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{data.subscriptions.active}</div>}
        icon={<div className="bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400 p-2 rounded-lg inline-flex"><FileText className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
      <BentoGridItem 
        title="Total Facilities" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{data.facilities.total}</div>}
        icon={<div className="bg-purple-50 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400 p-2 rounded-lg inline-flex"><Server className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
      <BentoGridItem 
        title="Live Facilities" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{data.facilities.live}</div>}
        icon={<div className="bg-green-50 text-green-500 dark:bg-green-900/30 dark:text-green-400 p-2 rounded-lg inline-flex"><Wifi className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
      <BentoGridItem 
        title="Pending Approvals" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{data.facilities.pendingApproval}</div>}
        icon={<div className="bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400 p-2 rounded-lg inline-flex"><CheckSquare className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
      <BentoGridItem 
        title="SaaS Revenue" 
        header={<div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(data.revenue.currentPeriod)}</div>}
        icon={<div className="bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-lg inline-flex"><CreditCard className="w-5 h-5 stroke-[1.5]" /></div>} 
      />
    </BentoGrid>
  );
}
