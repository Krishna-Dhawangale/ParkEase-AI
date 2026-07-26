import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore, useTenantStore } from '../../../store';
import { FacilityService, type ClientFacility, type FacilityPricing } from './facility.service';
import {
  Building2, MapPin, Map, IndianRupee, Settings2, Camera, FileText,
  ChevronLeft, AlertTriangle, CheckCircle2, Loader2, ArrowRight, Save, Edit2, Trash2, Undo
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import DigitalTwin from '../digitalTwin/DigitalTwin';

type Tab = 'overview' | 'pricing' | 'entry_exit' | 'digital_twin' | 'cameras' | 'policies' | 'go_live';

export default function FacilityWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentTenant } = useTenantStore();
  
  const [facility, setFacility] = useState<ClientFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  const tenantId = user?.tenantId || currentTenant?.id;

  useEffect(() => {
    if (!tenantId || !id) return;
    
    const fetchFacility = async () => {
      setLoading(true);
      try {
        const fac = await FacilityService.getById(tenantId, id);
        if (fac) {
          setFacility(fac);
        } else {
          // Fallback if not found (e.g. invalid ID)
          navigate('/admin/parking');
        }
      } catch (err) {
        console.error('Failed to load facility', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacility();
  }, [tenantId, id, navigate]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!facility) return null;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/parking')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{facility.name}</h1>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider",
                  facility.status === 'DRAFT' && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                  facility.status === 'PENDING_APPROVAL' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  facility.status === 'APPROVED' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  facility.status === 'LIVE' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  facility.status === 'REJECTED' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {facility.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {facility.address}, {facility.city}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {facility.status === 'DRAFT' && (
              <>
                <button 
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-sm transition-all dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this facility? This action cannot be undone.') && tenantId && facility.id) {
                      await FacilityService.delete(tenantId, facility.id);
                      navigate('/admin/parking');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button 
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                  onClick={async () => {
                     // Mock submit for approval
                     if(tenantId && facility.id) {
                       await FacilityService.submitForApproval(tenantId, facility.id);
                       setFacility({...facility, status: 'PENDING_APPROVAL'});
                     }
                  }}
                >
                  Submit for Approval
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
            {facility.status === 'PENDING_APPROVAL' && (
              <>
                <button 
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-sm transition-all dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this facility request? This action cannot be undone.') && tenantId && facility.id) {
                      await FacilityService.delete(tenantId, facility.id);
                      navigate('/admin/parking');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Request
                </button>
                <button 
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                  onClick={async () => {
                     if(tenantId && facility.id) {
                       await FacilityService.withdrawApproval(tenantId, facility.id);
                       setFacility({...facility, status: 'DRAFT'});
                     }
                  }}
                >
                  <Undo className="w-4 h-4" />
                  Edit Request
                </button>
              </>
            )}
            {facility.status === 'REJECTED' && (
              <>
                <button 
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-sm transition-all dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this facility? This action cannot be undone.') && tenantId && facility.id) {
                      await FacilityService.delete(tenantId, facility.id);
                      navigate('/admin/parking');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button 
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                  onClick={async () => {
                     // Mock submit for approval
                     if(tenantId && facility.id) {
                       await FacilityService.submitForApproval(tenantId, facility.id);
                       setFacility({...facility, status: 'PENDING_APPROVAL'});
                     }
                  }}
                >
                  Submit for Approval
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
            {facility.status === 'APPROVED' && (
              <button 
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                onClick={async () => {
                   // Mock go live
                   if(tenantId && facility.id) {
                     await FacilityService.update(tenantId, facility.id, { status: 'LIVE' });
                     setFacility({...facility, status: 'LIVE'});
                   }
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Go Live
              </button>
            )}
          </div>
        </div>
        
        {/* ── Tabs ── */}
        <div className="flex items-center gap-6 mt-6 overflow-x-auto hide-scrollbar">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={Building2} label="Overview" />
          <TabButton active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} icon={IndianRupee} label="Pricing" />
          <TabButton active={activeTab === 'entry_exit'} onClick={() => setActiveTab('entry_exit')} icon={Settings2} label="Entry & Exit" />
          <TabButton active={activeTab === 'digital_twin'} onClick={() => setActiveTab('digital_twin')} icon={Map} label="Digital Twin" />
          <TabButton active={activeTab === 'cameras'} onClick={() => setActiveTab('cameras')} icon={Camera} label="Cameras & Devices" />
          <TabButton active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} icon={FileText} label="Policies" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          
          {facility.status === 'REJECTED' && facility.rejectionReason && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">Approval Request Rejected</h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{facility.rejectionReason}</p>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                   <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Facility Details</h3>
                   <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.type}</dd>
                     </div>
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Capacity</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.totalCapacity} slots across {facility.floors} floors</dd>
                     </div>
                     <div className="col-span-2">
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.description || 'No description provided.'}</dd>
                     </div>
                   </dl>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                   <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
                   <dl className="space-y-4">
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Manager</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.contact.managerName || 'Not specified'}</dd>
                     </div>
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.contact.phone || 'Not specified'}</dd>
                     </div>
                     <div>
                       <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</dt>
                       <dd className="text-sm text-slate-900 dark:text-white">{facility.contact.email || 'Not specified'}</dd>
                     </div>
                   </dl>
                 </div>
               </div>
             </div>
          )}
          
          {activeTab === 'pricing' && (
            <PricingTab
              facility={facility}
              tenantId={tenantId!}
              onSaved={(updated) => setFacility(updated)}
            />
          )}
          
          {(activeTab === 'entry_exit' || activeTab === 'cameras' || activeTab === 'policies') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <Settings2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Coming Soon</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                This configuration panel will be available in the next release.
              </p>
            </div>
          )}
          
          {activeTab === 'digital_twin' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative" style={{ minHeight: '600px' }}>
              <div className="absolute top-4 right-4 z-10">
                <Link to="/admin/digital-twin" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-lg">
                  <Edit2 className="w-4 h-4" /> Edit Digital Twin
                </Link>
              </div>
              <div className="w-full h-full scale-[0.8] origin-top">
                <DigitalTwin readOnly={true} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
        active 
          ? "border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400" 
          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ─── Pricing Tab Component ────────────────────────────────────────────────────

function PricingField({ label, hint, prefix, value, onChange, min = 0 }: {
  label: string;
  hint?: string;
  prefix?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">{hint}</p>}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          step="0.5"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "w-full py-2.5 pr-4 text-sm rounded-lg border border-slate-200 dark:border-slate-700",
            "bg-white dark:bg-slate-950 text-slate-900 dark:text-white",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all",
            prefix ? "pl-8" : "pl-4"
          )}
        />
      </div>
    </div>
  );
}

