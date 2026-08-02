import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isWaveActive, setIsWaveActive] = useState(false);

  const handleToggle = () => {
    setIsWaveActive(true);
    toggleTheme();
    setTimeout(() => setIsWaveActive(false), 750);
  };

  const dimensions = {
    sm: { container: 'w-12 h-6 p-0.5', knob: 'w-5 h-5', translate: 'translate-x-6' },
    md: { container: 'w-16 h-8 p-1', knob: 'w-6 h-6', translate: 'translate-x-8' },
    lg: { container: 'w-20 h-10 p-1.5', knob: 'w-7 h-7', translate: 'translate-x-10' },
  }[size];

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Theme"
      type="button"
      className={`relative inline-flex items-center rounded-full transition-all duration-500 overflow-hidden cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 ${
        isDark
          ? 'bg-[#111628] border border-[#232A45] shadow-[0_0_20px_rgba(124,58,237,0.25)]'
          : 'bg-slate-200/80 border border-slate-300 shadow-inner hover:bg-slate-300/80'
      } ${dimensions.container} ${className}`}
    >
      {/* Background Starry Sky for Dark Mode */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
          >
            <span className="w-0.5 h-0.5 bg-white rounded-full opacity-90 animate-ping absolute top-2 left-3" />
            <span className="w-1 h-1 bg-purple-300 rounded-full opacity-70 absolute bottom-1.5 left-5" />
            <span className="w-0.5 h-0.5 bg-white rounded-full opacity-80 absolute top-1.5 left-7" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purple Energy Wave Overlay */}
      <AnimatePresence>
        {isWaveActive && (
          <motion.span
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#8B5CF6] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Sliding Morphing Knob */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.8,
        }}
        className={`relative z-10 rounded-full flex items-center justify-center shadow-md ${dimensions.knob} ${
          isDark
            ? `${dimensions.translate} bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]`
            : 'translate-x-0 bg-white text-amber-500 shadow-sm'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-3.5 h-3.5 fill-current text-white"
              viewBox="0 0 24 24"
            >
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-3.5 h-3.5 fill-current text-amber-500"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.061-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM7.758 17.303a.75.75 0 00-1.061 1.06l1.591 1.59a.75.75 0 001.06-1.061l-1.59-1.589zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 00-1.06 1.061l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.592z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};
