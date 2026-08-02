import { useEffect, useState } from 'react';
import { MonitorPlay, ShieldCheck, AlertTriangle, WifiOff, Clock } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SuperAdminService } from '../services/super-admin.service';
import type { DigitalTwinEntry } from '../types/super-admin.types';

export function DigitalTwinsPage() {
  const [data, setData] = useState<DigitalTwinEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getDigitalTwins();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Simulate real-time monitoring updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const columns: ColumnDef<DigitalTwinEntry>[] = [
    {
      key: 'facility',
      header: 'Facility',
      cell: (t) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{t.facilityName}</div>
          <div className="text-xs text-slate-500">{t.organizationName}</div>
        </div>
      )
    },
    {
      key: 'version',
      header: 'Published Version',
      cell: (t) => (
        <span className="text-sm font-medium">
          {t.publishedVersion ? `v${t.publishedVersion}.0` : '—'}
        </span>
      )
    },
    {
      key: 'scale',
      header: 'Scale',
      cell: (t) => (
        <div className="text-sm">
          <div>{t.slots} Slots</div>
          <div className="text-xs text-slate-500">{t.floors} Floors</div>
        </div>
      )
    },
    {
      key: 'connection',
      header: 'WebSocket',
      cell: (t) => (
        <div className="flex items-center gap-1.5">
          {t.wsConnected ? (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="flex h-2 w-2 relative">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {t.wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Sync Status',
      cell: (t) => <SAStatusBadge status={t.syncStatus} dot />
    },
    {
      key: 'updated',
      header: 'Last Sync',
      cell: (t) => (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          {t.lastUpdated ? (
            <>
              <Clock className="w-3 h-3" />
              {new Date(t.lastUpdated).toLocaleString()}
            </>
          ) : 'Never'}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (t) => (
        <button 
          disabled={t.syncStatus === 'NOT_CONFIGURED'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MonitorPlay className="w-3.5 h-3.5" /> Inspect
        </button>
      )
    }
  ];

  const stats = {
    synced: data.filter(d => d.syncStatus === 'SYNCED').length,
    degraded: data.filter(d => d.syncStatus === 'DEGRADED').length,
    disconnected: data.filter(d => d.syncStatus === 'DISCONNECTED').length,
  };

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Digital Twin Monitor" 
        description="Monitor real-time synchronization and WebSocket connectivity for all deployed Digital Twins."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-emerald-800 dark:text-emerald-500 text-sm font-medium mb-1">Synced & Healthy</div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">{stats.synced}</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-amber-800 dark:text-amber-500 text-sm font-medium mb-1">Degraded Performance</div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-400">{stats.degraded}</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-red-800 dark:text-red-500 text-sm font-medium mb-1">Disconnected</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-400">{stats.disconnected}</div>
          </div>
          <WifiOff className="w-8 h-8 text-red-500 opacity-80" />
        </div>
      </div>

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={MonitorPlay}
        emptyTitle="No Digital Twins found."
      />
    </div>
  );
}
