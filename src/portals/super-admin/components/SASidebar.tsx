import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useSASidebarStore } from '../store/super-admin.store';
import {
  LayoutDashboard, Building2, Users, Rocket, CheckSquare, Server,
  MonitorPlay, Video, Activity, CreditCard, Receipt, Banknote,
  LifeBuoy, MessageSquare, Shield, Lock, ActivitySquare, Settings,
  User, LogOut, FileText, ChevronLeft, ChevronRight, BarChart3, Clock, Bell
} from 'lucide-react';
import { useAuthStore } from '../../../store';

const navigation = [
  {
    section: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    section: 'CLIENT MANAGEMENT',
    items: [
      { name: 'Organizations', href: '/super-admin/organizations', icon: Building2 },
      { name: 'Client Admins', href: '/super-admin/client-admins', icon: Users },
      { name: 'Facility Approvals', href: '/super-admin/approvals', icon: CheckSquare },
    ]
  },
  {
    section: 'PLATFORM',
    items: [
      { name: 'Facilities', href: '/super-admin/facilities', icon: Server },
      { name: 'Digital Twin Monitor', href: '/super-admin/digital-twins', icon: MonitorPlay },
      { name: 'Devices & Cameras', href: '/super-admin/devices', icon: Video },
      { name: 'Platform Operations', href: '/super-admin/operations', icon: Activity },
    ]
  },
  {
    section: 'BUSINESS',
    items: [
      { name: 'Plans', href: '/super-admin/plans', icon: FileText },
      { name: 'Subscriptions', href: '/super-admin/subscriptions', icon: CreditCard },
      { name: 'Billing', href: '/super-admin/billing', icon: Receipt },
      { name: 'Revenue', href: '/super-admin/revenue', icon: BarChart3 },
    ]
  },
  {
    section: 'SUPPORT',
    items: [
      { name: 'Support Tickets', href: '/super-admin/support', icon: LifeBuoy },
      { name: 'Complaints', href: '/super-admin/complaints', icon: MessageSquare },
    ]
  },
  {
    section: 'GOVERNANCE',
    items: [
      { name: 'Audit Logs', href: '/super-admin/audit', icon: Clock },
      { name: 'Security', href: '/super-admin/security', icon: Shield },
      { name: 'Access Control', href: '/super-admin/access-control', icon: Lock },
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { name: 'System Health', href: '/super-admin/system-health', icon: ActivitySquare },
      { name: 'Notifications', href: '/super-admin/notifications', icon: Bell },
      { name: 'Platform Settings', href: '/super-admin/settings', icon: Settings },
    ]
  }
];

export function SASidebar() {
  const { isCollapsed, toggleCollapse } = useSASidebarStore();
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <aside className={cn(
      "flex flex-col bg-white dark:bg-[#161D36] border-r border-slate-200 dark:border-[#232A45] transition-all duration-300 z-30 fixed h-full text-slate-900 dark:text-slate-100",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#232A45] shrink-0">
        <Link to="/super-admin/dashboard" className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <div className="bg-black dark:bg-[#7C3AED] rounded-lg p-1.5 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm leading-none">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-bold tracking-tight text-sm leading-tight">ParkEase AI</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Super Admin</span>
          </div>
        </Link>
        {isCollapsed && (
          <div className="bg-black dark:bg-[#7C3AED] rounded-lg p-1.5 mx-auto">
            <Shield className="h-5 w-5 text-white" />
          </div>
        )}
        <button 
          onClick={toggleCollapse}
          className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors", isCollapsed && "hidden")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar py-4 flex flex-col gap-6">
        {navigation.map((section) => (
          <div key={section.section} className="px-3">
            {!isCollapsed && (
              <h3 className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                        isActive 
                          ? "bg-black dark:bg-[#7C3AED] text-white shadow-md shadow-black/10 font-semibold" 
                          : "text-slate-600 dark:text-[#A1A6C4] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B2345]"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors stroke-[1.5]", 
                        isActive ? "text-white" : "text-slate-500 dark:text-[#A1A6C4] group-hover:text-slate-900 dark:group-hover:text-white"
                      )} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer / Account */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <Link
          to="/super-admin/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group mb-1",
            location.pathname === '/super-admin/profile' && "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          )}
          title={isCollapsed ? "Profile" : undefined}
        >
          <User className="h-[18px] w-[18px] shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 stroke-[1.5]" />
          {!isCollapsed && <span className="truncate">Profile</span>}
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 stroke-[1.5]" />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
      
      {isCollapsed && (
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-white"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </aside>
  );
}
