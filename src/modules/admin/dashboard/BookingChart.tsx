import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { bookingData } from './data';

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Booking Chart ──────────────────────────────────────────────────────────────

const BookingChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Bookings</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Bookings, cancellations & walk-ins</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Bookings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Walk-ins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bookingData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookings"
              name="Bookings"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="walkins"
              name="Walk-ins"
              fill="#FBBF24"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="cancellations"
              name="Cancelled"
              fill="#FB7185"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BookingChart;
