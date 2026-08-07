import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Shield, CreditCard, Bell, Palette, ChevronRight,
  X, CheckCircle2, Lock, FileText, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Notification toggle states
  const [bookingConfirmations, setBookingConfirmations] = useState(true);
  const [paymentReceipts, setPaymentReceipts] = useState(true);
  const [offersPromotions, setOffersPromotions] = useState(false);
  const [parkingReminders, setParkingReminders] = useState(true);

  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Modals state
  const [activeModal, setActiveModal] = useState<'edit-profile' | 'password' | 'privacy' | 'terms' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states initialized dynamically from auth user object
  const [name, setName] = useState(
    user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email ? user.email.split('@')[0] : 'User Profile')
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePreferences = () => {
    showToast('Notification preferences saved successfully!');
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    showToast('Profile information updated successfully!');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password changed successfully!');
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 font-sans pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 border border-gray-800 text-xs md:text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-xs md:text-sm text-gray-500 font-normal mt-0.5">
          Manage your account, preferences and security settings.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column */}
        <div className="space-y-5">
          
          {/* Card 1: Account Settings */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Account Settings</h2>
                <p className="text-[12px] text-gray-400 font-normal mt-0.5">Update your personal information and account details.</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
              <div 
                onClick={() => setActiveModal('edit-profile')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Your Name</span>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
                  <span>{name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('edit-profile')}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Email Address</span>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
                  <span className="truncate max-w-[180px]">{email}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('edit-profile')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Phone Number</span>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
                  <span>{phone}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <button 
                onClick={() => setActiveModal('edit-profile')}
                className="bg-black text-white font-semibold py-2 px-4 rounded-xl text-xs hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xs"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Card 2: Security */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Security</h2>
                <p className="text-[12px] text-gray-400 font-normal mt-0.5">Keep your account secure and protected.</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
              <div 
                onClick={() => setActiveModal('password')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Change Password</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Update your password regularly</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>

              <div className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-600">Enabled</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment Settings */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Payment Settings</h2>
                <p className="text-[12px] text-gray-400 font-normal mt-0.5">Manage your payment methods and preferences.</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
              <div 
                onClick={() => navigate('/customer/payments')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Saved Payment Methods</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">View and manage saved cards and UPI</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>

              <div 
                onClick={() => navigate('/customer/payments')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Default Payment Method</span>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
                  <span className="font-mono text-xs">UPI •••• 1234</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-5">
          
          {/* Card 4: Notification Preferences */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Notification Preferences</h2>
                <p className="text-[12px] text-gray-400 font-normal mt-0.5">Choose how and when you want to receive notifications.</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-b border-gray-100 py-3">
              {/* Booking Confirmations */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Booking Confirmations</p>
                  <p className="text-[11px] text-gray-400">Get notified for booking confirmations</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingConfirmations(!bookingConfirmations)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center shrink-0 ${
                    bookingConfirmations ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: bookingConfirmations ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Payment Receipts */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Payment Receipts</p>
                  <p className="text-[11px] text-gray-400">Get notified for payment receipts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentReceipts(!paymentReceipts)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center shrink-0 ${
                    paymentReceipts ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: paymentReceipts ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Offers & Promotions */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Offers & Promotions</p>
                  <p className="text-[11px] text-gray-400">Receive updates on offers and discounts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOffersPromotions(!offersPromotions)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center shrink-0 ${
                    offersPromotions ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: offersPromotions ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Parking Reminders */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900">Parking Reminders</p>
                  <p className="text-[11px] text-gray-400">Get reminders before your booking starts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setParkingReminders(!parkingReminders)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center shrink-0 ${
                    parkingReminders ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: parkingReminders ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>
            </div>

            <div>
              <button 
                onClick={handleSavePreferences}
                className="bg-black text-white font-semibold py-2 px-4 rounded-xl text-xs hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Card 5: Appearance */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Appearance</h2>
                <p className="text-[12px] text-gray-400 font-normal mt-0.5">Customize the app theme to your liking.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <p className="text-xs md:text-sm font-semibold text-gray-900">Theme</p>
                <p className="text-[11px] text-gray-400">Choose light or dark mode</p>
              </div>
              <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/60">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    themeMode === 'light'
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    themeMode === 'dark'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>

          {/* Card 6: Other */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0 font-bold text-gray-700 text-sm">
                •••
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Other</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-100 border-t border-gray-100">
              <div 
                onClick={() => setActiveModal('privacy')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Privacy Policy</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>

              <div 
                onClick={() => setActiveModal('terms')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Terms & Conditions</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* Help Center -> Redirects to /customer/support */}
              <div 
                onClick={() => navigate('/customer/support')}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold text-gray-900">Help Center</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Edit Profile Modal */}
              {activeModal === 'edit-profile' && (
                <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Edit Account Details</h3>
                      <p className="text-xs text-gray-500">Update your name, email, and phone</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-sm mt-3"
                  >
                    Save Account Changes
                  </button>
                </form>
              )}

              {/* Change Password Modal */}
              {activeModal === 'password' && (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                      <p className="text-xs text-gray-500">Ensure your account uses a strong password</p>
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-sm mt-3"
                  >
                    Update Password
                  </button>
                </form>
              )}

              {/* Privacy Policy Modal */}
              {activeModal === 'privacy' && (
                <div className="space-y-5 text-gray-800 pr-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Privacy Policy</h3>
                      <p className="text-[11px] text-gray-400">Last updated: August 2026 • ParkEase AI Platform</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs md:text-sm leading-relaxed text-gray-600">
                    <h4 className="font-bold text-gray-900 text-sm">1. Information We Collect</h4>
                    <p>
                      ParkEase AI collects personal information necessary to facilitate smart parking reservations, digital twin slot allocations, and automated gate access. This includes your name, email address, phone number, vehicle license plate data, geolocation for nearby facility discovery, and transaction history.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">2. Automated License Plate Recognition (ANPR) & Telemetry</h4>
                    <p>
                      Our smart facilities utilize ANPR cameras and IoT slot sensors to monitor real-time vehicle entry, exit, and parking spot occupancy. Camera snapshots are processed securely for entry barrier activation and session timing. ANPR logs are encrypted and retained strictly for audit and billing purposes.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">3. Payment & Security Architecture</h4>
                    <p>
                      Payment credentials (Credit Cards, UPI, Wallets) are processed through PCI-DSS compliant payment gateways (Razorpay, Stripe). ParkEase AI does not store raw credit card numbers or banking PINs on its servers. All data transfers use TLS 1.3 encryption.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">4. Data Sharing & Third Parties</h4>
                    <p>
                      We do not sell your personal data. Limited operational data (such as vehicle license plate and reservation time) is shared with verified parking facility operators solely to ensure seamless gate entry and attendant verification.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">5. Your Privacy Rights</h4>
                    <p>
                      You have the right to inspect, update, or request deletion of your account data at any time. For privacy inquiries or data removal requests, contact our Data Protection Officer at <span className="font-semibold text-gray-900">privacy@parkease.ai</span>.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="bg-black text-white font-semibold py-2 px-5 rounded-xl text-xs hover:bg-gray-800 transition-colors"
                    >
                      Close Privacy Policy
                    </button>
                  </div>
                </div>
              )}

              {/* Terms & Conditions Modal */}
              {activeModal === 'terms' && (
                <div className="space-y-5 text-gray-800 pr-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Terms & Conditions</h3>
                      <p className="text-[11px] text-gray-400">Effective Date: August 2026 • ParkEase AI Terms of Service</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs md:text-sm leading-relaxed text-gray-600">
                    <h4 className="font-bold text-gray-900 text-sm">1. Acceptance of Terms</h4>
                    <p>
                      By accessing or using the ParkEase AI platform, web portal, or digital ticket passes, you agree to be bound by these Terms & Conditions and our Privacy Policy.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">2. Parking Reservations & QR Gate Access</h4>
                    <p>
                      A confirmed reservation guarantees a parking spot allocation at the chosen facility during your specified time slot. You must present your digital QR pass or enter with your registered license plate matching your booking. Parking beyond your reserved end time may incur overstay surcharges based on the facility dynamic rate.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">3. Cancellations & Refunds</h4>
                    <p>
                      Bookings can be cancelled up to 15 minutes before start time for a full refund. Cancellations made within 15 minutes of start time or no-shows are subject to a nominal cancellation fee. Refunds are automatically credited back to your original payment method within 3–5 business days.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">4. Vehicle Safety & Facility Liability</h4>
                    <p>
                      ParkEase AI provides digital slot allocation and facility navigation software. Physical facility operators maintain local garage safety. ParkEase AI is not liable for theft, vandalism, or damage to personal items or vehicles while parked at partner facilities.
                    </p>

                    <h4 className="font-bold text-gray-900 text-sm">5. Account Usage & Misuse</h4>
                    <p>
                      Users must provide accurate vehicle registration details. Misuse of gate passes, fraudulent payment attempts, or deliberate blocking of EV/accessible slots may result in immediate suspension of booking privileges.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="bg-black text-white font-semibold py-2 px-5 rounded-xl text-xs hover:bg-gray-800 transition-colors"
                    >
                      Accept & Close
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
