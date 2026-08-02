import { AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function SAErrorState({ title = 'Error Loading Data', message, onRetry, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-950/20 text-center', className)}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-1">{title}</h3>
      <p className="text-sm text-red-600 dark:text-red-500 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
