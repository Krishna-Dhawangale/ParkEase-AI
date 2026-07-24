import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OwnerSidebar } from '../modules/owner/components/OwnerSidebar';
import { useAuthStore, useThemeStore } from '../store';
import { cn } from '../lib/utils';
import { Menu, Sun, Moon, Bell, Shield, Activity, RefreshCw } from 'lucide-react';

export const OwnerLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const user = useAuthStore(s => s.user);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <OwnerSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        setMobileOpen={setIsMobileOpen}
      />

      {/* Top Navbar for Facility Operator */}
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-20 h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md transition-all duration-300 flex items-center px-4 sm:px-6 justify-between',
          isCollapsed ? 'lg:left-[72px]' : 'lg:left-64'
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Facility Operator Portal</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Facility ID: LOT-01</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Telemetry
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications Button */}
          <button className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
              {user?.firstName ? user.firstName[0] : 'O'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Facility Manager'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">
                {user?.subRole ? user.subRole.replace('_', ' ') : 'Facility Admin'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Operational Canvas */}
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
