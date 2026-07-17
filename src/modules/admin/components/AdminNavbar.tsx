import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  CircleUser,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { useAdminSidebarStore, useThemeStore } from '../../../store';
import { cn } from '../../../lib/utils';

/* ───────────────────────── Route Label Map ──────────────────────────────────── */

const routeLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  parking: 'Parking Management',
  'digital-twin': 'Digital Twin Builder',
  bookings: 'Bookings',
  users: 'Users',
  employees: 'Employees',
  analytics: 'Analytics',
  ai: 'AI Dashboard',
  pricing: 'Pricing',
  payments: 'Payments',
  notifications: 'Notifications',
  reports: 'Reports',
  security: 'Security',
  settings: 'Settings',
  profile: 'Profile',
  support: 'Support',
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    path: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }));
}

/* ────────────────────────── Navbar Component ─────────────────────────────────── */

const AdminNavbar = () => {
  const { setMobileOpen } = useAdminSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:px-6">
      {/* ── Left: Hamburger + Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden items-center gap-1 text-sm sm:flex" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.path}>
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
              )}
              <span
                className={cn(
                  'truncate',
                  crumb.isLast
                    ? 'font-medium text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500'
                )}
              >
                {crumb.label}
              </span>
            </Fragment>
          ))}
        </nav>

        <span className="truncate text-sm font-medium text-slate-900 dark:text-white sm:hidden">
          {breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Admin'}
        </span>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-0.5">
        {/* Search */}
        <button className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 md:flex">
          <Search className="h-4 w-4" />
          <span className="text-slate-500 dark:text-slate-400">Search…</span>
          <kbd className="ml-3 hidden h-5 items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500 lg:inline-flex">
            ⌘K
          </kbd>
        </button>
        <button
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* Language */}
        <button
          className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:flex"
          aria-label="Language"
        >
          <Globe className="h-5 w-5" />
        </button>

        {/* Help */}
        <button
          className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:flex"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="mx-2 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                A
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                  Admin
                </p>
                <p className="text-[11px] leading-tight text-slate-500">
                  admin@parkease.ai
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <DropdownMenu.Label className="px-3 py-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">admin@parkease.ai</p>
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-700" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                onSelect={() => navigate('/admin/profile')}
              >
                <CircleUser className="h-4 w-4 text-slate-400" />
                Profile
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                onSelect={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Settings
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                onSelect={() => navigate('/admin/support')}
              >
                <LifeBuoy className="h-4 w-4 text-slate-400" />
                Help &amp; Support
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-700" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-600 outline-none transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                onSelect={() => navigate('/')}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

export default AdminNavbar;
