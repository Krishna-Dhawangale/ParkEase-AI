import { motion } from 'framer-motion';

const slotColors: Record<string, string> = {
  available: '#16A34A',
  occupied: '#DC2626',
  reserved: '#F59E0B',
  ev: '#2563EB',
  vip: '#7C3AED',
};

const slots = [
  { id: 'A1', x: 60, y: 40, status: 'available' },
  { id: 'A2', x: 100, y: 40, status: 'occupied' },
  { id: 'A3', x: 140, y: 40, status: 'reserved' },
  { id: 'A4', x: 180, y: 40, status: 'ev' },
  { id: 'A5', x: 220, y: 40, status: 'available' },
  { id: 'A6', x: 260, y: 40, status: 'occupied' },
  { id: 'B1', x: 60, y: 120, status: 'vip' },
  { id: 'B2', x: 100, y: 120, status: 'available' },
  { id: 'B3', x: 140, y: 120, status: 'occupied' },
  { id: 'B4', x: 180, y: 120, status: 'available' },
  { id: 'B5', x: 220, y: 120, status: 'reserved' },
  { id: 'B6', x: 260, y: 120, status: 'ev' },
];

const vehicles = [
  { x: 80, y: 80, color: 'var(--brand)', id: 'v1' },
  { x: 180, y: 80, color: '#2563EB', id: 'v2' },
];

export function ParkingIllustration() {
  return (
    <div className="relative">
      {/* Main card */}
      <motion.div
        className="card p-6 relative overflow-hidden"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-[var(--text-primary)] dark:text-white">Central Hub – Live</span>
          </div>
          <div className="flex gap-1">
            {['GF', 'F1', 'F2'].map((f, i) => (
              <span key={f} className={`px-2 py-0.5 text-xs font-semibold rounded-md ${i === 0 ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-primary)] dark:bg-[var(--border)] text-[var(--text-secondary)]'}`}>{f}</span>
            ))}
          </div>
        </div>

        {/* SVG Parking View */}
        <div className="bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] rounded-xl overflow-hidden">
          <svg viewBox="0 0 340 200" className="w-full h-auto">
            {/* Road/driveway */}
            <rect x="20" y="90" width="300" height="20" rx="4" fill="var(--border)" />
            <rect x="20" y="92" width="300" height="1" fill="white" opacity="0.5" />
            {/* Lane marking */}
            {[0,1,2,3,4].map(i => (
              <rect key={i} x={40 + i*55} y="99" width="20" height="2" rx="1" fill="white" opacity="0.6" />
            ))}

            {/* Parking slots */}
            {slots.map((slot) => (
              <g key={slot.id}>
                <motion.rect
                  x={slot.x}
                  y={slot.y}
                  width={28}
                  height={40}
                  rx={4}
                  fill={`${slotColors[slot.status]}25`}
                  stroke={slotColors[slot.status]}
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.random() * 0.5 }}
                />
                {slot.status === 'occupied' && (
                  <motion.rect
                    x={slot.x + 4}
                    y={slot.y + 8}
                    width={20}
                    height={24}
                    rx={3}
                    fill={slotColors[slot.status]}
                    opacity={0.7}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {slot.status === 'ev' && (
                  <text x={slot.x + 8} y={slot.y + 24} fontSize={12} fill={slotColors['ev']} fontWeight="bold">⚡</text>
                )}
                {slot.status === 'vip' && (
                  <text x={slot.x + 7} y={slot.y + 24} fontSize={10} fill={slotColors['vip']} fontWeight="bold">VIP</text>
                )}
              </g>
            ))}

            {/* Moving vehicles on road */}
            {vehicles.map((v) => (
              <motion.g key={v.id}>
                <motion.rect
                  x={v.x}
                  y={v.y}
                  width={22}
                  height={14}
                  rx={3}
                  fill={v.color}
                  animate={{ x: [v.x, v.x + 120, v.x + 120, v.x] }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
                />
              </motion.g>
            ))}

            {/* Entry/Exit gates */}
            <rect x="20" y="85" width="8" height="30" rx="2" fill="#F59E0B" />
            <rect x="312" y="85" width="8" height="30" rx="2" fill="#DC2626" />
            <text x="10" y="125" fontSize="6" fill="#F59E0B" fontWeight="bold">IN</text>
            <text x="308" y="125" fontSize="6" fill="#DC2626" fontWeight="bold">OUT</text>

            {/* AI recommendation badge */}
            <motion.g
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <rect x="60" y="155" width="80" height="20" rx="8" fill="var(--brand)" />
              <text x="100" y="169" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">AI Recommended ✓</text>
            </motion.g>

            {/* Camera icons */}
            {[80, 200].map(cx => (
              <g key={cx}>
                <circle cx={cx} cy={12} r={5} fill="var(--border)" />
                <circle cx={cx} cy={12} r={2} fill="#64748B" />
                <motion.circle
                  cx={cx} cy={12} r={8}
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth={1}
                  opacity={0.5}
                  animate={{ r: [5, 10], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Available', value: '47', color: '#16A34A' },
            { label: 'Occupied', value: '62', color: '#DC2626' },
            { label: 'Reserved', value: '8', color: '#F59E0B' },
            { label: 'EV Slots', value: '3', color: '#2563EB' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-2 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
              <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating AI badge */}
      <motion.div
        className="absolute -top-4 -right-4 card px-3 py-2 shadow-hover"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
            <span className="text-[10px]">🧠</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--text-primary)] dark:text-white">AI Confidence</div>
            <div className="text-xs font-bold text-[var(--brand)]">96.2%</div>
          </div>
        </div>
      </motion.div>

      {/* Floating revenue card */}
      <motion.div
        className="absolute -bottom-4 -left-4 card px-3 py-2 shadow-hover"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <span className="text-[10px]">💰</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--text-primary)] dark:text-white">Today's Revenue</div>
            <div className="text-xs font-bold text-green-600">₹48,720</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
