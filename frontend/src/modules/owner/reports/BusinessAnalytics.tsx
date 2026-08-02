import React from 'react';
import { BarChart3, Download, TrendingUp, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockMonthlyData = [
  { month: 'Jan', revenue: 142000, occupancy: 72 },
  { month: 'Feb', revenue: 168000, occupancy: 78 },
  { month: 'Mar', revenue: 195000, occupancy: 84 },
  { month: 'Apr', revenue: 210000, occupancy: 88 },
  { month: 'May', revenue: 245000, occupancy: 91 },
  { month: 'Jun', revenue: 284500, occupancy: 94 },
];

export const BusinessAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-txt-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-bdr shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Business Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Facility Financial & Occupancy Analytics</h1>
          <p className="text-xs text-txt-secondary mt-1">Detailed earnings breakdown, peak hour occupancy curves, vehicle distribution, and PDF/CSV reports.</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-bg-elevated hover:bg-bg-hover text-xs font-semibold text-txt-secondary border border-bdr flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
          <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40">
            <Download className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-bg-card border border-bdr space-y-4">
        <h3 className="font-bold text-txt-primary text-base">Monthly Gross Revenue & Occupancy Growth</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '12px' }} />
            <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
