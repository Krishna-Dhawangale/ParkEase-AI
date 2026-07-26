import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, CheckCircle2, ChevronRight, Loader2, ArrowRight, ArrowLeft, 
  User, MapPin, FileText, CreditCard, ShieldCheck, Check
} from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SABreadcrumbs } from '../components/SABreadcrumbs';
import { SuperAdminService } from '../services/super-admin.service';
import type { OrganizationType, BillingCycle, SaaSPlan } from '../types/super-admin.types';

const STEPS = [
  { id: 0, title: 'Business', icon: Building2 },
  { id: 1, title: 'Contact', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Details', icon: FileText },
  { id: 4, title: 'Plan', icon: CreditCard },
  { id: 5, title: 'Admin', icon: ShieldCheck },
  { id: 6, title: 'Review', icon: CheckCircle2 }
];

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [successResult, setSuccessResult] = useState<{
    orgName: string;
    adminName: string;
    email: string;
    tempPassword?: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Business
    orgName: '',
    legalName: '',
    type: 'MALL' as OrganizationType,
    website: '',
    
    // Step 2: Contact
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    
    // Step 3: Address
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    
    // Step 4: Details
    gstNumber: '',
    businessRegNumber: '',
    internalNotes: '',
    
    // Step 5: Plan
    planId: '',
    billingCycle: 'MONTHLY' as BillingCycle,
    startDate: new Date().toISOString().split('T')[0],
    
    // Step 6: Admin
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminTitle: ''
  });

  useEffect(() => {
    SuperAdminService.getPlans().then(setPlans);
  }, []);

  // Sync admin email with contact email by default if not set
  useEffect(() => {
    if (currentStep === 5 && !formData.adminEmail && formData.contactEmail) {
      setFormData(prev => ({ 
        ...prev, 
        adminEmail: prev.contactEmail,
        adminFirstName: prev.contactName.split(' ')[0] || '',
        adminLastName: prev.contactName.split(' ').slice(1).join(' ') || '',
        adminPhone: prev.contactPhone
      }));
    }
  }, [currentStep, formData.contactEmail, formData.contactName, formData.contactPhone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminService.createOrganization({
        organization: {
          name: formData.orgName,
          businessName: formData.legalName || formData.orgName,
          type: formData.type,
          website: formData.website || undefined
        },
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country
        },
        subscription: {
          planId: formData.planId || (plans[0]?.id ?? 'plan-1'),
          billingCycle: formData.billingCycle,
          startDate: new Date(formData.startDate).toISOString()
        },
        clientAdmin: {
          firstName: formData.adminFirstName,
          lastName: formData.adminLastName,
          email: formData.adminEmail,
          phone: formData.adminPhone
        }
      });
      
      setSuccessResult({
        orgName: res.organization.name,
        adminName: `${res.clientAdmin.firstName} ${res.clientAdmin.lastName}`,
        email: res.clientAdmin.email,
        tempPassword: res.temporaryPassword
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successResult) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Organization Created Successfully</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            The organization has been onboarded and the primary Client Admin account is ready.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-left mb-8 space-y-4">
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Organization</div>
              <div className="font-semibold text-slate-900 dark:text-white">{successResult.orgName}</div>
            </div>
            <hr className="border-slate-200 dark:border-slate-700" />
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Client Administrator</div>
              <div className="font-semibold text-slate-900 dark:text-white">{successResult.adminName}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">{successResult.email}</div>
            </div>
            {successResult.tempPassword && (
              <>
                <hr className="border-slate-200 dark:border-slate-700" />
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-md p-4">
                  <div className="text-[11px] font-medium text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-2">Temporary Login Credential</div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tracking-wider bg-white dark:bg-slate-950 px-3 py-2 rounded border border-slate-200 dark:border-slate-800 select-all">
                    {successResult.tempPassword}
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-2">
                    Copy this credential and securely provide it to the client. It will not be shown again. They will be forced to change it upon first login.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/super-admin/organizations"
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Back to Organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <SABreadcrumbs items={[
        { label: 'Organizations', href: '/super-admin/organizations' },
        { label: 'Add Organization' }
      ]} />
      
      <SAPageHeader 
        title="Add Organization" 
        description="Onboard a new client business to the ParkEase AI platform." 
      />

      {/* Stepper Header */}
      <div className="hidden sm:block mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {STEPS.map((step, stepIdx) => (
              <li key={step.title} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <div className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full
                    ${currentStep > step.id ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer' : 
                      currentStep === step.id ? 'border-2 border-brand-600 bg-white dark:bg-slate-900' : 
                      'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}
                  `}
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : (
                      <step.icon className={`h-4 w-4 ${currentStep === step.id ? 'text-brand-600' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div className="ml-4 text-xs font-medium uppercase tracking-wider absolute -bottom-6 left-1/2 -translate-x-1/2 w-max text-center">
                    <span className={currentStep >= step.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>
                      {step.title}
                    </span>
                  </div>
                </div>
                {stepIdx !== STEPS.length - 1 ? (
                  <div className={`absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full bg-slate-200 dark:bg-slate-800 ${currentStep > step.id ? 'bg-brand-600 dark:bg-brand-600' : ''}`} />
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <form onSubmit={handleNext}>
          <div className="p-6 sm:p-8 min-h-[400px]">
            {/* Step 1: Business */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organization Name <span className="text-red-500">*</span></label>
                    <input type="text" name="orgName" required value={formData.orgName} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="e.g. Phoenix Group" autoFocus />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Legal / Business Name</label>
                    <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="e.g. Phoenix Group Enterprises Pvt Ltd" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organization Type <span className="text-red-500">*</span></label>
                    <select name="type" required value={formData.type} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm">
                      <option value="MALL">Mall</option>
                      <option value="AIRPORT">Airport</option>
                      <option value="HOSPITAL">Hospital</option>
                      <option value="HOTEL">Hotel</option>
                      <option value="UNIVERSITY">University</option>
                      <option value="CORPORATE_CAMPUS">Corporate Campus</option>
                      <option value="COMMERCIAL_PARKING">Commercial Parking Operator</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="https://..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Primary Contact</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Person <span className="text-red-500">*</span></label>
                    <input type="text" name="contactName" required value={formData.contactName} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="Full Name" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Email <span className="text-red-500">*</span></label>
                    <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="email@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="+91..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Address</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address <span className="text-red-500">*</span></label>
                    <input type="text" name="street" required value={formData.street} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City <span className="text-red-500">*</span></label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State <span className="text-red-500">*</span></label>
                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PIN Code <span className="text-red-500">*</span></label>
                    <input type="text" name="pinCode" required pattern="[0-9]{6}" title="6 digit PIN code" value={formData.pinCode} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country <span className="text-red-500">*</span></label>
                    <input type="text" name="country" required value={formData.country} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Details</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Number <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Reg. Number <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                    <input type="text" name="businessRegNumber" value={formData.businessRegNumber} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internal Notes <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                    <textarea rows={4} name="internalNotes" value={formData.internalNotes} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" placeholder="Any internal notes for ParkEase team..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Plan */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Subscription Plan</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select SaaS Plan <span className="text-red-500">*</span></label>
                    {plans.length > 0 ? (
                      <select name="planId" required value={formData.planId} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" autoFocus>
                        <option value="">-- Select a Plan --</option>
                        {plans.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.monthlyPrice}/mo</option>)}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-sm">
                        No plans found. Defaulting to standard deployment architecture.
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Cycle <span className="text-red-500">*</span></label>
                    <select name="billingCycle" required value={formData.billingCycle} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm">
                      <option value="MONTHLY">Monthly</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subscription Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Admin */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Client Administrator</h2>
                <p className="text-sm text-slate-500">This user will be granted Super Admin access for their specific organization.</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input type="text" name="adminFirstName" required value={formData.adminFirstName} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" name="adminLastName" required value={formData.adminLastName} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="adminEmail" required value={formData.adminEmail} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" name="adminPhone" required value={formData.adminPhone} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                    <input type="text" name="adminTitle" value={formData.adminTitle} onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-brand-600 dark:bg-slate-950 sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Review Details</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex justify-between">
                        Organization
                        <button type="button" onClick={() => setCurrentStep(0)} className="text-brand-600 hover:underline font-normal text-xs">Edit</button>
                      </h3>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1">
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Name:</span> {formData.orgName}</p>
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Type:</span> {formData.type}</p>
                        {formData.website && <p><span className="font-medium text-slate-700 dark:text-slate-300">Website:</span> {formData.website}</p>}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex justify-between">
                        Contact
                        <button type="button" onClick={() => setCurrentStep(1)} className="text-brand-600 hover:underline font-normal text-xs">Edit</button>
                      </h3>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1">
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Name:</span> {formData.contactName}</p>
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> {formData.contactEmail}</p>
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> {formData.contactPhone}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex justify-between">
                        Address
                        <button type="button" onClick={() => setCurrentStep(2)} className="text-brand-600 hover:underline font-normal text-xs">Edit</button>
                      </h3>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1">
                        <p>{formData.street}</p>
                        <p>{formData.city}, {formData.state} {formData.pinCode}</p>
                        <p>{formData.country}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex justify-between">
                        Client Admin
                        <button type="button" onClick={() => setCurrentStep(5)} className="text-brand-600 hover:underline font-normal text-xs">Edit</button>
                      </h3>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1">
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Name:</span> {formData.adminFirstName} {formData.adminLastName}</p>
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> {formData.adminEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${currentStep === 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md shadow-sm transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-6 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md shadow-sm transition-colors disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Organization
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
