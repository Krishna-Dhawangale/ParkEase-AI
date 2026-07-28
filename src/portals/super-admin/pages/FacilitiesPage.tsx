import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server, Eye, Pause, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SAConfirmDialog } from '../components/SAConfirmDialog';
import { SuperAdminService } from '../services/super-admin.service';
import type { SAFacility, PaginationParams } from '../types/super-admin.types';

export function FacilitiesPage() {
  const [data, setData] = useState<SAFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string; type: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
    type: ''
  });

  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; facId: string; facName: string }>({
    open: false, facId: '', facName: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getFacilities(params);
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

  const handleSuspend = async (reason?: string) => {
    if (!suspendDialog.facId || !reason) return;
    await SuperAdminService.suspendFacility(suspendDialog.facId, reason);
    setSuspendDialog({ open: false, facId: '', facName: '' });
    loadData();
  };

  const columns: ColumnDef<SAFacility>[] = [
    {
      key: 'name',
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
      header: 'Location / Type',
      cell: (f) => (
        <div className="text-sm">
          <div>{f.city}, {f.state}</div>
          <div className="text-xs text-slate-500">{f.type.replace(/_/g, ' ')}</div>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Occupancy',
      cell: (f) => (
        <div className="text-sm">
          <div className="font-medium">{f.currentOccupancy} / {f.slots}</div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
            <div 
              className="bg-brand-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, (f.currentOccupancy / Math.max(1, f.slots)) * 100)}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'health',
      header: 'Health',
      cell: (f) => (
        <div className="flex items-center gap-2 text-sm">
          {f.digitalTwinStatus === 'SYNCED' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500"  />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-slate-300">|</span>
          {f.deviceHealth === 'HEALTHY' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500"  />
          ) : f.deviceHealth === 'NO_DEVICES' ? (
            <span className="text-xs text-slate-500">No Devices</span>
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (f) => <SAStatusBadge status={f.approvalStatus} dot />
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (f) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            to={`/super-admin/facilities/${f.id}`}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
            
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          {f.approvalStatus === 'LIVE' && (
            <button 
              onClick={() => setSuspendDialog({ open: true, facId: f.id, facName: f.name })}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Facilities"
        description="Monitor all parking facilities operating on the platform."
      />

      <SAFilterBar 
        searchPlaceholder="Search facilities by name, org, or city..."
        searchValue={params.search || ''}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Live', value: 'LIVE' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Suspended', value: 'SUSPENDED' },
              { label: 'Under Review', value: 'UNDER_REVIEW' },
              { label: 'Draft', value: 'DRAFT' },
            ]
          },
          {
            key: 'type',
            label: 'Types',
            value: params.type,
            onChange: (type) => setParams(p => ({ ...p, type, page: 1 })),
            options: [
              { label: 'Mall', value: 'MALL' },
              { label: 'Airport', value: 'AIRPORT' },
              { label: 'Hospital', value: 'HOSPITAL' },
              { label: 'Commercial', value: 'COMMERCIAL_PARKING' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={Server}
        emptyTitle="No facilities found."
        pagination={{
          page: params.page,
          totalPages,
          total,
          onPageChange: (page) => setParams(p => ({ ...p, page }))
        }}
      />

      <SAConfirmDialog
        open={suspendDialog.open}
        onOpenChange={(open) => !open && setSuspendDialog({ open: false, facId: '', facName: '' })}
        title={`Suspend Facility: ${suspendDialog.facName}?`}
        description="This will immediately take the facility offline. Users will not be able to book, and devices will stop processing entry/exit. An email will be sent to the Client Admin."
        confirmLabel="Suspend Facility"
        destructive
        requireReason
        onConfirm={handleSuspend}
      />
    </div>
  );
}
