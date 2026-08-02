import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Search, Calendar, Box, Wallet, Car, Activity, CreditCard,
  User, HelpCircle, Settings, LogOut, Bell, Moon, ChevronDown,
  LayoutGrid, Menu, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Find Parking', icon: Search, path: '/customer/search' },
  { name: 'My Bookings', icon: Calendar, path: '/customer/bookings' },
  { name: 'Digital Twin', icon: Box, path: '/customer/digital-twin' },
  { name: 'Payments', icon: CreditCard, path: '/customer/payments' },
  { name: 'Vehicles', icon: Car, path: '/customer/vehicles' },
  { name: 'Activity', icon: Activity, path: '/customer/activity' },
  { name: 'Profile', icon: User, path: '/customer/profile' },
  { name: 'Support', icon: HelpCircle, path: '/customer/support' },
  { name: 'Settings', icon: Settings, path: '/customer/settings' },
];

export function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-[#161D36] text-gray-900 dark:text-slate-100">
      <div className="p-[22px] flex items-center gap-3 border-b border-gray-200 dark:border-[#232A45]">
        <div className="w-8 h-8 bg-black dark:bg-[#7C3AED] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-bold text-xl leading-none tracking-tighter">P</span>
        </div>
        <div>
          <h1 className="font-bold text-xl leading-none tracking-tight text-gray-900 dark:text-white">ParkEase AI</h1>
          <p className="text-[10px] text-gray-500 dark:text-[#A1A6C4] font-medium mt-0.5">Smart Parking, Smarter City.</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (location.pathname === '/customer' && item.path === '/customer/search') ||
                           location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-black dark:bg-[#7C3AED] text-white shadow-md shadow-black/10 font-semibold" 
                  : "text-gray-600 dark:text-[#A1A6C4] hover:bg-gray-100 dark:hover:bg-[#1B2345] hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-gray-500 dark:text-[#A1A6C4] group-hover:text-gray-900 dark:group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 shrink-0">
        <div className="bg-[#F8FAFC] dark:bg-[#111628] rounded-2xl p-5 border border-gray-200 dark:border-[#232A45] mb-2 overflow-hidden relative hidden md:block">
          <h4 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight mb-1">Park smarter, save time</h4>
          <p className="text-[12px] text-gray-500 dark:text-[#A1A6C4] leading-snug mb-4">Find and book the best parking spots in your city.</p>
          <Button variant="primary" size="sm" className="w-full text-xs font-semibold rounded-lg shadow-sm bg-black dark:bg-[#7C3AED] hover:bg-gray-800 dark:hover:bg-[#8B5CF6] text-white border-0" onClick={() => navigate('/customer/search')}>
            Find Parking
          </Button>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 dark:bg-purple-900/30 rounded-full opacity-50 blur-2xl"></div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[15px] font-medium text-gray-600 dark:text-[#A1A6C4] hover:bg-gray-100 dark:hover:bg-[#1B2345] hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] text-gray-500 dark:text-[#A1A6C4]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0A0F1C] font-sans text-gray-900 dark:text-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-white dark:bg-[#161D36] border-r border-gray-200 dark:border-[#232A45] hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#161D36] shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen relative bg-[#F9FAFB] dark:bg-[#0A0F1C]">
        {/* Top Navigation */}
        <header className="h-[64px] md:h-[72px] bg-white/80 dark:bg-[#161D36]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#232A45] flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-[#A1A6C4] hover:bg-gray-100 dark:hover:bg-[#1B2345] md:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#232A45] bg-white dark:bg-[#111628] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1B2345] text-gray-700 dark:text-slate-200 transition-colors shrink-0">
              <Box className="w-4 h-4 text-gray-500 dark:text-[#A1A6C4]" />
              <span className="hidden md:inline">User Portal</span>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-[#A1A6C4]" />
            </button>
            
            <div className="relative w-full max-w-md hidden md:block group ml-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-[18px] w-[18px] text-gray-400 dark:text-[#A1A6C4] group-focus-within:text-black dark:group-focus-within:text-white transition-colors" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search parking lots, locations..."
                className="block w-full pl-10 pr-[88px] py-2.5 border border-gray-200 dark:border-[#232A45] rounded-full leading-5 bg-gray-50/50 dark:bg-[#111628] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-purple-500/20 focus:border-gray-300 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#161D36] sm:text-sm transition-all shadow-sm"
              />
              <div className="absolute inset-y-1 right-1">
                <Button size="sm" className="h-full rounded-full px-5 text-xs bg-black dark:bg-[#7C3AED] hover:bg-gray-800 dark:hover:bg-[#8B5CF6] text-white">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="md:hidden flex-1" />
          </div>

          <div className="flex items-center gap-2 md:gap-5 ml-4 shrink-0">
            <button className="md:hidden p-2 rounded-full text-gray-500 dark:text-[#A1A6C4] hover:bg-gray-100 dark:hover:bg-[#1B2345] hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => navigate('/customer/search')}>
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>

            <button className="relative p-2 rounded-full text-gray-500 dark:text-[#A1A6C4] hover:bg-gray-100 dark:hover:bg-[#1B2345] hover:text-gray-900 dark:hover:text-white transition-colors">
              <Bell className="h-5 w-5" strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-black dark:bg-[#7C3AED] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#161D36]">
                3
              </span>
            </button>
            
            <div className="hidden sm:block">
              <ThemeToggle size="sm" />
            </div>

            <div className="flex items-center gap-3 pl-2 md:border-l md:border-gray-200 cursor-pointer hover:opacity-80 transition-opacity ml-1 md:ml-0">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || 'Prathamesh'}&backgroundColor=000000`} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-gray-900 hidden sm:block truncate max-w-[100px]">{user?.firstName || 'Prathamesh'}</span>
            </div>
          </div>
        </header>

        {/* Page Content Area - Native Scroll */}
        <div className="flex-1 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
