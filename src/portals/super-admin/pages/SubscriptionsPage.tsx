import { useEffect, useState } from 'react';
import { CreditCard, Calendar } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { Subscription, PaginationParams } from '../types/super-admin.types';

export function SubscriptionsPage() {
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string; planId: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
    planId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getSubscriptions(params);
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

  const columns: ColumnDef<Subscription>[] = [
    {
      key: 'org',
      header: 'Organization',
      cell: (sub) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {sub.organizationName}
        </span>
      )
    },
    {
      key: 'plan',
      header: 'Plan',
      cell: (sub) => (
        <div className="text-sm">
          <div className="font-medium">{sub.planName}</div>
          <div className="text-xs text-slate-500">{sub.billingCycle}</div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (sub) => (
        <span className="text-sm font-medium">
          ₹{sub.amount.toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (sub) => <SAStatusBadge status={sub.status} dot />
    },
    {
      key: 'startDate',
      header: 'Start Date',
      cell: (sub) => <span className="text-sm text-slate-500">{new Date(sub.startDate).toLocaleDateString()}</span>
    },
    {
      key: 'nextBilling',
      header: 'Next Billing',
      cell: (sub) => (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(sub.renewalDate).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: () => (
        <button className="text-brand-600 hover:text-brand-500 text-sm font-medium">
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Active Subscriptions" 
        description="Monitor client subscriptions, plan tiers, and upcoming renewals."
      />

      <SAFilterBar 
        searchPlaceholder="Search by organization..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Past Due', value: 'PAST_DUE' },
              { label: 'Canceled', value: 'CANCELED' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={CreditCard}
        emptyTitle="No subscriptions found."
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
