import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, IndianRupee, ArrowUpRight } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SALoadingState } from '../components/SALoadingState';
import { SuperAdminService } from '../services/super-admin.service';

export function RevenuePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SALoadingState fullPage />;

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Revenue & Growth" 
        description="Analyze Monthly Recurring Revenue (MRR), ARR, and overall platform growth."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Monthly Recurring Revenue (MRR)</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <span className="text-slate-400 mr-1 text-2xl">₹</span>2,850,000
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +15.2%
            </span>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Annual Run Rate (ARR)</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <span className="text-slate-400 mr-1 text-2xl">₹</span>34,200,000
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Average Revenue Per Org (ARPO)</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <span className="text-slate-400 mr-1 text-2xl">₹</span>185,400
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Revenue Charts Pipeline</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Detailed MRR growth, churn analysis, and cohort retention charts will be integrated in Phase 2 of analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
