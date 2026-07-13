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

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Video and Playback States
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100 %
  const [screenState, setScreenState] = useState<'intro' | 'transition' | 'auth'>('intro');
  const [isSignUp, setIsSignUp] = useState(false);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (isSignUp && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    // Simple simulation of authentication
    setTimeout(() => {
      setLoading(false);
      loginUser(email);
      navigate('/dashboard');
    }, 1500);
  };

  // Determine if title & button should animate into view
  const triggerIntroElements = videoProgress >= 60;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
      <AnimatePresence mode="wait">
        {screenState !== 'auth' ? (
          <motion.div
            key="intro-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
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
              animate={{ opacity: triggerIntroElements ? 0.65 : 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-black pointer-events-none"
            />

            {/* Cinematic Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
              <AnimatePresence>
                {triggerIntroElements && (
                  <div className="max-w-2xl flex flex-col items-center justify-center">
                    {/* Brand / Logo */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: -20 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center shadow-lg shadow-[#0F766E]/40">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
                        ParkEase <span className="text-[#14B8A6]">AI</span>
                      </h1>
                    </motion.div>

                    {/* Subtitle / Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="text-base sm:text-lg text-white/70 max-w-md leading-relaxed mb-8"
                    >
                      A world-class Smart Parking Management Platform powered by advanced AI and Digital Twin visualization.
                    </motion.p>

                    {/* Get Started Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1, type: 'spring', stiffness: 100 }}
                      onClick={startAuthTransition}
                      className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white bg-[#0F766E] hover:bg-[#0D6B63] active:scale-95 transition-all shadow-lg shadow-[#0F766E]/30"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center">
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
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {isSignUp ? 'Create your account' : 'Welcome back'}
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    {isSignUp ? 'Sign up to access the smart portal' : 'Enter credentials to access the platform'}
                  </p>
                </div>

                {/* Switch Tabs */}
                <div className="flex bg-white/10 rounded-xl p-1 mb-5">
                  <button
                    onClick={() => { setIsSignUp(false); setError(''); }}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                      !isSignUp ? 'bg-[#0F766E] text-white shadow-md' : 'text-white/60 hover:text-white'
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsSignUp(true); setError(''); }}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                      isSignUp ? 'bg-[#0F766E] text-white shadow-md' : 'text-white/60 hover:text-white'
                    )}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Authentication Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="Girish Kumar"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#14B8A6] focus:bg-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@parkease.ai"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#14B8A6] focus:bg-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#14B8A6] focus:bg-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0F766E] hover:bg-[#0D6B63] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#0F766E]/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

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
