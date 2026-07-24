import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  Activity,
  Brain,
  CreditCard,
  CircleDollarSign,
  ShieldAlert,
  LifeBuoy,
  Code2,
  FileText,
  ToggleRight,
  Settings,
  CircleUser,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Crown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAdminSidebarStore, useAuthStore } from '../../../store';
import { cn } from '../../../lib/utils';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Platform Command HQ', icon: LayoutDashboard, path: '/admin/dashboard' },
    ],
  },
  {
    label: 'Partners & Ecosystem',
    items: [
      { label: 'Partner Approvals', icon: CheckSquare, path: '/admin/partners', badge: 'KYC' },
      { label: 'User Governance', icon: Users, path: '/admin/users' },
      { label: 'Subscriptions & Billing', icon: CreditCard, path: '/admin/subscriptions' },
    ],
  },
  {
    label: 'Platform Telemetry',
    items: [
      { label: 'Global Analytics', icon: BarChart3, path: '/admin/analytics' },
      { label: 'Infrastructure Health', icon: Activity, path: '/admin/monitoring', badge: '99.98%' },
      { label: 'AI Neural Engine', icon: Brain, path: '/admin/ai' },
    ],
  },
  {
    label: 'Financial & Governance',
    items: [
      { label: 'Commission Ledger', icon: CircleDollarSign, path: '/admin/finances' },
      { label: 'Anti-Fraud & Risk', icon: ShieldAlert, path: '/admin/fraud' },
    ],
  },
  {
    label: 'System & Security',
    items: [
      { label: 'Global Support Desk', icon: LifeBuoy, path: '/admin/support' },
      { label: 'API Keys & Webhooks', icon: Code2, path: '/admin/api' },
      { label: 'Global Audit Logs', icon: FileText, path: '/admin/security' },
      { label: 'Feature Flags', icon: ToggleRight, path: '/admin/feature-flags' },
      { label: 'Platform Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Superadmin Profile', icon: CircleUser, path: '/admin/profile' },
    ],
  },
];

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
            ? 'bg-indigo-600/20 text-indigo-400 font-semibold border-l-2 border-indigo-500'
            : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200',
          isCollapsed && 'justify-center px-2 border-l-0'
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0 text-indigo-400" />
      {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
      {!isCollapsed && item.badge && (
        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300">
          {item.badge}
        </span>
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

const AdminSidebar = () => {
  const { isCollapsed, isMobileOpen, toggleCollapse, setMobileOpen } = useAdminSidebarStore();
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const renderContent = (isMobile: boolean) => {
    const collapsed = isCollapsed && !isMobile;

    return (
      <div className="flex h-full flex-col bg-slate-950 text-slate-100 border-r border-slate-800">
        {/* Brand */}
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-indigo-800/40 px-4 bg-indigo-950/30',
            collapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-900/50">
              <Crown className="w-5 h-5 text-indigo-100" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white tracking-wide">
                  ParkEase AI
                </h2>
                <p className="truncate text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Superadmin SaaS HQ
                </p>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigation.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
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

        {/* Bottom */}
        <div className="shrink-0 border-t border-slate-800 p-3 bg-slate-950/50">
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 text-red-400" />
            {!collapsed && <span>Logout Superadmin</span>}
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
                  <span>Collapse Sidebar</span>
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
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-20 hidden border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out lg:flex lg:flex-col',
          isCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {renderContent(false)}
      </aside>

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
