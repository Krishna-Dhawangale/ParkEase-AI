import { motion } from 'framer-motion';
import { useTenantStore } from '../../../store';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Car,
  CalendarCheck,
  Clock,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '../../../lib/utils';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', revenue: 185000, bookings: 1240 },
  { month: 'Feb', revenue: 210000, bookings: 1380 },
  { month: 'Mar', revenue: 245000, bookings: 1520 },
  { month: 'Apr', revenue: 228000, bookings: 1450 },
  { month: 'May', revenue: 262000, bookings: 1680 },
  { month: 'Jun', revenue: 298000, bookings: 1820 },
  { month: 'Jul', revenue: 315000, bookings: 1950 },
  { month: 'Aug', revenue: 288000, bookings: 1780 },
  { month: 'Sep', revenue: 340000, bookings: 2100 },
  { month: 'Oct', revenue: 365000, bookings: 2280 },
  { month: 'Nov', revenue: 392000, bookings: 2400 },
  { month: 'Dec', revenue: 425000, bookings: 2580 },
];

const dailyOccupancy = [
  { day: 'Mon', avg: 72, peak: 94 },
  { day: 'Tue', avg: 68, peak: 89 },
  { day: 'Wed', avg: 75, peak: 92 },
  { day: 'Thu', avg: 78, peak: 96 },
  { day: 'Fri', avg: 85, peak: 98 },
  { day: 'Sat', avg: 92, peak: 100 },
  { day: 'Sun', avg: 65, peak: 82 },
];

const vehicleDistribution = [
  { name: 'Sedan', value: 42, color: '#3B82F6' },
  { name: 'SUV', value: 28, color: '#8B5CF6' },
  { name: 'Hatchback', value: 18, color: '#10B981' },
  { name: 'Bike', value: 8, color: '#F59E0B' },
  { name: 'Other', value: 4, color: '#6B7280' },
];

const sourceData = [
  { name: 'Mobile App', value: 58, color: '#3B82F6' },
  { name: 'Web Portal', value: 22, color: '#8B5CF6' },
  { name: 'Walk-in', value: 15, color: '#10B981' },
  { name: 'Partner API', value: 5, color: '#F59E0B' },
];

const hourlyPattern = [
  { hour: '6AM', entries: 12, exits: 3 },
  { hour: '7AM', entries: 28, exits: 5 },
  { hour: '8AM', entries: 45, exits: 8 },
  { hour: '9AM', entries: 38, exits: 12 },
  { hour: '10AM', entries: 22, exits: 15 },
  { hour: '11AM', entries: 18, exits: 14 },
  { hour: '12PM', entries: 20, exits: 18 },
  { hour: '1PM', entries: 15, exits: 20 },
  { hour: '2PM', entries: 12, exits: 16 },
  { hour: '3PM', entries: 10, exits: 14 },
  { hour: '4PM', entries: 8, exits: 22 },
  { hour: '5PM', entries: 5, exits: 35 },
  { hour: '6PM', entries: 4, exits: 28 },
  { hour: '7PM', entries: 3, exits: 18 },
  { hour: '8PM', entries: 2, exits: 12 },
];

// ─── Component ──────────────────────────────────────────────────────────────────

const AnalyticsDashboard = () => {
  const { currentTenant } = useTenantStore();
  const isDraft = currentTenant?.status === 'DRAFT' || currentTenant?.status === 'TRIAL';

  // For a new tenant, use empty data
  const revData = isDraft ? [] : revenueData;
  const occData = isDraft ? [] : dailyOccupancy;
  const vehData = isDraft ? [] : vehicleDistribution;
  const srcData = isDraft ? [] : sourceData;
  const hrData = isDraft ? [] : hourlyPattern;

  const kpis = isDraft ? [
    { label: 'Total Revenue', value: '₹0', change: '0%', up: true, icon: IndianRupee, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Total Bookings', value: '0', change: '0%', up: true, icon: CalendarCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Avg Occupancy', value: '0%', change: '0%', up: true, icon: Car, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Avg Duration', value: '0m', change: '0m', up: true, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ] : [
    { label: 'Total Revenue', value: '₹33,53,000', change: '+22.4%', up: true, icon: IndianRupee, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Total Bookings', value: '22,180', change: '+18.6%', up: true, icon: CalendarCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Avg Occupancy', value: '76%', change: '+5.2%', up: true, icon: Car, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Avg Duration', value: '2h 42m', change: '-8m', up: false, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track performance metrics, trends, and operational insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 md:flex">
            <Calendar className="h-3.5 w-3.5" />
            Last 30 days
          </button>
          <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:bg-blue-800 sm:flex">
            <Download className="h-3.5 w-3.5" />
            Download Report
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", kpi.bg)}>
                  <Icon className={cn("h-4 w-4", kpi.color)} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{kpi.value}</h3>
                <span className={cn("flex items-center text-xs font-semibold", kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                  {kpi.up ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Revenue Trend</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monthly revenue for the current year</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            {revData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Insufficient data to calculate trends</div>
            )}
          </div>
        </div>

        {/* Vehicle Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Vehicle Distribution</h2>
          <div className="h-[200px] w-full">
            {vehData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vehData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={2} stroke="#fff">
                    {vehData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No vehicle data</div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {vehData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Occupancy by Day */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Weekly Occupancy</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average vs Peak occupancy by day</p>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {occData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="avg" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Average" />
                  <Bar dataKey="peak" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Peak" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Insufficient data to calculate trends</div>
            )}
          </div>
        </div>

        {/* Entry/Exit Pattern */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Entry / Exit Pattern</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hourly traffic flow today</p>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {hrData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="entryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="exitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="entries" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#entryGrad)" name="Entries" />
                  <Area type="monotone" dataKey="exits" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#exitGrad)" name="Exits" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Insufficient data to calculate trends</div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Source Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Booking Sources</h2>
        {srcData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {srcData.map((source) => (
              <div key={source.name} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{source.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{source.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${source.value}%`, backgroundColor: source.color }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-sm text-slate-500">Insufficient data to calculate trends</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
