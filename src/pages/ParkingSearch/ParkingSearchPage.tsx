import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Star, Zap, Shield, Leaf,
  Clock, ChevronRight, Filter, X, Car, Navigation, Check,
  Wifi, Camera, Building2, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { mockParkingFacilities } from '../../lib/data';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const amenityIcons: Record<string, string> = {
  'CCTV': '📹',
  'EV Charging': '⚡',
  'Covered': '🏠',
  'Valet': '🎫',
  'Open Air': '☀️',
  'Shuttle': '🚌',
};

export function ParkingSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('ai');
  const [selectedParking, setSelectedParking] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'ev', label: 'EV Charging' },
    { id: 'covered', label: 'Covered' },
    { id: 'valet', label: 'Valet' },
    { id: 'recommended', label: 'AI Recommended' },
  ];

  const sortOptions = [
    { id: 'ai', label: 'AI Recommended' },
    { id: 'distance', label: 'Distance' },
    { id: 'price', label: 'Price' },
    { id: 'rating', label: 'Rating' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-transparent">
      {/* Left Panel */}
      <div className="flex-1 lg:max-w-xl xl:max-w-2xl overflow-y-auto">
        <div className="page-shell space-y-5">
          {/* Header */}
          <div className="page-hero space-y-4">
            <div className="section-kicker">Find the best slot</div>
            <div>
              <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Find Parking</h1>
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1 max-w-lg">
                AI-powered search across 500+ locations with live recommendations, cleaner filters, and better intent matching.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="card-flat p-3">
                <div className="text-lg font-bold text-[#111827] dark:text-white">500+</div>
                <div className="text-[11px] text-[#6B7280]">Locations</div>
              </div>
              <div className="card-flat p-3">
                <div className="text-lg font-bold text-[#111827] dark:text-white">&lt;200ms</div>
                <div className="text-[11px] text-[#6B7280]">AI match</div>
              </div>
              <div className="card-flat p-3">
                <div className="text-lg font-bold text-[#111827] dark:text-white">4.8</div>
                <div className="text-[11px] text-[#6B7280]">Avg rating</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search location, parking name..."
              className="input-field pl-11 pr-28 py-3.5 text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  showFilters
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 text-[#6B7280]'
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="card-flat p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#111827] dark:text-white">Advanced Filters</span>
                    <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#334155]">
                      <X className="w-4 h-4 text-[#6B7280]" />
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] mb-2">Price Range (per hour)</p>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="500" defaultValue="200" className="flex-1 accent-[#0F766E]" />
                      <span className="text-sm font-semibold text-[#0F766E] whitespace-nowrap">₹0–200</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] mb-2">Maximum Distance</p>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="10" defaultValue="3" step="0.5" className="flex-1 accent-[#0F766E]" />
                      <span className="text-sm font-semibold text-[#0F766E] whitespace-nowrap">3 km</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {['CCTV', 'EV Charging', 'Covered', 'Valet', 'Shuttle', 'Open Air'].map(a => (
                        <button key={a} className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] dark:bg-[#334155] border border-[#E5E7EB] dark:border-[#475569] text-[#6B7280] hover:border-[#0F766E] hover:text-[#0F766E] transition-all">
                          {amenityIcons[a]} {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-xs py-2">Apply Filters</button>
                    <button className="btn-secondary text-xs py-2">Reset</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  'pill-tab',
                  activeFilter === f.id
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 text-[#6B7280]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">
              {mockParkingFacilities.length} results found
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#6B7280]">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] bg-transparent border-none outline-none cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Parking Cards */}
          <div className="space-y-4">
            {mockParkingFacilities.map((facility, i) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedParking(facility.id)}
                className={cn(
                  'card overflow-hidden cursor-pointer transition-all',
                  selectedParking === facility.id && 'ring-2 ring-[#0F766E] dark:ring-[#14B8A6]'
                )}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden bg-[#F8FAFC] dark:bg-[#334155]">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x220/0F766E/FFFFFF?text=${facility.name.split(' ')[0]}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {facility.aiRecommended && (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#0F766E] text-white flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> AI Pick
                      </span>
                    )}
                    {facility.hasEV && (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-600 text-white">⚡ EV</span>
                    )}
                  </div>

                  {/* Open/Close badge */}
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      'px-2 py-1 rounded-lg text-[10px] font-bold',
                      facility.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    )}>
                      {facility.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Bottom info on image */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={cn('w-3 h-3', j < Math.floor(facility.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-white/40')} />
                        ))}
                      </div>
                      <span className="text-[11px] text-white font-semibold">{facility.rating}</span>
                      <span className="text-[10px] text-white/70">({facility.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#111827] dark:text-white text-sm truncate">{facility.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#6B7280] flex-shrink-0" />
                        <span className="text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">{facility.address}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-[#111827] dark:text-white">₹{facility.price}</div>
                      <div className="text-[11px] text-[#6B7280]">per {facility.priceUnit}</div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]">
                      <div className="text-xs font-bold text-green-600">{facility.available}</div>
                      <div className="text-[10px] text-[#6B7280]">Free</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]">
                      <div className="text-xs font-bold text-[#111827] dark:text-white flex items-center justify-center gap-0.5">
                        <Navigation className="w-2.5 h-2.5" />{facility.distance}km
                      </div>
                      <div className="text-[10px] text-[#6B7280]">Distance</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]">
                      <div className="text-xs font-bold text-[#111827] dark:text-white">{facility.walkTime}m</div>
                      <div className="text-[10px] text-[#6B7280]">Walk</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]">
                      <div className="text-xs font-bold text-[#111827] dark:text-white flex items-center justify-center gap-0.5">
                        <Leaf className="w-2.5 h-2.5 text-green-500" />{facility.greenScore}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">Green</div>
                    </div>
                  </div>

                  {/* Availability bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-[#6B7280]">Availability</span>
                      <span className="text-[11px] font-semibold text-[#0F766E]">{Math.round(facility.available / facility.total * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E5E7EB] dark:bg-[#334155] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(facility.available / facility.total * 100)}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full bg-green-500"
                      />
                    </div>
                  </div>

                  {/* Security + Amenities */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#0F766E]" />
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className={cn('w-2 h-2 rounded-sm', j < facility.security ? 'bg-[#0F766E]' : 'bg-[#E5E7EB] dark:bg-[#334155]')} />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#6B7280]">Security</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {facility.amenities.slice(0, 3).map(a => (
                        <span key={a} className="text-sm" title={a}>{amenityIcons[a]}</span>
                      ))}
                      {facility.amenities.length > 3 && (
                        <span className="text-[10px] text-[#6B7280]">+{facility.amenities.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/book')}
                    className="btn-primary w-full"
                  >
                    Reserve Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="hidden lg:flex flex-1 relative">
        <PremiumMapView selectedId={selectedParking} facilities={mockParkingFacilities} />
      </div>
    </div>
  );
}

function PremiumMapView({ selectedId, facilities }: { selectedId: string | null; facilities: typeof mockParkingFacilities }) {
  return (
    <div className="relative w-full h-full bg-[#E5E7EB] dark:bg-[#1E293B] overflow-hidden">
      {/* Map SVG background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="600" height="700" fill="#E8F4E8" />
        
        {/* Dark mode would be dark */}
        <rect width="600" height="700" fill="#D1FAE5" opacity="0.3" />

        {/* Roads */}
        <rect x="0" y="200" width="600" height="20" fill="white" opacity="0.8" />
        <rect x="0" y="400" width="600" height="20" fill="white" opacity="0.8" />
        <rect x="150" y="0" width="20" height="700" fill="white" opacity="0.8" />
        <rect x="350" y="0" width="20" height="700" fill="white" opacity="0.8" />
        <rect x="500" y="0" width="20" height="700" fill="white" opacity="0.8" />

        {/* Blocks/buildings */}
        {[
          [30, 30, 100, 160], [200, 30, 130, 160],
          [30, 240, 100, 140], [200, 240, 130, 140],
          [380, 30, 200, 160], [380, 240, 200, 140],
          [30, 440, 100, 240], [200, 440, 130, 240],
          [380, 440, 200, 240],
        ].map(([x, y, w, h], idx) => (
          <rect key={idx} x={x} y={y} width={w} height={h} rx="6" fill="#C8D6C0" opacity="0.5" />
        ))}

        {/* Metro line */}
        <path d="M 0 150 Q 300 100 600 150" stroke="#7C3AED" strokeWidth="3" fill="none" strokeDasharray="8 4" opacity="0.5" />

        {/* Parking markers */}
        {facilities.map((f, i) => {
          const positions = [{ x: 200, y: 320 }, { x: 420, y: 320 }, { x: 320, y: 180 }];
          const pos = positions[i] || { x: 300, y: 350 };
          const isSelected = f.id === selectedId;
          return (
            <g key={f.id}>
              <motion.g
                animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Pulse effect for selected */}
                {isSelected && (
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={20}
                    fill="#0F766E"
                    opacity={0.2}
                    animate={{ r: [20, 35], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <circle cx={pos.x} cy={pos.y} r={16} fill={isSelected ? '#0F766E' : 'white'} stroke={isSelected ? '#0F766E' : '#E5E7EB'} strokeWidth={2} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill={isSelected ? 'white' : '#0F766E'}>P</text>
                
                {/* AI badge */}
                {f.aiRecommended && (
                  <g>
                    <circle cx={pos.x + 12} cy={pos.y - 12} r={7} fill="#F59E0B" />
                    <text x={pos.x + 12} y={pos.y - 9} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">AI</text>
                  </g>
                )}

                {/* Available count */}
                <rect x={pos.x - 14} y={pos.y + 18} width="28" height="14" rx="7" fill="white" stroke="#E5E7EB" strokeWidth={1} />
                <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={8} fill="#16A34A" fontWeight="bold">{f.available} free</text>
              </motion.g>
            </g>
          );
        })}

        {/* User location */}
        <motion.circle
          cx={290} cy={370}
          r={8}
          fill="#2563EB"
          stroke="white"
          strokeWidth={3}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx={290} cy={370}
          r={16}
          fill="#2563EB"
          opacity={0.15}
          animate={{ r: [16, 28], opacity: [0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Map overlay controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {['+', '-', '⊕'].map((ctrl, i) => (
          <button key={i} className="w-9 h-9 card rounded-2xl flex items-center justify-center text-sm font-bold text-[#6B7280] hover:text-[#0F766E] transition-colors">
            {ctrl}
          </button>
        ))}
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 card p-3">
        <p className="text-xs font-semibold text-[#111827] dark:text-white mb-2">Map Legend</p>
        {[
          { color: '#0F766E', label: 'Parking Hub' },
          { color: '#F59E0B', label: 'AI Recommended' },
          { color: '#2563EB', label: 'Your Location' },
          { color: '#7C3AED', label: 'Metro Line' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-[#6B7280]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Street-view style overlay */}
      <div className="absolute top-4 left-4 card px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
          <span className="font-semibold text-[#111827] dark:text-white">Bengaluru, KA</span>
        </div>
      </div>
    </div>
  );
}
