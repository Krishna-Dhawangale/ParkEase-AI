import React, { useState } from 'react';
import { Tags, Sparkles, Plus, Check, Clock, TrendingUp, Calendar, Zap } from 'lucide-react';

export const PricingManagement: React.FC = () => {
  const [basePrice, setBasePrice] = useState(50);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.5);
  const [weekendRate, setWeekendRate] = useState(65);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-txt-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-bdr shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Tariff & Pricing Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Facility Pricing & Dynamic Tariff Rules</h1>
          <p className="text-xs text-txt-secondary mt-1">Configure base hourly rates, dynamic peak surge triggers, weekend tariffs, coupons, and monthly passes.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Base Hourly Rate Card */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bdr space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-txt-primary text-base">Standard Base Tariff</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">Active</span>
          </div>
          <p className="text-xs text-txt-secondary">Default rate applied during off-peak operational hours.</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-txt-primary">₹{basePrice}</span>
            <span className="text-xs text-txt-secondary">/ hour</span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={basePrice}
            onChange={e => setBasePrice(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        {/* Peak Surge Multiplier */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bdr space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-txt-primary text-base">Dynamic Surge Multiplier</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">AI Triggered</span>
          </div>
          <p className="text-xs text-txt-secondary">Surge multiplier when facility occupancy exceeds 85%.</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-amber-400">{surgeMultiplier}x</span>
            <span className="text-xs text-txt-secondary">(Effective ₹{Math.round(basePrice * surgeMultiplier)}/hr)</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={surgeMultiplier}
            onChange={e => setSurgeMultiplier(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Weekend Rate */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bdr space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-txt-primary text-base">Weekend & Holiday Rate</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">Scheduled</span>
          </div>
          <p className="text-xs text-txt-secondary">Applied automatically on Saturdays, Sundays, and public holidays.</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-blue-400">₹{weekendRate}</span>
            <span className="text-xs text-txt-secondary">/ hour</span>
          </div>
          <input
            type="range"
            min="30"
            max="250"
            value={weekendRate}
            onChange={e => setWeekendRate(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
