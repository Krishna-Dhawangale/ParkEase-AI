import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, TrendingUp, BarChart3, Layers, Zap, IndianRupee,
  Wrench, Brain, ChevronRight, Filter, RefreshCw, ArrowUpRight,
  AlertTriangle, Clock, Target, Sparkles
} from 'lucide-react';
import { mockAIInsights } from '../../lib/data';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  TrendingUp, BarChart3, Layers, Zap, IndianRupee, Wrench,
};

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/10', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/30' },
  brand: { bg: 'bg-[var(--brand)]/5 dark:bg-[var(--brand-light)]/10', icon: 'text-[var(--brand)] dark:text-[var(--brand-light)]', border: 'border-[var(--brand)]/20 dark:border-[var(--brand-light)]/30' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/10', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/30' },
  success: { bg: 'bg-green-50 dark:bg-green-900/10', icon: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800/30' },
  secondary: { bg: 'bg-[var(--bg-primary)] dark:bg-[var(--border)]/50', icon: 'text-[var(--text-secondary)]', border: 'border-[var(--border)] dark:border-[var(--border)]' },
};

const impactLabels: Record<string, { text: string; color: string }> = {
  high: { text: 'High Impact', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
  medium: { text: 'Medium Impact', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
  low: { text: 'Low Impact', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
};

export function AIInsightsPage() {
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const filters = [
    { id: 'all', label: 'All Insights' },
    { id: 'prediction', label: 'Predictions' },
    { id: 'opportunity', label: 'Opportunities' },
    { id: 'optimization', label: 'Optimizations' },
    { id: 'revenue', label: 'Revenue' },
  ];

  const filteredInsights = filter === 'all'
    ? mockAIInsights
    : mockAIInsights.filter(i => i.type === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">AI Insights</h1>
            <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-0.5">
              Intelligent recommendations from ParkEase Neural Engine™
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="btn-ghost">
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
          <div className="badge badge-brand">
            <Brain className="w-3 h-3" />
            {mockAIInsights.length} active insights
          </div>
        </div>
      </div>

      {/* AI Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 gradient-brand text-white overflow-hidden relative"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="relative grid sm:grid-cols-4 gap-5">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5" />
              <span className="font-bold text-sm">AI Daily Summary</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Today's analysis shows <span className="font-bold text-white">strong revenue performance (+11%)</span> with
              an expected peak at 6 PM. Floor 3 remains underutilized — AI recommends signage redirect to improve by 28%.
            </p>
          </div>
          <div className="text-center p-3 bg-white/15 rounded-xl">
            <div className="text-2xl font-bold">6</div>
            <div className="text-white/70 text-xs">Insights Today</div>
          </div>
          <div className="text-center p-3 bg-white/15 rounded-xl">
            <div className="text-2xl font-bold">96.2%</div>
            <div className="text-white/70 text-xs">Model Accuracy</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
              filter === f.id
                ? 'bg-[var(--brand)] text-white'
                : 'bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        {filteredInsights.map((insight, i) => {
          const colors = colorMap[insight.color] || colorMap.secondary;
          const Icon = iconMap[insight.icon] || Lightbulb;
          const impact = impactLabels[insight.impact];

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'card overflow-hidden border-l-4 cursor-pointer hover:shadow-hover transition-all',
                colors.border
              )}
              onClick={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0', colors.bg)}>
                    <Icon className={cn('w-5 h-5', colors.icon)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm">{insight.title}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', impact.color)}>
                        {impact.text}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--brand)]/10 text-[var(--brand)] dark:bg-[var(--brand-light)]/10 dark:text-[var(--brand-light)] capitalize">
                        {insight.type}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed">
                      {insight.message}
                    </p>

                    {/* Confidence Bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-[var(--brand)]" />
                        <span className="text-xs text-[var(--text-secondary)]">Confidence:</span>
                        <span className="text-xs font-bold text-[var(--brand)] dark:text-[var(--brand-light)]">{insight.confidence}%</span>
                      </div>
                      <div className="flex-1 max-w-24 h-1.5 bg-[var(--border)] dark:bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${insight.confidence}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                          className="h-full rounded-full bg-[var(--brand)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <motion.div
                    animate={{ rotate: expandedId === insight.id ? 90 : 0 }}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                  </motion.div>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedId === insight.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-[var(--border)] dark:border-[var(--border)] space-y-3">
                      <div className="pt-3 grid sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
                          <div className="text-[11px] text-[var(--text-secondary)] mb-0.5">Data Points Analyzed</div>
                          <div className="font-bold text-[var(--text-primary)] dark:text-white">847</div>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
                          <div className="text-[11px] text-[var(--text-secondary)] mb-0.5">Processing Time</div>
                          <div className="font-bold text-[var(--text-primary)] dark:text-white">142ms</div>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
                          <div className="text-[11px] text-[var(--text-secondary)] mb-0.5">Model Version</div>
                          <div className="font-bold text-[var(--text-primary)] dark:text-white">v3.2.1</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-primary text-xs py-2 flex-1">
                          Take Action
                        </button>
                        <button className="btn-secondary text-xs py-2">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state when filtered */}
      {filteredInsights.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] dark:bg-[var(--border)] flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-7 h-7 text-[var(--text-secondary)]" />
          </div>
          <h3 className="font-bold text-[var(--text-primary)] dark:text-white mb-1">No insights found</h3>
          <p className="text-sm text-[var(--text-secondary)]">Try a different filter or refresh.</p>
          <button onClick={() => setFilter('all')} className="btn-primary mt-4">View All Insights</button>
        </div>
      )}
    </div>
  );
}
