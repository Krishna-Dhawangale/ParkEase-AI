import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  deltaType?: 'increase' | 'decrease' | 'neutral';
  prefix?: ReactNode;
  className?: string;
  loading?: boolean;
  iconContainerClass?: string;
}

export function SAMetric({ label, value, delta, deltaType, prefix, className, loading, iconContainerClass = 'bg-slate-50 text-slate-500' }: Props) {
  const isPositive = deltaType === 'increase' || (delta && delta > 0);
  const isNegative = deltaType === 'decrease' || (delta && delta < 0);

  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm', className)}>
      <div className="flex items-center gap-3 mb-4">
        {prefix && (
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", iconContainerClass)}>
            {prefix}
          </div>
        )}
        <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{label}</span>
      </div>
      
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          
          {delta !== undefined && (
            <div className="flex items-center text-[12px] mt-1 font-medium">
              <span className={cn(
                'flex items-center',
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 
                isNegative ? 'text-red-600 dark:text-red-400' : 
                'text-slate-500 dark:text-slate-400'
              )}>
                {isPositive && <TrendingUp className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />}
                {isNegative && <TrendingDown className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />}
                {delta > 0 ? '+' : ''}{delta}%
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal">from last month</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
