import { useEffect, useState } from 'react';
import { Receipt, Download } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { Invoice, PaginationParams } from '../types/super-admin.types';

export function BillingPage() {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getInvoices(params);
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

  const columns: ColumnDef<Invoice>[] = [
    {
      key: 'invoice',
      header: 'Invoice #',
      cell: (inv) => (
        <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
          {inv.id}
        </span>
      )
    },
    {
      key: 'org',
      header: 'Organization',
      cell: (inv) => <span className="text-sm">{inv.organizationName}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (inv) => (
        <span className="text-sm font-medium">
          ₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (inv) => <SAStatusBadge status={inv.status} dot />
    },
    {
      key: 'createdAt',
      header: 'Issued Date',
      cell: (inv) => <span className="text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</span>
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (inv) => <span className="text-sm text-slate-500">{new Date(inv.dueDate).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (inv) => (
        <button 
          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Invoices & Billing" 
        description="Track all generated invoices, payments, and outstanding balances."
      />

      <SAFilterBar 
        searchPlaceholder="Search by invoice # or organization..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Paid', value: 'PAID' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Overdue', value: 'OVERDUE' },
              { label: 'Void', value: 'VOID' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={Receipt}
        emptyTitle="No invoices found."
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
