import { useState, useEffect } from 'react';
import { useTenantStore } from '../../../store';
import { mockParkingLots } from '../../../services/api.mock';
import type { ParkingLot } from '../../../types/models';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Settings2,
  Camera,
  Map,
  Play,
  Pause,
  AlertTriangle,
  Building2,
  IndianRupee,
  CheckCircle2,
  Activity,
  CarFront,
  Plus
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function ParkingList() {
  const { currentTenant } = useTenantStore();
  const [facilities, setFacilities] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching tenant facilities
    setIsLoading(true);
    setTimeout(() => {
      if (currentTenant) {
        // Find facilities matching tenant ID
        const tenantFacilities = mockParkingLots.filter(l => l.tenantId === currentTenant.id);
        
        // If it's a new tenant and no facilities exist in mock data, we could show empty state
        // For demonstration, if they have DRAFT status, we might show a draft facility
        if (tenantFacilities.length === 0 && currentTenant.status === 'DRAFT') {
          setFacilities([{
            id: `temp-${Date.now()}`,
            tenantId: currentTenant.id,
            name: 'Draft Facility (From Onboarding)',
            description: 'This facility was created during onboarding.',
            address: {
              street: '123 Onboarding St',
              city: 'Metropolis',
              state: 'NY',
              zipCode: '10001',
              country: 'USA',
              coordinates: { lat: 0, lng: 0 }
            },
            capacity: 50,
            basePricePerHour: 15,
            currency: 'INR',
            features: [],
            operatingHours: {} as any,
            layout: { width: 10, height: 10, slots: [], obstacles: [] },
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }]);
        } else {
          setFacilities(tenantFacilities);
        }
      }
      setIsLoading(false);
    }, 600);
  }, [currentTenant]);

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
    <div className="min-h-screen pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Parking Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your facilities, operating hours, pricing, and digital twin layouts.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </div>

      {facilities.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Facilities Found</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            You don't have any parking facilities configured yet. Create your first facility to get started.
          </p>
          <button className="btn-primary mt-6">Create Facility</button>
        </div>
      ) : (
        <div className="space-y-8">
          {facilities.map(facility => {
            const isLive = facility.isActive;
            
            return (
              <div key={facility.id} className="card border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Facility Header */}
                <div className="border-b border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border",
                      isLive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                    )}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{facility.name}</h2>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                          isLive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {isLive ? 'LIVE' : 'DRAFT'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {facility.address.street}, {facility.address.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isLive ? (
                      <button className="btn-primary flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700">
                        <Play className="w-4 h-4" /> Request Go-Live
                      </button>
                    ) : (
                      <button className="btn-secondary flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700">
                        <Pause className="w-4 h-4" /> Pause Bookings
                      </button>
                    )}
                  </div>
                </div>

                {/* Facility Stats (Zeroed initially) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-800 border-b border-gray-200 dark:border-gray-800">
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Capacity</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{facility.capacity}</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Bookings</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">0</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Base Price</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4 mr-0.5" /> {facility.basePricePerHour}/hr
                    </p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cameras Online</p>
                    <p className="text-xl font-semibold text-emerald-600">0 / 0</p>
                  </div>
                </div>

                {/* Facility Management Actions */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">Management Console</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <Settings2 className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Facility</span>
                    </button>
                    
                    <Link to="/admin/pricing" className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <IndianRupee className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Pricing</span>
                    </Link>

                    <Link to="/admin/digital-twin" className="flex flex-col items-center justify-center gap-3 p-4 border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20 rounded-lg hover:border-brand-500 hover:bg-brand-100 transition-colors group">
                      <Map className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                      <span className="text-sm font-bold text-brand-700 dark:text-brand-300">Open Digital Twin</span>
                    </Link>

                    <button className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <Clock className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operating Hours</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <CarFront className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Slots & Floors</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <AlertTriangle className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Rules</span>
                    </button>

                    <Link to="/admin/devices" className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors group">
                      <Camera className="w-6 h-6 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Hardware</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
