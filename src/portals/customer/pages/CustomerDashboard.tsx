import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car, MapPin, Clock, Search, ChevronRight, Zap,
  Navigation, Star, History, CreditCard, Bell
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { mockParkingFacilities } from '../../../lib/data';

// Mock user data for the consumer dashboard
const activeBooking = {
  id: 'B-7X2A1',
  parkingName: 'Central Metro Hub',
  slot: 'A-12',
  floor: 'Ground Floor',
  entryTime: '10:30 AM',
  endTime: '12:30 PM',
  status: 'active',
  vehicle: 'KA 05 MN 4521 (Maruti Dzire)',
  image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&auto=format&fit=crop&q=80',
};

const savedVehicles = [
  { id: 'v1', number: 'KA 05 MN 4521', type: 'Sedan', brand: 'Maruti Dzire', color: 'White', default: true },
  { id: 'v2', number: 'KA 01 AB 1234', type: 'SUV', brand: 'Hyundai Creta', color: 'Black', default: false },
];

export function CustomerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
            Hello, Alex 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-0.5">
            Where are we parking today?
          </p>
        </div>
      </div>

      {/* Quick Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)] to-blue-600 rounded-2xl blur opacity-20 dark:opacity-40" />
        <div className="relative flex items-center bg-white dark:bg-[#0F172A] border border-[var(--border)] dark:border-white/10 rounded-2xl p-2 shadow-sm">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-[var(--brand)]" />
            <input
              type="text"
              placeholder="Search destinations, malls, airports..."
              className="w-full bg-transparent border-none outline-none text-sm text-[var(--text-primary)] dark:text-white placeholder:text-[var(--text-secondary)] py-2"
              onClick={() => navigate('/search')}
            />
          </div>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary py-2.5 px-6 shrink-0"
          >
            Find Parking
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (Active Booking & Vehicles) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Booking */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                <span className="live-dot" /> Current Session
              </h2>
              <button className="text-sm font-semibold text-[var(--brand)]" onClick={() => navigate('/ticket')}>View Ticket</button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card overflow-hidden relative group cursor-pointer"
              onClick={() => navigate('/ticket')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-5 flex flex-col sm:flex-row gap-5">
                {/* Image */}
                <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={activeBooking.image} alt={activeBooking.parkingName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg backdrop-blur-md">
                    ACTIVE
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-white">{activeBooking.parkingName}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {activeBooking.floor}</span>
                      <span className="flex items-center gap-1.5"><Car className="w-4 h-4" /> Slot {activeBooking.slot}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)] dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--brand)]" />
                      <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-white">
                        {activeBooking.entryTime} - {activeBooking.endTime}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand)] transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Nearby & Recommended */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white">Recommended Near You</h2>
              <button onClick={() => navigate('/search')} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-white transition-colors">See all</button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {mockParkingFacilities.slice(0, 2).map((facility, i) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => navigate('/search')}
                  className="card p-4 cursor-pointer hover:border-[var(--brand)]/30 transition-colors"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm line-clamp-1">{facility.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-xs font-semibold text-[var(--text-primary)] dark:text-white">{facility.rating}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">({facility.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-secondary)]">
                        <Navigation className="w-3 h-3" /> {facility.distance}km away
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] dark:border-white/10">
                    <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">₹{facility.price}<span className="text-[10px] text-[var(--text-secondary)] font-normal">/hr</span></div>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-lg">{facility.available} free</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Vehicles, Recent, Quick Actions) */}
        <div className="space-y-6">
          {/* Saved Vehicles */}
          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] dark:text-white uppercase tracking-wider">My Vehicles</h2>
              <button className="p-1 hover:bg-[var(--bg-primary)] dark:hover:bg-white/5 rounded-lg"><Car className="w-4 h-4 text-[var(--text-secondary)]" /></button>
            </div>
            <div className="space-y-3">
              {savedVehicles.map((v) => (
                <div key={v.id} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors", v.default ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-[var(--border)] dark:border-white/10")}>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] border border-[var(--border)] dark:border-white/10 flex items-center justify-center shrink-0">
                    <Car className={cn("w-5 h-5", v.default ? "text-[var(--brand)]" : "text-[var(--text-secondary)]")} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                      {v.number} {v.default && <span className="px-1.5 py-0.5 rounded text-[8px] bg-[var(--brand)] text-white">DEFAULT</span>}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{v.brand} · {v.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="grid grid-cols-2 gap-3">
            {[
              { label: 'History', icon: History, path: '/workflow' },
              { label: 'Payment', icon: CreditCard, path: '/payment' },
              { label: 'Favorites', icon: Star, path: '/search' },
              { label: 'Alerts', icon: Bell, path: '/notifications' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="card p-4 flex flex-col items-center justify-center gap-2 hover:border-[var(--brand)]/30 transition-colors text-[var(--text-secondary)] hover:text-[var(--brand)]"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-semibold text-[var(--text-primary)] dark:text-white">{item.label}</span>
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
