import { useState } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Brain, GitMerge, CalendarCheck,
  CreditCard, Ticket, User, Shield, BarChart3, Lightbulb,
  Bell, Menu, X, Sun, Moon, ChevronLeft, ChevronRight,
  Car, Zap, LogOut, Settings, ChevronDown
} from 'lucide-react';
import { useThemeStore, useSidebarStore } from '../../store';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Find Parking', path: '/search' },
  { icon: Brain, label: 'AI Recommendation', path: '/ai-recommendation' },
  { icon: GitMerge, label: 'Digital Twin', path: '/digital-twin', badge: 'Live' },
  { icon: CalendarCheck, label: 'Book Parking', path: '/book' },
  { icon: CreditCard, label: 'Payment', path: '/payment' },
  { icon: Ticket, label: 'My Tickets', path: '/ticket' },
];

const secondaryNav = [
  { icon: Shield, label: 'Admin', path: '/admin' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Lightbulb, label: 'AI Insights', path: '/ai-insights', badge: '6' },
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '3' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function AppLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const { collapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-[#E5E7EB] dark:border-[#334155]',
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
              <span className="font-bold text-[15px] text-[#111827] dark:text-white whitespace-nowrap">
                ParkEase <span className="text-[#0F766E] dark:text-[#14B8A6]">AI</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] px-3 mb-2">Main</p>
        )}
        {navItems.map((item) => (
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
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#14B8A6]/20 dark:text-[#14B8A6]">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="my-3 border-t border-[#E5E7EB] dark:border-[#334155]" />
        
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] px-3 mb-2">Tools</p>
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
      <div className="p-3 border-t border-[#E5E7EB] dark:border-[#334155] space-y-2">
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

        {!collapsed && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-all cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              G
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111827] dark:text-white truncate">Girish Kumar</p>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#6B7280]" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col flex-shrink-0 bg-white dark:bg-[#1E293B] border-r border-[#E5E7EB] dark:border-[#334155] relative z-20"
      >
        <SidebarContent />
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] flex items-center justify-center shadow-soft hover:shadow-card transition-all z-30"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-[#6B7280]" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-[#6B7280]" />
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
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#1E293B] border-r border-[#E5E7EB] dark:border-[#334155] z-50 lg:hidden flex flex-col"
            >
              <SidebarContent onItemClick={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#334155]"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14 bg-white dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155] z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors"
          >
            <Menu className="w-4 h-4 text-[#6B7280]" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search parking, bookings..."
                className="w-full pl-8 pr-4 py-2 text-xs bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl placeholder:text-[#9CA3AF] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#9CA3AF] bg-[#E5E7EB] dark:bg-[#334155] px-1.5 py-0.5 rounded hidden md:block">⌘K</kbd>
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
              className="p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#6B7280]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors"
            >
              <Bell className="w-4 h-4 text-[#6B7280]" />
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

            {/* Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold"
            >
              G
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A]">
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
        <nav className="lg:hidden flex items-center justify-around py-2 bg-white dark:bg-[#1E293B] border-t border-[#E5E7EB] dark:border-[#334155] safe-area-bottom">
          {[
            { icon: LayoutDashboard, path: '/dashboard', label: 'Home' },
            { icon: Search, path: '/search', label: 'Search' },
            { icon: Brain, path: '/ai-recommendation', label: 'AI' },
            { icon: GitMerge, path: '/digital-twin', label: 'Twin' },
            { icon: User, path: '/profile', label: 'Profile' },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                  isActive
                    ? 'text-[#0F766E] dark:text-[#14B8A6]'
                    : 'text-[#6B7280] dark:text-[#94A3B8]'
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
