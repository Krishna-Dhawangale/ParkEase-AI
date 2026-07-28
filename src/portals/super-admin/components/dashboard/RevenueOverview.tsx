import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SADashboardData } from '../../types/super-admin.types';
import { SAEmptyState } from '../SAEmptyState';
import { CreditCard } from 'lucide-react';

interface Props {
  revenue: SADashboardData['revenue'];
}

export function RevenueOverview({ revenue }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const hasData = revenue.history && revenue.history.length > 0;

  return (
    <div className="xl:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">SaaS Revenue Overview</h2>
        <div className="text-xs text-slate-500 border border-slate-200 dark:border-slate-800 rounded px-2 py-1">
          Selected Period
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px] flex flex-col justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenue.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}K`} />
              <Tooltip cursor={{ stroke: '#cbd5e1' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <SAEmptyState 
            icon={CreditCard}
            title="No revenue yet"
            description="No SaaS revenue recorded for this period."
            action={<button className="text-[12px] font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded transition-colors">View Plans</button>}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <div>
          <div className="text-[11px] text-slate-500 font-medium mb-1">Total Revenue</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(revenue.currentPeriod)}</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-medium mb-1">Paid Invoices</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{revenue.paid}</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-medium mb-1">Pending Invoices</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{revenue.outstanding}</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-medium mb-1">Overdue Invoices</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{revenue.overdue}</div>
        </div>
      </div>
    </div>
  );
}
