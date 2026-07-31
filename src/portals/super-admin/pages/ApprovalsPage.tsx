import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Eye, Clock, AlertTriangle } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { SAFacility, PaginationParams } from '../types/super-admin.types';

export function ApprovalsPage() {
  const [data, setData] = useState<SAFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = SuperAdminService.subscribeToFacilityApprovals(params, (res) => {
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params]);

  const columns: ColumnDef<SAFacility>[] = [
    {
      key: 'facility',
      header: 'Facility',
      cell: (f) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{f.name}</div>
          <div className="text-xs text-slate-500">{f.organizationName}</div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      cell: (f) => (
        <div className="text-sm">
          <div>{f.city}, {f.state}</div>
          <div className="text-xs text-slate-500">{f.type.replace(/_/g, ' ')}</div>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (f) => (
        <div className="text-sm">
          <div>{f.slots} Slots</div>
          <div className="text-xs text-slate-500">{f.floors} Floors</div>
        </div>
      )
    },
    {
      key: 'readiness',
      header: 'Readiness',
      cell: (f) => {
        const issues = [];
        if (!f.pricingConfigured) issues.push('Pricing');
        if (!f.entryExitConfigured) issues.push('Entry/Exit');
        if (f.digitalTwinStatus === 'NOT_CONFIGURED') issues.push('Digital Twin');

        if (issues.length === 0) {
          return <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400"><CheckSquare className="w-3 h-3 mr-1" /> Ready</span>;
        }
        return (
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-500" title={`Missing: ${issues.join(', ')}`}>
            <AlertTriangle className="w-3 h-3 mr-1" /> Missing {issues.length} item(s)
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      cell: (f) => <SAStatusBadge status={f.approvalStatus} dot />
    },
    {
      key: 'submitted',
      header: 'Submitted',
      cell: (f) => (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          {f.submittedAt ? (
            <>
              <Clock className="w-3 h-3" />
              {new Date(f.submittedAt).toLocaleDateString()}
            </>
          ) : 'Not submitted'}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (f) => (
        <Link 
          to={`/super-admin/approvals/${f.id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4" /> Review
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Facility Approvals" 
        description="Review and approve client facilities before they go live on the platform."
      />

      <SAFilterBar 
        searchPlaceholder="Search facilities or organizations..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Under Review', value: 'UNDER_REVIEW' },
              { label: 'Changes Requested', value: 'CHANGES_REQUESTED' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Draft', value: 'DRAFT' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={CheckSquare}
        emptyTitle="No facilities require approval."
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
