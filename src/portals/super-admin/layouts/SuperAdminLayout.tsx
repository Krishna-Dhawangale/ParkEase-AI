import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store';
import { SASidebar } from '../components/SASidebar';
import { SAHeader } from '../components/SAHeader';
import { useSASidebarStore } from '../store/super-admin.store';
import { cn } from '../../../lib/utils';


export function SuperAdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const { isCollapsed } = useSASidebarStore();

  // Route protection - ONLY SUPER_ADMIN allowed
  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    // Redirect to SA login specifically, carrying returnUrl
    return <Navigate to={`/super-admin/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-200 dark:selection:bg-brand-900/50">
      <SASidebar />
      
      <div className="flex flex-col min-h-screen">
        <SAHeader />
        
        <main className={cn(
          "flex-1 p-6 md:p-8 transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
