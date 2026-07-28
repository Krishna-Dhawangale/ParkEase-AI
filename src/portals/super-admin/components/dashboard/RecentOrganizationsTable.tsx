import { Link } from 'react-router-dom';
import type { SADashboardOrganization } from '../../types/super-admin.types';
import { SAEmptyState } from '../SAEmptyState';
import { Building2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface Props {
  organizations: SADashboardOrganization[];
}

export function RecentOrganizationsTable({ organizations }: Props) {
  const hasOrgs = organizations.length > 0;

  return (
    <div className="xl:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/50">
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">Recent Organizations</h2>
        {hasOrgs && (
          <Link to="/super-admin/organizations" className="text-[12px] text-brand-600 hover:text-brand-700 font-medium">
            View all
          </Link>
        )}
      </div>
      
      {hasOrgs ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/50 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-5 py-3 font-medium">Organization</th>
                <th className="px-5 py-3 font-medium">Facilities</th>
                <th className="px-5 py-3 font-medium">Subscription</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created On</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-[13px]">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{org.name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{org.facilities}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{org.plan}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-[11px] px-2 py-0.5 rounded font-medium",
                      org.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
                      org.status === 'ONBOARDING' ? "bg-amber-50 text-amber-600" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-slate-400 hover:text-slate-600">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <SAEmptyState 
            icon={Building2}
            title="No organizations yet"
            description="When clients sign up, their organizations will appear here."
            action={<button className="text-[12px] font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded transition-colors">Add Organization</button>}
          />
        </div>
      )}
    </div>
  );
}
