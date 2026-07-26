import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Server, Building2, MapPin, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SABreadcrumbs } from '../components/SABreadcrumbs';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SALoadingState } from '../components/SALoadingState';
import { SAErrorState } from '../components/SAErrorState';
import { SuperAdminService } from '../services/super-admin.service';
import type { SAFacility } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

export function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<SAFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'twin' | 'devices' | 'health' | 'activity'>('overview');
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await SuperAdminService.getFacility(id);
          setFacility(data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <SALoadingState fullPage />;
  if (!facility) return <SAErrorState message="Facility not found." />;

  return (
    <div className="space-y-6">
      <SABreadcrumbs items={[
        { label: 'Facilities', href: '/super-admin/facilities' },
        { label: facility.name }
      ]} />
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl border border-brand-100 dark:border-brand-800">
            <Server className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{facility.name}</h1>
              <SAStatusBadge status={facility.approvalStatus} dot />
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {facility.organizationName}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {facility.city}, {facility.state}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'config', label: 'Configuration' },
            { id: 'twin', label: 'Digital Twin' },
            { id: 'devices', label: 'Devices' },
            { id: 'health', label: 'Operational Health' },
            { id: 'activity', label: 'Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 dark:hover:border-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Live Operations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Occupancy</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{facility.currentOccupancy} <span className="text-sm font-normal text-slate-500">/ {facility.slots}</span></div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Today's Bookings</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{facility.bookingsToday}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Twin Status</div>
                    <div className="mt-2"><SAStatusBadge status={facility.digitalTwinStatus} dot /></div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Device Health</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{facility.deviceHealth.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Facility Details</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Type</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{facility.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Operating Hours</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{facility.operatingHours || '24/7'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Floors</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{facility.floors}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Total Slots</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{facility.slots}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Facility Created</div>
                      <div className="text-xs text-slate-500">{new Date(facility.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {facility.submittedAt && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        <Activity className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Go-Live Requested</div>
                        <div className="text-xs text-slate-500">{new Date(facility.submittedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {facility.approvedAt && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Approved & Live</div>
                        <div className="text-xs text-slate-500">{new Date(facility.approvedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
            This section will be populated in subsequent implementation phases.
          </div>
        )}
      </div>
    </div>
  );
}
