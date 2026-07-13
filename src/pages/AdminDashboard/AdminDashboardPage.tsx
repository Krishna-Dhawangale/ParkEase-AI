import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Activity, Camera, BarChart3, TrendingUp, AlertTriangle,
  Users, Zap, Car, Clock, Brain, Heart, Eye, ChevronRight,
  CheckCircle2, XCircle, RefreshCw, Download, Bell, Layers,
  IndianRupee, Thermometer, Wifi, WifiOff, Lock, Unlock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { mockAdminStats, mockOccupancyData, mockLiveActivity } from '../../lib/data';
import { cn } from '../../lib/utils';

const occupancyDistribution = [
  { name: 'Occupied', value: 312, color: '#DC2626' },
  { name: 'Available', value: 143, color: '#16A34A' },
  { name: 'Reserved', value: 34, color: '#F59E0B' },
  { name: 'Maintenance', value: 11, color: '#6B7280' },
];

const floorOccupancy = [
  { floor: 'GF', occupancy: 89, total: 120 },
  { floor: 'F1', occupancy: 76, total: 130 },
  { floor: 'F2', occupancy: 82, total: 130 },
  { floor: 'F3', occupancy: 34, total: 120 },
];

const alerts = [
  { id: 1, type: 'conflict', title: 'Double Booking Detected', desc: 'Slot C-15 has overlapping reservations. Auto-resolved.', time: '2m ago', severity: 'high' },
  { id: 2, type: 'camera', title: 'Camera 7 Offline', desc: 'Floor 2, Section D. Investigating...', time: '8m ago', severity: 'medium' },
  { id: 3, type: 'barrier', title: 'Exit Barrier Slow Response', desc: 'Gate 2 response time: 4.2s (normal: <2s).', time: '15m ago', severity: 'low' },
  { id: 4, type: 'ai', title: 'AI Model Retrained', desc: 'Accuracy improved from 94.8% to 96.2%.', time: '1h ago', severity: 'info' },
];

const employeeActivity = [
  { name: 'Ravi S.', role: 'Gate Operator', status: 'online', action: 'Monitoring Entry Gate', time: '2m ago' },
  { name: 'Priya M.', role: 'Security', status: 'online', action: 'Floor 2 patrol', time: '5m ago' },
  { name: 'Suresh K.', role: 'Maintenance', status: 'offline', action: 'Shift ended', time: '1h ago' },
  { name: 'Anita R.', role: 'Admin', status: 'online', action: 'Reviewing reports', time: 'Now' },
];

