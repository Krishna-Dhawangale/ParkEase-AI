import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AuthService } from '../../services/auth.service';
import { LayoutBuilder } from '../../components/LayoutBuilder/LayoutBuilder';
import type { ParkingLayout } from '../../types/models';

type RegistrationData = {
  // Step 1: Personal
  firstName: string; lastName: string; email: string; password: string;
  // Step 2: Business
  businessName: string; businessRegNumber: string; taxId: string; phone: string;
  // Step 3: Location
  street: string; city: string; state: string; zip: string;
  // Step 4: Details
  capacity: string; basePrice: string;
  // Step 5: Layout
  layout: ParkingLayout | null;
  // Step 6: Documents
  documentUploaded: boolean;
};

export const OwnerAuthPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>({
    firstName: '', lastName: '', email: '', password: '',
    businessName: '', businessRegNumber: '', taxId: '', phone: '',
    street: '', city: '', state: '', zip: '',
    capacity: '50', basePrice: '15',
    layout: null,
    documentUploaded: false,
  });
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const updateData = (fields: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await AuthService.login({ email: data.email, password: data.password });
      if (response.user.role !== 'OWNER') throw new Error('Not an owner account');
      login(response.token, response.user);
      navigate('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async () => {
    setError('');
    try {
      const response = await AuthService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'OWNER'
      });
      // In a real app, we'd also send the business data and layout to a /profile endpoint
      login(response.token, response.user);
      navigate('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  if (isLoginView) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="card max-w-md w-full border-t-4 border-[var(--color-primary)]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-text)]">Partner Login</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input-field" value={data.email} onChange={e => updateData({ email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" className="input-field" value={data.password} onChange={e => updateData({ password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Sign In</button>
          </form>
          <div className="mt-6 text-center text-sm">
            <button onClick={() => setIsLoginView(false)} className="text-[var(--color-primary)] hover:underline">
              Want to list your parking? Apply here
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Wizard
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" className="input-field" value={data.firstName} onChange={e => updateData({ firstName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" className="input-field" value={data.lastName} onChange={e => updateData({ lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input-field" value={data.email} onChange={e => updateData({ email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" className="input-field" value={data.password} onChange={e => updateData({ password: e.target.value })} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Business Profile</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input type="text" className="input-field" value={data.businessName} onChange={e => updateData({ businessName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Registration Number</label>
              <input type="text" className="input-field" value={data.businessRegNumber} onChange={e => updateData({ businessRegNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax ID</label>
              <input type="text" className="input-field" value={data.taxId} onChange={e => updateData({ taxId: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Phone</label>
              <input type="tel" className="input-field" value={data.phone} onChange={e => updateData({ phone: e.target.value })} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Primary Parking Location</h3>
            <p className="text-sm opacity-70 mb-4">You can add more parking locations later from your dashboard.</p>
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input type="text" className="input-field" value={data.street} onChange={e => updateData({ street: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" className="input-field" value={data.city} onChange={e => updateData({ city: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State / Province</label>
                <input type="text" className="input-field" value={data.state} onChange={e => updateData({ state: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Parking Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Capacity (Vehicles)</label>
              <input type="number" className="input-field" value={data.capacity} onChange={e => updateData({ capacity: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Price per Hour ($)</label>
              <input type="number" className="input-field" value={data.basePrice} onChange={e => updateData({ basePrice: e.target.value })} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-fade-in h-[600px] flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Parking Layout</h3>
            <p className="text-sm opacity-70 mb-4">Use the grid below to map out your parking slots and obstacles.</p>
            <div className="flex-1 min-h-0 border rounded-xl overflow-hidden relative">
              <LayoutBuilder initialLayout={data.layout || undefined} onSave={(layout) => {
                updateData({ layout });
                setStep(6);
              }} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Verification Documents</h3>
            <p className="text-sm opacity-70 mb-4">Upload business registration and property ownership/lease documents.</p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
              <div className="mb-4 text-4xl">📄</div>
              <p className="font-medium">Drag & drop files here</p>
              <p className="text-sm opacity-70 mt-1">PDF, JPG, PNG up to 10MB</p>
              <button 
                className="btn-primary mt-4" 
                onClick={() => updateData({ documentUploaded: true })}
              >
                {data.documentUploaded ? 'Files Uploaded ✓' : 'Select Files'}
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Review Application</h3>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="opacity-70">Business Name</span>
                <span className="font-medium">{data.businessName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="opacity-70">Location</span>
                <span className="font-medium">{data.city}, {data.state}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="opacity-70">Capacity</span>
                <span className="font-medium">{data.capacity} slots</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Layout Mapped</span>
                <span className="font-medium">{data.layout ? 'Yes ✓' : 'No ✗'}</span>
              </div>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">
              By submitting this application, you agree to the ParkEase AI Partner Terms of Service.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">ParkEase AI Partner</h1>
        <button onClick={() => setIsLoginView(true)} className="text-sm hover:underline">
          Cancel Application
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto w-full">
        {/* Progress Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="card sticky top-8">
            <h3 className="font-semibold mb-4">Onboarding Progress</h3>
            <ul className="space-y-4 relative">
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gray-200 dark:bg-slate-700 -z-10"></div>
              {[
                { id: 1, label: 'Personal Details' },
                { id: 2, label: 'Business Profile' },
                { id: 3, label: 'Location' },
                { id: 4, label: 'Capacity & Pricing' },
                { id: 5, label: 'Parking Layout' },
                { id: 6, label: 'Documents' },
                { id: 7, label: 'Review' },
              ].map(s => (
                <li key={s.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s.id ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20' :
                    step > s.id ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500 dark:bg-slate-700'
                  }`}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className={`text-sm ${step === s.id ? 'font-medium' : 'opacity-70'}`}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1">
          <div className="card min-h-[400px] flex flex-col">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            
            <div className="flex-1 mb-8">
              {renderStep()}
            </div>

            {/* Navigation Buttons (hidden on layout step since it saves itself) */}
            {step !== 5 && (
              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                <button 
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 text-sm font-medium disabled:opacity-30"
                >
                  Back
                </button>
                
                {step < 7 ? (
                  <button 
                    onClick={() => setStep(s => Math.min(7, s + 1))}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handleRegisterSubmit}
                    className="btn-primary"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
