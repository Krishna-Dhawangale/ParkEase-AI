import { useEffect, useState } from 'react';
import { useTenantStore, useWebSocketStore, useAuthStore } from '../../../store';
import { DashboardService } from '../../../services/dashboard.service';
import { FacilityService, type ClientFacility } from '../parking/facility.service';
import {
  RefreshCw,
  Download,
  IndianRupee,
  Car,
  CalendarCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  Play,
  Settings,
  Camera,
  FileText,
  Map,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  CarFront,
  Zap,
  Plus,
  Building2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../../lib/utils';
import type { RecentBooking, RecentAlert, PeakHourDataPoint, KPICard, RevenueDataPoint } from './data';
import { Link } from 'react-router-dom';

const getFormattedDate = () => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
};

const Dashboard = () => {
  const { currentTenant } = useTenantStore();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState<KPICard[]>([]);
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [alerts, setAlerts] = useState<RecentAlert[]>([]);
  const [occupancyTrend, setOccupancyTrend] = useState<PeakHourDataPoint[]>([]);
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>([]);
  const [hasFacilities, setHasFacilities] = useState(true);
  const [draftFacility, setDraftFacility] = useState<ClientFacility | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const tenantId = user?.tenantId || currentTenant?.id || 'default';
      const [kpiData, bookingsData, alertsData, peakData, revData, facilities] = await Promise.all([
        DashboardService.getKPIs(tenantId),
        DashboardService.getRecentBookings(tenantId),
        DashboardService.getRecentAlerts(tenantId),
        DashboardService.getPeakHourData(tenantId),
        DashboardService.getRevenueData(tenantId),
        FacilityService.getByTenant(tenantId)
      ]);
      
      setHasFacilities(facilities.length > 0);
      // Show draft banner if at least one facility exists that is still DRAFT (not submitted yet)
      const firstDraft = facilities.find(f => f.status === 'DRAFT') ?? null;
      setDraftFacility(firstDraft);
      setKpis(kpiData);
      setBookings(bookingsData);
      setAlerts(alertsData);
      setOccupancyTrend(peakData);
      setRevenue(revData);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const { lastMessage } = useWebSocketStore();

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'BOOKING_UPDATE') {
        setBookings(prev => {
          const newBooking: RecentBooking = {
            id: lastMessage.payload.id,
            vehicle: 'NEW ' + Math.floor(Math.random() * 9999),
            vehicleType: 'Sedan',
            user: 'Live User',
            time: 'Just now',
            status: 'Active',
            amount: '₹0',
            slot: 'TBD'
          };
          return [newBooking, ...prev].slice(0, 5);
        });
        setKpis(prev => prev.map(kpi => {
          if (kpi.id === 'total-bookings' || kpi.id === 'occupied') {
            return { ...kpi, value: (parseInt(kpi.value.replace(/,/g, '')) + 1).toString() };
          }
          return kpi;
        }));
      } else if (lastMessage.type === 'DEVICE_STATUS') {
        setAlerts(prev => {
          const newAlert: RecentAlert = {
            id: lastMessage.payload.id,
            type: 'Sensor Offline',
            message: lastMessage.payload.message,
            priority: lastMessage.payload.status === 'Warning' ? 'Medium' : 'High',
            timestamp: 'Just now',
            status: 'Active',
            location: 'Zone A'
          };
          return [newAlert, ...prev].slice(0, 5);
        });
      }
    }
  }, [lastMessage]);

  return (
    <div className="min-h-screen pb-12 bg-[#F9FAFB] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa]">
      {/* Top Warning Banner — only show when a DRAFT facility exists */}
      {draftFacility && (
        <div className="bg-[#fffbeb] dark:bg-[#422006] border-b border-[#fcd34d] dark:border-[#78350f] px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#92400e] dark:text-[#fde68a]">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Facility is in DRAFT status.</span>
            <span className="hidden sm:inline">Configure pricing and submit for approval to go live.</span>
          </div>
          <Link to={`/admin/parking/${draftFacility.id}`} className="text-xs font-bold bg-[#f59e0b] hover:bg-[#d97706] text-white px-3 py-1 rounded transition-colors">
            Configure Now
          </Link>
        </div>
      )}

      <div className="px-6 lg:px-8 max-w-7xl mx-auto space-y-6 pt-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                draftFacility ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              )}>
                {draftFacility ? 'DRAFT' : 'LIVE'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getFormattedDate()} · {currentTenant?.name || 'Loading...'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} disabled={isLoading} className="btn-secondary p-2 aspect-square flex items-center justify-center">
              <RefreshCw className={cn("h-4 w-4 text-gray-500", isLoading && "animate-spin")} />
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between group hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Today's Revenue</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">₹0</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500" /> 0% from yesterday</p>
            </div>
          </div>

          <div className="card p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between group hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Bookings Today</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">0</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Activity className="w-3 h-3 text-gray-400" /> 0 active right now</p>
            </div>
          </div>

          <div className="card p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between group hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Vehicles Inside</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">0</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">0 entries / 0 exits</p>
            </div>
          </div>

          <div className="card p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between group hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Map className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Available Spaces</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">0 <span className="text-sm font-normal text-gray-500">/ 0</span></h3>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card border border-gray-200 dark:border-gray-800 p-1 rounded-lg bg-white dark:bg-[#09090b]">
          <div className="flex overflow-x-auto hide-scrollbar gap-1 p-1">
            <Link to="/admin/digital-twin" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <Map className="w-4 h-4" /> Digital Twin
            </Link>
            <Link to="/admin/pricing" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <IndianRupee className="w-4 h-4" /> Pricing
            </Link>
            <Link to="/admin/bookings" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <CalendarCheck className="w-4 h-4" /> View Bookings
            </Link>
            <Link to="/admin/devices" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <Camera className="w-4 h-4" /> Monitoring
            </Link>
            <Link to="/admin/reports" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4" /> Reports
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap text-gray-700 dark:text-gray-300">
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            
            {!hasFacilities ? (
              <div className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-900/50 rounded-xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Map className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Welcome to ParkEase AI</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                  Your workspace is ready. Add your first parking facility to start configuring your smart parking operation.
                </p>
                <Link
                  to="/admin/parking/new"
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add First Parking
                </Link>
              </div>
            ) : (
              <>
                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Revenue Trend (30 Days)</h3>
                <div className="h-[200px] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded border border-dashed border-gray-200 dark:border-gray-800">
                  {revenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '6px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-gray-500">Insufficient data</span>
                  )}
                </div>
              </div>

              <div className="card border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Peak Hours (Today)</h3>
                <div className="h-[200px] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded border border-dashed border-gray-200 dark:border-gray-800">
                  {occupancyTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={occupancyTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '6px', fontSize: '12px' }} cursor={{ fill: '#f3f4f6' }} />
                        <Bar dataKey="occupancy" fill="#6366f1" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-gray-500">Insufficient data</span>
                  )}
                </div>
              </div>
            </div>

            {/* Entry/Exit Activity */}
            <div className="card border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Live Entry / Exit Activity</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="p-0">
                {bookings.length > 0 ? (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 border-b border-gray-200 dark:border-gray-800 text-xs">
                      <tr>
                        <th className="px-5 py-3 font-medium">Time</th>
                        <th className="px-5 py-3 font-medium">Event</th>
                        <th className="px-5 py-3 font-medium">Vehicle</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {bookings.slice(0, 5).map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="px-5 py-3 text-gray-500 text-xs">{b.time}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {i % 2 === 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-blue-500" />}
                              <span className="text-gray-900 dark:text-gray-100">{i % 2 === 0 ? 'Entry' : 'Exit'}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs">{b.vehicle}</td>
                          <td className="px-5 py-3">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">Valid</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                    <CarFront className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No activity yet</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[250px]">Live entry and exit events will appear here once vehicles start arriving.</p>
                  </div>
                )}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Right Sidebar: Alerts & Facility Status */}
          <div className="space-y-6">
            <div className="card border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">System Alerts</h3>
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">{alerts.length}</span>
              </div>
              <div className="p-0">
                {alerts.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[300px] overflow-y-auto">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5",
                            alert.priority === 'Critical' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : 
                            alert.priority === 'High' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          )}>
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                              <span className="font-mono">{alert.location}</span>
                              <span>·</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                    <ShieldAlert className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">All Systems Normal</p>
                    <p className="text-xs text-gray-500 mt-1">No alerts or conflicts detected.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card border border-gray-200 dark:border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Live Parking Status</h3>
              
              {!hasFacilities ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No facilities configured</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium"><Map className="w-4 h-4 text-gray-400" /> Ground Floor</div>
                    <div className="text-xs font-mono text-gray-500">0 / 0</div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium"><Map className="w-4 h-4 text-gray-400" /> Basement B1</div>
                    <div className="text-xs font-mono text-gray-500">0 / 0</div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