export function AdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const stats = mockAdminStats;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5">
              <span className="live-dot" /> Live monitoring · Central Metro Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="btn-ghost">
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-primary">
            <Bell className="w-4 h-4" /> Alert Settings
          </button>
        </div>
      </div>

      {/* System Health Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-green-600" />
          <span className="font-bold text-[#111827] dark:text-white">System Health:</span>
          <span className="text-lg font-bold text-green-600">{stats.healthScore}/100</span>
        </div>
        <div className="h-2 flex-1 min-w-32 bg-[#E5E7EB] dark:bg-[#334155] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.healthScore}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            { label: 'Cameras', value: `${stats.cameras}/${stats.cameras}`, ok: true },
            { label: 'Barriers', value: `${stats.barriers}/${stats.barriers}`, ok: true },
            { label: 'AI Engine', value: 'Online', ok: true },
            { label: 'Payment', value: 'Online', ok: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              {item.ok ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
              <span className="text-[#6B7280]">{item.label}: <span className={cn('font-semibold', item.ok ? 'text-green-600' : 'text-red-600')}>{item.value}</span></span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Car, label: 'Total Slots', value: stats.totalSlots, color: 'brand' },
          { icon: CheckCircle2, label: 'Occupied', value: stats.occupied, color: 'danger' },
          { icon: Zap, label: 'Available', value: stats.available, color: 'success' },
          { icon: IndianRupee, label: "Today's Revenue", value: `₹${(stats.todayRevenue / 1000).toFixed(1)}K`, color: 'amber' },
          { icon: Brain, label: 'AI Accuracy', value: `${stats.aiAccuracy}%`, color: 'info' },
          { icon: Clock, label: 'Avg Time', value: `${stats.avgParkingTime}h`, color: 'brand' },
        ].map((kpi, i) => {
          const colorMap: Record<string, string> = {
            brand: 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]',
            danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
            info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
          };
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-4 text-center"
            >
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2', colorMap[kpi.color]?.split(' ').slice(0, 2).join(' '))}>
                <kpi.icon className={cn('w-4 h-4', colorMap[kpi.color]?.split(' ').slice(2).join(' '))} />
              </div>
              <div className="text-xl font-bold text-[#111827] dark:text-white">{kpi.value}</div>
              <div className="text-[11px] text-[#6B7280]">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Occupancy Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <h3 className="font-bold text-[#111827] dark:text-white mb-4">Slot Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={occupancyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {occupancyDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, name: string) => [`${v} slots`, name]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {occupancyDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-[#6B7280]">{d.name}: <span className="font-semibold text-[#111827] dark:text-white">{d.value}</span></span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#111827] dark:text-white">Live Occupancy & Revenue</h3>
            <span className="badge badge-brand">Today</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockOccupancyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="adminOccGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
              <Area type="monotone" dataKey="occupancy" stroke="#0F766E" strokeWidth={2} fill="url(#adminOccGrad)" dot={false} name="Occupancy %" />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fill="url(#adminRevGrad)" dot={false} name="Revenue ₹" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Floor Heatmap + Alerts + Staff */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Floor Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-[#0F766E]" />
            <h3 className="font-bold text-[#111827] dark:text-white">Floor Occupancy</h3>
          </div>
          <div className="space-y-3">
            {floorOccupancy.map(f => {
              const pct = Math.round((f.occupancy / f.total) * 100);
              return (
                <div key={f.floor}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#111827] dark:text-white">{f.floor}</span>
                    <span className="text-xs text-[#6B7280]">{f.occupancy}/{f.total} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-[#E5E7EB] dark:bg-[#334155] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className={cn('h-full rounded-full', pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-green-500')}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">AI Insight</span>
            </div>
            <p className="text-xs text-amber-600/80 mt-1">Floor 3 is underutilized (28%). Redirect signage from entry can improve by 28%.</p>
          </div>
        </motion.div>

        {/* Conflict & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-[#111827] dark:text-white">Alerts</h3>
            </div>
            <span className="badge badge-warning">{alerts.length} active</span>
          </div>
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="px-5 py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    alert.severity === 'high' && 'bg-red-500',
                    alert.severity === 'medium' && 'bg-amber-500',
                    alert.severity === 'low' && 'bg-blue-500',
                    alert.severity === 'info' && 'bg-green-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#111827] dark:text-white">{alert.title}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{alert.desc}</p>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Employee Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0F766E]" />
              <h3 className="font-bold text-[#111827] dark:text-white">Staff Activity</h3>
            </div>
            <span className="text-xs text-[#6B7280]">3 online</span>
          </div>
          <div className="p-4 space-y-3">
            {employeeActivity.map((emp, i) => (
              <motion.div
                key={emp.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 flex items-center justify-center text-xs font-bold text-[#0F766E] dark:text-[#14B8A6]">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1E293B]',
                    emp.status === 'online' ? 'bg-green-500' : 'bg-[#9CA3AF]'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] dark:text-white">{emp.name} · <span className="text-[#6B7280] font-normal">{emp.role}</span></p>
                  <p className="text-[11px] text-[#6B7280] truncate">{emp.action}</p>
                </div>
                <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">{emp.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security & Barriers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5"
      >
        <h3 className="font-bold text-[#111827] dark:text-white mb-4">Security & Access Control</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Entry Gate 1', status: 'Open', icon: Unlock, color: 'success' },
            { label: 'Entry Gate 2', status: 'Open', icon: Unlock, color: 'success' },
            { label: 'Exit Gate 1', status: 'Open', icon: Unlock, color: 'success' },
            { label: 'Exit Gate 2', status: 'Maintenance', icon: Lock, color: 'amber' },
          ].map(gate => (
            <div key={gate.label} className={cn(
              'p-3 rounded-xl border text-center',
              gate.color === 'success' && 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/20',
              gate.color === 'amber' && 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/20',
            )}>
              <gate.icon className={cn(
                'w-5 h-5 mx-auto mb-2',
                gate.color === 'success' && 'text-green-600',
                gate.color === 'amber' && 'text-amber-600',
              )} />
              <div className="text-xs font-semibold text-[#111827] dark:text-white">{gate.label}</div>
              <div className={cn(
                'text-[11px] font-bold mt-0.5',
                gate.color === 'success' && 'text-green-600',
                gate.color === 'amber' && 'text-amber-600',
              )}>{gate.status}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
