import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, Eye, Edit2, Play, Pause, Trash2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SAConfirmDialog } from '../components/SAConfirmDialog';
import { SuperAdminService, clearAllSAData } from '../services/super-admin.service';
import type { Organization, OrganizationStatus, PaginationParams } from '../types/super-admin.types';

export function OrganizationsPage() {
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [params, setParams] = useState<PaginationParams & { status: string; type: string; plan?: string }>({
    page: 1,
    pageSize: 15,
    search: '',
    status: '',
    type: '',
    plan: ''
  });

  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; orgId: string; orgName: string }>({
    open: false, orgId: '', orgName: ''
  });

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; orgId: string; orgName: string }>({
    open: false, orgId: '', orgName: ''
  });

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getOrganizations(params);
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
    if (!suspendDialog.orgId) return;
    await SuperAdminService.updateOrganizationStatus(suspendDialog.orgId, 'SUSPENDED', reason);
    setSuspendDialog({ open: false, orgId: '', orgName: '' });
    loadData();
  };

  const handleReactivate = async (id: string) => {
    await SuperAdminService.updateOrganizationStatus(id, 'ACTIVE');
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteDialog.orgId) return;
    await SuperAdminService.deleteOrganization(deleteDialog.orgId);
    setDeleteDialog({ open: false, orgId: '', orgName: '' });
    loadData();
  };

  const handleResetAll = async () => {
    const shouldBypass = new URLSearchParams(window.location.search).get('noconfirm') === 'true';
    if (shouldBypass || confirm('⚠️ This will permanently delete ALL organizations, client admins, and their data. Continue?')) {
      await clearAllSAData();
      loadData();
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      key: 'name',
      header: 'Organization',
      cell: (org) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{org.name}</div>
          <div className="text-xs text-slate-500">{org.businessName}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      cell: (org) => <span className="text-sm">{org.type.replace(/_/g, ' ')}</span>
    },
    {
      key: 'contact',
      header: 'Primary Contact',
      cell: (org) => (
        <div>
          <div className="text-sm text-slate-900 dark:text-slate-300">{org.primaryContact.name}</div>
          <div className="text-xs text-slate-500">{org.primaryContact.email}</div>
        </div>
      )
    },
    {
      key: 'facilities',
      header: 'Facilities',
      cell: (org) => <span className="text-sm font-medium">{org.facilityCount}</span>
    },
    {
      key: 'status',
      header: 'Status',
      cell: (org) => <SAStatusBadge status={org.status} dot />
    },
    {
      key: 'created',
      header: 'Created',
      cell: (org) => <span className="text-sm text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (org) => (
        <div className="flex items-center justify-end">
          <div className="relative group">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded transition-colors">
              <span className="text-xl leading-none">⋮</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
              <Link to={`/super-admin/organizations/${org.id}`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                View Organization
              </Link>
              <Link to={`/super-admin/organizations/${org.id}?tab=admins`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Manage Client Admins
              </Link>
              <Link to={`/super-admin/organizations/${org.id}?tab=facilities`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                View Facilities
              </Link>
              <hr className="border-slate-200 dark:border-slate-800 my-1" />
              {org.status === 'SUSPENDED' ? (
                <button onClick={() => handleReactivate(org.id)} className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  Reactivate
                </button>
              ) : (
                <button onClick={() => setSuspendDialog({ open: true, orgId: org.id, orgName: org.name })} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Suspend Organization
                </button>
              )}
              <button onClick={() => setDeleteDialog({ open: true, orgId: org.id, orgName: org.name })} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                <span className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete Organization</span>
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Organizations" 
        description="Manage all client organizations, their facilities, and subscriptions."
        actions={
          <div className="flex items-center gap-2">
            {import.meta.env.DEV && (
              <button
                onClick={handleResetAll}
                className="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/50 transition-colors"
                title="Dev only: clear all data"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Reset All Data
              </button>
            )}
            <Link
              to="/super-admin/organizations/create"
              className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 -ml-1" />
              Create Organization
            </Link>
          </div>
        }
      />

      <SAFilterBar 
        searchPlaceholder="Search organizations by name or email..."
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
              { label: 'Onboarding', value: 'ONBOARDING' },
              { label: 'Past Due', value: 'PAST_DUE' },
              { label: 'Suspended', value: 'SUSPENDED' },
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
              { label: 'Hotel', value: 'HOTEL' },
              { label: 'University', value: 'UNIVERSITY' },
              { label: 'Corporate Campus', value: 'CORPORATE_CAMPUS' },
              { label: 'Commercial Parking', value: 'COMMERCIAL_PARKING' },
              { label: 'Government', value: 'GOVERNMENT' },
              { label: 'Other', value: 'OTHER' },
            ]
          },
          {
            key: 'plan',
            label: 'Plans',
            value: params.plan || '',
            onChange: (plan) => setParams(p => ({ ...p, plan, page: 1 })),
            options: [
              { label: 'Starter', value: 'STARTER' },
              { label: 'Professional', value: 'PROFESSIONAL' },
              { label: 'Enterprise', value: 'ENTERPRISE' },
              { label: 'Custom', value: 'CUSTOM' }
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={Building2}
        emptyTitle="No client organizations yet."
        emptyDescription="Create a new organization to start onboarding clients to ParkEase AI."
        emptyAction={
          <Link
            to="/super-admin/organizations/create"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Create Organization
          </Link>
        }
        pagination={{
          page: params.page,
          totalPages,
          total,
          onPageChange: (page) => setParams(p => ({ ...p, page }))
        }}
      />

      <SAConfirmDialog
        open={suspendDialog.open}
        onOpenChange={(open) => !open && setSuspendDialog({ open: false, orgId: '', orgName: '' })}
        title={`Suspend ${suspendDialog.orgName}?`}
        description="This will immediately revoke access for all client admins of this organization. Facilities will be taken offline."
        confirmLabel="Suspend Organization"
        destructive
        requireReason
        onConfirm={handleSuspend}
      />

      <SAConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, orgId: '', orgName: '' })}
        title={`Delete ${deleteDialog.orgName}?`}
        description="This will permanently delete the organization and all associated data — client admins, subscriptions, invoices, and facilities. This action cannot be undone."
        confirmLabel="Delete Organization"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
