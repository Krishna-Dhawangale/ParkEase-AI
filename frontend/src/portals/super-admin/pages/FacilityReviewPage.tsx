import {  useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, MapPin, CheckCircle2, XCircle, AlertTriangle, 
  MonitorPlay, Video, ShieldCheck, MessageSquare, Clock, CheckSquare
} from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SABreadcrumbs } from '../components/SABreadcrumbs';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SALoadingState } from '../components/SALoadingState';
import { SAErrorState } from '../components/SAErrorState';
import { SAConfirmDialog } from '../components/SAConfirmDialog';
import { SuperAdminService } from '../services/super-admin.service';
import type { SAFacility, FacilityReviewComment } from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

export function FacilityReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<SAFacility | null>(null);
  const [history, setHistory] = useState<FacilityReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [approveDialog, setApproveDialog] = useState(false);
  const [changesDialog, setChangesDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      if (id) {
        const fac = await SuperAdminService.getFacility(id);
        if (!fac) throw new Error('Facility not found');
        setFacility(fac);
        const hist = await SuperAdminService.getFacilityReviewComments(id);
        setHistory(hist);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load facility details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    await SuperAdminService.approveFacility(id);
    setApproveDialog(false);
    load();
  };

  const handleRequestChanges = async (comment?: string) => {
    if (!id || !comment) return;
    await SuperAdminService.requestFacilityChanges(id, comment);
    setChangesDialog(false);
    load();
  };

  const handleReject = async (reason?: string) => {
    if (!id || !reason) return;
    await SuperAdminService.rejectFacility(id, reason);
    setRejectDialog(false);
    navigate('/super-admin/approvals');
  };

  if (loading) return <SALoadingState fullPage />;
  if (error || !facility) return <SAErrorState message={error} onRetry={load} />;

  const isPending = facility.approvalStatus === 'UNDER_REVIEW';

  const ChecklistItem = ({ label, isReady }: { label: string, isReady: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      {isReady ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700" />
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <SABreadcrumbs items={[
        { label: 'Facility Approvals', href: '/super-admin/approvals' },
        { label: facility.name }
      ]} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{facility.name}</h1>
            <SAStatusBadge status={facility.approvalStatus} dot />
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-4">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {facility.organizationName}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {facility.city}, {facility.state}</span>
          </p>
        </div>
        
        {isPending && (
          <div className="flex gap-2">
            <button 
              onClick={() => setRejectDialog(true)}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 hover:bg-red-50 dark:bg-slate-900 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Reject
            </button>
            <button 
              onClick={() => setChangesDialog(true)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Request Changes
            </button>
            <button 
              onClick={() => setApproveDialog(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-sm transition-colors"
            >
              Approve for Go-Live
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                Location & Configuration
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Facility Type</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{facility.type.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Operating Hours</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{facility.operatingHours || '24/7'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Capacity</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{facility.slots} Slots</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Floors</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{facility.floors} Floors</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-brand-500" />
                Digital Twin
              </h3>
              <Link 
                to={`/super-admin/facilities/${facility.id}/twin`} 
                className="text-sm text-brand-600 hover:text-brand-500 font-medium"
              >
                Inspect Read-Only
              </Link>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  facility.digitalTwinStatus === 'SYNCED' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500" :
                  facility.digitalTwinStatus === 'NOT_CONFIGURED' ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                  "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
                )}>
                  {facility.digitalTwinStatus === 'SYNCED' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Status: {facility.digitalTwinStatus.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-slate-500">Mapping complete: {facility.digitalTwinStatus !== 'NOT_CONFIGURED' ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-500" />
                Review History
              </h3>
            </div>
            <div className="p-6">
              {history.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                  {history.map((comment) => (
                    <div key={comment.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        {comment.action === 'SUBMITTED' ? <CheckSquare className="w-4 h-4" /> :
                         comment.action === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                         comment.action === 'CHANGES_REQUESTED' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                         comment.action === 'REJECTED' ? <XCircle className="w-4 h-4 text-red-500" /> :
                         <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{comment.actorName}</span>
                          <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <SAStatusBadge status={comment.action} className="mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No review history yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Checklist */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-500" />
                Readiness Checklist
              </h3>
            </div>
            <div className="p-6">
              <ChecklistItem label="Facility Details" isReady={true} />
              <ChecklistItem label="Location & Address" isReady={true} />
              <ChecklistItem label="Capacity & Slots" isReady={true} />
              <ChecklistItem label="Pricing Configuration" isReady={facility.pricingConfigured} />
              <ChecklistItem label="Digital Twin Mapped" isReady={facility.digitalTwinStatus !== 'NOT_CONFIGURED'} />
              <ChecklistItem label="Entry/Exit Terminals" isReady={facility.entryExitConfigured} />
            </div>
            
            {isPending && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-900/50">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  Please ensure all criteria are met before approving this facility for Go-Live.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SAConfirmDialog
        open={approveDialog}
        onOpenChange={setApproveDialog}
        title="Approve Facility for Go-Live?"
        description="This will allow normal users to see and book parking at this facility. Devices and Digital Twin will enter production mode."
        confirmLabel="Approve Facility"
        onConfirm={handleApprove}
      />

      <SAConfirmDialog
        open={changesDialog}
        onOpenChange={setChangesDialog}
        title="Request Changes"
        description="Specify what the Client Admin needs to fix before this facility can be approved."
        confirmLabel="Send Request"
        requireReason
        onConfirm={handleRequestChanges}
      />

      <SAConfirmDialog
        open={rejectDialog}
        onOpenChange={setRejectDialog}
        title="Reject Facility"
        description="This will return the facility to DRAFT status. The client will need to address the issues and submit a new Go-Live request."
        confirmLabel="Reject Facility"
        destructive
        requireReason
        onConfirm={handleReject}
      />
    </div>
  );
}
