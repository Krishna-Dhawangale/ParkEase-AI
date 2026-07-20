import { motion } from 'framer-motion';
import {
  X,
  Car,
  Wifi,
  WifiOff,
  Clock,
  Tag,
  MapPin,
  Edit3,
} from 'lucide-react';
import { slotStatusConfig, type ParkingSlot, type SlotStatus } from './data';
import { cn } from '../../../lib/utils';

interface InspectorProps {
  slot: ParkingSlot | null;
  onClose: () => void;
  onUpdateStatus: (slotId: string, status: SlotStatus) => void;
}

const Inspector = ({ slot, onClose, onUpdateStatus }: InspectorProps) => {
  if (!slot) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Select a slot to inspect
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Click any slot on the grid to view details
        </p>
      </div>
    );
  }

  const config = slotStatusConfig[slot.status];

  return (
    <motion.div
      key={slot.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: config.color }}
          >
            {slot.label}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Slot {slot.label}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{slot.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-5 flex-1 overflow-y-auto">
        {/* Status */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Tag className="h-3 w-3" /> Status
          </label>
          <div
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border, border: '1px solid' }}
          >
            {config.label}
          </div>
        </div>

        {/* Vehicle Info */}
        {slot.vehiclePlate && (
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Car className="h-3 w-3" /> Vehicle
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {slot.vehiclePlate}
            </div>
          </div>
        )}

        {/* Sensor */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {slot.sensor === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />} Sensor
          </label>
          <div className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
            slot.sensor === 'online'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
          )}>
            <span className={cn('h-2 w-2 rounded-full', slot.sensor === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500')} />
            {slot.sensor === 'online' ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <MapPin className="h-3 w-3" /> Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Row</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{String.fromCharCode(65 + slot.row)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Column</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{slot.col + 1}</p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Clock className="h-3 w-3" /> Last Updated
          </label>
          <p className="text-sm text-slate-600 dark:text-slate-300">{slot.lastUpdated}</p>
        </div>

        {/* Change Status */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Edit3 className="h-3 w-3" /> Change Status
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.entries(slotStatusConfig) as [SlotStatus, typeof config][]).map(([status, conf]) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(slot.id, status)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                  slot.status === status
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: conf.color }} />
                {conf.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Inspector;
