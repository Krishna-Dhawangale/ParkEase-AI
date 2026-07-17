import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
} from 'lucide-react';

import DashboardCards from './DashboardCards';
import RevenueChart from './RevenueChart';
import BookingChart from './BookingChart';
import OccupancyChart from './OccupancyChart';
import PeakHourChart from './PeakHourChart';
import QuickActions from './QuickActions';
import RecentBookings from './RecentBookings';
import RecentPayments from './RecentPayments';
import RecentAlerts from './RecentAlerts';

// ─── Date Formatter ─────────────────────────────────────────────────────────────

const getFormattedDate = () => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ─── Dashboard ──────────────────────────────────────────────────────────────────

const Dashboard = () => {
  return (
    <div className="min-h-screen space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {getGreeting()}, Admin · {getFormattedDate()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Workspace Selector */}
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ParkEase HQ
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Date */}
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 md:flex">
            <Calendar className="h-3.5 w-3.5" />
            Today
          </button>

          {/* Refresh */}
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Export */}
          <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:bg-blue-800 sm:flex">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* ── Row 1: KPI Cards ── */}
      <DashboardCards />

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueChart />
        <BookingChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PeakHourChart />
        </div>
        <OccupancyChart />
      </div>

      {/* ── Row 3: Quick Actions ── */}
      <QuickActions />

      {/* ── Row 4: Recent Bookings ── */}
      <RecentBookings />

      {/* ── Row 5: Recent Payments ── */}
      <RecentPayments />

      {/* ── Row 6: Recent Alerts ── */}
      <RecentAlerts />
    </div>
  );
};

export default Dashboard;
