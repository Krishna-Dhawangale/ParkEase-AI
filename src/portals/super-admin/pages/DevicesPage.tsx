import { useEffect, useState } from 'react';
import { Video, ShieldCheck, AlertTriangle, WifiOff, MapPin, Building2, TerminalSquare, RotateCcw } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  facilityName: string;
  organizationName: string;
  ipAddress: string;
  lastPing: string;
  firmwareVersion: string;
}

export function DevicesPage() {
  const [data, setData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [params, setParams] = useState({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
    type: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate API call for devices
      await new Promise(resolve => setTimeout(resolve, 600));
      setData([
        {
          id: 'DEV-001',
          name: 'Main Gate EN-1',
          type: 'ANPR_CAMERA',
          status: 'ONLINE',
          facilityName: 'Phoenix Marketcity Main',
          organizationName: 'Phoenix Group',
          ipAddress: '192.168.1.101',
          lastPing: new Date().toISOString(),
          firmwareVersion: 'v2.4.1'
        },
        {
          id: 'DEV-002',
          name: 'Main Gate EX-1',
          type: 'BOOM_BARRIER',
          status: 'ONLINE',
          facilityName: 'Phoenix Marketcity Main',
          organizationName: 'Phoenix Group',
          ipAddress: '192.168.1.102',
          lastPing: new Date().toISOString(),
          firmwareVersion: 'v1.8.0'
        },
        {
          id: 'DEV-003',
          name: 'Basement P1 EN-1',
          type: 'RFID_READER',
          status: 'OFFLINE',
          facilityName: 'Apollo Hospital North',
          organizationName: 'Apollo Hospitals',
          ipAddress: '10.0.0.45',
          lastPing: new Date(Date.now() - 3600000).toISOString(),
          firmwareVersion: 'v3.0.2'
        },
        {
          id: 'DEV-004',
          name: 'Valet Kiosk 1',
          type: 'KIOSK',
          status: 'DEGRADED',
          facilityName: 'Taj Mahal Palace',
          organizationName: 'Taj Hotels',
          ipAddress: '172.16.0.12',
          lastPing: new Date(Date.now() - 5000).toISOString(),
          firmwareVersion: 'v4.1.0'
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  const columns: ColumnDef<Device>[] = [
    {
      key: 'device',
      header: 'Device',
      cell: (d) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            {d.type === 'ANPR_CAMERA' && <Video className="w-3.5 h-3.5 text-slate-400" />}
            {d.type === 'BOOM_BARRIER' && <TerminalSquare className="w-3.5 h-3.5 text-slate-400" />}
            {d.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{d.id} · {d.ipAddress}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      cell: (d) => <span className="text-sm">{d.type.replace(/_/g, ' ')}</span>
    },
    {
      key: 'location',
      header: 'Location',
      cell: (d) => (
        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {d.facilityName}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 pl-5">{d.organizationName}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (d) => (
        <div className="flex items-center gap-2">
          {d.status === 'ONLINE' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> :
           d.status === 'DEGRADED' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
           <WifiOff className="w-4 h-4 text-red-500" />}
          <span className="text-sm font-medium">{d.status}</span>
        </div>
      )
    },
    {
      key: 'lastPing',
      header: 'Last Ping',
      cell: (d) => (
        <span className="text-sm text-slate-500">
          {new Date(d.lastPing).toLocaleTimeString()}
        </span>
      )
    },
    {
      key: 'firmware',
      header: 'Firmware',
      cell: (d) => <span className="text-sm">{d.firmwareVersion}</span>
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (d) => (
        <button 
          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="Restart Device"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Hardware & Devices" 
        description="Monitor the health of IoT devices (Cameras, Booms, Kiosks) across all facilities."
      />

      <SAFilterBar 
        searchPlaceholder="Search by device ID, name, or IP..."
        searchValue={params.search}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Online', value: 'ONLINE' },
              { label: 'Offline', value: 'OFFLINE' },
              { label: 'Degraded', value: 'DEGRADED' },
            ]
          },
          {
            key: 'type',
            label: 'Device Types',
            value: params.type,
            onChange: (type) => setParams(p => ({ ...p, type, page: 1 })),
            options: [
              { label: 'ANPR Camera', value: 'ANPR_CAMERA' },
              { label: 'Boom Barrier', value: 'BOOM_BARRIER' },
              { label: 'RFID Reader', value: 'RFID_READER' },
              { label: 'Kiosk', value: 'KIOSK' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={Video}
        emptyTitle="No devices found."
      />
    </div>
  );
}
