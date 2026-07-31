import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, CreditCard, Car, Settings, Bell,
  MapPin, Mail, Phone, ShieldCheck, ChevronRight,
  Camera, Lock, Info, Trash2, Leaf, Clock, Plus, HelpCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAuthStore } from '../../../store';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const tabs = [
    { name: 'Overview', icon: User, current: true },
    { name: 'Booking History', icon: Calendar, current: false },
    { name: 'Payment Methods', icon: CreditCard, current: false },
    { name: 'Vehicles', icon: Car, current: false },
    { name: 'Preferences', icon: Settings, current: false },
    { name: 'Notifications', icon: Bell, current: false },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account details and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${tab.current
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <tab.icon className={`w-4 h-4 ${tab.current ? 'text-black' : 'text-gray-400'}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left/Middle Column - Content */}
        <div className="flex-[1.5] space-y-8">
          
          {/* Recent Bookings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
              <button onClick={() => navigate('/customer/bookings')} className="text-sm font-medium text-gray-600 hover:text-gray-900">View all</button>
            </div>
            
            <Card className="p-0 overflow-hidden divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/customer/bookings')}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=150&h=100" alt="Empress Mall" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Empress Mall Parking</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">24 May 2025 <span className="mx-1">•</span> 10:00 AM - 12:00 PM</p>
                    <p className="text-[11px] text-gray-500">MH 31 AB 1234</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-emerald-600 mb-1">Completed</p>
                  <p className="font-bold text-gray-900 text-sm flex items-center justify-end">₹60.00 <ChevronRight className="w-3.5 h-3.5 ml-1 text-gray-400" /></p>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/customer/bookings')}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80&w=150&h=100" alt="VR Nagpur" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">VR Nagpur Parking</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">21 May 2025 <span className="mx-1">•</span> 06:00 PM - 09:00 PM</p>
                    <p className="text-[11px] text-gray-500">MH 31 CD 5678</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-emerald-600 mb-1">Completed</p>
                  <p className="font-bold text-gray-900 text-sm flex items-center justify-end">₹75.00 <ChevronRight className="w-3.5 h-3.5 ml-1 text-gray-400" /></p>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/customer/bookings')}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=150&h=100" alt="Central Avenue" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Central Avenue Parking</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">20 May 2025 <span className="mx-1">•</span> 11:00 AM - 01:00 PM</p>
                    <p className="text-[11px] text-gray-500">MH 31 EF 9012</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-emerald-600 mb-1">Completed</p>
                  <p className="font-bold text-gray-900 text-sm flex items-center justify-end">₹35.00 <ChevronRight className="w-3.5 h-3.5 ml-1 text-gray-400" /></p>
                </div>
              </div>
            </Card>
          </section>

          {/* Account Summary */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-4">Account Summary</h2>
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Bookings</p>
                  <p className="font-bold text-gray-900 text-xl">24</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                    <Car className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Hours Parked</p>
                  <p className="font-bold text-gray-900 text-xl">56h <span className="text-sm">30m</span></p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Saved</p>
                  <p className="font-bold text-gray-900 text-xl">₹3,420</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">CO₂ Saved</p>
                  <p className="font-bold text-gray-900 text-xl">12.4 <span className="text-sm">kg</span></p>
                </div>
              </div>
            </Card>
          </section>

          {/* Bottom Row: Vehicles & Payments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Saved Vehicles</h2>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Manage</button>
              </div>
              <Card className="p-0 overflow-hidden divide-y divide-gray-100">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                    <Car className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-gray-900 text-sm">MH 31 AB 1234</p>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0 border-none h-4">Primary</Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Maruti Suzuki Baleno</p>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center w-full h-full gap-2">
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </button>
                </div>
              </Card>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Payment Methods</h2>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Manage</button>
              </div>
              <Card className="p-0 overflow-hidden divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="VISA" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium mb-0.5">Visa Credit Card</p>
                      <p className="font-bold text-gray-900 text-xs tracking-wide">**** **** **** 4242</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0 border-none h-5">Primary</Badge>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-gray-400 font-bold text-lg font-serif italic">UPI</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">prathamesh@upi</p>
                    <p className="font-bold text-gray-900 text-xs">UPI ID</p>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center w-full h-full gap-2">
                    <Plus className="w-4 h-4" /> Add Payment Method
                  </button>
                </div>
              </Card>
            </section>
          </div>

        </div>

        {/* Right Column - Profile & Actions */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">
          
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || 'Prathamesh'}&backgroundColor=000000`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
              {user?.firstName || 'Prathamesh Deshmukh'}
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h2>
            <Badge className="bg-emerald-50 text-emerald-700 text-[10px] border-none mb-6">Verified</Badge>
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 truncate">{user?.email || 'prathamesh.deshmukh@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 truncate">+91 87654 32109</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 truncate">Nagpur, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 truncate">Member since May 2024</span>
              </div>
            </div>

            <div className="w-full space-y-3 mt-8">
              <Button variant="outline" className="w-full h-11 bg-white">
                Edit Profile
              </Button>
              <Button variant="primary" className="w-full h-11">
                <Lock className="w-4 h-4 mr-2" /> Change Password
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <h3 className="font-bold text-gray-900 p-5 pb-2 text-[15px]">Quick Actions</h3>
            <div className="divide-y divide-gray-100">
              <div className="p-4 px-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> Get Support
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="p-4 px-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> Privacy Policy
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="p-4 px-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Info className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> Terms & Conditions
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="p-4 px-5 flex items-center justify-between hover:bg-red-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-red-600">
                  <Trash2 className="w-4 h-4 text-red-500" /> Delete Account
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-600" />
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
