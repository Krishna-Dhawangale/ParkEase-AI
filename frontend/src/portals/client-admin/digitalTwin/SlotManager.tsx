import { slotStatusConfig, type SlotStatus, type ParkingFloor } from './data';

interface SlotManagerProps {
  floor: ParkingFloor;
}

const SlotManager = ({ floor }: SlotManagerProps) => {
  const statusCounts: Record<SlotStatus, number> = {
    available: 0,
    occupied: 0,
    reserved: 0,
    ev: 0,
    vip: 0,
    emergency: 0,
    maintenance: 0,
  };

  floor.slots.forEach(slot => { statusCounts[slot.status]++; });

  const sensorOnline = floor.slots.filter(s => s.sensor === 'online').length;
  const sensorOffline = floor.slots.filter(s => s.sensor === 'offline').length;

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Slot Legend
        </h4>
        <div className="space-y-1.5">
          {(Object.entries(slotStatusConfig) as [SlotStatus, (typeof slotStatusConfig)[SlotStatus]][]).map(([status, conf]) => (
            <div
              key={status}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: conf.color }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{conf.label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {statusCounts[status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Health */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Sensor Health
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{sensorOnline}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 dark:bg-rose-500/10">
            <span className="flex items-center gap-2 text-xs font-medium text-rose-700 dark:text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Offline
            </span>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">{sensorOffline}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Floor Stats
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{floor.totalSlots}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Occupancy</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {Math.round((floor.occupiedSlots / floor.totalSlots) * 100)}%
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Rows</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{floor.rows}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Columns</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{floor.cols}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManager;
