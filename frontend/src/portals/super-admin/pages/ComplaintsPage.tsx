import { useEffect, useState } from 'react';
import { MessageSquare, AlertTriangle, User, ExternalLink } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SADataTable, type ColumnDef } from '../components/SADataTable';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SAFilterBar } from '../components/SAFilterBar';
import { SuperAdminService } from '../services/super-admin.service';

interface Complaint {
  id: string;
  facilityName: string;
  organizationName: string;
  userName: string;
  issueType: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
}

export function ComplaintsPage() {
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [params, setParams] = useState({
    page: 1,
    pageSize: 15,
    search: '',
    status: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate API
      await new Promise(resolve => setTimeout(resolve, 600));
      setData([
        {
          id: 'CMP-9921',
          facilityName: 'Phoenix Marketcity Main',
          organizationName: 'Phoenix Group',
          userName: 'John Doe',
          issueType: 'Payment Failure',
          description: 'Money deducted but boom barrier did not open.',
          status: 'OPEN',
          createdAt: new Date().toISOString()
        },
        {
          id: 'CMP-9922',
          facilityName: 'Apollo Hospital North',
          organizationName: 'Apollo Hospitals',
          userName: 'Jane Smith',
          issueType: 'Hardware Malfunction',
          description: 'Kiosk screen was completely frozen, caused a jam.',
          status: 'INVESTIGATING',
          createdAt: new Date(Date.now() - 86400000).toISOString()
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

  const columns: ColumnDef<Complaint>[] = [
    {
      key: 'id',
      header: 'ID',
      cell: (c) => <span className="font-mono text-xs text-slate-500">{c.id}</span>
    },
    {
      key: 'details',
      header: 'Issue Details',
      cell: (c) => (
        <div className="max-w-md">
          <div className="font-medium text-slate-900 dark:text-white mb-1">{c.issueType}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 truncate" title={c.description}>
            {c.description}
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Facility',
      cell: (c) => (
        <div className="text-sm">
          <div className="font-medium text-slate-700 dark:text-slate-300">{c.facilityName}</div>
          <div className="text-xs text-slate-500">{c.organizationName}</div>
        </div>
      )
    },
    {
      key: 'user',
      header: 'End User',
      cell: (c) => (
        <div className="text-sm flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <User className="w-3.5 h-3.5" />
          {c.userName}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <SAStatusBadge status={c.status} dot />
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: () => (
        <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors" title="Investigate">
          <ExternalLink className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="End-User Complaints" 
        description="Monitor escalations and serious complaints from end-users that require platform intervention."
      />

      <SAFilterBar 
        searchPlaceholder="Search complaints..."
        searchValue={params.search}
        onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        filters={[
          {
            key: 'status',
            label: 'Statuses',
            value: params.status,
            onChange: (status) => setParams(p => ({ ...p, status, page: 1 })),
            options: [
              { label: 'Open', value: 'OPEN' },
              { label: 'Investigating', value: 'INVESTIGATING' },
              { label: 'Resolved', value: 'RESOLVED' },
            ]
          }
        ]}
      />

      <SADataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyIcon={MessageSquare}
        emptyTitle="No complaints found."
      />
    </div>
  );
}
