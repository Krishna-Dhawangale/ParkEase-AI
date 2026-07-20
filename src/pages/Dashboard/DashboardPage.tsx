import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car, CheckCircle2, CalendarClock, IndianRupee, Brain, Heart,
  TrendingUp, TrendingDown, Zap, Clock, Activity, BarChart3,
  AlertCircle, ChevronRight, Filter, MoreHorizontal, Download,
  RefreshCw, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockOccupancyData, mockRevenueTrend, mockRecentBookings, mockLiveActivity, mockAdminStats } from '../../lib/data';
import { cn, formatCurrency } from '../../lib/utils';

const kpiCards = [
  {
    title: 'Available Slots',
    value: '143',
    change: '+12',
    changeType: 'positive',
    icon: Car,
    color: 'brand',
    sub: 'of 500 total',
  },
  {
    title: 'Occupied Slots',
    value: '312',
    change: '+8',
    changeType: 'neutral',
    icon: CheckCircle2,
    color: 'danger',
    sub: '62.4% occupancy',
  },
  {
    title: 'Reserved Slots',
    value: '34',
    change: '+3',
    changeType: 'positive',
    icon: CalendarClock,
    color: 'amber',
    sub: 'Next 2 hours',
  },
  {
    title: "Today's Revenue",
    value: '₹48,720',
    change: '+11%',
    changeType: 'positive',
    icon: IndianRupee,
    color: 'success',
    sub: 'vs ₹43,892 yesterday',
  },
  {
    title: "Today's Bookings",
    value: '812',
    change: '+67',
    changeType: 'positive',
    icon: BarChart3,
    color: 'info',
    sub: 'Active sessions: 312',
  },
  {
    title: 'Avg Parking Time',
    value: '2.4 hrs',
    change: '-0.2h',
    changeType: 'positive',
    icon: Clock,
    color: 'brand',
    sub: 'Target: 2.5 hrs',
  },
  {
    title: 'AI Accuracy',
    value: '96.2%',
    change: '+1.2%',
    changeType: 'positive',
    icon: Brain,
    color: 'info',
    sub: 'Last 7 days',
  },
  {
    title: 'Health Score',
    value: '94/100',
    change: '+2',
    changeType: 'positive',
    icon: Heart,
    color: 'success',
    sub: 'Excellent',
  },
];

const statusColors: Record<string, string> = {
  active: 'badge-brand',
  completed: 'badge-success',
  upcoming: 'badge-info',
  cancelled: 'badge-danger',
};

