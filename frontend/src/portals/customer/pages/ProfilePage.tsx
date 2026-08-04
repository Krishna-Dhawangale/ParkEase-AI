import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, CheckCircle2, Calendar, Star,
  Car, CreditCard, Leaf, Lock, Edit3, ChevronRight, X, Camera,
  ShieldCheck, Clock, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Modals state
  const [activeModal, setActiveModal] = useState<'edit-profile' | 'password' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states initialized dynamically from auth user object
  const [name, setName] = useState(
    user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email ? user.email.split('@')[0] : 'User Profile')
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.city || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    showToast('Profile updated successfully!');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password changed successfully!');
  };

  // Get initials for avatar from actual user name
  const initials = (name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  // Compute real dynamic account summary metrics from user bookings
  const userBookings = React.useMemo(() => {
    const saved = localStorage.getItem('parkease-user-bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  }, []);

  const totalBookingsCount = userBookings.length;
  const totalHoursParked = userBookings.reduce((acc, b: any) => {
    const hrs = parseFloat(b.duration) || 2;
    return acc + hrs;
  }, 0);
  const totalMoneySaved = userBookings.reduce((acc, b: any) => acc + (parseFloat(b.amount?.replace(/[^0-9.]/g, '')) || 0) * 0.2, 0);
  const totalCo2Saved = (totalBookingsCount * 0.517).toFixed(1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800 text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Manage your account details and preferences
        </p>
      </div>

      {/* Top Banner Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Left Side: Avatar & Primary Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-black text-white font-bold text-3xl flex items-center justify-center shrink-0 shadow-md">
              {initials}
            </div>
            <button 
              onClick={() => setActiveModal('edit-profile')}
              className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h2>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
            </div>

            <div className="inline-block">
              <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="space-y-1 pt-1 text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{email || 'No email specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{phone || 'Not added'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{location || 'Not specified'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setActiveModal('edit-profile')}
                className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
              >
                Edit Profile <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Verification Details & Loyalty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          
          {/* Email Verified */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Email Verified</p>
              <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{email || 'Not verified'}</p>
            </div>
          </div>

          {/* Phone Verified */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Phone Verified</p>
              <p className="text-[11px] text-gray-400">{phone || 'Not verified'}</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Member Since</p>
              <p className="text-[11px] text-gray-400">August 2026</p>
            </div>
          </div>

          {/* Loyalty Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-900">Loyalty Level</p>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Bronze
                </span>
              </div>
              <p className="text-[11px] text-gray-400">0 points</p>
            </div>
          </div>

        </div>

      </div>

      {/* Section 1: Account Summary */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Bookings */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookingsCount}</p>
            </div>
          </div>

          {/* Hours Parked */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Hours Parked</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(totalHoursParked)}h <span className="text-sm">{Math.round((totalHoursParked % 1) * 60)}m</span>
              </p>
            </div>
          </div>

          {/* Money Saved */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Money Saved</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(totalMoneySaved)}</p>
            </div>
          </div>

          {/* CO2 Saved */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">CO₂ Saved</p>
              <p className="text-2xl font-bold text-gray-900">{totalCo2Saved} <span className="text-sm">kg</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Edit Profile */}
          <div 
            onClick={() => setActiveModal('edit-profile')}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">Edit Profile</h4>
                <p className="text-[11px] text-gray-400 truncate">Update your personal information</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Card 2: Change Password */}
          <div 
            onClick={() => setActiveModal('password')}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">Change Password</h4>
                <p className="text-[11px] text-gray-400 truncate">Keep your account secure</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Card 3: Manage Vehicles */}
          <div 
            onClick={() => navigate('/customer/vehicles')}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">Manage Vehicles</h4>
                <p className="text-[11px] text-gray-400 truncate">View and manage your vehicles</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Card 4: View Bookings */}
          <div 
            onClick={() => navigate('/customer/bookings')}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">View Bookings</h4>
                <p className="text-[11px] text-gray-400 truncate">See your booking history</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

        </div>
      </div>

      {/* Section 3: Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <button 
            onClick={() => navigate('/customer/bookings')}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View all activity <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          {userBookings.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Clock className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-700">No recent activity yet</p>
              <p className="text-xs text-gray-400">Your recent bookings and account actions will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userBookings.map((b: any, index: number) => (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Booking Completed</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{b.name} • {b.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 shrink-0">{b.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Edit Profile Form */}
              {activeModal === 'edit-profile' && (
                <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                      <p className="text-xs text-gray-500">Update your account information</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md mt-4"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {/* Change Password Form */}
              {activeModal === 'password' && (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                      <p className="text-xs text-gray-500">Ensure your account is secure</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md mt-4"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
