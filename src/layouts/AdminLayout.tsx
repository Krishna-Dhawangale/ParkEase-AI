import { Outlet } from 'react-router-dom';
import AdminSidebar from '../portals/client-admin/components/AdminSidebar';
import AdminNavbar from '../portals/client-admin/components/AdminNavbar';
import FirstLoginGuard from '../portals/client-admin/components/FirstLoginGuard';
import OnboardingGuard from '../portals/client-admin/components/OnboardingGuard';
import { useAdminSidebarStore } from '../store';
import { useWebSocket } from '../hooks/useWebSocket';
import { cn } from '../lib/utils';

const AdminLayout = () => {
  const { isCollapsed } = useAdminSidebarStore();
  useWebSocket();

  return (
    <FirstLoginGuard>
      <OnboardingGuard>
        <div className="min-h-screen bg-[var(--bg-primary)]">
          <AdminNavbar />
          <AdminSidebar />
          <main
            className={cn(
              'min-h-screen pt-16 transition-all duration-300 ease-in-out',
              isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
            )}
          >
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </OnboardingGuard>
    </FirstLoginGuard>
  );
};

export default AdminLayout;
