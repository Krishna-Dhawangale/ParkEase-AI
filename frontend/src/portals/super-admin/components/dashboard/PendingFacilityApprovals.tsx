import { Link } from 'react-router-dom';
import { Building2, CheckSquare } from 'lucide-react';
import type { SADashboardFacilityApproval } from '../../types/super-admin.types';
import { SAEmptyState } from '../SAEmptyState';

interface Props {
  approvals: SADashboardFacilityApproval[];
}

export function PendingFacilityApprovals({ approvals }: Props) {
  const hasApprovals = approvals.length > 0;

  return (
    <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">Pending Facility Approvals</h2>
        {hasApprovals && (
          <Link to="/super-admin/approvals" className="text-[12px] text-brand-600 hover:text-brand-700 font-medium">
            View all
          </Link>
        )}
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {hasApprovals ? (
          approvals.map((app) => (
            <div key={app.id} className="flex gap-3 items-center group">
              <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded shrink-0 overflow-hidden relative">
                 <div className="absolute inset-0 bg-brand-900/10 flex items-center justify-center">
                   <Building2 className="w-5 h-5 text-brand-500/50" />
                 </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-900 dark:text-white truncate">{app.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{app.organizationName} • {app.city}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Submitted {new Date(app.submittedAt).toLocaleDateString()}</div>
              </div>
              <Link to={`/super-admin/approvals/${app.id}`}>
                <button className="text-[11px] font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded transition-colors shrink-0">
                  Review
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <SAEmptyState 
              icon={CheckSquare}
              title="No pending approvals"
              description="Facilities submitted by Client Admins will appear here."
            />
          </div>
        )}
      </div>
    </div>
  );
}
