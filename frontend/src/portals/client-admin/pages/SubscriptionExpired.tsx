import React from 'react';
import { AlertTriangle, CreditCard, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionExpired() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Subscription Expired</h1>
        <p className="text-slate-400 mb-8">
          Your organization's subscription has expired. Please renew your subscription to continue managing your facilities and accessing the Client Portal.
        </p>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            onClick={() => {/* Integration with payment gateway would go here */}}
          >
            <CreditCard className="w-5 h-5" />
            Renew Subscription
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl border border-slate-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
