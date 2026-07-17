import { slotStatusConfig, type ParkingSlot, type SlotStatus } from './data';

interface SlotEditorProps {
  slot: ParkingSlot;
  onUpdateStatus: (slotId: string, status: SlotStatus) => void;
}

const SlotEditor = ({ slot, onUpdateStatus }: SlotEditorProps) => {
  const config = slotStatusConfig[slot.status];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Quick Edit — {slot.label}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(slotStatusConfig) as [SlotStatus, (typeof slotStatusConfig)[SlotStatus]][]).map(([status, conf]) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(slot.id, status)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all ${
                slot.status === status
                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: conf.color }} />
              {conf.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotEditor;
