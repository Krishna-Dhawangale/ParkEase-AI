import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
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

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If authenticated but wrong role, maybe go to their specific dashboard
    const fallbackPath = user.role === 'OWNER' ? '/owner/dashboard' : user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};
