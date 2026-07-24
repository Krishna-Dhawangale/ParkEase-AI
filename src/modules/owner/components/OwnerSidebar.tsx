import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  UserCog,
  Tags,
  Boxes,
  ShieldCheck,
  Wrench,
  BarChart3,
  Brain,
  FileText,
  LifeBuoy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Store
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore } from '../../../store';
import { cn } from '../../../lib/utils';
import { hasPermission } from '../../../lib/rbac';
import type { Permission } from '../../../types/auth';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
  permission?: Permission;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Operator Dashboard', icon: LayoutDashboard, path: '/owner/dashboard' },
    ],
  },
  {
    label: 'Facility Operations',
    items: [
      { label: 'Facility Management', icon: Building2, path: '/owner/parking', permission: 'FACILITY_EDIT' },
      { label: 'Bookings Operations', icon: CalendarCheck, path: '/owner/bookings', permission: 'BOOKING_MANAGE' },
      { label: 'Customer Directory', icon: Users, path: '/owner/customers', permission: 'CUSTOMER_VIEW' },
      { label: 'Staff & Sub-Roles', icon: UserCog, path: '/owner/staff', permission: 'STAFF_MANAGE' },
    ],
  },
  {
    label: 'Engineering & Twin',
    items: [
      { label: 'Digital Twin Builder', icon: Boxes, path: '/owner/digital-twin', permission: 'FACILITY_EDIT' },
      { label: 'Security Operations', icon: ShieldCheck, path: '/owner/security', permission: 'SECURITY_CONTROL' },
      { label: 'Maintenance Work Orders', icon: Wrench, path: '/owner/maintenance', permission: 'WORK_ORDER_VIEW', badge: 'Alert' },
    ],
  },
  {
    label: 'Analytics & Finance',
    items: [
      { label: 'Pricing & Tariffs', icon: Tags, path: '/owner/pricing', permission: 'PRICING_EDIT' },
      { label: 'Business Analytics', icon: BarChart3, path: '/owner/reports', permission: 'AUDIT_LOG_VIEW' },
      { label: 'AI Analytics', icon: Brain, path: '/owner/ai-insights', permission: 'AI_INSIGHTS_VIEW' },
      { label: 'Operational Audit Logs', icon: FileText, path: '/owner/audit-logs', permission: 'AUDIT_LOG_VIEW' },
    ],
  },
  {
    label: 'Config & Help',
    items: [
      { label: 'Operator Support', icon: LifeBuoy, path: '/owner/support' },
      { label: 'Facility Settings', icon: Settings, path: '/owner/settings' },
    ],
  },
];

interface OwnerSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  toggleCollapse,
  setMobileOpen,
}) => {
  const user = useAuthStore(s => s.user);
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
      <div className="flex h-full flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
        {/* Brand Header */}
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-emerald-800/40 px-4 bg-emerald-950/30',
            collapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-900/40">
              <Store className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white tracking-wide">
                  Facility Operator
                </h2>
                <p className="truncate text-[10px] font-semibold text-emerald-400">
                  {user?.subRole?.replace('_', ' ') || 'Facility Manager'}
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

        {/* Facility Selector Header */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-slate-800 bg-slate-950/40">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Property</p>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">Downtown Central Hub</p>
                <p className="text-[10px] text-emerald-400 font-medium">32 / 50 Occupied</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigation.map((section) => {
            const filteredItems = section.items.filter(item => 
              !item.permission || hasPermission(user, item.permission)
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.label}>
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    {section.label}
                  </p>
                )}
                {collapsed && <div className="mb-2 border-t border-slate-800" />}
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={isMobile ? () => setMobileOpen(false) : undefined}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200',
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                              : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200',
                            collapsed && 'justify-center px-2 border-l-0'
                          )
                        }
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0 text-emerald-400" />
                        {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 p-3 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 text-red-400" />
            {!collapsed && <span>Logout Operator</span>}
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
    <>
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-0 z-30 hidden border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out lg:flex lg:flex-col',
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
    </>
  );
};
