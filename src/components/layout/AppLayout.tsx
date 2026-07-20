import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Brain, GitMerge, CalendarCheck,
  CreditCard, Ticket, User, Shield, BarChart3, Lightbulb,
  Bell, Menu, X, Sun, Moon, ChevronLeft, ChevronRight,
  Car, Zap, ChevronDown, Workflow
} from 'lucide-react';
import { useThemeStore, useSidebarStore, useAuthStore } from '../../store';
import { cn } from '../../lib/utils';
import React from 'react';

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
};

const userNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Workflow, label: 'Project Workflow', path: '/workflow', badge: 'SRS' },
  { icon: Search, label: 'Find Parking', path: '/search' },
  { icon: Brain, label: 'AI Recommendation', path: '/ai-recommendation' },
  { icon: GitMerge, label: 'Digital Twin', path: '/digital-twin', badge: 'Live' },
  { icon: CalendarCheck, label: 'Book Parking', path: '/book' },
  { icon: CreditCard, label: 'Payment', path: '/payment' },
  { icon: Ticket, label: 'My Tickets', path: '/ticket' },
];

const ownerNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Partner Dashboard', path: '/owner/dashboard' },
  { icon: Car, label: 'My Parking Lots', path: '/owner/parking' },
  { icon: BarChart3, label: 'Revenue', path: '/owner/revenue' },
];

const adminNavItems: NavItem[] = [
  { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
  { icon: BarChart3, label: 'System Analytics', path: '/analytics' },
  { icon: Lightbulb, label: 'AI Insights', path: '/ai-insights', badge: '6' },
];

const secondaryNav: NavItem[] = [
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '3' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function AppLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const { collapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.role === 'OWNER';

  const currentNavItems = isAdmin ? adminNavItems : isOwner ? ownerNavItems : userNavItems;

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
        'flex items-center gap-3 px-4 py-5 border-b border-[var(--border)] dark:border-[var(--border)]',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
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
              <span className="font-bold text-[15px] text-[var(--text-primary)] dark:text-white whitespace-nowrap">
                ParkEase <span className="text-[var(--brand)] dark:text-[var(--brand-light)]">AI</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] px-3 mb-2">Main</p>
        )}
        {currentNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'sidebar-item group relative',
                isActive && 'active',
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
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--brand)]/10 text-[var(--brand)] dark:bg-[var(--brand-light)]/20 dark:text-[var(--brand-light)]">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="my-3 border-t border-[var(--border)] dark:border-[var(--border)]" />

        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] px-3 mb-2">Tools</p>
        )}
        {secondaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  'sidebar-item group relative',
                  isActive && 'active',
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
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
      </div>

      {/* Bottom - Theme & User */}
      <div className="p-3 border-t border-[var(--border)] dark:border-[var(--border)] space-y-2">
        <button
          onClick={toggleTheme}
          className={cn(
            'sidebar-item w-full',
            collapsed && 'justify-center px-0'
          )}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Sun className="w-4 h-4 flex-shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-item w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300',
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)] transition-all cursor-pointer select-none",
                sidebarProfileOpen && "bg-[var(--bg-primary)] dark:bg-[var(--border)]"
              )}
              onClick={() => setSidebarProfileOpen(!sidebarProfileOpen)}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {isAdmin ? 'A' : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-white truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : (isAdmin ? 'Admin User' : isOwner ? 'Partner' : 'Standard User')}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                  {isAdmin ? 'System Admin' : isOwner ? 'Parking Owner' : 'Customer'}
                </p>
              </div>
              <ChevronDown className={cn("w-3 h-3 text-[var(--text-secondary)] transition-transform duration-200", sidebarProfileOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
              {sidebarProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      navigate('/profile', { state: { activeTab: 'Overview' } });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[var(--border)] rounded-xl transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      navigate('/profile', { state: { activeTab: 'Settings' } });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[var(--border)] rounded-xl transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    Settings
                  </button>

                  <div className="border-t border-[var(--border)] dark:border-[var(--border)] my-1" />

                  <button
                    onClick={() => {
                      setSidebarProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors text-left"
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
    <div className="flex h-screen bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col flex-shrink-0 bg-white dark:bg-[var(--bg-card)] border-r border-[var(--border)] dark:border-[var(--border)] relative z-20"
      >
        <SidebarContent />
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] flex items-center justify-center shadow-soft hover:shadow-card transition-all z-30"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-[var(--text-secondary)]" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-[var(--text-secondary)]" />
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[var(--bg-card)] border-r border-[var(--border)] dark:border-[var(--border)] z-50 lg:hidden flex flex-col"
            >
              <SidebarContent onItemClick={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)]"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14 bg-white dark:bg-[var(--bg-card)] border-b border-[var(--border)] dark:border-[var(--border)] z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)] transition-colors"
          >
            <Menu className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search parking, bookings..."
                className="w-full pl-8 pr-4 py-2 text-xs bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] border border-[var(--border)] dark:border-[var(--border)] rounded-xl placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-secondary)] bg-[var(--border)] dark:bg-[var(--border)] px-1.5 py-0.5 rounded hidden md:block">⌘K</kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
              <span className="live-dot" />
              <span className="text-[11px] font-semibold text-green-700 dark:text-green-400">Live</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)] transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)] transition-colors"
            >
              <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Quick action */}
            <button
              onClick={() => navigate('/book')}
              className="btn-primary text-xs px-3 py-2 hidden sm:flex"
            >
              <Zap className="w-3.5 h-3.5" />
              Book Now
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={avatarDropdownRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
              >
                {isAdmin ? 'A' : 'U'}
              </button>

              <AnimatePresence>
                {avatarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    {/* User profile summary */}
                    <div className="px-4 py-2.5 border-b border-[var(--border)] dark:border-[var(--border)]">
                      <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-white truncate">
                        {isAdmin ? 'Girish Kumar' : 'Standard User'}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] truncate mt-0.5">
                        {user?.email || 'user@parkease.ai'}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--brand)]/10 text-[var(--brand)] dark:bg-[var(--brand-light)]/20 dark:text-[var(--brand-light)] mt-2">
                        {isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          navigate('/profile', { state: { activeTab: 'Overview' } });
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[var(--border)] rounded-xl transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          navigate('/profile', { state: { activeTab: 'Settings' } });
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[var(--border)] rounded-xl transition-colors text-left"
                      >
                        <Settings className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        Settings
                      </button>

                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#F3F4F6] dark:hover:bg-[var(--border)] rounded-xl transition-colors text-left"
                      >
                        {theme === 'light' ? (
                          <>
                            <Moon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            Dark Mode
                          </>
                        ) : (
                          <>
                            <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                            Light Mode
                          </>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-[var(--border)] dark:border-[var(--border)] my-1" />

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setAvatarOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors text-left"
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
        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex items-center justify-around py-2 bg-white dark:bg-[var(--bg-card)] border-t border-[var(--border)] dark:border-[var(--border)] safe-area-bottom">
          {currentNavItems.slice(0, 4).concat([{ icon: User, path: '/profile', label: 'Profile' }]).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                  isActive
                    ? 'text-[var(--brand)] dark:text-[var(--brand-light)]'
                    : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)]'
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
