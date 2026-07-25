import React, { useState } from 'react';
import { useAuthStore } from '../../../store';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

interface FirstLoginGuardProps {
  children: React.ReactNode;
}

const FirstLoginGuard: React.FC<FirstLoginGuardProps> = ({ children }) => {
  const { user, login } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If not authenticated or doesn't require change, render children
  if (!user || !user.requiresPasswordChange) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulate API call to change password
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        // Update user state to remove requiresPasswordChange
        if (user) {
          const updatedUser = { ...user, requiresPasswordChange: false };
          login(useAuthStore.getState().token || '', updatedUser);
        }
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center text-[var(--text-primary)] mb-2">
            Action Required
          </h2>
          <p className="text-sm text-center text-[var(--text-secondary)] mb-6">
            For your security, you must change your temporary password before accessing the ParkEase Admin Portal.
          </p>

          {success ? (
            <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <p className="font-medium text-[var(--text-primary)]">Password updated successfully!</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="password"
                    className="input-field pl-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="password"
                    className="input-field pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary w-full justify-center mt-2">
                Update Password & Continue
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstLoginGuard;
