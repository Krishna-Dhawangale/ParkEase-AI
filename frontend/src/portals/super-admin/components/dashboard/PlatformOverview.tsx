import { ShieldAlert, Car, MonitorPlay, Wifi, Ticket, AlertTriangle } from 'lucide-react';
import type { SADashboardData } from '../../types/super-admin.types';

interface Props {
  platform: SADashboardData['platform'];
  digitalTwins: SADashboardData['digitalTwins'];
  devices: SADashboardData['devices'];
  support: SADashboardData['support'];
}

export function PlatformOverview({ platform, digitalTwins, devices, support }: Props) {
  const totalTwins = digitalTwins.connected + digitalTwins.disconnected + digitalTwins.degraded;
  const totalDevices = devices.online + devices.offline + devices.warning;

  return (
    <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col shadow-sm">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-5">Platform Overview</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <ShieldAlert className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Bookings Processed Today</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{platform.bookingsToday}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Car className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Active Parking Sessions</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{platform.activeSessions}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <MonitorPlay className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Digital Twins Connected</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
            {digitalTwins.connected} / {totalTwins}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Wifi className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Devices Online</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
            {devices.online} / {totalDevices}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Ticket className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Open Support Tickets</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{support.openTickets}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <AlertTriangle className="w-[18px] h-[18px] stroke-[1.5]" />
            <span className="text-[13px]">Open Complaints</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{support.openComplaints}</span>
        </div>
      </div>
    </div>
  );
}
