import React, { useState } from 'react';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useTenantStore } from '../../../store';
import { FacilityService, type SlotCategory } from './facility.service';
import {
  Building2, MapPin, Clock, Layers, Phone, ChevronLeft,
  Plus, Minus, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const FACILITY_TYPES = [
  'Mall', 'Airport', 'Hospital', 'Hotel', 'University',
  'Corporate Campus', 'Commercial Parking', 'Government', 'Residential', 'Other'
];

const SLOT_CATEGORIES: { key: SlotCategory; label: string; color: string }[] = [
  { key: 'REGULAR', label: 'Regular', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { key: 'EV', label: 'EV Charging', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { key: 'ACCESSIBLE', label: 'Accessible (PwD)', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
];

// ─── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// ─── Field ──────────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-slate-400";
const selectCls = `${inputCls} appearance-none`;

// ─── Component ──────────────────────────────────────────────────────────────
export default function NewFacility() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentTenant } = useTenantStore();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [is24x7, setIs24x7] = useState(false);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');

  const [floors, setFloors] = useState(1);
  const [totalCapacity, setTotalCapacity] = useState<number | ''>('');
  const [slotCounts, setSlotCounts] = useState<Record<SlotCategory, number>>({
    REGULAR: 0,
    EV: 0,
    ACCESSIBLE: 0,
  });

  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tenantId = user?.tenantId || currentTenant?.id;

  // ── Slot count helpers ────────────────────────────────────────────────────
  const updateSlot = (cat: SlotCategory, delta: number) => {
    setSlotCounts(prev => ({ ...prev, [cat]: Math.max(0, (prev[cat] || 0) + delta) }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Facility name is required.'); return; }
    if (!type) { setError('Facility type is required.'); return; }
    if (!address.trim() || !city.trim() || !state.trim()) { setError('Address, city, and state are required.'); return; }
    if (!totalCapacity || Number(totalCapacity) < 1) { setError('Total capacity must be at least 1.'); return; }
    if (!tenantId) { setError('Your account is not linked to an organization. Contact support.'); return; }

    const slotCategories = SLOT_CATEGORIES
      .map(c => ({ category: c.key, count: slotCounts[c.key] || 0 }))
      .filter(c => c.count > 0);

    setLoading(true);
    try {
      const facility = await FacilityService.create(tenantId, {
        name: name.trim(),
        type,
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        latitude: latitude.trim(),
        longitude: longitude.trim(),
        is24x7,
        openTime,
        closeTime,
        floors,
        totalCapacity: Number(totalCapacity),
        slotCategories,
        contact: {
          managerName: managerName.trim(),
          phone: managerPhone.trim(),
          email: managerEmail.trim(),
        },
      });
      navigate(`/admin/parking/${facility.id}`, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] pb-20">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/parking')}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Add Parking Facility</h1>
          <p className="text-xs text-slate-500">Saved as DRAFT — you can configure further before going live</p>
        </div>
        <button
          form="new-facility-form"
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Save as Draft
        </button>
      </div>

      {/* ── Content ── */}
      <form id="new-facility-form" onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 md:px-6 pt-8 space-y-6">

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* ── 1. Basic Information ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <SectionHeader icon={Building2} title="Basic Information" description="Name and type of your parking facility" />
          <div className="space-y-4">
            <Field label="Facility Name" required>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Phoenix Mall Basement Parking"
                className={inputCls}
                required
              />
            </Field>
            <Field label="Facility Type" required>
              <select value={type} onChange={e => setType(e.target.value)} className={selectCls} required>
                <option value="">Select type…</option>
                {FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Description" hint="Brief overview shown to users and administrators">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Covered parking with 24/7 CCTV surveillance…"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>

        {/* ── 2. Location ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <SectionHeader icon={MapPin} title="Location" description="Physical address of the parking facility" />
          <div className="space-y-4">
            <Field label="Street Address" required>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 MG Road, Andheri West" className={inputCls} required />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="City" required>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" className={inputCls} required />
              </Field>
              <Field label="State" required>
                <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" className={inputCls} required />
              </Field>
            </div>
            <Field label="PIN Code">
              <input type="text" value={pinCode} onChange={e => setPinCode(e.target.value)} placeholder="400058" maxLength={6} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Latitude" required>
                <input type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="19.0760" className={inputCls} required />
              </Field>
              <Field label="Longitude" required>
                <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="72.8777" className={inputCls} required />
              </Field>
            </div>
            
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Pinpoint Location on Map</p>
              <div className="w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 relative">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: Number(latitude) || 21.1458, lng: Number(longitude) || 79.0882 }}
                    zoom={13}
                    onClick={(e) => {
                      if (e.latLng) {
                        setLatitude(e.latLng.lat().toFixed(6));
                        setLongitude(e.latLng.lng().toFixed(6));
                      }
                    }}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      streetViewControl: false,
                    }}
                  >
                    {(latitude && longitude) && (
                      <MarkerF
                        position={{ lat: Number(latitude), lng: Number(longitude) }}
                        draggable={true}
                        onDragEnd={(e) => {
                          if (e.latLng) {
                            setLatitude(e.latLng.lat().toFixed(6));
                            setLongitude(e.latLng.lng().toFixed(6));
                          }
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-500 text-sm">
                    Loading map...
                  </div>
                )}
                {(!latitude || !longitude) && isLoaded && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 pointer-events-none">
                    Click anywhere on the map to set location
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Operating Hours ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <SectionHeader icon={Clock} title="Operating Hours" />
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setIs24x7(v => !v)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                  is24x7 ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                  is24x7 && "translate-x-5"
                )} />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Open 24 hours / 7 days</span>
                <p className="text-xs text-slate-400">Toggle off to set specific hours</p>
              </div>
            </label>

            {!is24x7 && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Opening Time">
                  <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Closing Time">
                  <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Parking Structure ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <SectionHeader icon={Layers} title="Parking Structure" description="Floors, capacity, and slot categories" />
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Number of Floors" required>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFloors(f => Math.max(1, f - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold text-slate-900 dark:text-white">{floors}</span>
                  <button
                    type="button"
                    onClick={() => setFloors(f => f + 1)}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Field>
              <Field label="Total Capacity" required>
                <input
                  type="number"
                  value={totalCapacity}
                  onChange={e => setTotalCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="250"
                  min="1"
                  className={inputCls}
                  required
                />
              </Field>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Slot Categories <span className="font-normal text-slate-400">(optional breakdown)</span></p>
              <div className="space-y-2">
                {SLOT_CATEGORIES.map(cat => (
                  <div key={cat.key} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded", cat.color)}>{cat.label}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateSlot(cat.key, -1)} className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">{slotCounts[cat.key]}</span>
                      <button type="button" onClick={() => updateSlot(cat.key, 1)} className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Contact ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <SectionHeader icon={Phone} title="Facility Contact" description="On-site manager details" />
          <div className="space-y-4">
            <Field label="Manager Name">
              <input type="text" value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Amit Shah" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Manager Phone">
                <input type="tel" value={managerPhone} onChange={e => setManagerPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
              </Field>
              <Field label="Manager Email">
                <input type="email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} placeholder="amit@yourcompany.com" className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── Bottom submit ── */}
        <div className="flex items-center justify-between py-2">
          <button type="button" onClick={() => navigate('/admin/parking')} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
