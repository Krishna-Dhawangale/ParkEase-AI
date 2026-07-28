import { cn } from '../../../lib/utils';
import type { ServiceStatus } from '../types/super-admin.types';

const statusColorMap: Record<ServiceStatus, string> = {
  OPERATIONAL: 'bg-emerald-500',
  DEGRADED: 'bg-amber-500',
  OUTAGE: 'bg-red-500',
  UNKNOWN: 'bg-slate-400',
};

interface Props {
  status: ServiceStatus;
  className?: string;
  pulse?: boolean;
}

export function SAHealthIndicator({ status, className, pulse = true }: Props) {
  const color = statusColorMap[status] || statusColorMap.UNKNOWN;
  
  return (
    <span className={cn('relative flex h-3 w-3', className)}>
      {pulse && status !== 'UNKNOWN' && status !== 'OUTAGE' && (
        <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', color)}></span>
      )}
      <span className={cn('relative inline-flex rounded-full h-3 w-3', color)}></span>
    </span>
  );
}
