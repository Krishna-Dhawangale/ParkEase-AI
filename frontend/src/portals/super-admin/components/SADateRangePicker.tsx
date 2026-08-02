import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Props {
  className?: string;
}

export function SADateRangePicker({ className }: Props) {
  // This is a UI-only mock component matching the design.
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] font-medium text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors", className)}>
      <Calendar className="h-4 w-4 text-slate-500" />
      <span>20 May 2026 - 26 May 2026</span>
      <ChevronDown className="h-4 w-4 text-slate-500 ml-2" />
    </div>
  );
}
