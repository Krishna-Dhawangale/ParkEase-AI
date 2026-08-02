import { useEffect, useState } from 'react';
import { LifeBuoy, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { SupportTicket, PaginationParams } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

export function SupportPage() {
  const [data, setData] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string; priority: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
    priority: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getSupportTickets(params);
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

  const columns: ColumnDef<SupportTicket>[] = [
    {
      key: 'ticket',
      header: 'Ticket & Subject',
      cell: (t) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white mb-0.5">{t.subject}</div>
          <div className="text-xs text-slate-500 font-mono">{t.id}</div>
        </div>
      )
    },
    {
      key: 'reporter',
      header: 'Reporter',
      cell: (t) => (
        <div className="text-sm">
          <div className="font-medium text-slate-700 dark:text-slate-300">{t.organizationName}</div>
          <div className="text-xs text-slate-500">{t.facilityName || 'Global'}</div>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (t) => (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
          t.priority === 'URGENT' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50" :
          t.priority === 'HIGH' ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50" :
          t.priority === 'MEDIUM' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50" :
          "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
        )}>
          {t.priority}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (t) => <SAStatusBadge status={t.status} dot />
    },
    {
      key: 'created',
      header: 'Created At',
      cell: (t) => (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(t.createdAt).toLocaleString()}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (t) => (
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50 rounded-md transition-colors border border-brand-200 dark:border-brand-800/50">
          <MessageSquare className="w-3.5 h-3.5" /> Reply
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="B2B Support Tickets" 
        description="Handle issues and requests submitted by Client Admins."
      />

      <SAFilterBar 
        searchPlaceholder="Search by ticket ID, subject, or org..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Open', value: 'OPEN' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Waiting on Client', value: 'WAITING_ON_CLIENT' },
              { label: 'Resolved', value: 'RESOLVED' },
            ]
          },
          {
            key: 'priority',
            label: 'Priorities',
            value: params.priority,
            onChange: (priority) => setParams(p => ({ ...p, priority, page: 1 })),
            options: [
              { label: 'Critical', value: 'URGENT' },
              { label: 'High', value: 'HIGH' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Low', value: 'LOW' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={LifeBuoy}
        emptyTitle="No support tickets found."
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
