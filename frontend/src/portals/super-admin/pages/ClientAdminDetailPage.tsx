import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, Building2, Key, Ban, CheckCircle, Activity, Mail, Phone, Calendar, Loader2, Copy } from 'lucide-react';
import { SuperAdminService } from '../services/super-admin.service';
import type { ClientAdmin } from '../types/super-admin.types';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { cn } from '../../../lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

export function ClientAdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<ClientAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [provisionResult, setProvisionResult] = useState<{ temporaryPassword: string } | null>(null);

  const loadAdmin = async () => {
    try {
      if (!id) return;
      const res = await SuperAdminService.getClientAdmins({ page: 1, pageSize: 1 });
      // In a real app we'd fetch by ID directly, but here we just grab from the store
      const all = await SuperAdminService.getClientAdmins({ page: 1, pageSize: 1000 });
      const found = all.data.find(a => a.id === id);
      if (found) setAdmin(found);
      else navigate('/super-admin/client-admins', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const handleResetPassword = async () => {
    if (!admin) return;
    try {
      setActionLoading(true);
      const res = await SuperAdminService.resetClientAdminPassword(admin.id);
      setProvisionResult({ temporaryPassword: res.tempPassword });
      await loadAdmin();
    } catch (err) {
      console.error(err);
      alert('Failed to reset password.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!admin || !disableReason) return;
    try {
      setActionLoading(true);
      await SuperAdminService.updateClientAdminStatus(admin.id, 'DISABLED');
      setShowDisableDialog(false);
      setDisableReason('');
      await loadAdmin();
    } catch (err) {
      console.error(err);
      alert('Failed to disable account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!admin) return;
    try {
      setActionLoading(true);
      await SuperAdminService.updateClientAdminStatus(admin.id, 'ACTIVE');
      await loadAdmin();
    } catch (err) {
      console.error(err);
      alert('Failed to enable account.');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {admin.firstName} {admin.lastName}
              </h1>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center w-fit gap-1",
                admin.status === 'DISABLED' 
                  ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                  : admin.status === 'INVITED'
                  ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50" 
                  : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50"
              )}>
                {admin.status === 'DISABLED' ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {admin.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">
              {admin.role.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {admin.status === 'DISABLED' ? (
            <button
              onClick={handleEnable}
              disabled={actionLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
            >
              {actionLoading ? 'Enabling...' : 'Enable Account'}
            </button>
          ) : (
            <button
              onClick={() => setShowDisableDialog(true)}
              className="px-4 py-2 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Disable Account
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Account Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <dt className="text-sm font-medium text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</dt>
                  <dd className="mt-1.5 text-sm text-slate-900 dark:text-white font-medium">{admin.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</dt>
                  <dd className="mt-1.5 text-sm text-slate-900 dark:text-white font-medium">{admin.phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Role</dt>
                  <dd className="mt-1.5 text-sm text-slate-900 dark:text-white font-medium">{admin.role.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date Created</dt>
                  <dd className="mt-1.5 text-sm text-slate-900 dark:text-white font-medium">{new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Linked Organization</h3>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white">{admin.organizationName}</h4>
                <p className="text-sm text-slate-500 mt-1">Tenant ID: {admin.organizationId}</p>
              </div>
              <button
                onClick={() => navigate(`/super-admin/organizations/${admin.organizationId}`)}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg transition-colors"
              >
                View Organization &rarr;
              </button>
            </div>
          </div>
          
        </div>

        {/* Right Column - Security & Status */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Security</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Login Access</span>
                {admin.mustChangePassword ? (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-2 rounded text-medium">
                    <Key className="w-4 h-4" /> Password Change Pending
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 p-2 rounded text-medium">
                    <CheckCircle className="w-4 h-4" /> Password Set
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Last Login</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never logged in'}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowResetDialog(true)}
                  className="w-full justify-center flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Disable Dialog */}
      <Dialog.Root open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 z-50">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">Disable Account</Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 mt-2">
              This will immediately revoke login access for {admin.firstName} {admin.lastName}. They will not be able to access the Client Portal.
            </Dialog.Description>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason <span className="text-red-500">*</span></label>
              <select
                value={disableReason}
                onChange={e => setDisableReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white outline-none"
              >
                <option value="" disabled>Select a reason...</option>
                <option value="Employee left organization">Employee left organization</option>
                <option value="Organization requested account suspension">Organization requested suspension</option>
                <option value="Security concern">Security concern</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDisableDialog(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable}
                disabled={actionLoading || !disableReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-500 disabled:opacity-50"
              >
                {actionLoading ? 'Disabling...' : 'Disable Account'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reset Password Initial Dialog */}
      <Dialog.Root open={showResetDialog && !provisionResult} onOpenChange={setShowResetDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 z-50">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">Reset Password</Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 mt-2">
              The administrator's existing password will no longer be usable after the reset is completed. A new temporary credential will be generated and a password change will be required on their next login.
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={actionLoading}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 disabled:opacity-50"
              >
                {actionLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reset Password Success (Temporary Credential) */}
      <Dialog.Root open={!!provisionResult} onOpenChange={(open) => {
        if (!open) {
          setProvisionResult(null);
          setShowResetDialog(false);
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 z-50">
            
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white">Password Reset Successful</h4>
              <p className="text-sm text-slate-500">Provide this temporary credential to the administrator.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-sans block text-xs mb-0.5">Login Email</span>
                  <span className="text-slate-900 dark:text-white font-medium">{admin.email}</span>
                </div>
                <button onClick={() => copyToClipboard(admin.email)} className="text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 p-1.5 rounded transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-sans block text-xs mb-0.5">New Temporary Password</span>
                  <span className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                    {provisionResult?.temporaryPassword}
                  </span>
                </div>
                <button onClick={() => copyToClipboard(provisionResult?.temporaryPassword || '')} className="text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 p-1.5 rounded transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setProvisionResult(null);
                  setShowResetDialog(false);
                }}
                className="w-full px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                Done
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
