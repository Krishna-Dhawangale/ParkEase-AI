import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { peakHourData } from './data';

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
          <span className="font-semibold text-slate-900 dark:text-white">
            {entry.name === 'Occupancy' ? `${entry.value}%` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Peak Hour Chart ────────────────────────────────────────────────────────────

const PeakHourChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Peak Hour Analysis</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Hourly occupancy & traffic</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Occupancy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Entries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Exits</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={peakHourData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="entriesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="occupancy"
              name="Occupancy"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#occupancyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="entries"
              name="Entries"
              stroke="#34D399"
              strokeWidth={1.5}
              fill="url(#entriesGrad)"
              dot={false}
              activeDot={{ r: 3, fill: '#34D399', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="exits"
              name="Exits"
              stroke="#FBBF24"
              strokeWidth={1.5}
              fill="transparent"
              dot={false}
              activeDot={{ r: 3, fill: '#FBBF24', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PeakHourChart;
