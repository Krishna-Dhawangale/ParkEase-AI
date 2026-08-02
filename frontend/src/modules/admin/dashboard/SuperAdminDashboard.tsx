import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Users, Building2, CircleDollarSign, Activity, Brain,
  ShieldAlert, Server, Code2, CheckCircle2, TrendingUp, Zap, Clock, Headphones
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSaaSGrowth = [
  { month: 'Jan', mrr: 8.2, commission: 0.82 },
  { month: 'Feb', mrr: 9.8, commission: 0.98 },
  { month: 'Mar', mrr: 11.4, commission: 1.14 },
  { month: 'Apr', mrr: 12.6, commission: 1.26 },
  { month: 'May', mrr: 13.9, commission: 1.39 },
  { month: 'Jun', mrr: 14.8, commission: 1.48 },
];

export const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-txt-primary">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-indigo-950/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                SaaS Operations Headquarters
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 99.98% System Health
              </span>
            </div>
            <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Platform Governance & Infrastructure Command</h1>
            <p className="text-xs text-txt-secondary mt-0.5">Global multi-tenant partner monitoring, subscription MRR, AI service latency, and risk mitigation.</p>
          </div>
        </div>
      </div>

      {/* SaaS Governance KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Monthly Recurring Revenue (MRR)", value: "₹14.8M", sub: "+18.2% YoY growth", icon: CircleDollarSign, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { title: "Platform Commission Earnings", value: "₹1.48M", sub: "10% avg commission cut", icon: TrendingUp, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
          { title: "Total Facility Partners", value: "142 Owners", sub: "8 pending KYC approvals", icon: Building2, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { title: "Active Driver Accounts", value: "48,500 Users", sub: "+1,240 new drivers this week", icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { title: "Platform Uptime SLA", value: "99.98%", sub: "0 downtime in 45 days", icon: Server, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { title: "AI Neural Requests Today", value: "184,200", sub: "142ms avg inference time", icon: Brain, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
          { title: "Support SLA Resolution", value: "98.4%", sub: "Avg response <12 mins", icon: Headphones, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { title: "Fraud Alerts & Flagged", value: "0 Critical", sub: "2 flagged refund requests", icon: ShieldAlert, color: "text-red-400 bg-red-500/10 border-red-500/20" },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-bg-card border border-bdr hover:border-indigo-900/60 transition-all shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                <kpi.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-txt-secondary">{kpi.sub}</span>
            </div>
            <div className="text-2xl font-bold text-txt-primary tracking-tight mb-1">{kpi.value}</div>
            <div className="text-xs text-txt-secondary font-medium">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Main SaaS Growth & Infrastructure Telemetry Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-bg-card border border-bdr space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-txt-primary text-base">Monthly Recurring Revenue (MRR) & Commission Ledger</h3>
              <p className="text-xs text-txt-secondary">Aggregated multi-tenant revenue stream and platform platform fees</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">2026 YTD</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockSaaSGrowth}>
              <defs>
                <linearGradient id="saasMrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="mrr" stroke="#6366F1" strokeWidth={2.5} fill="url(#saasMrr)" name="MRR (₹ Millions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Infrastructure & Services Status Card */}
        <div className="p-5 rounded-2xl bg-bg-card border border-bdr space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-txt-primary text-base">Platform Infrastructure Health</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">All Systems Normal</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { service: 'API Gateway Cluster', latency: '24ms', ok: true },
              { service: 'PostgreSQL Primary DB', latency: '4ms', ok: true },
              { service: 'AI Inference Neural Engine', latency: '142ms', ok: true },
              { service: 'Razorpay / Stripe Gateway', latency: '180ms', ok: true },
              { service: 'ANPR Stream Worker Cluster', latency: '85ms', ok: true },
            ].map(s => (
              <div key={s.service} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/80 border border-bdr">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-txt-primary">{s.service}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{s.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
