import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, MoreVertical, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAFilterBar, type FilterOption } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';
import type { ClientAdmin, Organization } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function ClientAdminsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ClientAdmin[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [page, setPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getClientAdmins({ page, pageSize: 20, search, status, organizationId });
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgs = async () => {
    try {
      const res = await SuperAdminService.getOrganizations({ page: 1, pageSize: 1000 });
      setOrganizations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, organizationId, page]);

  const handleAction = async (action: 'disable' | 'enable' | 'delete', userId: string) => {
    try {
      if (action === 'disable') {
        if (confirm("Are you sure you want to disable this account?")) {
          await SuperAdminService.updateClientAdminStatus(userId, 'DISABLED');
          loadData();
        }
      } else if (action === 'enable') {
        if (confirm("Are you sure you want to re-enable this account?")) {
          await SuperAdminService.updateClientAdminStatus(userId, 'ACTIVE');
          loadData();
        }
      } else if (action === 'delete') {
        if (confirm("Are you sure you want to permanently delete this admin account? This cannot be undone.")) {
          await SuperAdminService.deleteClientAdmin(userId);
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    }
  };

  const statusOptions: FilterOption[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Invited', value: 'INVITED' },
    { label: 'Locked', value: 'LOCKED' },
    { label: 'Disabled', value: 'DISABLED' },
  ];

  const orgOptions: FilterOption[] = [
    { label: 'All Organizations', value: '' },
    ...organizations.map(o => ({ label: o.name, value: o.id }))
  ];

  const columns: ColumnDef<ClientAdmin>[] = [
    {
      key: 'admin',
      header: 'Admin',
      cell: (user) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-slate-500">{user.email}</div>
        </div>
      )
    },
    {
      key: 'organization',
      header: 'Organization',
      cell: (user) => <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.organizationName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      cell: (user) => (
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center w-fit gap-1",
          user.status === 'DISABLED' 
            ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            : user.status === 'INVITED'
            ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50" 
            : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50"
        )}>
          {user.status === 'DISABLED' ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          {user.status}
        </span>
      )
    },
    {
      key: 'login',
      header: 'Last Login',
      cell: (user) => <span className="text-sm text-slate-500">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</span>
    },
    {
      key: 'created',
      header: 'Created',
      cell: (user) => <span className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (user) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-white dark:bg-slate-900 rounded-lg p-1 shadow-md border border-slate-200 dark:border-slate-800 z-50 text-sm"
              sideOffset={4}
              align="end"
            >
              <DropdownMenu.Item 
                onClick={() => navigate(`/super-admin/client-admins/${user.id}`)}
                className="flex items-center px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer outline-none"
              >
                View Details
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
              
              {user.status === 'DISABLED' ? (
                <DropdownMenu.Item 
                  onClick={() => handleAction('enable', user.id)}
                  className="flex items-center px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md cursor-pointer outline-none font-medium"
                >
                  Enable Account
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item 
                  onClick={() => handleAction('disable', user.id)}
                  className="flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md cursor-pointer outline-none font-medium"
                >
                  Disable Account
                </DropdownMenu.Item>
              )}
              
              <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
              
              <DropdownMenu.Item 
                onClick={() => handleAction('delete', user.id)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md cursor-pointer outline-none font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Admin
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Client Admins" 
        description="Manage administrators for ParkEase client organizations."
        actions={
          <button
            onClick={() => navigate('/super-admin/client-admins/new')}
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2 -ml-1" />
            Create Client Admin
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <SAFilterBar
            searchPlaceholder="Search by name, email, or organization..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'organization',
                label: 'Organization',
                options: orgOptions,
                value: organizationId,
                onChange: setOrganizationId
              },
              {
                key: 'status',
                label: 'Status',
                options: statusOptions,
                value: status,
                onChange: setStatus
              }
            ]}
          />
        </div>

        <SADataTable
          columns={columns}
          data={data}
          loading={loading}
          emptyIcon={User}
          emptyTitle="No Client Admin accounts yet."
          emptyDescription="Create an administrator for a ParkEase client organization."
          emptyAction={
            <button
              onClick={() => navigate('/super-admin/client-admins/new')}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Create Client Admin
            </button>
          }
        />
      </div>
    </div>
  );
}
