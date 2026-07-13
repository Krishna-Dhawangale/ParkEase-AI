import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Calendar, Clock, Car, Leaf,
  IndianRupee, Star, Users, Zap, Download, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  Legend
} from 'recharts';
import { mockRevenueTrend, mockOccupancyData, mockVehicleTypes } from '../../lib/data';
import { cn } from '../../lib/utils';

const weeklyBookings = [
  { day: 'Mon', bookings: 142 },
  { day: 'Tue', bookings: 168 },
  { day: 'Wed', bookings: 131 },
  { day: 'Thu', bookings: 187 },
  { day: 'Fri', bookings: 224 },
  { day: 'Sat', bookings: 298 },
  { day: 'Sun', bookings: 265 },
];

const peakHours = [
  { time: '6-8 AM', avg: 45, label: 'Morning Rush' },
  { time: '8-10 AM', avg: 78, label: 'Office Hours' },
  { time: '10-12 PM', avg: 65, label: 'Mid Morning' },
  { time: '12-2 PM', avg: 88, label: 'Lunch Peak' },
  { time: '2-4 PM', avg: 60, label: 'Afternoon' },
  { time: '4-6 PM', avg: 82, label: 'Evening Rush' },
  { time: '6-8 PM', avg: 92, label: 'Peak Exit' },
  { time: '8-10 PM', avg: 48, label: 'Night' },
];

const greenMetrics = [
  { month: 'Jan', co2: 320, fuel: 180, score: 72 },
  { month: 'Feb', co2: 380, fuel: 210, score: 76 },
  { month: 'Mar', co2: 345, fuel: 195, score: 74 },
  { month: 'Apr', co2: 420, fuel: 240, score: 81 },
  { month: 'May', co2: 480, fuel: 270, score: 85 },
  { month: 'Jun', co2: 520, fuel: 295, score: 88 },
  { month: 'Jul', co2: 490, fuel: 280, score: 86 },
];

const vehicleColors = ['#0F766E', '#2563EB', '#F59E0B', '#7C3AED', '#6B7280'];

const monthlyComparison = [
  { metric: 'Revenue', current: '₹4.21L', previous: '₹3.78L', change: '+11.3%', positive: true },
  { metric: 'Bookings', current: '7,017', previous: '6,300', change: '+11.4%', positive: true },
  { metric: 'Avg Occupancy', current: '74%', previous: '69%', change: '+5%', positive: true },
  { metric: 'Avg Duration', current: '2.4h', previous: '2.6h', change: '-7.7%', positive: true },
  { metric: 'Customer Rating', current: '4.8', previous: '4.6', change: '+0.2', positive: true },
  { metric: 'CO₂ Saved', current: '490kg', previous: '420kg', change: '+16.7%', positive: true },
];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
            Comprehensive parking intelligence and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl p-1">
            {(['week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                  timeRange === range ? 'bg-[#0F766E] text-white' : 'text-[#6B7280]'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      {/* Monthly Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {monthlyComparison.map((item, i) => (
          <motion.div
            key={item.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-4"
          >
            <div className="text-xs text-[#6B7280] mb-1">{item.metric}</div>
            <div className="text-lg font-bold text-[#111827] dark:text-white">{item.current}</div>
            <div className="flex items-center gap-1 mt-1">
              {item.positive ? (
                <ArrowUpRight className="w-3 h-3 text-green-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600" />
              )}
              <span className={cn('text-xs font-semibold', item.positive ? 'text-green-600' : 'text-red-600')}>
                {item.change}
              </span>
              <span className="text-[10px] text-[#9CA3AF]">vs last</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Daily Bookings */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#111827] dark:text-white">Revenue Trend</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Monthly revenue with bookings overlay</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#0F766E]" /> Revenue</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Bookings</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockRevenueTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} opacity={0.9} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#111827] dark:text-white">Daily Bookings</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">This week's booking distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyBookings} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
              <Bar dataKey="bookings" fill="#14B8A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Peak Hours + Vehicle Types + Green Score */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#0F766E]" />
            <h3 className="font-bold text-[#111827] dark:text-white">Peak Hours</h3>
          </div>
          <div className="space-y-2.5">
            {peakHours.map(h => (
              <div key={h.time}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-[#6B7280]">{h.time}</span>
                  <span className="text-xs font-semibold text-[#111827] dark:text-white">{h.avg}%</span>
                </div>
                <div className="h-2 bg-[#E5E7EB] dark:bg-[#334155] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${h.avg}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className={cn('h-full rounded-full', h.avg > 85 ? 'bg-red-500' : h.avg > 60 ? 'bg-amber-500' : 'bg-green-500')}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vehicle Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-[#111827] dark:text-white">Vehicle Types</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={mockVehicleTypes}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="count"
                label={({ name, percentage }: any) => `${name} ${percentage}%`}
                labelLine={false}
                fontSize={9}
              >
                {mockVehicleTypes.map((_, i) => (
                  <Cell key={i} fill={vehicleColors[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {mockVehicleTypes.map((v, i) => (
              <div key={v.name} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: vehicleColors[i] }} />
                <span className="text-[11px] text-[#6B7280]">{v.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Green Score Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-4 h-4 text-green-600" />
            <h3 className="font-bold text-[#111827] dark:text-white">Green Impact</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={greenMetrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
              <Line type="monotone" dataKey="co2" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} name="CO₂ Saved (kg)" />
              <Line type="monotone" dataKey="fuel" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Fuel Saved (L)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-green-600" /><span className="text-[11px] text-[#6B7280]">CO₂</span></div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-blue-600" /><span className="text-[11px] text-[#6B7280]">Fuel</span></div>
          </div>
        </motion.div>
      </div>

      {/* Customer Ratings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="font-bold text-[#111827] dark:text-white">Customer Ratings</h3>
          </div>
          <span className="badge badge-brand">4.8 average</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[
            { stars: 5, count: 4218, pct: 68 },
            { stars: 4, count: 1421, pct: 23 },
            { stars: 3, count: 372, pct: 6 },
            { stars: 2, count: 124, pct: 2 },
            { stars: 1, count: 62, pct: 1 },
          ].map(rating => (
            <div key={rating.stars} className="space-y-1">
              <div className="flex items-center justify-center gap-0.5">
                <span className="text-xs font-semibold text-[#111827] dark:text-white">{rating.stars}</span>
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              </div>
              <div className="h-16 bg-[#E5E7EB] dark:bg-[#334155] rounded-lg overflow-hidden flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${rating.pct}%` }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="w-full bg-[#F59E0B] rounded-t-lg"
                />
              </div>
              <div className="text-center text-[10px] text-[#6B7280]">{rating.pct}%</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
