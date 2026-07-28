import { cn } from '../../../lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  purple: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900',
};

// Status-to-variant mappings for common entity statuses
const statusVariantMap: Record<string, BadgeVariant> = {
  // Organization
  ONBOARDING: 'info', ACTIVE: 'success', PAST_DUE: 'warning', SUSPENDED: 'danger', TERMINATED: 'danger',
  // Client Admin
  INVITED: 'info', LOCKED: 'warning', DISABLED: 'danger',
  // Facility
  DRAFT: 'neutral', UNDER_REVIEW: 'info', CHANGES_REQUESTED: 'warning', APPROVED: 'success', LIVE: 'success', PAUSED: 'warning',
  // Subscription
  EXPIRED: 'neutral', CANCELLED: 'danger',
  // Invoice
  ISSUED: 'info', PAID: 'success', VOID: 'neutral', REFUNDED: 'purple',
  // Tickets
  OPEN: 'danger', IN_PROGRESS: 'info', WAITING_FOR_CLIENT: 'warning', RESOLVED: 'success', CLOSED: 'neutral',
  // Devices
  ONLINE: 'success', OFFLINE: 'danger', DEGRADED: 'warning', MAINTENANCE: 'neutral',
  // Digital Twin
  SYNCED: 'success', DISCONNECTED: 'danger', OUTDATED: 'warning', NOT_CONFIGURED: 'neutral',
  // Incidents
  INVESTIGATING: 'info', MONITORING: 'warning',
  // System
  OPERATIONAL: 'success', OUTAGE: 'danger', UNKNOWN: 'neutral',
  // Severity
  INFO: 'info', WARNING: 'warning', HIGH: 'danger', CRITICAL: 'danger',
  LOW: 'neutral', MEDIUM: 'info', URGENT: 'danger',
  // Priority
  PRIORITY: 'info', DEDICATED: 'purple', BASIC: 'neutral',
  // Complaints
  ESCALATED: 'danger',
};

interface Props {
  status: string;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function SAStatusBadge({ status, variant, className, dot = false }: Props) {
  const v = variant ?? statusVariantMap[status] ?? 'neutral';
  const label = status.replace(/_/g, ' ');

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider', variantStyles[v], className)}>
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', {
          'bg-emerald-500': v === 'success',
          'bg-amber-500': v === 'warning',
          'bg-red-500': v === 'danger',
          'bg-blue-500': v === 'info',
          'bg-slate-400': v === 'neutral',
          'bg-violet-500': v === 'purple',
        })} />
      )}
      {label}
    </span>
  );
}
