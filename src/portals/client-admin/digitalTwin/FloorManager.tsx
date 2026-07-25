import { motion } from 'framer-motion';
import { Building2, Plus, ChevronRight, Layers } from 'lucide-react';
import type { ParkingFloor } from './data';
import { cn } from '../../../lib/utils';

interface FloorManagerProps {
  floors: ParkingFloor[];
  activeFloorId: string;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: () => void;
}

const FloorManager = ({ floors, activeFloorId, onSelectFloor, onAddFloor }: FloorManagerProps) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Floors
          </span>
        </div>
        <button
          onClick={onAddFloor}
          title="Add Floor"
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Floor List */}
      <div className="space-y-1">
        {floors.map((floor) => {
          const isActive = floor.id === activeFloorId;
          const occupancyPct = Math.round((floor.occupiedSlots / floor.totalSlots) * 100);

          return (
            <motion.button
              key={floor.id}
              onClick={() => onSelectFloor(floor.id)}
              whileHover={{ x: 2 }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                isActive
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              )}>
                {floor.level}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'truncate text-sm font-medium',
                  isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'
                )}>
                  {floor.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {floor.occupiedSlots}/{floor.totalSlots} occupied
                  </span>
                  <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        occupancyPct >= 90 ? 'bg-rose-500' : occupancyPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <ChevronRight className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                isActive ? 'text-blue-400' : 'text-slate-300 dark:text-slate-600',
                isActive && 'rotate-90'
              )} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorManager;
