import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Lock, Mail, User, Eye, EyeOff, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { resolveUserPermissions } from '../../lib/rbac';
import { cn } from '../../lib/utils';

export const UserAuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const loginUser = useAuthStore(state => state.login);
  const navigate = useNavigate();

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

    setTimeout(() => {
      setLoading(false);

      if (!isSignUp) {
        if (email === 'admin@parkease.ai' && password !== 'admin123') {
          setError('Invalid password for Admin account. Use admin123.');
          return;
        }
        if (email === 'owner@parkease.ai' && password !== 'owner123') {
          setError('Invalid password for Partner account. Use owner123.');
          return;
        }
        if (email === 'user@parkease.ai' && password !== 'user123') {
          setError('Invalid password for User account. Use user123.');
          return;
        }
      }

      const isSuperAdmin = email.includes('admin') || email === 'admin@parkease.ai';
      const isOwner = email.includes('owner') || email === 'owner@parkease.ai';
      const userRole = isSuperAdmin ? 'SUPER_ADMIN' : isOwner ? 'OWNER' : 'USER';
      const permissions = resolveUserPermissions(userRole);

      const names = fullName ? fullName.trim().split(' ') : [];
      const fName = names[0] || (isSuperAdmin ? 'Admin' : isOwner ? 'Owner' : 'Demo');
      const lName = names.slice(1).join(' ') || 'User';

      loginUser('demo-token', {
        id: `user-${Date.now()}`,
        email,
        role: userRole,
        permissions,
        firstName: fName,
        lastName: lName,
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      });

      if (isSuperAdmin) {
        navigate('/admin/dashboard');
      } else if (isOwner) {
        navigate('/owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1200);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
      {/* Looping Video Background */}
      <video
        src="/auth-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Dark Mask */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Top Brand Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 z-20 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center">
          <Car className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-bold text-[14px] text-white">ParkEase AI</span>
      </button>

      {/* Center Authentication Panel */}
      <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Form Header */}
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
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                !isSignUp ? 'bg-[#0F766E] text-white shadow-md' : 'text-white/60 hover:text-white'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                isSignUp ? 'bg-[#0F766E] text-white shadow-md' : 'text-white/60 hover:text-white'
              )}
            >
              Create Account
            </button>
          </div>

          {/* Demo Credentials Helper */}
          {!isSignUp && (
            <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs space-y-1.5 font-sans text-left">
              <div className="font-semibold text-white">Demo Accounts:</div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span className="text-white/40 block">User Email:</span>
                  <code className="text-teal-300 font-mono select-all">user@parkease.ai</code>
                  <span className="text-white/40 block mt-0.5">Pass: <code className="text-teal-300 font-mono">user123</code></span>
                </div>
                <div>
                  <span className="text-white/40 block">Partner Email:</span>
                  <code className="text-teal-300 font-mono select-all">owner@parkease.ai</code>
                  <span className="text-white/40 block mt-0.5">Pass: <code className="text-teal-300 font-mono">owner123</code></span>
                </div>
                <div>
                  <span className="text-white/40 block">Admin Email:</span>
                  <code className="text-teal-300 font-mono select-all">admin@parkease.ai</code>
                  <span className="text-white/40 block mt-0.5">Pass: <code className="text-teal-300 font-mono">admin123</code></span>
                </div>
              </div>
            </div>
          )}

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

          {/* Form */}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F766E] hover:bg-[#0D6B63] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#0F766E]/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
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

          {/* Security indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-white/40">
            <Shield className="w-3.5 h-3.5" />
            Secured by ParkEase AI Core Shield
          </div>
        </motion.div>
      </div>
    </div>
  );
};
