import { Settings, Bell, Shield, Database } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <SAPageHeader 
        title="Platform Settings" 
        description="Global configuration for the ParkEase AI SaaS platform."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-200 dark:divide-slate-800">
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Security & Authentication</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Configure password policies, MFA requirements, and session limits for all portals.</p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Require MFA for all Super Admins</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Enforce strict password complexity (min 12 chars, special, number)</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Session Timeout (minutes)</label>
                  <input type="number" defaultValue={60} className="block w-full max-w-xs rounded-md border-0 py-1.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 sm:text-sm dark:bg-slate-950" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">System Notifications</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Alerting for system health, degraded operations, and critical audit events.</p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Email alerts for CRITICAL severity events</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Slack integration for deployment logs</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-md shadow-sm transition-colors">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
