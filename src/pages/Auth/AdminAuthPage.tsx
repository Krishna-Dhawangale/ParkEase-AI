import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AuthService } from '../../services/auth.service';
import { normalizeEmail } from '../../services/api.mock';
import { Car, Mail, Lock, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({ email: normalizeEmail(email), password });
      
      // Client Admins only
      if (response.user.role === 'SUPER_ADMIN' || response.user.role === 'CUSTOMER') {
        throw new Error('Unauthorized role for Client Portal. Use the appropriate login portal.');
      }
      
      if (response.user.accountStatus === 'DISABLED') {
        throw new Error('Your account is currently disabled. Contact ParkEase AI support.');
      }

      login(response.token, response.user);

      if (response.user.requiresPasswordChange) {
        navigate('/admin/change-password');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mb-4">
            <Car className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ParkEase AI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 uppercase tracking-wider font-semibold">
            Client Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@organization.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Secured by ParkEase AI Core
        </div>
      </div>
    </div>
  );
};
