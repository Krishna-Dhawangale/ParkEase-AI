import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OwnerSidebar } from '../modules/owner/components/OwnerSidebar';
import { useAuthStore } from '../store';
import { cn } from '../lib/utils';
import { Menu, Bell, Shield, Activity } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const OwnerLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useAuthStore(s => s.user);

  return (
    <div className="min-h-screen bg-bg-app text-txt-primary font-sans">
      <OwnerSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        setMobileOpen={setIsMobileOpen}
      />

      {/* Top Navbar for Facility Operator */}
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-20 h-16 border-b border-bdr bg-bg-card/90 backdrop-blur-md transition-all duration-300 flex items-center px-4 sm:px-6 justify-between',
          isCollapsed ? 'lg:left-[72px]' : 'lg:left-64'
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-bg-secondary text-txt-secondary hover:text-txt-primary"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-owner-subtle border border-owner/20 text-owner">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Facility Operator Portal</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-bg-secondary text-txt-secondary text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-owner animate-pulse" />
            <span>Facility ID: LOT-01</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-semantic-success-bg border border-semantic-success-border text-semantic-success text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
            Live Telemetry
          </div>

          {/* Theme Toggle */}
          <ThemeToggle compact />

          {/* Notifications Button */}
          <button className="relative p-2 rounded-xl bg-bg-secondary hover:bg-bg-hover text-txt-secondary transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-owner" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-bdr">
            <div className="w-8 h-8 rounded-full bg-owner flex items-center justify-center font-bold text-xs text-white">
              {user?.firstName ? user.firstName[0] : 'O'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-txt-primary leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Facility Manager'}
              </p>
              <p className="text-[10px] text-owner font-medium">
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
