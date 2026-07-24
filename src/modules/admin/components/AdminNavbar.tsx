import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  Crown,
  ChevronRight,
  ChevronDown,
  CircleUser,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { useAdminSidebarStore, useThemeStore, useAuthStore } from '../../../store';
import { cn } from '../../../lib/utils';

const routeLabels: Record<string, string> = {
  admin: 'Superadmin HQ',
  dashboard: 'Platform Dashboard',
  partners: 'Partner Approvals',
  users: 'User Governance',
  subscriptions: 'Subscriptions & Billing',
  analytics: 'Global Analytics',
  monitoring: 'Infrastructure Health',
  ai: 'AI Neural Engine',
  finances: 'Commission Ledger',
  fraud: 'Anti-Fraud & Risk',
  support: 'Global Support Desk',
  api: 'API Keys & Webhooks',
  security: 'Global Audit Logs',
  'feature-flags': 'Feature Flags',
  settings: 'Platform Settings',
  profile: 'Superadmin Profile',
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    path: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }));
}

const AdminNavbar = () => {
  const { setMobileOpen } = useAdminSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-indigo-900/40 bg-slate-900 px-4 text-slate-100 dark:border-slate-800 dark:bg-slate-900 lg:px-6 shadow-md">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Crown className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Superadmin SaaS Portal</span>
        </div>

        <nav className="hidden items-center gap-1 text-xs sm:flex ml-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.path}>
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
              )}
              <span
                className={cn(
                  'truncate',
                  crumb.isLast
                    ? 'font-semibold text-white'
                    : 'text-slate-400'
                )}
              >
                {crumb.label}
              </span>
            </Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400 border border-slate-700">
          <Search className="h-3.5 w-3.5 text-indigo-400" />
          <input 
            type="text" 
            placeholder="Search platform, partners, logs..." 
            className="bg-transparent border-none outline-none text-white text-xs placeholder:text-slate-500 w-44"
          />
        </div>

        {/* Live System Metric Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          99.98% Uptime
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        <div className="mx-1 h-6 w-px bg-slate-800" />

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-800">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md">
                SA
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-tight text-white">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
                </p>
                <p className="text-[10px] leading-tight text-indigo-400 font-semibold">
                  Platform Admin
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-xl border border-slate-800 bg-slate-900 py-1.5 text-slate-200 shadow-2xl"
            >
              <DropdownMenu.Label className="px-3 py-2">
                <p className="text-xs font-bold text-white">
                  Platform Superadmin
                </p>
                <p className="text-[10px] text-slate-400">{user?.email || 'admin@parkease.ai'}</p>
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 outline-none transition-colors hover:bg-slate-800"
                onSelect={() => navigate('/admin/profile')}
              >
                <CircleUser className="h-3.5 w-3.5 text-indigo-400" />
                Superadmin Profile
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 outline-none transition-colors hover:bg-slate-800"
                onSelect={() => navigate('/admin/settings')}
              >
                <Settings className="h-3.5 w-3.5 text-indigo-400" />
                Platform Settings
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 outline-none transition-colors hover:bg-slate-800"
                onSelect={() => navigate('/admin/support')}
              >
                <LifeBuoy className="h-3.5 w-3.5 text-indigo-400" />
                Global Support Queue
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-400 outline-none transition-colors hover:bg-red-500/10"
                onSelect={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout Superadmin
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

export default AdminNavbar;
