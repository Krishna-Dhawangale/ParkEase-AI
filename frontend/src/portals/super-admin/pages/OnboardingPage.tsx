import { useEffect, useState } from 'react';
import { Rocket, CheckCircle2, Circle, Clock } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SALoadingState } from '../components/SALoadingState';
import { SAErrorState } from '../components/SAErrorState';
import { SuperAdminService } from '../services/super-admin.service';
import type { OnboardingEntry, OnboardingStage } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

const stages: { id: OnboardingStage; label: string }[] = [
  { id: 'ACCOUNT_CREATED', label: 'Account' },
  { id: 'CLIENT_ADMIN_CREATED', label: 'Admin' },
  { id: 'FIRST_LOGIN', label: 'Login' },
  { id: 'PASSWORD_CHANGED', label: 'Secure' },
  { id: 'PROFILE_COMPLETED', label: 'Profile' },
  { id: 'FACILITY_CREATED', label: 'Facility' },
  { id: 'DIGITAL_TWIN_CONFIGURED', label: 'Twin' },
  { id: 'GO_LIVE_REQUESTED', label: 'Requested' },
  { id: 'UNDER_REVIEW', label: 'Review' },
  { id: 'LIVE', label: 'Live' },
];

export function OnboardingPage() {
  const [data, setData] = useState<OnboardingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getOnboardingPipeline();
      setData(res);
    } catch (err: any) {
      setError('Failed to load onboarding pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <SALoadingState fullPage />;
  if (error) return <SAErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Client Onboarding Pipeline" 
        description="Track the progress of new organizations from account creation to their first live facility."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider min-w-[200px]">Organization</th>
              <th className="px-6 py-4 font-semibold tracking-wider min-w-[150px]">Current Stage</th>
              <th className="px-6 py-4 font-semibold tracking-wider min-w-[500px]">Pipeline Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.map((entry) => {
              const currentStageIndex = stages.findIndex(s => s.id === entry.currentStage);
              
              return (
                <tr key={entry.organizationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{entry.organizationName}</div>
                    <div className="text-xs text-slate-500">{entry.type.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                      {stages[currentStageIndex]?.label || entry.currentStage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between w-full relative">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
                      
                      {stages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        
                        return (
                          <div 
                            key={stage.id} 
                            className="relative z-10 flex flex-col items-center group cursor-default"
                            title={`${stage.label}${entry.stageCompletedAt[stage.id] ? ` - ${new Date(entry.stageCompletedAt[stage.id]!).toLocaleDateString()}` : ''}`}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                              isCompleted ? "bg-brand-500 text-white ring-2 ring-white dark:ring-slate-900" :
                              "bg-slate-200 dark:bg-slate-700 text-slate-400"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-2 h-2 fill-current" />}
                            </div>
                            <span className={cn(
                              "absolute -bottom-5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                              isCurrent ? "text-brand-600 dark:text-brand-400 opacity-100" : "text-slate-500"
                            )}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                  <Rocket className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <p>No organizations currently in the pipeline.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
