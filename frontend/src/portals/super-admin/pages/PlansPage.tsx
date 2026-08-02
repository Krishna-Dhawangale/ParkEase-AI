import { useEffect, useState } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SuperAdminService } from '../services/super-admin.service';
import type { SaaSPlan } from '../types/super-admin.types';
import { SALoadingState } from '../components/SALoadingState';

export function PlansPage() {
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SuperAdminService.getPlans().then((data) => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <SALoadingState fullPage />;

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="SaaS Plans" 
        description="Manage subscription tiers and their associated limits."
        actions={
          <button className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500">
            Create New Plan
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
            {plan.name === 'Enterprise' && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 to-indigo-500"></div>
            )}
            
            <div className="p-6 md:p-8 flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  ₹{plan.monthlyPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-slate-500">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Up to <strong>{plan.maxFacilities}</strong> Facilities</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Up to <strong>{plan.maxSlots.toLocaleString()}</strong> Total Slots</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300"><strong>{plan.supportLevel.replace(/_/g, ' ')}</strong> Support</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Digital Twin Access</span>
                </li>
                {plan.name === 'Enterprise' && (
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Dedicated Account Manager</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="p-6 pt-0 mt-auto">
              <button className="w-full rounded-md bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
