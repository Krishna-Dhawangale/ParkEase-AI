import { slotStatusConfig, type ParkingFloor, type SlotStatus } from './data';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ThreeSceneProps {
  floor: ParkingFloor;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="font-medium text-slate-900 dark:text-white">{entry.name}</span>
        <span className="text-slate-400">·</span>
        <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
      </div>
    </div>
  );
};

const ThreeScene = ({ floor }: ThreeSceneProps) => {
  const statusCounts: Record<SlotStatus, number> = {
    available: 0, occupied: 0, reserved: 0, ev: 0, vip: 0, emergency: 0, maintenance: 0,
  };
  floor.slots.forEach(s => { statusCounts[s.status]++; });

  const chartData = (Object.entries(statusCounts) as [SlotStatus, number][])
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: slotStatusConfig[status].label,
      value: count,
      color: slotStatusConfig[status].color,
    }));

  const occupancyPct = Math.round((floor.occupiedSlots / floor.totalSlots) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Floor Overview
        </h4>
        <div className="relative h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                animationBegin={200}
                animationDuration={600}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{occupancyPct}%</span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Occupied</span>
          </div>
        </div>
      </div>

      {/* Mini Legend */}
      <div className="space-y-1">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeScene;
