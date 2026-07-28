import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SALoadingState } from '../components/SALoadingState';
import { SAErrorState } from '../components/SAErrorState';
import { SADateRangePicker } from '../components/SADateRangePicker';
import { SuperAdminService } from '../services/super-admin.service';
import { AnimatedStatusBadge } from '../../../components/motion/AnimatedStatusBadge';

// Dashboard Components
import { DashboardMetricsRow } from '../components/dashboard/DashboardMetricsRow';
import { RevenueOverview } from '../components/dashboard/RevenueOverview';
import { PlatformOverview } from '../components/dashboard/PlatformOverview';
import { PendingFacilityApprovals } from '../components/dashboard/PendingFacilityApprovals';
import { SystemHealthList } from '../components/dashboard/SystemHealthList';
import { RecentOrganizationsTable } from '../components/dashboard/RecentOrganizationsTable';
import { RecentAlertsList } from '../components/dashboard/RecentAlertsList';

import type { 
  SADashboardData, 
  SADashboardAlert, 
  SADashboardOrganization, 
  SADashboardFacilityApproval,
  SADashboardSystemHealth
} from '../types/super-admin.types';

export function SuperAdminDashboard() {
  const [data, setData] = useState<{ 
    metrics: SADashboardData; 
    alerts: SADashboardAlert[];
    organizations: SADashboardOrganization[];
    approvals: SADashboardFacilityApproval[];
    health: SADashboardSystemHealth[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await SuperAdminService.getDashboard();
      setData(res);
    } catch (err: any) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <SALoadingState fullPage message="Loading platform metrics..." />;
  }

  if (error || !data) {
    return <SAErrorState message={error} onRetry={loadData} />;
  }

  const { metrics, alerts, organizations, approvals, health } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AnimatedStatusBadge 
          status="warning" 
          label="Zero State Simulation" 
          animateIn={true}
          pulseIcon={true}
        />
        <SADateRangePicker />
      </div>

      <DashboardMetricsRow data={metrics} />

      {/* Middle Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <RevenueOverview revenue={metrics.revenue} />
        <PlatformOverview 
          platform={metrics.platform} 
          digitalTwins={metrics.digitalTwins}
          devices={metrics.devices}
          support={metrics.support}
        />
        <SystemHealthList health={health} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
        <RecentOrganizationsTable organizations={organizations} />
        <PendingFacilityApprovals approvals={approvals} />
        <RecentAlertsList alerts={alerts} />
      </div>
      
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200 pt-4 pb-4">
        <div>© 2026 ParkEase AI. All rights reserved.</div>
        <div>Need help? <Link to="/super-admin/support" className="text-brand-600 hover:underline">Contact Support</Link></div>
      </div>
    </div>
  );
}
