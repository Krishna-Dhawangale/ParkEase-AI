import { Outlet } from 'react-router-dom';
import AdminSidebar from '../portals/client-admin/components/AdminSidebar';
import AdminNavbar from '../portals/client-admin/components/AdminNavbar';
import { useAdminSidebarStore, useTenantStore } from '../store';
import { useWebSocket } from '../hooks/useWebSocket';
import { cn } from '../lib/utils';
import { AlertCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const AdminLayout = () => {
  const { isCollapsed } = useAdminSidebarStore();
  const currentTenant = useTenantStore((s) => s.currentTenant);
  useWebSocket();

  // Check if subscription expires within 5 days
  let daysUntilExpiry = null;
  if (currentTenant?.subscriptionEndDate) {
    daysUntilExpiry = differenceInDays(new Date(currentTenant.subscriptionEndDate), new Date());
  }
  const showWarning = daysUntilExpiry !== null && daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AdminNavbar />
      <AdminSidebar />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 ease-in-out flex flex-col',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {showWarning && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
              Warning: Your subscription will expire in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}. Please renew to avoid service interruption.
            </p>
          </div>
        )}
        <div className="p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
