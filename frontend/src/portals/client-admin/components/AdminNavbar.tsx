import { Fragment, useState, useEffect } from 'react';
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
  Building2,
} from 'lucide-react';
import { useAdminSidebarStore, useThemeStore, useWebSocketStore, useAuthStore, useTenantStore } from '../../../store';
import { FacilityService, type ClientFacility } from '../parking/facility.service';
import { cn } from '../../../lib/utils';
import { ThemeToggle } from '../../../components/ui/ThemeToggle';

/* ───────────────────────── Route Label Map ──────────────────────────────────── */

const routeLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  parking: 'Parking Management',
  'digital-twin': 'Digital Twin',
  bookings: 'Bookings',
  customers: 'Customers',
  employees: 'Employees',
  analytics: 'Analytics',
  ai: 'AI & Predictions',
  pricing: 'Pricing',
  payments: 'Payments',
  devices: 'IoT & Devices',
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
  const { isConnected, isReconnecting } = useWebSocketStore();
  const { user, logout } = useAuthStore();
  const { currentTenant } = useTenantStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState<ClientFacility[]>([]);
  const [activeFacility, setActiveFacility] = useState<ClientFacility | null>(null);

  const tenantId = user?.tenantId || currentTenant?.id;

  // Load this tenant's facilities
  useEffect(() => {
    if (!tenantId) return;
    FacilityService.getByTenant(tenantId).then(facs => {
      setFacilities(facs);
      if (facs.length > 0 && !activeFacility) setActiveFacility(facs[0]);
    }).catch(() => {/* ignore */});
  }, [tenantId]);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin'
    : 'Admin';
  const displayEmail = user?.email || 'admin@parkease.ai';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login/admin');
  };

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

        {/* ── Facility Selector — only if tenant has facilities ── */}
        {facilities.length > 0 && (
          <div className="hidden md:flex ml-2 pl-4 border-l border-slate-200 dark:border-slate-800">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-slate-900 dark:text-white leading-tight">{activeFacility?.name ?? 'Select Facility'}</span>
                    <span className="text-[10px] font-medium text-slate-500 leading-tight">{activeFacility?.city ?? ''}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="start" sideOffset={8} className="z-50 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <DropdownMenu.Label className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Facility
                  </DropdownMenu.Label>
                  {facilities.map(fac => (
                    <DropdownMenu.Item
                      key={fac.id}
                      onSelect={() => setActiveFacility(fac)}
                      className={cn(
                        "mx-1.5 flex cursor-pointer flex-col rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                        activeFacility?.id === fac.id
                          ? "bg-blue-50 dark:bg-blue-500/10 text-slate-700 dark:text-slate-300"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      )}
                    >
                      <span className={cn("font-semibold", activeFacility?.id === fac.id ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-white")}>
                        {fac.name}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">{fac.city}</span>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenu.Item
                    onSelect={() => navigate('/admin/parking')}
                    className="mx-1.5 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    View All Facilities
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        )}
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

        {/* Connection Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 mr-1">
          <span className="relative flex h-2.5 w-2.5">
            {isReconnecting ? (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            ) : isConnected ? (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            ) : null}
            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isReconnecting ? "bg-amber-500" : isConnected ? "bg-emerald-500" : "bg-rose-500")}></span>
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-16">
            {isReconnecting ? 'Connecting' : isConnected ? 'Live Sync' : 'Offline'}
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle size="sm" />

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
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-[11px] leading-tight text-slate-500">
                  {displayEmail}
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
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">{displayEmail}</p>
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
                onSelect={handleLogout}
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
