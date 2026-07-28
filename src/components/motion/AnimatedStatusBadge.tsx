import type { HTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'info';

interface AnimatedStatusBadgeProps extends HTMLMotionProps<"div"> {
  status: StatusType;
  label: string;
  animateIn?: boolean;
  pulseIcon?: boolean;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800/50',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border-amber-200 dark:border-amber-800/50',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border-red-200 dark:border-red-800/50',
  },
  info: {
    icon: Info,
    classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 border-blue-200 dark:border-blue-800/50',
  }
};

export function AnimatedStatusBadge({
  status,
  label,
  animateIn = true,
  pulseIcon = false,
  className,
  ...props
}: AnimatedStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const shouldReduceMotion = useReducedMotion();

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  const iconVariants: Variants = {
    initial: { scale: 1 },
    pulse: {
      scale: shouldReduceMotion ? 1 : [1, 1.15, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={badgeVariants}
      initial={animateIn ? 'hidden' : 'visible'}
      animate="visible"
      className={cn(
        "text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5",
        config.classes,
        className
      )}
      {...props}
    >
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate={pulseIcon ? "pulse" : "initial"}
      >
        <Icon className="w-3.5 h-3.5" />
      </motion.div>
      {label}
    </motion.div>
  );
}