function PricingTab({
  facility,
  tenantId,
  onSaved,
}: {
  facility: ClientFacility;
  tenantId: string;
  onSaved: (updated: ClientFacility) => void;
}) {
  const defaults: FacilityPricing = {
    hourlyRate: facility.pricing?.hourlyRate ?? 50,
    minimumCharge: facility.pricing?.minimumCharge ?? 30,
    dailyMaximum: facility.pricing?.dailyMaximum ?? 300,
    gracePeriodMinutes: facility.pricing?.gracePeriodMinutes ?? 10,
    overstayPenaltyRate: facility.pricing?.overstayPenaltyRate ?? 100,
  };

  const [editing, setEditing] = useState(!facility.pricingConfigured);
  const [form, setForm] = useState<FacilityPricing>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FacilityPricing) => (v: number) =>
    setForm(prev => ({ ...prev, [field]: v }));

  const handleSave = async () => {
    setError('');
    if (form.hourlyRate <= 0) { setError('Hourly rate must be greater than ₹0.'); return; }
    if (form.minimumCharge > form.dailyMaximum) { setError('Minimum charge cannot exceed the daily maximum.'); return; }
    setSaving(true);
    try {
      const updated = await FacilityService.update(tenantId, facility.id, {
        pricing: form,
        pricingConfigured: true,
      });
      onSaved(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save pricing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pricing Configuration</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Set parking rates for this facility. All amounts in Indian Rupees (₹).</p>
        </div>
        {facility.pricingConfigured && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            <Edit2 className="w-4 h-4" /> Edit Pricing
          </button>
        )}
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          Pricing saved successfully!
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PricingField
            label="Base Hourly Rate"
            hint="Charged per hour or part thereof after the minimum charge."
            prefix="₹"
            value={form.hourlyRate}
            onChange={set('hourlyRate')}
            min={1}
          />
          <PricingField
            label="Minimum Charge"
            hint="Minimum amount charged regardless of duration."
            prefix="₹"
            value={form.minimumCharge}
            onChange={set('minimumCharge')}
          />
          <PricingField
            label="Daily Maximum"
            hint="Maximum amount charged per 24-hour period."
            prefix="₹"
            value={form.dailyMaximum}
            onChange={set('dailyMaximum')}
            min={1}
          />
          <PricingField
            label="Grace Period"
            hint="Free window after booking ends before overstay penalty applies."
            prefix="min"
            value={form.gracePeriodMinutes}
            onChange={set('gracePeriodMinutes')}
            min={0}
          />
          <PricingField
            label="Overstay Penalty Rate"
            hint="Additional charge per hour after the grace period expires."
            prefix="₹"
            value={form.overstayPenaltyRate}
            onChange={set('overstayPenaltyRate')}
            min={0}
          />
        </div>

        {/* Pricing Summary Preview */}
        <div className="mt-8 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Rate Summary Preview</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-700 dark:text-slate-300">Min: <strong>₹{form.minimumCharge}</strong></span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300">₹{form.hourlyRate}/hr</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300">Daily max: <strong>₹{form.dailyMaximum}</strong></span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300">Grace: {form.gracePeriodMinutes} min</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300">Overstay: ₹{form.overstayPenaltyRate}/hr</span>
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Pricing'}
            </button>
            {facility.pricingConfigured && (
              <button
                onClick={() => { setEditing(false); setForm(defaults); setError(''); }}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
