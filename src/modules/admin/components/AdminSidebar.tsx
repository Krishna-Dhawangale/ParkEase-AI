import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  LayoutDashboard,
  Car,
  Boxes,
  CalendarCheck,
  Users,
  UserCog,
  BarChart3,
  Brain,
  Tags,
  CreditCard,
  Bell,
  FileBarChart,
  Shield,
  Settings,
  CircleUser,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAdminSidebarStore } from '../../../store';
import { cn } from '../../../lib/utils';

/* ───────────────────────────── Navigation Config ───────────────────────────── */

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Parking Management', icon: Car, path: '/admin/parking' },
      { label: 'Digital Twin Builder', icon: Boxes, path: '/admin/digital-twin' },
      { label: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
      { label: 'Users', icon: Users, path: '/admin/users' },
      { label: 'Employees', icon: UserCog, path: '/admin/employees' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { label: 'AI Dashboard', icon: Brain, path: '/admin/ai' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Pricing', icon: Tags, path: '/admin/pricing' },
      { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
      { label: 'Reports', icon: FileBarChart, path: '/admin/reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Security', icon: Shield, path: '/admin/security' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Profile', icon: CircleUser, path: '/admin/profile' },
      { label: 'Support', icon: LifeBuoy, path: '/admin/support' },
    ],
  },
];

/* ──────────────────────────── Sidebar Nav Item ─────────────────────────────── */

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

const SidebarNavItem = ({ item, isCollapsed, onNavigate }: SidebarNavItemProps) => {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200',
          isActive
            ? 'bg-blue-600/10 text-blue-400'
            : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200',
          isCollapsed && 'justify-center px-2'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-500" />
          )}
          <Icon className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={14}
            className="z-[60] rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-xl"
          >
            {item.label}
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return link;
};

/* ──────────────────────────── Main Sidebar ──────────────────────────────────── */

const AdminSidebar = () => {
  const { isCollapsed, isMobileOpen, toggleCollapse, setMobileOpen } =
    useAdminSidebarStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setMobileOpen(false);
    navigate('/');
  };

  const renderContent = (isMobile: boolean) => {
    const collapsed = isCollapsed && !isMobile;

    return (
      <div className="flex h-full flex-col">
        {/* ── Brand ── */}
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-slate-800 px-4',
            collapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              P
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">
                  ParkEase AI
                </h2>
                <p className="truncate text-[11px] text-slate-500">
                  Team Workspace
                </p>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((section) => (
            <div key={section.label} className="mb-5">
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {section.label}
                </p>
              )}
              {collapsed && <div className="mb-2 border-t border-slate-800" />}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    item={item}
                    isCollapsed={collapsed}
                    onNavigate={isMobile ? () => setMobileOpen(false) : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Bottom ── */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className={cn(
                'mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition-all duration-200 hover:bg-white/[0.06] hover:text-slate-300',
                collapsed && 'justify-center px-2'
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-[18px] w-[18px]" />
              ) : (
                <>
                  <ChevronLeft className="h-[18px] w-[18px]" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-20 hidden border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out lg:flex lg:flex-col',
          isCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {renderContent(false)}
      </aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed bottom-0 left-0 top-0 z-50 w-64 bg-slate-900 shadow-2xl lg:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {renderContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Tooltip.Provider>
  );
};

export default AdminSidebar;
