import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin, Star, Clock, Car, Zap, Shield, Navigation,
  ChevronLeft, Share2, Heart, CheckCircle2, Building2, ChevronRight
} from 'lucide-react';
import { mockParkingFacilities } from '../../../lib/data';
import { cn } from '../../../lib/utils';

export function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // In a real app we'd fetch this by ID. For now, use mock data.
  const facility = mockParkingFacilities.find(f => f.id === id) || mockParkingFacilities[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[var(--bg-primary)] dark:bg-[#081120]">
      {/* Header Image & Actions */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full shrink-0">
        <img 
          src={facility.image} 
          alt={facility.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        {/* Top bar actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "")} />
            </button>
          </div>
        </div>

        {/* Bottom image info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {facility.aiRecommended && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--brand)] text-white flex items-center gap-1 shadow-md">
                <Zap className="w-3 h-3" /> AI Pick
              </span>
            )}
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold shadow-md",
              facility.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}>
              {facility.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{facility.name}</h1>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--brand-light)]" /> {facility.address}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {facility.rating} ({facility.reviews})</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 -mt-6 relative z-20">
        
        {/* Left Column (Details) */}
        <div className="flex-1 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="card p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-2">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{facility.available} free</div>
              <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Availability</div>
            </div>
            <div className="card p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{facility.distance}km</div>
              <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Distance</div>
            </div>
            <div className="card p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{facility.security}/5</div>
              <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Security</div>
            </div>
            <div className="card p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">3</div>
              <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Floors</div>
            </div>
          </div>

          {/* About */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white mb-3">About this facility</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Experience seamless parking at {facility.name}. This facility is equipped with automated entry/exit systems, high-definition CCTV coverage, and real-time availability tracking. Select your slot in advance using our interactive Digital Twin and enjoy a guaranteed parking space upon arrival.
            </p>
          </div>

          {/* Amenities */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
              {facility.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 text-sm text-[var(--text-primary)] dark:text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" />
                  {a}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] dark:text-white font-medium">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" /> Accessible Slots
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] dark:text-white font-medium">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" /> Well Lit
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--brand)]" /> Operating Hours
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-[var(--border)] dark:border-white/5">
                <span className="text-[var(--text-secondary)]">Monday - Friday</span>
                <span className="font-semibold text-[var(--text-primary)] dark:text-white">24 Hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)] dark:border-white/5">
                <span className="text-[var(--text-secondary)]">Saturday</span>
                <span className="font-semibold text-[var(--text-primary)] dark:text-white">24 Hours</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-secondary)]">Sunday</span>
                <span className="font-semibold text-[var(--text-primary)] dark:text-white">24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Booking Widget) */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="card p-6 sticky top-20 shadow-xl border-[var(--brand)]/20 dark:border-[var(--brand)]/30">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Standard Rate</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-[var(--brand)]">₹{facility.price}</span>
                  <span className="text-sm font-semibold text-[var(--text-secondary)] pb-1">/{facility.priceUnit}</span>
                </div>
              </div>
              {facility.hasEV && (
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-0.5">EV Charging</p>
                  <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Available</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Low Congestion Right Now</span>
              </div>
              
              <div className="p-4 bg-[var(--bg-primary)] dark:bg-white/5 rounded-xl text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">Total Capacity</span>
                  <span className="font-bold text-[var(--text-primary)] dark:text-white">{facility.total} Slots</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-[var(--text-secondary)]">Currently Available</span>
                  <span className="font-bold text-green-600">{facility.available} Slots</span>
                </div>
                {/* Availability Bar */}
                <div className="h-1.5 w-full bg-[var(--border)] dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(facility.available / facility.total) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/digital-twin?parkingId=${facility.id}`)}
              className="btn-primary w-full py-4 text-base shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:shadow-[0_12px_25px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 transition-all"
            >
              Book a Slot Now
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
            <p className="text-xs text-center text-[var(--text-secondary)] mt-3">You won't be charged yet. Pick your slot first.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
