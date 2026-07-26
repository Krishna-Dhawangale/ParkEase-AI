import { useEffect, useState } from 'react';
import { Clock, Download, Search } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { AuditLog, PaginationParams } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

export function AuditLogsPage() {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { resource: string; action: string }>({
    page: 1,
    pageSize: 20,
    search: '',
    resource: '',
    action: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getAuditLogs(params);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  const columns: ColumnDef<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (log) => (
        <span className="text-sm font-mono text-slate-500 whitespace-nowrap">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      )
    },
    {
      key: 'actor',
      header: 'Actor',
      cell: (log) => (
        <div className="text-sm">
          <div className="font-medium text-slate-900 dark:text-white">{log.actor}</div>
          <div className="text-xs text-slate-500">{log.actorRole}</div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      cell: (log) => (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono uppercase",
          log.action.includes('CREATE') ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          log.action.includes('UPDATE') ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          log.action.includes('DELETE') ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        )}>
          {log.action}
        </span>
      )
    },
    {
      key: 'entity',
      header: 'Entity',
      cell: (log) => (
        <div className="text-sm">
          <div className="font-medium text-slate-700 dark:text-slate-300">{log.resource}</div>
          <div className="text-xs font-mono text-slate-500">{log.resourceId}</div>
        </div>
      )
    },
    {
      key: 'metadata',
      header: 'Details',
      cell: (log) => (
        <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block" title={JSON.stringify(log.metadata)}>
          {JSON.stringify(log.metadata)}
        </span>
      )
    },
    {
      key: 'ip',
      header: 'IP Address',
      cell: (log) => <span className="font-mono text-xs text-slate-500">{log.resourceId}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Audit Logs" 
        description="Immutable record of all administrative actions taken within the platform."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      <SAFilterBar 
        searchPlaceholder="Search by Actor ID, Entity ID, or metadata..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'resource',
            label: 'Entities',
            value: params.resource,
            onChange: (resource) => setParams(p => ({ ...p, resource, page: 1 })),
            options: [
              { label: 'Organization', value: 'ORGANIZATION' },
              { label: 'Facility', value: 'FACILITY' },
              { label: 'Client Admin', value: 'CLIENT_ADMIN' },
              { label: 'System Setting', value: 'SYSTEM_SETTING' },
            ]
          },
          {
            key: 'action',
            label: 'Actions',
            value: params.action,
            onChange: (action) => setParams(p => ({ ...p, action, page: 1 })),
            options: [
              { label: 'Create', value: 'CREATE' },
              { label: 'Update', value: 'UPDATE' },
              { label: 'Delete', value: 'DELETE' },
              { label: 'Suspend', value: 'SUSPEND' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={Clock}
        emptyTitle="No audit logs found."
        pagination={{
          page: params.page,
          totalPages,
          total,
          onPageChange: (page) => setParams(p => ({ ...p, page }))
        }}
      />
    </div>
  );
}
