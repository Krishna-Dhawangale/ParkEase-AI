import React, { useState } from 'react';
import { useAuthStore, useTenantStore } from '../../../store';
import { Building2, MapPin, Settings2, IndianRupee, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { currentTenant, setTenant } = useTenantStore();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Organization
  const [orgData, setOrgData] = useState({
    name: currentTenant?.name || '',
    type: 'Mall',
    contactEmail: currentTenant?.contactEmail || '',
    phone: currentTenant?.contactPhone || '',
    primaryAdmin: '',
    supportContact: '',
    logoUploaded: false,
  });

  // Step 2: Facility
  const [facilityData, setFacilityData] = useState({
    name: '',
    type: 'Mall',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    lat: '',
    lng: '',
    timezone: 'Asia/Kolkata',
    is247: true,
    operatingHoursStart: '00:00',
    operatingHoursEnd: '23:59',
    parkingContactNumber: '',
    parkingEmail: '',
  });

  // Step 3: Parking Configuration
  const [configData, setConfigData] = useState({
    numFloors: '1',
    floorNames: 'Ground',
    totalCapacity: '0',
    carSlots: '0',
    bikeSlots: '0',
    accessibleSlots: '0',
    evSlots: '0',
    entryGates: '1',
    exitGates: '1',
    gracePeriodMins: '15',
    maxDurationHours: '24',
    reservationRules: 'Allowed 24h prior',
    cancellationRules: 'Free up to 2h before',
    overstayRules: 'Standard penalty applies',
  });

  // Step 4: Pricing
  const [pricingData, setPricingData] = useState({
    carBase: '0',
    carHourly: '0',
    carDailyMax: '0',
    bikeBase: '0',
    bikeHourly: '0',
    evParking: '0',
    evCharging: '0',
    accessiblePolicy: 'Standard',
    weekdayPricingToggle: false,
    weekendPricingToggle: false,
    peakPricingToggle: false,
    eventPricingToggle: false,
    taxesPercent: '0',
    penaltyAmount: '0',
    penaltyType: 'FLAT', // FLAT, PER_MINUTE, PER_HOUR
  });

  // Step 5: Media
  const [mediaData, setMediaData] = useState({
    coverUploaded: false,
    galleryUploaded: false,
    entranceUploaded: false,
    exitUploaded: false,
    floorUploaded: false,
  });

  // Allow through if no user (public routes), no tenant (super admin), or already onboarded
  if (!user || !currentTenant || currentTenant.isOnboarded !== false) {
    return <>{children}</>;
  }

  const handleComplete = () => {
    setIsSubmitting(true);
    // Simulate API save as DRAFT
    setTimeout(() => {
      setIsSubmitting(false);
      setTenant({ ...currentTenant, isOnboarded: true, status: 'DRAFT' });
    }, 1500);
  };

  const steps = [
    { id: 1, label: 'Organization', icon: Building2 },
    { id: 2, label: 'Facility Details', icon: MapPin },
    { id: 3, label: 'Configuration', icon: Settings2 },
    { id: 4, label: 'Pricing', icon: IndianRupee },
    { id: 5, label: 'Media & Save', icon: ImageIcon },
  ];

  return (
    <div className="fixed inset-0 z-[9000] bg-[var(--bg-secondary)] overflow-y-auto">
      <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome to ParkEase AI</h1>
          <p className="text-[var(--text-secondary)] mt-2">Let's configure your parking operation.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
          {/* Progress Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="card p-6 sticky top-8 border-t-4 border-[var(--brand)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-6 tracking-tight">Onboarding</h3>
              <ul className="space-y-6 relative">
                <div className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5 bg-[var(--border)] -z-10"></div>
                {steps.map(s => {
                  const isCompleted = step > s.id;
                  const isActive = step === s.id;
                  return (
                    <li key={s.id} className="flex items-start gap-4 bg-white dark:bg-transparent relative z-10">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors border-2',
                        isActive ? 'border-[var(--brand)] bg-[var(--brand)] text-white' :
                        isCompleted ? 'border-green-500 bg-green-500 text-white' :
                        'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{s.id}</span>}
                      </div>
                      <div className="pt-1.5">
                        <span className={cn(
                          'text-sm transition-colors',
                          isActive ? 'font-bold text-[var(--text-primary)]' : 
                          'font-medium text-[var(--text-secondary)]'
                        )}>
                          {s.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Wizard Content */}
          <div className="flex-1 flex flex-col min-h-[600px]">
            <div className="card p-8 flex-1 flex flex-col border border-[var(--border)]">
              
              {/* Step 1: Organization */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Organization Profile</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Details about your tenant organization.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Organization Name</label>
                      <input className="input-field" value={orgData.name} onChange={e => setOrgData({...orgData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Organization Type</label>
                      <select className="input-field" value={orgData.type} onChange={e => setOrgData({...orgData, type: e.target.value})}>
                        <option>Mall</option>
                        <option>Airport</option>
                        <option>Hospital</option>
                        <option>Corporate campus</option>
                        <option>University</option>
                        <option>Hotel</option>
                        <option>Commercial complex</option>
                        <option>Parking operator</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Business Email</label>
                      <input type="email" className="input-field" value={orgData.contactEmail} onChange={e => setOrgData({...orgData, contactEmail: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input className="input-field" value={orgData.phone} onChange={e => setOrgData({...orgData, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary Administrator</label>
                      <input className="input-field" value={orgData.primaryAdmin} onChange={e => setOrgData({...orgData, primaryAdmin: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Support Contact</label>
                      <input className="input-field" value={orgData.supportContact} onChange={e => setOrgData({...orgData, supportContact: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Organization Logo</label>
                    <button className={cn("px-4 py-2 text-sm rounded border", orgData.logoUploaded ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setOrgData({...orgData, logoUploaded: true})}>
                      {orgData.logoUploaded ? "Logo Uploaded" : "Upload Logo"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Facility */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Facility Details</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Configure your primary parking facility location.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Parking/Facility Name</label><input className="input-field" placeholder="e.g. Phoenix Marketcity Parking" value={facilityData.name} onChange={e => setFacilityData({...facilityData, name: e.target.value})} /></div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Facility Type</label>
                      <select className="input-field" value={facilityData.type} onChange={e => setFacilityData({...facilityData, type: e.target.value})}>
                        <option>Mall</option><option>Airport</option><option>Hospital</option><option>Corporate</option><option>Hotel</option><option>University</option><option>Public Parking</option><option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address Line 1</label><input className="input-field" value={facilityData.address1} onChange={e => setFacilityData({...facilityData, address1: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address Line 2</label><input className="input-field" value={facilityData.address2} onChange={e => setFacilityData({...facilityData, address2: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">City</label><input className="input-field" value={facilityData.city} onChange={e => setFacilityData({...facilityData, city: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">State</label><input className="input-field" value={facilityData.state} onChange={e => setFacilityData({...facilityData, state: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">PIN Code</label><input className="input-field" value={facilityData.pinCode} onChange={e => setFacilityData({...facilityData, pinCode: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Country</label><input className="input-field" value={facilityData.country} onChange={e => setFacilityData({...facilityData, country: e.target.value})} /></div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded">
                    <p className="text-sm font-medium mb-2">Location Coordinates (Google Maps Placeholder)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs mb-1">Latitude</label><input className="input-field text-sm" placeholder="e.g. 19.0760" value={facilityData.lat} onChange={e => setFacilityData({...facilityData, lat: e.target.value})} /></div>
                      <div><label className="block text-xs mb-1">Longitude</label><input className="input-field text-sm" placeholder="e.g. 72.8777" value={facilityData.lng} onChange={e => setFacilityData({...facilityData, lng: e.target.value})} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Timezone</label>
                      <input className="input-field" value={facilityData.timezone} onChange={e => setFacilityData({...facilityData, timezone: e.target.value})} />
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={facilityData.is247} onChange={e => setFacilityData({...facilityData, is247: e.target.checked})} className="rounded border-gray-300" />
                        <span className="text-sm font-medium">24/7 Operations</span>
                      </label>
                    </div>
                    {!facilityData.is247 && (
                      <>
                        <div><label className="block text-sm font-medium mb-1">Open Time</label><input type="time" className="input-field" value={facilityData.operatingHoursStart} onChange={e => setFacilityData({...facilityData, operatingHoursStart: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Close Time</label><input type="time" className="input-field" value={facilityData.operatingHoursEnd} onChange={e => setFacilityData({...facilityData, operatingHoursEnd: e.target.value})} /></div>
                      </>
                    )}
                    <div><label className="block text-sm font-medium mb-1">Parking Contact Number</label><input className="input-field" value={facilityData.parkingContactNumber} onChange={e => setFacilityData({...facilityData, parkingContactNumber: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Parking Email</label><input type="email" className="input-field" value={facilityData.parkingEmail} onChange={e => setFacilityData({...facilityData, parkingEmail: e.target.value})} /></div>
                  </div>
                </div>
              )}

              {/* Step 3: Parking Configuration */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Parking Configuration</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Define capacity and operational rules.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Num Floors</label><input type="number" className="input-field" value={configData.numFloors} onChange={e => setConfigData({...configData, numFloors: e.target.value})} /></div>
                    <div className="md:col-span-3"><label className="block text-sm font-medium mb-1">Floor Names (comma separated)</label><input className="input-field" placeholder="e.g. Ground, B1, B2" value={configData.floorNames} onChange={e => setConfigData({...configData, floorNames: e.target.value})} /></div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold mb-3">Slot Distribution</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div><label className="block text-xs mb-1">Total Capacity</label><input type="number" className="input-field text-sm" value={configData.totalCapacity} onChange={e => setConfigData({...configData, totalCapacity: e.target.value})} /></div>
                      <div><label className="block text-xs mb-1">Car Slots</label><input type="number" className="input-field text-sm" value={configData.carSlots} onChange={e => setConfigData({...configData, carSlots: e.target.value})} /></div>
                      <div><label className="block text-xs mb-1">Bike Slots</label><input type="number" className="input-field text-sm" value={configData.bikeSlots} onChange={e => setConfigData({...configData, bikeSlots: e.target.value})} /></div>
                      <div><label className="block text-xs mb-1">Accessible</label><input type="number" className="input-field text-sm" value={configData.accessibleSlots} onChange={e => setConfigData({...configData, accessibleSlots: e.target.value})} /></div>
                      <div><label className="block text-xs mb-1">EV Charging</label><input type="number" className="input-field text-sm" value={configData.evSlots} onChange={e => setConfigData({...configData, evSlots: e.target.value})} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Entry Gates Count</label><input type="number" className="input-field" value={configData.entryGates} onChange={e => setConfigData({...configData, entryGates: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Exit Gates Count</label><input type="number" className="input-field" value={configData.exitGates} onChange={e => setConfigData({...configData, exitGates: e.target.value})} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Grace Period (Mins)</label><input type="number" className="input-field" value={configData.gracePeriodMins} onChange={e => setConfigData({...configData, gracePeriodMins: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Max Duration (Hours)</label><input type="number" className="input-field" value={configData.maxDurationHours} onChange={e => setConfigData({...configData, maxDurationHours: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Reservation Rules</label><input className="input-field" value={configData.reservationRules} onChange={e => setConfigData({...configData, reservationRules: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Cancellation Rules</label><input className="input-field" value={configData.cancellationRules} onChange={e => setConfigData({...configData, cancellationRules: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Overstay Rules</label><input className="input-field" value={configData.overstayRules} onChange={e => setConfigData({...configData, overstayRules: e.target.value})} /></div>
                  </div>
                </div>
              )}

              {/* Step 4: Pricing */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Pricing Configuration</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Set ₹0 for properties you want to configure later.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">CAR: Base (₹)</label><input type="number" className="input-field text-sm" value={pricingData.carBase} onChange={e => setPricingData({...pricingData, carBase: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">CAR: Hourly (₹)</label><input type="number" className="input-field text-sm" value={pricingData.carHourly} onChange={e => setPricingData({...pricingData, carHourly: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">CAR: Daily Max (₹)</label><input type="number" className="input-field text-sm" value={pricingData.carDailyMax} onChange={e => setPricingData({...pricingData, carDailyMax: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">BIKE: Base (₹)</label><input type="number" className="input-field text-sm" value={pricingData.bikeBase} onChange={e => setPricingData({...pricingData, bikeBase: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">BIKE: Hourly (₹)</label><input type="number" className="input-field text-sm" value={pricingData.bikeHourly} onChange={e => setPricingData({...pricingData, bikeHourly: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">EV Parking (₹)</label><input type="number" className="input-field text-sm" value={pricingData.evParking} onChange={e => setPricingData({...pricingData, evParking: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">EV Charging (₹)</label><input type="number" className="input-field text-sm" value={pricingData.evCharging} onChange={e => setPricingData({...pricingData, evCharging: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold mb-1 text-slate-500">Accessible Policy</label><input className="input-field text-sm" value={pricingData.accessiblePolicy} onChange={e => setPricingData({...pricingData, accessiblePolicy: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1 text-slate-500">Taxes (%)</label>
                        <input type="number" className="input-field text-sm" value={pricingData.taxesPercent} onChange={e => setPricingData({...pricingData, taxesPercent: e.target.value})} />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-1 text-slate-500">Penalty Amount</label>
                          <input type="number" className="input-field text-sm" value={pricingData.penaltyAmount} onChange={e => setPricingData({...pricingData, penaltyAmount: e.target.value})} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-1 text-slate-500">Penalty Type</label>
                          <select className="input-field text-sm" value={pricingData.penaltyType} onChange={e => setPricingData({...pricingData, penaltyType: e.target.value})}>
                            <option value="FLAT">Flat</option>
                            <option value="PER_MINUTE">Per Minute</option>
                            <option value="PER_HOUR">Per Hour</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Media & Save Draft */}
              {step === 5 && (
                <div className="space-y-6 animate-fade-in flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Upload Media</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Upload images for the normal-user portal. Facility will be saved as DRAFT.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className={cn("p-4 border rounded text-sm text-left flex justify-between items-center", mediaData.coverUploaded ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setMediaData({...mediaData, coverUploaded: true})}>
                      <span className="font-medium">Cover Image</span> {mediaData.coverUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                    <button className={cn("p-4 border rounded text-sm text-left flex justify-between items-center", mediaData.galleryUploaded ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setMediaData({...mediaData, galleryUploaded: true})}>
                      <span className="font-medium">Gallery Images</span> {mediaData.galleryUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                    <button className={cn("p-4 border rounded text-sm text-left flex justify-between items-center", mediaData.entranceUploaded ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setMediaData({...mediaData, entranceUploaded: true})}>
                      <span className="font-medium">Entrance Image</span> {mediaData.entranceUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                    <button className={cn("p-4 border rounded text-sm text-left flex justify-between items-center", mediaData.exitUploaded ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setMediaData({...mediaData, exitUploaded: true})}>
                      <span className="font-medium">Exit Image</span> {mediaData.exitUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                    <button className={cn("p-4 border rounded text-sm text-left flex justify-between items-center md:col-span-2", mediaData.floorUploaded ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")} onClick={() => setMediaData({...mediaData, floorUploaded: true})}>
                      <span className="font-medium">Optional Floor Maps</span> {mediaData.floorUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded mt-4">
                    <p className="text-sm font-bold text-amber-800">Almost Done</p>
                    <p className="text-xs text-amber-700 mt-1">Your facility will initially have the status <strong>DRAFT</strong>. It will not appear on the public portal until you complete the Digital Twin setup and Request Go-Live.</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-[var(--border)] mt-8">
                <button 
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1 || isSubmitting}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                
                {step < 5 ? (
                  <button 
                    onClick={() => setStep(s => Math.min(5, s + 1))}
                    className="btn-primary px-8"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="btn-primary px-8"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Draft & Enter Portal'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuard;
