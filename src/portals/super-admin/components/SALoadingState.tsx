import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Props {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

export function SALoadingState({ message = 'Loading...', className, fullPage = false }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', fullPage ? 'h-[calc(100vh-140px)]' : 'h-48', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
      <p className="text-sm text-slate-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
