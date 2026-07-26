import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { revenueData } from './data';

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
    <div className="rounded-xl border border-bdr bg-white p-3 shadow-lg dark:border-bdr dark:bg-bg-elevated">
      <p className="mb-2 text-xs font-semibold text-txt-muted dark:text-txt-secondary">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-txt-muted dark:text-txt-secondary">{entry.name}:</span>
          <span className="font-semibold text-txt-primary dark:text-txt-primary">
            ₹{(entry.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Revenue Chart ──────────────────────────────────────────────────────────────

const RevenueChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-bdr bg-white p-6 shadow-soft dark:border-bdr dark:bg-bg-card"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-txt-primary dark:text-txt-primary">Revenue Overview</h3>
          <p className="mt-0.5 text-xs text-txt-muted dark:text-txt-secondary">Monthly revenue breakdown</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[11px] text-txt-muted dark:text-txt-secondary">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-txt-muted dark:text-txt-secondary">Profit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-[11px] text-txt-muted dark:text-txt-secondary">Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-txt-primary dark:text-txt-primary" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `₹${value / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ display: 'none' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#FB7185"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: '#FB7185', strokeWidth: 2, stroke: '#fff' }}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
