import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Building2, CheckCircle2, Copy, ShieldAlert, AlertCircle } from 'lucide-react';
import { SuperAdminService } from '../services/super-admin.service';
import type { Organization, ClientAdmin } from '../types/super-admin.types';

export function CreateClientAdminPage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    organizationId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
  });

  const [provisionResult, setProvisionResult] = useState<{
    user: ClientAdmin;
    temporaryPassword: string;
  } | null>(null);

  useEffect(() => {
    loadOrgs();
  }, []);

  const loadOrgs = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.getOrganizations({ page: 1, pageSize: 1000, status: 'ACTIVE' });
      setOrganizations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId) {
      setError("Please select an organization.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await SuperAdminService.createClientAdmin(formData);
      setProvisionResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to create client admin account.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (provisionResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 mt-12">
          <div className="flex flex-col items-center text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Client Admin Created</h2>
              <p className="text-slate-500 mt-1">
                The administrator account has been provisioned successfully. Please provide these credentials securely to the user.
              </p>
            </div>
            
            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-500">Organization</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{provisionResult.user.organizationName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-500">Administrator</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{provisionResult.user.firstName} {provisionResult.user.lastName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 block">Login Email</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{provisionResult.user.email}</span>
                </div>
                <button type="button" onClick={() => copyToClipboard(provisionResult.user.email)} className="text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 block">Temporary Password</span>
                  <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{provisionResult.temporaryPassword}</span>
                </div>
                <button type="button" onClick={() => copyToClipboard(provisionResult.temporaryPassword)} className="text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-400 p-4 rounded-xl text-sm flex items-start gap-3 text-left">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">Important Security Notice</strong>
                This temporary password is shown only once for initial account provisioning. The administrator will be forced to change it upon first login.
              </div>
            </div>

            <div className="pt-4 flex w-full gap-3">
              <button 
                onClick={() => navigate(`/super-admin/client-admins/${provisionResult.user.id}`)}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                View Account Details
              </button>
              <button 
                onClick={() => navigate('/super-admin/client-admins')}
                className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Back to Client Admins
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create Client Admin</h1>
          <p className="text-slate-500 mt-1">Provision a new administrator for an existing ParkEase organization.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {error && (
          <div className="m-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-brand-600" />
              Organization Assignment
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Client Organization <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.organizationId}
                onChange={e => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all disabled:opacity-50"
                disabled={loading}
              >
                <option value="" disabled>Select an organization...</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name} ({org.type})</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">Only ACTIVE organizations are available for provisioning.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserPlus className="w-5 h-5 text-brand-600" />
              Administrator Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Rahul"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sharma"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@organization.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Operations Manager"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/super-admin/client-admins')}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm shadow-brand-500/20"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Provisioning...
                </>
              ) : (
                'Create Client Admin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
