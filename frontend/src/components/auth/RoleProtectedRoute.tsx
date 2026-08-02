import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import type { Role } from '../../types/auth';

interface RoleProtectedRouteProps {
  allowedRoles: Role[];
  redirectTo?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If authenticated but wrong role, maybe go to their specific dashboard
    const fallbackPath = ['CLIENT_OWNER', 'CLIENT_ADMIN', 'PARKING_MANAGER', 'SECURITY_GUARD', 'CASHIER', 'MAINTENANCE'].includes(user.role) ? '/admin' : user.role === 'SUPER_ADMIN' ? '/super-admin' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  if (user.accountStatus === 'DISABLED') {
    // We could redirect to a specific disabled page, but for now we'll route to login with an error state
    // In a real app we'd dispatch a logout and redirect.
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-center max-w-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Account Disabled</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Your account is currently disabled. Contact ParkEase AI support.</p>
        </div>
      </div>
    );
  }

  // Intercept normal flow if password change is required
  // Exclude the change-password route itself to avoid infinite loop
  if (user.requiresPasswordChange && !location.pathname.includes('/change-password')) {
    const pwdPath = user.role === 'SUPER_ADMIN' ? '/super-admin/change-password' : '/admin/change-password';
    return <Navigate to={pwdPath} replace />;
  }

  // Intercept normal flow if client admin hasn't completed profile setup yet
  // This gate fires after password change but before the portal
  const isClientRole = ['CLIENT_OWNER', 'CLIENT_ADMIN', 'PARKING_MANAGER'].includes(user.role);
  const isOnWelcomePage = location.pathname === '/admin/welcome';
  const isOnChangePwdPage = location.pathname.includes('/change-password');

  if (isClientRole && !isOnChangePwdPage && !isOnWelcomePage) {
    if (!user.profileSetupComplete) {
      return <Navigate to="/admin/welcome" replace />;
    }
  }

  return <Outlet />;
};
