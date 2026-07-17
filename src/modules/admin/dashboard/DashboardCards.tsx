import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Car,
  CircleParking,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  HeartPulse,
  Brain,
} from 'lucide-react';
import { kpiCards, type KPICard } from './data';
import Sparkline from './Sparkline';

// ─── Icon Map ───────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Car,
  CircleParking,
  IndianRupee,
  TrendingUp,
  CalendarCheck,
  HeartPulse,
  Brain,
};

// ─── Color Map ──────────────────────────────────────────────────────────────────

const colorMap: Record<KPICard['color'], { bg: string; text: string; sparkline: string }> = {
  blue:    { bg: 'bg-blue-50 dark:bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',    sparkline: '#3B82F6' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', sparkline: '#10B981' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',   sparkline: '#F59E0B' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-500/10',     text: 'text-rose-600 dark:text-rose-400',     sparkline: '#F43F5E' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-500/10',  text: 'text-violet-600 dark:text-violet-400',  sparkline: '#8B5CF6' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-500/10',     text: 'text-cyan-600 dark:text-cyan-400',     sparkline: '#06B6D4' },
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-500/10',  text: 'text-indigo-600 dark:text-indigo-400',  sparkline: '#6366F1' },
  teal:    { bg: 'bg-teal-50 dark:bg-teal-500/10',     text: 'text-teal-600 dark:text-teal-400',     sparkline: '#14B8A6' },
};

// ─── Single Card ────────────────────────────────────────────────────────────────

const StatKPICard = ({ card, index }: { card: KPICard; index: number }) => {
  const Icon = iconMap[card.icon] ?? LayoutGrid;
  const colors = colorMap[card.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-hover dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header: Icon + Sparkline */}
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <Sparkline data={card.sparkline} color={colors.sparkline} />
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
          {card.title}
        </p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {card.value}
          </span>
          {card.suffix && (
            <span className="text-lg font-semibold text-slate-400 dark:text-slate-500">
              {card.suffix}
            </span>
          )}
        </div>
      </div>

      {/* Trend */}
      <div className="mt-3 flex items-center gap-1.5">
        {card.trend === 'up' ? (
          <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 dark:bg-emerald-500/10">
            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{card.change}%
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 dark:bg-rose-500/10">
            <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {card.change}%
            </span>
          </div>
        )}
        <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last week</span>
      </div>
    </motion.div>
  );
};

// ─── KPI Cards Grid ─────────────────────────────────────────────────────────────

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((card, index) => (
        <StatKPICard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
};

export default DashboardCards;
