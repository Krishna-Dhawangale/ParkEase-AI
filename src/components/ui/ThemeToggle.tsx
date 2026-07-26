import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../../store';
import { cn } from '../../lib/utils';

const iconVariants = {
  initial: { opacity: 0, scale: 0.5, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.5, rotate: 90 },
};

const labels = {
  light: 'Light Mode',
  dark: 'Dark Mode',
  system: 'System',
} as const;

interface ThemeToggleProps {
  /** Show text label next to icon */
  showLabel?: boolean;
  /** Additional className */
  className?: string;
  /** Compact mode for header buttons */
  compact?: boolean;
}

/**
 * Professional 3-way theme toggle: Light → Dark → System → Light
 * Click cycles through modes. Shows Sun/Moon/Monitor icons with
 * smooth framer-motion transitions.
 */
export function ThemeToggle({ showLabel = false, className, compact = false }: ThemeToggleProps) {
  const { preference, cycleTheme, initSystemListener } = useThemeStore();

  // Initialize system preference listener on mount
  useEffect(() => {
    const cleanup = initSystemListener();
    return cleanup;
  }, [initSystemListener]);

  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor;
  const label = labels[preference];

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-2xl font-medium transition-all duration-200',
        compact
          ? 'p-2 hover:bg-bg-hover'
          : 'sidebar-item w-full',
        className
      )}
      title={label}
      aria-label={`Theme: ${label}. Click to change.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={preference}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center flex-shrink-0"
        >
          <Icon
            className={cn(
              'flex-shrink-0',
              compact ? 'w-4 h-4' : 'w-4 h-4',
              preference === 'light' && 'text-amber-500',
              preference === 'dark' && 'text-blue-400',
              preference === 'system' && 'text-txt-secondary',
            )}
          />
        </motion.div>
      </AnimatePresence>

      {showLabel && (
        <span className="text-sm">{label}</span>
      )}
    </button>
  );
}
