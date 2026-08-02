import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore, useTenantStore } from '../../../../store';
import { SuperAdminService } from '../../../super-admin/services/super-admin.service';
import { AuthService } from '../../../../services/auth.service';
import { Building2, User, Phone, Mail, MapPin, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';

// ─── WelcomePage ─────────────────────────────────────────────────────────────
// Shown after first-time password change.
// Collects minimal profile info. Organization name is READ-ONLY from SA data.
// On submit → profileSetupComplete = true → redirects to /admin/dashboard.

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { currentTenant, setTenant } = useTenantStore();

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || user?.email || '');

  const [orgName, setOrgName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the organization the user belongs to (via tenantId)
  useEffect(() => {
    if (!user) return;

    const fetchOrg = async () => {
      setOrgLoading(true);
      try {
        // Use tenant from store if already loaded
        if (currentTenant) {
          setOrgName(currentTenant.name);
          return;
        }
        // Otherwise fetch from SA service using tenantId
        if (user.tenantId) {
          const org = await SuperAdminService.getOrganization(user.tenantId);
          if (org) {
            setOrgName(org.name);
            // Also hydrate the tenant store so downstream components work
            setTenant({
              id: org.id,
              name: org.name,
              slug: org.id,
              status: org.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
              plan: 'BASIC',
              contactEmail: org.primaryContact?.email || '',
              contactPhone: org.primaryContact?.phone || '',
              isOnboarded: false,
              type: org.type,
              createdAt: org.createdAt,
              updatedAt: org.updatedAt,
            });
          }
        }
      } catch (err) {
        console.error('[WelcomePage] Failed to fetch org:', err);
      } finally {
        setOrgLoading(false);
      }
    };

    fetchOrg();
  }, [user]);

  // Already completed setup — redirect
  if (user?.profileSetupComplete) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!user) {
    return <Navigate to="/login/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Your name is required.');
      return;
    }

    setLoading(true);
    try {
      // Persist profile fields onto the user object
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        contactEmail: contactEmail.trim(),
        profileSetupComplete: true,
        onboardingStatus: 'PROFILE_SETUP_COMPLETE' as const,
      };

      const updatedUser = {
        ...user,
        ...profileData
      };

      // Update central mock store so it persists across logins
      await AuthService.updateProfile(user.id, profileData);

      updateUser(updatedUser);

      // Small delay so the state update propagates before navigation
      await new Promise(r => setTimeout(r, 300));
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white text-lg">ParkEase AI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome, {user.firstName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Your workspace is ready. Complete a few details to get started.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Organization — Read Only */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Organization
              </label>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border",
                "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              )}>
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {orgLoading ? (
                  <span className="text-sm text-slate-400 italic">Loading organization...</span>
                ) : (
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {orgName || 'Unknown Organization'}
                  </span>
                )}
                <span className="ml-auto text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Read only
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Set by your ParkEase administrator. Contact support to change.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Your Name
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Business Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Business Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="contact@yourcompany.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !firstName.trim() || !lastName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          You can update this information anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}
