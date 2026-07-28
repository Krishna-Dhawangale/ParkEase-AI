import { useState, useEffect } from 'react';
import { useAuthStore, useTenantStore } from '../../../store';
import { FacilityService, type ClientFacility } from './facility.service';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  CheckCircle2,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function ParkingList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentTenant } = useTenantStore();
  const [facilities, setFacilities] = useState<ClientFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tenantId = user?.tenantId || currentTenant?.id;

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!tenantId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await FacilityService.getByTenant(tenantId);
        setFacilities(data);
      } catch (err) {
        console.error('Failed to load facilities', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilities();
  }, [tenantId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-gray-500">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>Loading facilities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#F9FAFB] dark:bg-[#09090b]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Parking Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your facilities, operating hours, pricing, and digital twin layouts.
          </p>
        </div>
        <button onClick={() => navigate('/admin/parking/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </div>

      <div className="px-6 lg:px-8 max-w-7xl mx-auto">
        {facilities.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 rounded-xl">
            <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Facilities Found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mb-6">
              You don't have any parking facilities configured yet. Create your first facility to get started.
            </p>
            <button onClick={() => navigate('/admin/parking/new')} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Facility
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map(facility => (
              <div 
                key={facility.id} 
                onClick={() => navigate(`/admin/parking/${facility.id}`)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      facility.status === 'DRAFT' && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                      facility.status === 'PENDING_APPROVAL' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      facility.status === 'APPROVED' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                      facility.status === 'LIVE' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      facility.status === 'REJECTED' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {facility.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors">
                    {facility.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {facility.address}, {facility.city}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Capacity</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{facility.totalCapacity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Type</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{facility.type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Manage Facility</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
