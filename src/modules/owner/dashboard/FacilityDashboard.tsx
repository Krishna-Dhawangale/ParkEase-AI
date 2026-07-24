import React from 'react';
import { motion } from 'framer-motion';
import {
  Car, IndianRupee, Clock, CheckCircle2, AlertTriangle, Zap,
  TrendingUp, Activity, ShieldCheck, Wrench, ChevronRight,
  Brain, BarChart3, Lock, Unlock, Thermometer, Sparkles, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

const mockOccupancy = [
  { time: '08:00', occupancy: 42, revenue: 3400 },
  { time: '10:00', occupancy: 68, revenue: 6800 },
  { time: '12:00', occupancy: 85, revenue: 11200 },
  { time: '14:00', occupancy: 78, revenue: 9800 },
  { time: '16:00', occupancy: 92, revenue: 14500 },
  { time: '18:00', occupancy: 96, revenue: 16800 },
  { time: '20:00', occupancy: 64, revenue: 8400 },
];

export const FacilityDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Facility Management Portal
            </span>
            <span className="text-xs text-slate-400">Downtown Central Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Operations Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time facility telemetry, active bookings, and automated barrier operations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            Refresh Telemetry
          </button>
          <button 
            onClick={() => navigate('/owner/digital-twin')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Launch Twin Builder
          </button>
        </div>
      </div>

      {/* Operator KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Today's Revenue", value: "₹48,720", sub: "+12.4% vs yesterday", icon: IndianRupee, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { title: "Weekly Revenue", value: "₹284,500", sub: "Target ₹300,000", icon: TrendingUp, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { title: "Active Bookings", value: "312 / 500", sub: "62.4% live occupancy", icon: Car, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { title: "Avg Parking Duration", value: "2.4 hrs", sub: "Optimal turnover", icon: Clock, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
          { title: "Facility AI Health", value: "96/100", sub: "All sensors online", icon: Brain, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { title: "Customer Satisfaction", value: "4.8 ★", sub: "From 1,240 reviews", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { title: "Active Maintenance Alerts", value: "2 Pending", sub: "Sensor #42 & Barrier Gate 2", icon: Wrench, color: "text-red-400 bg-red-500/10 border-red-500/20" },
          { title: "EV Charging Stations", value: "8 / 10 Active", sub: "80% utilization", icon: Zap, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", kpi.color)}>
                <kpi.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{kpi.sub}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mb-1">{kpi.value}</div>
            <div className="text-xs text-slate-400 font-medium">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid — Charts & Live Gate Telemetry */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Occupancy & Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Live Facility Occupancy & Hourly Revenue</h3>
              <p className="text-xs text-slate-400">Hourly load metrics across Floor GF, F1, F2, F3</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Today</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockOccupancy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="opOccGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="occupancy" stroke="#10B981" strokeWidth={2.5} fill="url(#opOccGrad)" name="Occupancy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gate Barriers Control Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Gate Barrier Remote Control</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">ANPR Synced</span>
          </div>

          <div className="space-y-3">
            {[
              { gate: 'Entry Gate 1 (North)', status: 'OPEN', color: 'emerald', time: '<1.2s response' },
              { gate: 'Entry Gate 2 (South)', status: 'OPEN', color: 'emerald', time: '<1.4s response' },
              { gate: 'Exit Gate 1 (North)', status: 'OPEN', color: 'emerald', time: '<1.1s response' },
              { gate: 'Exit Gate 2 (South)', status: 'MAINTENANCE', color: 'amber', time: 'Slow barrier arm' },
            ].map(g => (
              <div key={g.gate} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div>
                  <p className="text-xs font-semibold text-white">{g.gate}</p>
                  <p className="text-[10px] text-slate-400">{g.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    g.color === 'emerald' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {g.status}
                  </span>
                  <button className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs">
                    {g.status === 'OPEN' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/owner/security')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            Open Full Security Operations
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Dynamic Pricing Suggestion Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              AI Dynamic Pricing Recommendation
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-extrabold px-2 py-0.5 rounded">Peak Surge Ahead</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              High demand expected between 5 PM – 8 PM today. AI recommends increasing base hourly rate from <span className="font-bold text-emerald-400">₹50 → ₹65/hr</span> to boost revenue by an estimated +18%.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => navigate('/owner/pricing')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Apply Dynamic Tariff
          </button>
        </div>
      </div>
    </div>
  );
};
