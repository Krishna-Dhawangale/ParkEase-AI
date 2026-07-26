import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
// Note: In a real app we'd call an API. We'll mock it via AuthService in a moment.
import { AuthService } from '../../services/auth.service';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password requirements
  const reqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const allReqsMet = Object.values(reqs).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword === currentPassword) {
      setError('New password must be different from current temporary password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (!allReqsMet) {
      setError('Please satisfy all password requirements.');
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await AuthService.changePassword(user.id, currentPassword, newPassword);
        const updatedUser = { 
          ...user, 
          requiresPasswordChange: false, 
          accountStatus: 'ACTIVE' as const,
          onboardingStatus: 'PASSWORD_CHANGED' as const,
          profileSetupComplete: false, // will be set to true after /admin/welcome
        };
        updateUser(updatedUser);
      }
      setSuccess(true);
      setTimeout(() => {
        if (user?.role === 'SUPER_ADMIN') {
          navigate('/super-admin', { replace: true });
        } else {
          navigate('/admin/welcome', { replace: true });
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Ensure your temporary password is correct.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Password Updated!</h2>
          <p className="text-slate-500 text-sm">Your new password has been set successfully. Redirecting you to the portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Secure your account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            You are signing in for the first time. Create a new password before continuing.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Current Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Requirements Indicator */}
            <div className="grid grid-cols-2 gap-2 py-2">
              <Requirement met={reqs.length} text="8+ characters" />
              <Requirement met={reqs.upper} text="Uppercase letter" />
              <Requirement met={reqs.lower} text="Lowercase letter" />
              <Requirement met={reqs.number} text="Number" />
              <Requirement met={reqs.special} text="Special character" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !allReqsMet || !currentPassword || !confirmPassword}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-[11px]",
      met ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
    )}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      {text}
    </div>
  );
}
