import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, Shield, User } from 'lucide-react';
import { useAuthStore } from '../../store';

// Staggered word reveal
function WordReveal({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: delay + i * 0.08,
              duration: 0.7,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [screenState, setScreenState] = useState<'intro' | 'auth'>('intro');
  const [titleFinished, setTitleFinished] = useState(false);

  const handleTimeUpdate = () => {
    if (introVideoRef.current) {
      const { duration, currentTime } = introVideoRef.current;
      if (duration > 0) setVideoProgress((currentTime / duration) * 100);
    }
  };

  const triggerIntroElements = videoProgress >= 38;

  const handleGetStarted = () => {
    // Play audio
    const audio = new Audio('/get-started.mp3');
    audio.volume = 0.85;
    audio.play().catch(() => {});
    // Transition after short delay
    setTimeout(() => setScreenState('auth'), 400);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
      <AnimatePresence mode="wait">
        {screenState === 'intro' ? (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            {/* Video */}
            <video
              ref={introVideoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Gradient overlays — left-heavy so left content pops */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Subtle vignette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: triggerIntroElements ? 0.18 : 0 }}
              transition={{ duration: 2.5 }}
              className="absolute inset-0 bg-black pointer-events-none"
            />

            {/* ═══ HERO — Left Aligned ═══ */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="pl-12 sm:pl-16 lg:pl-24 pr-8 max-w-[600px]">
                <AnimatePresence>
                  {triggerIntroElements && (
                    <>
                      {/* ── Logo row ── */}
                      <motion.div
                        className="flex items-center gap-3 mb-8"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.0, duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                      >
                        {/* Icon with glow pulse */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                          className="relative"
                        >
                          <motion.div
                            animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.35, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-xl bg-[var(--brand)] blur-md"
                          />
                          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center shadow-lg">
                            <Car className="w-5 h-5 text-white" />
                          </div>
                        </motion.div>

                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-sm font-bold tracking-[0.2em] text-white/70 uppercase"
                        >
                          ParkEase AI
                        </motion.span>
                      </motion.div>

                      {/* ── Thin accent line ── */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.35, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                        style={{ transformOrigin: 'left' }}
                        className="h-[1.5px] w-20 bg-gradient-to-r from-[var(--brand)] to-transparent mb-7"
                      />

                      {/* ── Main title ── */}
                      <div className="mb-5">
                        <h1 className="font-sora font-extrabold tracking-tight text-white leading-[1.05]"
                            style={{ fontSize: 'clamp(38px, 5.5vw, 80px)' }}>
                          <div className="overflow-hidden">
                            <WordReveal text="Smart Parking," delay={0.4} />
                          </div>
                          <div className="overflow-hidden">
                            <WordReveal
                              text="Reimagined."
                              delay={0.65}
                              className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-[var(--brand-light)] to-white"
                            />
                          </div>
                        </h1>
                      </div>

                      {/* ── Subtitle ── */}
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="text-sm sm:text-base text-white/60 font-medium leading-relaxed mb-7 max-w-[420px]"
                      >
                        AI-powered Digital Twin visualization for modern parking facilities. Real-time, intelligent, and seamless.
                      </motion.p>

                      {/* ── Feature pills ── */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.35, duration: 0.6 }}
                        className="flex flex-wrap gap-2 mb-8"
                      >
                        {['Digital Twin', 'AI Prediction', 'Real-time', 'IoT'].map((label, i) => (
                          <motion.span
                            key={label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.45 + i * 0.08 }}
                            className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/15 bg-white/8 text-white/60 backdrop-blur-sm"
                          >
                            {label}
                          </motion.span>
                        ))}
                      </motion.div>

                      {/* ── CTA ── */}
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        onAnimationComplete={() => setTitleFinished(true)}
                      >
                        <motion.button
                          onClick={handleGetStarted}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className="group flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] shadow-xl shadow-[var(--brand)]/30 transition-all"
                        >
                          Get Started
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Video progress line at bottom */}
            <div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <video
              src="/auth-bg.mp4"
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/55" />

            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 left-6 flex items-center gap-2 z-20"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-white">ParkEase AI</span>
            </motion.div>

            {/* Auth Panel */}
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="w-full max-w-md bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="text-center mb-7">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Select Portal</h2>
                  <p className="text-sm text-white/60 mt-1.5">Choose your destination to log in to ParkEase AI.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Customer Portal', sub: 'For drivers and standard users', icon: User, color: 'bg-blue-500/20 text-blue-400', path: '/login/user' },
                    { label: 'Client Portal', sub: 'For parking facility owners and staff', icon: Car, color: 'bg-emerald-500/20 text-emerald-400', path: '/login/admin' },
                    { label: 'Super Admin', sub: 'Platform control plane', icon: Shield, color: 'bg-[var(--brand)]/20 text-[var(--brand-light)]', path: '/super-admin/login' },
                  ].map(({ label, sub, icon: Icon, color, path }, i) => (
                    <motion.button
                      key={path}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      onClick={() => navigate(path)}
                      className="w-full bg-white/8 hover:bg-white/15 border border-white/15 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                    >
                      <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{label}</div>
                        <div className="text-xs text-white/45 mt-0.5">{sub}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-white/35">
                  <Shield className="w-3 h-3" />
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
