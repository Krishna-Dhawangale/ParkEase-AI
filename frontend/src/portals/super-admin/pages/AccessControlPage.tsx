import { ShieldCheck, UserCheck, Key, Settings2 } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';

export function AccessControlPage() {
  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Access Control & Roles" 
        description="Manage roles, permissions, and access policies for internal ParkEase AI staff."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SUPER_ADMIN</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Full unrestricted access to all platform features, including billing and destructive actions.</p>
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">Capabilities:</div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
            <li>Manage Organizations & Facilities</li>
            <li>Modify Subscription Plans</li>
            <li>View all Audit Logs</li>
            <li>System Configuration</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SUPPORT_STAFF</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Limited access for customer support and troubleshooting.</p>
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">Capabilities:</div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
            <li>Read-only access to Organizations</li>
            <li>Manage Support Tickets & Complaints</li>
            <li>Cannot modify Billing or Plans</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-6 flex items-start gap-3">
        <Key className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Custom Roles Disabled</h4>
          <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
            Creation of custom internal roles is restricted in the current environment to comply with the standard security baseline. Please contact the security team for exceptions.
          </p>
        </div>
      </div>
    </div>
  );
}
