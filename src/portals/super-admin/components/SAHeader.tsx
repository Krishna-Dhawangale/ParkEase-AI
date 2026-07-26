import { Bell, Search, Menu, ChevronDown, User, Shield, Settings, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLocation } from 'react-router-dom';
import { useSASidebarStore } from '../store/super-admin.store';
import { cn } from '../../../lib/utils';
import { useAuthStore } from '../../../store';
import { useEffect, useState } from 'react';
import { SuperAdminService } from '../services/super-admin.service';

export function SAHeader() {
  const { isCollapsed } = useSASidebarStore();
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('organizations')) return { title: 'Organizations', subtitle: 'Manage client organizations and tenants' };
    if (path.includes('approvals')) return { title: 'Facility Approvals', subtitle: 'Review and approve pending facilities' };
    if (path.includes('facilities')) return { title: 'Facilities', subtitle: 'Global facility management' };
    if (path.includes('digital-twins')) return { title: 'Digital Twin Monitor', subtitle: 'Monitor 3D visualization systems' };
    if (path.includes('devices')) return { title: 'Devices & Cameras', subtitle: 'Hardware and camera monitoring' };
    if (path.includes('operations')) return { title: 'Platform Operations', subtitle: 'System health and operational metrics' };
    if (path.includes('plans')) return { title: 'SaaS Plans', subtitle: 'Manage subscription tiers' };
    if (path.includes('subscriptions')) return { title: 'Subscriptions', subtitle: 'Client subscription management' };
    if (path.includes('billing')) return { title: 'Billing', subtitle: 'Invoices and payment processing' };
    if (path.includes('revenue')) return { title: 'Revenue', subtitle: 'SaaS revenue analytics' };
    if (path.includes('support')) return { title: 'Support Tickets', subtitle: 'B2B support queue' };
    if (path.includes('complaints')) return { title: 'Complaints', subtitle: 'End-user complaint monitoring' };
    if (path.includes('audit')) return { title: 'Audit Logs', subtitle: 'System-wide activity history' };
    if (path.includes('security')) return { title: 'Security', subtitle: 'Platform security posture' };
    if (path.includes('access-control')) return { title: 'Access Control', subtitle: 'Role and permission management' };
    if (path.includes('system-health')) return { title: 'System Health', subtitle: 'Microservice status' };
    if (path.includes('settings')) return { title: 'Platform Settings', subtitle: 'Global configuration' };
    if (path.includes('client-admins')) return { title: 'Client Admins', subtitle: 'Manage tenant administrators' };
    if (path.includes('onboarding')) return { title: 'Client Onboarding', subtitle: 'Track new client activation' };
    
    return { title: 'Dashboard', subtitle: 'Overview of ParkEase AI platform' };
  };

  const { title, subtitle } = getPageInfo();

  useEffect(() => {
    setUnreadCount(SuperAdminService.getUnreadCount());
    const interval = setInterval(() => {
      setUnreadCount(SuperAdminService.getUnreadCount());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={cn(
      "h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 transition-all duration-300",
      isCollapsed ? "ml-16" : "ml-64"
    )}>
      
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-4 min-w-[250px]">
        <button 
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Sidebar"
          // We can wire this to toggleCollapse if needed for mobile, but on desktop it's already in sidebar.
          // Including it here to match the requested design exactly.
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight">{subtitle}</p>
        </div>
      </div>
      {/* Global Search - Centered */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors stroke-[1.5]" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all sm:text-sm"
            placeholder="Search organizations, facilities, clients, tickets... (Ctrl+K)"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center border border-slate-200 dark:border-slate-700 rounded px-1.5 text-[10px] font-sans font-medium text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 min-w-[250px] justify-end">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full transition-colors focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="h-[18px] w-[18px] stroke-[1.5]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
          )}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 outline-none">
              <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                SA
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[13px] font-medium text-slate-900 dark:text-white leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {user?.email || 'superadmin@parkease.ai'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              className="min-w-[220px] bg-white dark:bg-slate-900 rounded-md p-1 shadow-lg border border-slate-200 dark:border-slate-800 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
              sideOffset={5}
            >
              <DropdownMenu.Item className="group text-[13px] leading-none text-slate-700 dark:text-slate-300 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-800 cursor-pointer">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="group text-[13px] leading-none text-slate-700 dark:text-slate-300 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-800 cursor-pointer">
                <Shield className="w-4 h-4 mr-2 text-slate-400" />
                Security
              </DropdownMenu.Item>
              <DropdownMenu.Item className="group text-[13px] leading-none text-slate-700 dark:text-slate-300 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-800 cursor-pointer">
                <Settings className="w-4 h-4 mr-2 text-slate-400" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-slate-200 dark:bg-slate-800 m-1" />
              <DropdownMenu.Item className="group text-[13px] leading-none text-red-600 dark:text-red-400 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-50 dark:data-[highlighted]:bg-red-900/30 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
