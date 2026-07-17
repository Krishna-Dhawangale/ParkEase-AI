import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ZoneStatus } from './data';

interface ParkingStatusProps {
  status: ZoneStatus;
  className?: string;
}

const config = {
  Active: {
    colors: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  Maintenance: {
    colors: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
    icon: Clock,
  },
  Closed: {
    colors: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: XCircle,
  },
  Full: {
    colors: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
    icon: AlertCircle,
  },
} satisfies Record<ZoneStatus, { colors: string; icon: typeof CheckCircle2 }>;

const ParkingStatus = ({ status, className }: ParkingStatusProps) => {
  const { colors, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        colors,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
};

export default ParkingStatus;
