import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import { useAuthStore } from '../../store';

export function ForcePasswordChange() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      // 1. Update the actual password in Firebase
      await updatePassword(currentUser, password);

      // 2. Remove the FORCE_RESET tag
      await updateProfile(currentUser, { photoURL: '' });

      // 3. Update the global Zustand store to remove the flag
      if (user) {
        setAuth(await currentUser.getIdToken(), { ...user, requiresPasswordChange: false });
      }

      // 4. Redirect to their dashboard
      if (user?.role === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else if (user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_OWNER') {
        navigate('/admin/welcome');
      } else {
        navigate('/customer');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update password. Please log out and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-lines-in-motion-32773-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 dark:bg-black/40 liquid-glass rounded-[2rem] p-8">
          <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Change Your Password</h2>
          <p className="text-white/60 text-center text-sm mb-8">
            For security reasons, you must change your temporary password before accessing your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/50 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-gray-100 rounded-xl font-bold transition-colors flex items-center justify-center group disabled:opacity-70 mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