const colorMap = {
  brand: { bg: 'bg-[#0F766E]/10 dark:bg-[#14B8A6]/10', icon: 'text-[#0F766E] dark:text-[#14B8A6]', ring: 'ring-[#0F766E]/20' },
  danger: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400', ring: 'ring-red-200' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200' },
  success: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', ring: 'ring-green-200' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200' },
};

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-hover">
      <p className="text-xs font-semibold text-[#111827] dark:text-white mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : `${entry.value}%`}
        </p>
      ))}
    </div>
  );
};

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="page-shell-wide space-y-6">
      {/* Hero */}
      <div className="page-hero">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#14B8A6]/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="section-kicker">Operations command center</div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
                Good morning, Girish 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#6B7280] dark:text-[#94A3B8] max-w-xl">
                One glance gives you live occupancy, revenue, and AI alerts so you can act before the rush hits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#6B7280] dark:text-[#94A3B8]">
              <span className="badge badge-brand">Live facility sync</span>
              <span className="badge badge-success">96.2% AI accuracy</span>
              <span className="badge badge-info">48 ms refresh</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time range selector */}
            <div className="flex items-center bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 rounded-2xl p-1 backdrop-blur-xl">
            {['today', 'week', 'month'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize',
                  timeRange === range
                    ? 'bg-[#0F766E] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-white'
                )}
              >
                {range}
              </button>
            ))}
            </div>

            <button onClick={handleRefresh} className="btn-ghost">
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </button>

            <button className="btn-secondary hidden sm:flex">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Live alert bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30"
      >
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
          <span className="font-bold">AI Alert:</span> Occupancy expected to reach 94% by 6 PM today. Consider dynamic pricing.
        </p>
        <button className="ml-auto text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 whitespace-nowrap">
          View Insights <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => {
          const colors = colorMap[card.color as keyof typeof colorMap];
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', colors.bg)}>
                  <card.icon className={cn('w-4.5 h-4.5', colors.icon)} size={18} />
                </div>
                <div className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                  card.changeType === 'positive' && 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
                  card.changeType === 'neutral' && 'bg-[#F8FAFC] dark:bg-[#334155] text-[#6B7280]',
                )}>
                  {card.changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111827] dark:text-white mb-0.5">{card.value}</div>
              <div className="text-xs font-medium text-[#6B7280] dark:text-[#94A3B8]">{card.title}</div>
              <div className="text-[11px] text-[#9CA3AF] dark:text-[#475569] mt-1">{card.sub}</div>

              {/* Mini progress bar */}
              {card.title === 'Available Slots' && (
                <div className="mt-3 h-1 bg-[#F8FAFC] dark:bg-[#334155] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '28.6%' }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full bg-[#0F766E]"
                  />
                </div>
              )}
              {card.title === 'Occupied Slots' && (
                <div className="mt-3 h-1 bg-[#F8FAFC] dark:bg-[#334155] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '62.4%' }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full bg-red-500"
                  />
                </div>
              )}
              {card.title === 'AI Accuracy' && (
                <div className="mt-3 h-1 bg-[#F8FAFC] dark:bg-[#334155] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '96.2%' }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] dark:text-white">Live Occupancy Trend</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Today's occupancy and revenue by hour</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0F766E]" />
                <span className="text-xs text-[#6B7280]">Occupancy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-xs text-[#6B7280]">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockOccupancyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#0F766E"
                strokeWidth={2}
                fill="url(#occupancyGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#0F766E' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] dark:text-white">Revenue Trend</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Monthly</p>
            </div>
            <button className="text-xs text-[#0F766E] dark:text-[#14B8A6] font-semibold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockRevenueTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`₹${(Number(v)/1000).toFixed(0)}K`, 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              />
              <Bar dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div>
              <h3 className="font-bold text-[#111827] dark:text-white">Recent Bookings</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Latest parking sessions</p>
            </div>
            <button className="btn-ghost text-xs">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
            {mockRecentBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <Car className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#111827] dark:text-white truncate">{booking.vehicle}</p>
                    <span className="text-[10px] text-[#9CA3AF]">{booking.id}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">{booking.parking} · Slot {booking.slot}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#111827] dark:text-white">₹{booking.amount}</p>
                  <p className="text-[11px] text-[#6B7280]">{booking.time}</p>
                </div>
                <span className={cn('badge', statusColors[booking.status])}>
                  {booking.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2">
              <div className="live-dot" />
              <h3 className="font-bold text-[#111827] dark:text-white">Live Activity</h3>
            </div>
            <Activity className="w-4 h-4 text-[#6B7280]" />
          </div>
          <div className="p-4 space-y-3">
            {mockLiveActivity.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0',
                  activity.type === 'entry' && 'bg-green-50 dark:bg-green-900/20',
                  activity.type === 'exit' && 'bg-red-50 dark:bg-red-900/20',
                  activity.type === 'reserved' && 'bg-blue-50 dark:bg-blue-900/20',
                  activity.type === 'payment' && 'bg-amber-50 dark:bg-amber-900/20',
                )}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] dark:text-white">
                    {activity.type === 'entry' && 'Entered'}
                    {activity.type === 'exit' && 'Exited'}
                    {activity.type === 'reserved' && 'Reserved'}
                    {activity.type === 'payment' && 'Payment'}
                    {' '}· Slot {activity.slot}
                  </p>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] truncate">{activity.vehicle}</p>
                </div>
                <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-5"
      >
        <h3 className="font-bold text-[#111827] dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Zap, label: 'New Booking', color: 'brand', desc: 'Reserve a slot instantly' },
            { icon: Brain, label: 'AI Insights', color: 'info', desc: 'View predictions' },
            { icon: BarChart3, label: 'Analytics', color: 'amber', desc: 'Revenue & trends' },
            { icon: Car, label: 'Digital Twin', color: 'success', desc: 'Live facility view' },
          ].map(action => (
            <button key={action.label} className={cn(
              'p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98]',
              action.color === 'brand' && 'bg-[#0F766E]/5 dark:bg-[#14B8A6]/5 border-[#0F766E]/20',
              action.color === 'info' && 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/20',
              action.color === 'amber' && 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/20',
              action.color === 'success' && 'bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/20',
            )}>
              <action.icon className={cn(
                'w-5 h-5 mb-2',
                action.color === 'brand' && 'text-[#0F766E] dark:text-[#14B8A6]',
                action.color === 'info' && 'text-blue-600 dark:text-blue-400',
                action.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                action.color === 'success' && 'text-green-600 dark:text-green-400',
              )} />
              <p className="text-sm font-semibold text-[#111827] dark:text-white">{action.label}</p>
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
