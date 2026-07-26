import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  Crown,
  ChevronRight,
  ChevronDown,
  CircleUser,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { useAdminSidebarStore, useAuthStore } from '../../../store';
import { cn } from '../../../lib/utils';
import { ThemeToggle } from '../../../components/ui/ThemeToggle';

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
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-bdr bg-bg-card px-4 text-txt-primary lg:px-6 shadow-card">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-txt-muted transition-colors hover:bg-bg-hover hover:text-txt-primary lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-admin-subtle border border-admin/20 text-admin">
          <Crown className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">Superadmin SaaS Portal</span>
        </div>

        <nav className="hidden items-center gap-1 text-xs sm:flex ml-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.path}>
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-txt-muted" />
              )}
              <span
                className={cn(
                  'truncate',
                  crumb.isLast
                    ? 'font-semibold text-txt-primary'
                    : 'text-txt-secondary'
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
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-bg-secondary px-3 py-1.5 text-xs text-txt-secondary border border-bdr">
          <Search className="h-3.5 w-3.5 text-admin" />
          <input 
            type="text" 
            placeholder="Search platform, partners, logs..." 
            className="bg-transparent border-none outline-none text-txt-primary text-xs placeholder:text-txt-muted w-44"
          />
        </div>

        {/* Live System Metric Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-semantic-success-bg border border-semantic-success-border text-semantic-success text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          99.98% Uptime
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2 text-txt-muted transition-colors hover:bg-bg-hover hover:text-txt-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin ring-2 ring-bg-card" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle compact />

        <div className="mx-1 h-6 w-px bg-bdr" />

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-bg-hover">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-admin text-xs font-bold text-white shadow-md">
                SA
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-tight text-txt-primary">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
                </p>
                <p className="text-[10px] leading-tight text-admin font-semibold">
                  Platform Admin
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-txt-muted md:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-xl border border-bdr bg-bg-elevated py-1.5 text-txt-primary shadow-modal"
            >
              <DropdownMenu.Label className="px-3 py-2">
                <p className="text-xs font-bold text-txt-primary">
                  Platform Superadmin
                </p>
                <p className="text-[10px] text-txt-muted">{user?.email || 'admin@parkease.ai'}</p>
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="my-1 h-px bg-bdr" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-txt-secondary outline-none transition-colors hover:bg-bg-hover"
                onSelect={() => navigate('/admin/profile')}
              >
                <CircleUser className="h-3.5 w-3.5 text-admin" />
                Superadmin Profile
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-txt-secondary outline-none transition-colors hover:bg-bg-hover"
                onSelect={() => navigate('/admin/settings')}
              >
                <Settings className="h-3.5 w-3.5 text-admin" />
                Platform Settings
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-txt-secondary outline-none transition-colors hover:bg-bg-hover"
                onSelect={() => navigate('/admin/support')}
              >
                <LifeBuoy className="h-3.5 w-3.5 text-admin" />
                Global Support Queue
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-bdr" />

              <DropdownMenu.Item
                className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-500 dark:text-red-400 outline-none transition-colors hover:bg-semantic-danger-bg"
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
