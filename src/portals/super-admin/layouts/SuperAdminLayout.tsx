import { Outlet, Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { LayoutDashboard, Users, CreditCard, Settings, Building2 } from 'lucide-react';

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Simple Top Navbar */}
      <header className="h-16 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-white/10 flex items-center px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <span className="text-violet-600 dark:text-violet-500">ParkEase</span> Platform Admin
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm">
            SA
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0">
          <nav className="p-4 space-y-1">
            <Link to="/super-admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </Link>
            <Link to="/super-admin/clients" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">
              <Building2 className="h-4 w-4" /> Clients
            </Link>
            <Link to="/super-admin/revenue" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">
              <CreditCard className="h-4 w-4" /> Revenue
            </Link>
            <Link to="/super-admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">
              <Users className="h-4 w-4" /> Users
            </Link>
            <Link to="/super-admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
