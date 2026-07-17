import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { occupancyData } from './data';

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  const total = occupancyData.reduce((acc, d) => acc + d.value, 0);
  const pct = ((entry.value / total) * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.name}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {entry.value} slots · {pct}%
      </p>
    </div>
  );
};

// ─── Occupancy Chart ────────────────────────────────────────────────────────────

const OccupancyChart = () => {
  const total = occupancyData.reduce((acc, d) => acc + d.value, 0);
  const occupied = occupancyData.find((d) => d.name === 'Occupied')?.value ?? 0;
  const occupancyPct = ((occupied / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Occupancy Rate</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Current slot distribution</p>
      </div>

      {/* Chart */}
      <div className="relative h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={occupancyData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={400}
              animationDuration={800}
            >
              {occupancyData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {occupancyPct}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Occupied
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {occupancyData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
            <span className="ml-auto text-xs font-semibold text-slate-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OccupancyChart;
