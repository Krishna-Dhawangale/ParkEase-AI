import { Outlet } from 'react-router-dom';
import AdminSidebar from '../modules/admin/components/AdminSidebar';
import AdminNavbar from '../modules/admin/components/AdminNavbar';
import { useAdminSidebarStore } from '../store';
import { cn } from '../lib/utils';

const AdminLayout = () => {
  const { isCollapsed } = useAdminSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
  );
};

export default AdminLayout;
