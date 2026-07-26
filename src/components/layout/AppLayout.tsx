import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Brain, GitMerge, CalendarCheck,
  CreditCard, Ticket, User, Gift, HelpCircle,
  Bell, Menu, X, ChevronLeft, ChevronRight,
  Car, Zap, ChevronDown, Workflow, Settings, LogOut
} from 'lucide-react';
import { useThemeStore, useSidebarStore, useAuthStore } from '../../store';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';
import React from 'react';

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
};

const customerNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Find Parking', path: '/search' },
  { icon: Brain, label: 'AI Recommendation', path: '/ai-recommendation' },
  { icon: GitMerge, label: 'Digital Twin View', path: '/digital-twin', badge: 'Live' },
  { icon: CalendarCheck, label: 'Book Parking', path: '/book' },
  { icon: CreditCard, label: 'Payment & Wallet', path: '/payment' },
  { icon: Ticket, label: 'My Passes & Tickets', path: '/ticket' },
  { icon: Gift, label: 'Rewards & Perks', path: '/rewards', badge: 'New' },
  { icon: Workflow, label: 'Project Workflow', path: '/workflow', badge: 'SRS' },
];

const secondaryNav: NavItem[] = [
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '3' },
  { icon: HelpCircle, label: 'Support & Help', path: '/support' },
  { icon: User, label: 'My Garage & Profile', path: '/profile' },
];

export function AppLayout() {
  const { preference, cycleTheme } = useThemeStore();
  const { collapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarProfileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
        setAvatarOpen(false);
      }
      if (sidebarProfileDropdownRef.current && !sidebarProfileDropdownRef.current.contains(event.target as Node)) {
        setSidebarProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-bdr',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-md">
          <Car className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-[15px] text-txt-primary whitespace-nowrap">
                ParkEase <span className="text-brand">AI</span>
              </span>
              <span className="block text-[9px] font-semibold text-brand uppercase tracking-wider">
                Customer Workspace
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Customer Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand px-3 mb-2">Driver Portal</p>
        )}
        {customerNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'sidebar-item group relative',
                isActive && 'active font-semibold',
                collapsed && 'justify-center px-0 py-2.5'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full badge-brand">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="my-3 border-t border-bdr" />

        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-txt-muted px-3 mb-2">Account & Help</p>
        )}
        {secondaryNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'sidebar-item group relative',
                isActive && 'active font-semibold',
                collapsed && 'justify-center px-0 py-2.5'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full badge-danger">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom - Theme & User */}
      <div className="p-3 border-t border-bdr space-y-2">
        <ThemeToggle showLabel={!collapsed} />

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-item w-full text-red-600 dark:text-red-400 hover:bg-semantic-danger-bg hover:text-red-700 dark:hover:text-red-300',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold">Logout</span>
          )}
        </button>

        {!collapsed && (
          <div className="relative animate-fade-in" ref={sidebarProfileDropdownRef}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-hover transition-all cursor-pointer select-none border border-transparent hover:border-brand/20",
                sidebarProfileOpen && "bg-bg-hover border-brand/20"
              )}
              onClick={() => setSidebarProfileOpen(!sidebarProfileOpen)}
            >
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-txt-primary truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Customer User'}
                </p>
                <p className="text-[10px] text-brand font-medium">
                  Driver Persona
                </p>
              </div>
              <ChevronDown className={cn("w-3 h-3 text-txt-muted transition-transform duration-200", sidebarProfileOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
              {sidebarProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-glass-heavy backdrop-blur-2xl border border-bdr rounded-2xl shadow-modal py-1.5 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      navigate('/profile', { state: { activeTab: 'Overview' } });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-txt-secondary hover:bg-bg-hover rounded-xl transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-brand" />
                    My Profile & Garage
                  </button>

                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      navigate('/profile', { state: { activeTab: 'Settings' } });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-txt-secondary hover:bg-bg-hover rounded-xl transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-brand" />
                    Settings
                  </button>

                  <div className="border-t border-bdr my-1" />

                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-semantic-danger-bg rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-bg-app text-txt-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(var(--brand-rgb),0.10),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.07),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.05),_transparent_24%)]" />

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col flex-shrink-0 border-r border-bdr bg-sidebar-bg backdrop-blur-2xl relative z-20 shadow-card"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <SidebarContent />
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-card border border-bdr flex items-center justify-center shadow-soft hover:shadow-card transition-all z-30"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-brand" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-brand" />
          )}
        </button>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-glass-heavy backdrop-blur-2xl border-r border-bdr z-50 lg:hidden flex flex-col"
            >
              <SidebarContent onItemClick={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-bg-hover"
              >
                <X className="w-4 h-4 text-txt-muted" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 h-16 bg-navbar-bg backdrop-blur-2xl border-b border-bdr z-10" style={{ borderColor: 'var(--navbar-border)' }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-bg-hover transition-colors"
          >
            <Menu className="w-4 h-4 text-txt-muted" />
          </button>

          {/* Customer Workspace Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-subtle border border-brand/20 text-brand">
            <Car className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Customer Portal</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block ml-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted" />
              <input
                type="text"
                placeholder="Search parking facilities, slots..."
                className="input-field pl-8 pr-4 py-2 text-xs"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-semantic-success-bg border border-semantic-success-border">
              <span className="live-dot" />
              <span className="text-[11px] font-semibold text-semantic-success">Driver Live</span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle compact />

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl hover:bg-bg-hover transition-colors"
            >
              <Bell className="w-4 h-4 text-txt-muted" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Quick action */}
            <button
              onClick={() => navigate('/book')}
              className="btn-primary text-xs px-3 py-2 hidden sm:flex"
            >
              <Zap className="w-3.5 h-3.5" />
              Book Slot
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={avatarDropdownRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                U
              </button>

              <AnimatePresence>
                {avatarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 bg-glass-heavy backdrop-blur-2xl border border-bdr rounded-2xl shadow-modal py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-bdr">
                      <p className="text-xs font-semibold text-txt-primary truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Customer User'}
                      </p>
                      <p className="text-[10px] text-txt-muted truncate mt-0.5">
                        {user?.email || 'user@parkease.ai'}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded badge-brand mt-2">
                        Customer Driver
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          navigate('/profile', { state: { activeTab: 'Overview' } });
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-txt-secondary hover:bg-bg-hover rounded-xl transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-brand" />
                        My Profile & Garage
                      </button>

                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          navigate('/profile', { state: { activeTab: 'Settings' } });
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-txt-secondary hover:bg-bg-hover rounded-xl transition-colors text-left"
                      >
                        <Settings className="w-3.5 h-3.5 text-brand" />
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-bdr my-1" />

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-semantic-danger-bg rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-transparent">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative h-full"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-card/50 to-transparent" />
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex items-center justify-around py-2 bg-glass-heavy backdrop-blur-2xl border-t border-bdr safe-area-bottom">
          {customerNavItems.slice(0, 4).concat([{ icon: User, path: '/profile', label: 'Profile' }]).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                  isActive
                    ? 'text-brand'
                    : 'text-txt-muted'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
