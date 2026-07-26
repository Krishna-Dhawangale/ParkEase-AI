import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car, Brain, Lock, Mail, User, Eye, EyeOff, Check,
  ArrowRight, Shield, AlertCircle
} from 'lucide-react';
import { useThemeStore, useAuthStore } from '../../store';
import { cn } from '../../lib/utils';

export function LandingPage() {
  const navigate = useNavigate();
  const loginUser = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Removed auto-redirect. Users can now stay on the landing page even if authenticated.
  const handleGetStarted = () => {
    startAuthTransition();
  };

  // Video and Playback States
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100 %
  const [screenState, setScreenState] = useState<'intro' | 'transition' | 'auth'>('intro');
  const [titleFinished, setTitleFinished] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Time progress listener for the first video
  const handleTimeUpdate = () => {
    if (introVideoRef.current) {
      const duration = introVideoRef.current.duration;
      const current = introVideoRef.current.currentTime;
      if (duration > 0) {
        setVideoProgress((current / duration) * 100);
      }
    }
  };

  const startAuthTransition = () => {
    setScreenState('transition');
    setTimeout(() => {
      setScreenState('auth');
    }, 800); // match fade transition timing
  };



  // Determine if title & button should animate into view
  const triggerIntroElements = videoProgress >= 38;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
      <AnimatePresence mode="wait">
        {screenState !== 'auth' ? (
          <motion.div
            key="intro-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* First Video Background */}
            <video
              ref={introVideoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Dark Overlay (Fades in when intro text animates) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: triggerIntroElements ? 0.40 : 0 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-black pointer-events-none"
            />

            {/* Cinematic Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
              <AnimatePresence>
                {triggerIntroElements && (
                  <div className="max-w-2xl flex flex-col items-center justify-center">
                    {/* Unified Entrance Container */}
                    <motion.div
                      initial={{ opacity: 0.15, y: 500, scale: 0.98 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      transition={{ delay: 0.2, duration: 5.5, ease: [0.76, 0, 0.24, 1] }}
                      onAnimationComplete={() => setTitleFinished(true)}
                      className="w-full flex flex-col items-center justify-center"
                    >
                      {/* Inner Idle floating wrapper */}
                      <motion.div
                        animate={
                          titleFinished && !isHovered && screenState === 'intro'
                            ? { y: [0, -2, -0.5, -1.8, 0] }
                            : { y: 0 }
                        }
                        transition={
                          titleFinished && !isHovered && screenState === 'intro'
                            ? {
                              duration: 12,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }
                            : { duration: 0.5, ease: "easeOut" }
                        }
                        className="w-full flex flex-col items-center justify-center"
                      >
                        {/* Brand / Logo */}
                        <div className="flex items-center gap-4 mb-6 cinematic-shadow">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[24px] bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center shadow-lg shadow-[var(--brand)]/40">
                            <Car className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                          </div>
                          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-sora font-extrabold tracking-tighter text-white">
                            ParkEase AI
                          </h1>
                        </div>

                        {/* Subtitle / Description */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5, duration: 3.5, ease: [0.76, 0, 0.24, 1] }}
                          className="font-inter font-medium text-[rgba(255,255,255,0.82)] text-base sm:text-lg max-w-[650px] leading-[1.5] text-center cinematic-shadow"
                        >
                          A world-class Smart Parking Management Platform powered by advanced AI and Digital Twin visualization.
                        </motion.p>
                      </motion.div>
                    </motion.div>

                    {/* Get Started Button */}
                    <div className="h-20 mt-8 flex items-center justify-center">
                      <motion.button
                        initial={{ opacity: 0, y: 15 }}
                        animate={titleFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        onClick={handleGetStarted}
                        className={cn(
                          "group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white bg-[var(--brand)] hover:bg-[var(--brand-light)] active:scale-95 transition-all shadow-lg shadow-[var(--brand)]/30",
                          !titleFinished && "pointer-events-none opacity-0"
                        )}
                        style={{
                          visibility: titleFinished ? 'visible' : 'hidden'
                        }}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Looping Second Video Background */}
            <video
              src="/auth-bg.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Dark Mask for Authentication overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Back button or top brand badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center">
                <Car className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-[14px] text-white">ParkEase AI</span>
            </div>

            {/* Center Authentication Glass Panel */}
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Form header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Select Portal
                  </h2>
                  <p className="text-sm text-white/70 mt-2">
                    Choose your destination to log in to ParkEase AI.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/login/user')}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-base">Customer Portal</div>
                      <div className="text-xs text-white/50">For drivers and standard users</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate('/login/admin')}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-base">Client Portal</div>
                      <div className="text-xs text-white/50">For parking facility owners and staff</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => navigate('/super-admin/login')}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--brand)]/20 text-[var(--brand-light)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-base">Super Admin</div>
                      <div className="text-xs text-white/50">Platform control plane</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Bottom Secure indicator */}
                <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-white/40">
                  <Shield className="w-3.5 h-3.5" />
                  Secured by ParkEase AI Core Shield
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
