import React from 'react';
import { Gift, Award, Sparkles, Shield, Star, Leaf, CheckCircle2 } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white shadow">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">Driver Rewards & Eco Perks</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Earn points for booking off-peak hours and driving EV / hybrid vehicles.</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] font-bold text-sm">
          ⭐ 1,420 Reward Points
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--text-primary)] dark:text-white">Eco Driver Level</h3>
          <p className="text-xs text-[var(--text-secondary)]">Gold Tier (Saved 14.8kg CO₂ this month)</p>
        </div>

        <div className="p-6 rounded-2xl card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--text-primary)] dark:text-white">Active Discount Coupon</h3>
          <p className="text-xs text-[var(--text-secondary)]">15% OFF next weekend booking (`PARKEASE15`)</p>
        </div>

        <div className="p-6 rounded-2xl card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[var(--text-primary)] dark:text-white">Free Parking Pass</h3>
          <p className="text-xs text-[var(--text-secondary)]">1-hour free pass unlocked for 2,000 pts</p>
        </div>
      </div>
    </div>
  );
};
