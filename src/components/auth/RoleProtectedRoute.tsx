import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import type { Role, Permission } from '../../types/auth';
import { hasPermission } from '../../lib/rbac';

interface RoleProtectedRouteProps {
  allowedRoles: Role[];
  requiredPermission?: Permission;
  redirectTo?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  allowedRoles, 
  requiredPermission,
  redirectTo = '/login/user' 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Normalize legacy ADMIN role
  const userRole: Role = (user.role as any) === 'ADMIN' ? 'SUPER_ADMIN' : user.role;

  // Check role authorization
  if (!allowedRoles.includes(userRole)) {
    const fallbackPath = userRole === 'OWNER' 
      ? '/owner/dashboard' 
      : userRole === 'SUPER_ADMIN' 
      ? '/admin/dashboard' 
      : '/dashboard';

    // Prevent infinite loops
    if (location.pathname === fallbackPath) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check granular permission if required
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    const fallbackPath = userRole === 'OWNER' 
      ? '/owner/dashboard' 
      : userRole === 'SUPER_ADMIN' 
      ? '/admin/dashboard' 
      : '/dashboard';

    if (location.pathname === fallbackPath) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};
