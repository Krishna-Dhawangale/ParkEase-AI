import React, { useState } from 'react';
import { useAuthStore } from '../../../../store';
import { Navigate } from 'react-router-dom';
import { Shield, Building2, MapPin, Map, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
// Assuming we'll have an onboarding service for mocking API
import { OnboardingService } from '../../../../services/onboarding.service';

const STEPS = [
  { id: 'profile', label: 'Organization Profile', icon: Building2 },
  { id: 'facility', label: 'Facility Details', icon: MapPin },
  { id: 'digital_twin', label: 'Digital Twin Setup', icon: Map },
  { id: 'review', label: 'Verification & Review', icon: Shield },
];

export default function OnboardingWizard() {
  const { user, updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [orgName, setOrgName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('100');

  if (!user) return <Navigate to="/admin/login" replace />;

  // If already approved, they shouldn't be here
  if (user.onboardingStatus === 'APPROVED' || user.onboardingStatus === 'LIVE') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Handle step progression
  const handleNext = async () => {
    setError('');
    setLoading(true);
    try {
      if (currentStep === 0) {
        // Submit profile
        if (!orgName) throw new Error('Organization name is required.');
        await OnboardingService.updateProfile(user.id, { orgName });
        const updatedUser = { ...user, onboardingStatus: 'FACILITY_PENDING' as const };
        updateUser(updatedUser);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Submit facility
        if (!facilityName || !address) throw new Error('Facility details are required.');
        await OnboardingService.createFacility(user.id, { name: facilityName, address, capacity: parseInt(capacity) });
        const updatedUser = { ...user, onboardingStatus: 'DIGITAL_TWIN_PENDING' as const };
        updateUser(updatedUser);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Submit digital twin
        await OnboardingService.skipDigitalTwinSetup(user.id);
        const updatedUser = { ...user, onboardingStatus: 'REVIEW_PENDING' as const };
        updateUser(updatedUser);
        setCurrentStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  if (user.onboardingStatus === 'REVIEW_PENDING' || currentStep === 3) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Under Review</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Your facility details have been submitted. Our team is verifying your information. You will receive an email once your account goes live.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-12 md:pt-20 px-4">
      <div className="max-w-3xl w-full mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome to ParkEase AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Let's set up your operational workspace.</p>
        </div>

        {/* Steps Tracker */}
        <div className="flex items-center justify-between mb-12 relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive ? "bg-brand-600 border-brand-600 text-white" :
                  isCompleted ? "bg-white dark:bg-slate-900 border-brand-600 text-brand-600" :
                  "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-semibold absolute -bottom-6 whitespace-nowrap",
                  isActive || isCompleted ? "text-slate-900 dark:text-white" : "text-slate-500"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 mt-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20 text-sm font-medium">
              {error}
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Organization Profile</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Basic details about your operating business.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="e.g. Westfield Malls"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Primary Facility</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Where is your first parking facility located?</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Facility Name</label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={e => setFacilityName(e.target.value)}
                    placeholder="e.g. Westfield Downtown Parking"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Market St, San Francisco, CA"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Estimated Capacity (Spaces)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    placeholder="250"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Digital Twin Setup</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Map out your parking structure virtually.</p>
              </div>
              <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-center">
                <Map className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Configure Later</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                  You can use our advanced Digital Twin Builder to map out your facility's layout after your account is approved.
                </p>
                <div className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Will skip for now
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {currentStep === 2 ? 'Submit for Review' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
