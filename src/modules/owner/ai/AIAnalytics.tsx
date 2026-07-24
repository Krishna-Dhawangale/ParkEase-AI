import React from 'react';
import { Brain, TrendingUp, Users, Zap, Sparkles, BarChart3, AlertCircle } from 'lucide-react';

export const AIAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
              Predictive AI Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility AI Analytics & Predictive Insights</h1>
          <p className="text-xs text-slate-400 mt-1">7-day demand forecasting, occupancy probability, dynamic tariff recommendations, and optimal staffing advice.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Demand & Occupancy Forecast</h3>
          <p className="text-xs text-slate-400">Predicted 94% peak occupancy on Friday between 5 PM - 8 PM due to downtown concert event.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Recommended Staffing Levels</h3>
          <p className="text-xs text-slate-400">Assign +2 additional gate cashiers during Friday 4 PM - 9 PM shift to reduce exit queue latency.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Customer Churn Prediction</h3>
          <p className="text-xs text-slate-400">14 regular monthly pass customers at risk of churn. Recommending 10% renewal promo code.</p>
        </div>
      </div>
    </div>
  );
};
