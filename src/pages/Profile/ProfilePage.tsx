import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Car, Clock, Leaf, Star, Bell, Shield, Settings, Camera,
  ChevronRight, Edit2, Plus, Check, TrendingUp, IndianRupee,
  Gift, Moon, Sun, Smartphone, Key, LogOut, Medal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockRecentBookings } from '../../lib/data';
import { useThemeStore, useAuthStore } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = ['Overview', 'Vehicles', 'History', 'Rewards', 'Settings'];

function ProfileTab({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={cn(active ? 'block' : 'hidden')}>
      {children}
    </div>
  );
}

export function ProfilePage() {
  const { theme, toggleTheme } = useThemeStore();
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return (location.state as { activeTab?: string })?.activeTab || 'Overview';
  });

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  const user = useAuthStore(s => s.user);
  const isAdmin = user?.email === 'admin@parkease.ai';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold">
              {isAdmin ? 'A' : 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-[var(--border)] border border-[var(--border)] dark:border-[var(--border)] flex items-center justify-center shadow-soft">
              <Camera className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)] dark:text-white">
                  {isAdmin ? 'Girish Kumar' : 'Standard User'}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                  {user?.email || 'user@parkease.ai'} · +91 98765 43210
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-brand">{isAdmin ? 'Admin' : 'Customer'}</span>
                  <span className="badge badge-success">Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost p-2" title="Edit Profile">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:border-l sm:border-[var(--border)] sm:dark:border-[var(--border)] sm:pl-6">
            {[
              { icon: Car, label: 'Total Trips', value: '142', color: 'text-[var(--brand)]' },
              { icon: IndianRupee, label: 'Spent', value: '₹18.4K', color: 'text-blue-600' },
              { icon: Leaf, label: 'Green Score', value: '847', color: 'text-green-600' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon className={cn('w-5 h-5 mx-auto mb-1', stat.color)} />
                <div className="text-lg font-bold text-[var(--text-primary)] dark:text-white">{stat.value}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] rounded-2xl p-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
              activeTab === tab
                ? 'bg-[var(--brand)] text-white'
                : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      <ProfileTab active={activeTab === 'Overview'}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Car, label: 'Active Booking', value: 'Slot A-12', sub: 'Central Metro Hub · Expires 2:30 PM', color: 'brand' },
            { icon: Medal, label: 'Green Rank', value: '#34 of 12,480', sub: 'Top 0.3% in Bengaluru', color: 'success' },
            { icon: Gift, label: 'Reward Points', value: '2,840 pts', sub: '≈ ₹284 value', color: 'amber' },
            { icon: Star, label: 'Avg Rating Given', value: '4.8 / 5', sub: 'Based on 42 reviews', color: 'info' },
            { icon: Clock, label: 'Avg Parking Time', value: '2.3 hrs', sub: 'Across all bookings', color: 'brand' },
            { icon: TrendingUp, label: 'CO₂ Saved', value: '24.8 kg', sub: 'Equivalent to 2 trees', color: 'success' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center mb-3',
                item.color === 'brand' && 'bg-[var(--brand)]/10 dark:bg-[var(--brand-light)]/10',
                item.color === 'success' && 'bg-green-50 dark:bg-green-900/20',
                item.color === 'amber' && 'bg-amber-50 dark:bg-amber-900/20',
                item.color === 'info' && 'bg-blue-50 dark:bg-blue-900/20',
              )}>
                <item.icon className={cn('w-4.5 h-4.5', {
                  'text-[var(--brand)] dark:text-[var(--brand-light)]': item.color === 'brand',
                  'text-green-600 dark:text-green-400': item.color === 'success',
                  'text-amber-600 dark:text-amber-400': item.color === 'amber',
                  'text-blue-600 dark:text-blue-400': item.color === 'info',
                })} size={18} />
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] dark:text-white">{item.value}</div>
              <div className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </ProfileTab>

      {/* Vehicles Tab */}
      <ProfileTab active={activeTab === 'Vehicles'}>
        <div className="space-y-3">
          {[
            { number: 'KA 05 MN 4521', type: 'Sedan', brand: 'Maruti Suzuki Dzire', color: 'Pearl White', primary: true },
            { number: 'KA 01 AB 1234', type: 'SUV', brand: 'Hyundai Creta', color: 'Phantom Black', primary: false },
          ].map((vehicle, i) => (
            <motion.div
              key={vehicle.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] dark:bg-[var(--border)] flex items-center justify-center">
                <Car className="w-6 h-6 text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)] dark:text-white">{vehicle.number}</span>
                  {vehicle.primary && <span className="badge badge-brand text-[10px]">Primary</span>}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{vehicle.brand} · {vehicle.type} · {vehicle.color}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
                <button className="btn-ghost p-2 text-red-500 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
          <button className="card w-full p-4 border-dashed flex items-center justify-center gap-2 text-sm font-semibold text-[var(--brand)] dark:text-[var(--brand-light)] hover:bg-[var(--brand)]/5 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Vehicle
          </button>
        </div>
      </ProfileTab>

      {/* History Tab */}
      <ProfileTab active={activeTab === 'History'}>
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] dark:border-[var(--border)]">
            <h3 className="font-bold text-[var(--text-primary)] dark:text-white">Booking History</h3>
          </div>
          <div className="divide-y divide-[var(--border)] dark:divide-[var(--border)]">
            {mockRecentBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)]/30 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/10 dark:bg-[var(--brand-light)]/10 flex items-center justify-center">
                  <Car className="w-4.5 h-4.5 text-[var(--brand)] dark:text-[var(--brand-light)]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-white truncate">{booking.parking}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Slot {booking.slot} · {booking.time} · {booking.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[var(--text-primary)] dark:text-white">₹{booking.amount}</p>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    booking.status === 'active' && 'bg-[var(--brand)]/10 text-[var(--brand)]',
                    booking.status === 'completed' && 'bg-green-50 text-green-600',
                    booking.status === 'upcoming' && 'bg-blue-50 text-blue-600',
                    booking.status === 'cancelled' && 'bg-red-50 text-red-600',
                  )}>
                    {booking.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ProfileTab>

      {/* Rewards Tab */}
      <ProfileTab active={activeTab === 'Rewards'}>
        <div className="space-y-4">
          <div className="card p-6 gradient-brand text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">Total Green Points</p>
                <p className="text-4xl font-bold">2,840</p>
                <p className="text-white/60 text-xs mt-1">≈ ₹284 redeemable value</p>
              </div>
              <Medal className="w-12 h-12 text-[#F59E0B]" />
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '56.8%' }} />
            </div>
            <p className="text-xs text-white/60 mt-1.5">1,160 more points to Platinum status</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Cashback Earned', value: '₹847', icon: '💰', desc: 'From 142 trips' },
              { title: 'CO₂ Offset', value: '24.8kg', icon: '🌿', desc: '≈ 2 trees planted' },
              { title: 'Streak Bonus', value: '7 days', icon: '🔥', desc: 'Active this week' },
              { title: 'Referral Bonus', value: '500 pts', icon: '🎁', desc: '2 successful referrals' },
            ].map(r => (
              <div key={r.title} className="card p-4">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="font-bold text-[var(--text-primary)] dark:text-white">{r.value}</div>
                <div className="text-xs text-[var(--text-secondary)] font-medium">{r.title}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ProfileTab>

      {/* Settings Tab */}
      <ProfileTab active={activeTab === 'Settings'}>
        <div className="space-y-4">
          {[
            {
              title: 'Appearance',
              items: [
                { label: 'Dark Mode', icon: theme === 'dark' ? Moon : Sun, action: 'toggle', value: theme === 'dark' },
                { label: 'Language', icon: Settings, action: 'select', value: 'English (India)' },
              ]
            },
            {
              title: 'Notifications',
              items: [
                { label: 'Booking Reminders', icon: Bell, action: 'toggle', value: true },
                { label: 'Payment Receipts', icon: IndianRupee, action: 'toggle', value: true },
                { label: 'AI Recommendations', icon: Star, action: 'toggle', value: false },
              ]
            },
            {
              title: 'Security',
              items: [
                { label: 'Two-Factor Auth', icon: Shield, action: 'nav', value: 'Enabled' },
                { label: 'Saved Payment Methods', icon: Key, action: 'nav', value: '3 methods' },
                { label: 'Linked Devices', icon: Smartphone, action: 'nav', value: '2 devices' },
              ]
            }
          ].map(section => (
            <div key={section.title} className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--border)] dark:border-[var(--border)]">
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{section.title}</p>
              </div>
              <div className="divide-y divide-[var(--border)] dark:divide-[var(--border)]">
                {section.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--border)]/30 transition-colors cursor-pointer"
                    onClick={item.label === 'Dark Mode' ? toggleTheme : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text-primary)] dark:text-white">{item.label}</span>
                    </div>
                    {item.action === 'toggle' ? (
                      <div className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        item.value ? 'bg-[var(--brand)]' : 'bg-[var(--border)] dark:bg-[var(--border)]'
                      )}>
                        <div className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          item.value ? 'translate-x-4' : 'translate-x-0.5'
                        )} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)]">{item.value}</span>
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="card w-full p-4 flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </ProfileTab>
    </div>
  );
}
