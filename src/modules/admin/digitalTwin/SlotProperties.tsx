import { slotStatusConfig, type ParkingSlot } from './data';
import { Car, Wifi, WifiOff, MapPin } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SlotPropertiesProps {
  slot: ParkingSlot;
}

const SlotProperties = ({ slot }: SlotPropertiesProps) => {
  const config = slotStatusConfig[slot.status];

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded" style={{ backgroundColor: config.color }} />
        <span className="text-sm font-semibold" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>

      {/* Properties Grid */}
      <div className="space-y-2">
        {/* Slot ID */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Slot ID</span>
          <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-200">{slot.id}</span>
        </div>

        {/* Position */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <MapPin className="h-3 w-3" /> Position
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Row {String.fromCharCode(65 + slot.row)}, Col {slot.col + 1}
          </span>
        </div>

        {/* Vehicle */}
        {slot.vehiclePlate && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Car className="h-3 w-3" /> Vehicle
            </span>
            <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-200">
              {slot.vehiclePlate}
            </span>
          </div>
        )}

        {/* Sensor */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            {slot.sensor === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />} Sensor
          </span>
          <span className={cn(
            'text-xs font-medium',
            slot.sensor === 'online' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          )}>
            {slot.sensor === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Updated */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Updated</span>
          <span className="text-xs text-slate-600 dark:text-slate-300">{slot.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default SlotProperties;
