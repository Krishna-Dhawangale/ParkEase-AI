import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, AlertTriangle, Clock, Car, ShieldAlert, CheckCircle2, ArrowRightLeft
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ConflictManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock conflicts
const mockConflicts = [
  { id: 'C-1', type: 'OVERSTAY', bookingId: 'BK-10833', slot: 'B-19', customer: 'Meera Joshi', overstayDuration: '1h 30m', penalty: '₹200' },
  { id: 'C-2', type: 'DOUBLE_BOOKING', bookingId: 'BK-10850', slot: 'A-12', customer: 'Vikas T', details: 'Slot already occupied by BK-10842' },
];

const ConflictManager: React.FC<ConflictManagerProps> = ({ isOpen, onClose }) => {
  const [conflicts, setConflicts] = useState(mockConflicts);
  const [resolving, setResolving] = useState<string | null>(null);

  const handleResolve = (id: string, action: string) => {
    setResolving(id);
    setTimeout(() => {
      setConflicts(conflicts.filter(c => c.id !== id));
      setResolving(null);
    }, 800);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:border-slate-800 dark:bg-slate-950 flex flex-col max-h-[85vh]">
          
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center dark:bg-rose-900/30 dark:text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Conflict Manager</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">Resolve overstays, unauthorized parking, and double bookings</p>
              </div>
            </div>
            <Dialog.Close className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto flex-1 pr-2 min-h-[300px]">
            {conflicts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">All Clear!</h3>
                  <p className="text-sm text-[var(--text-secondary)]">There are no active parking conflicts.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="card p-5 border-l-4 border-l-rose-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-danger px-2 py-0.5">
                          {conflict.type.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)]">{conflict.slot}</span>
                        <span className="text-sm text-[var(--text-secondary)]">• {conflict.bookingId} ({conflict.customer})</span>
                      </div>
                      
                      {conflict.type === 'OVERSTAY' && (
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-rose-500" /> 
                          Overstayed by <span className="font-bold text-[var(--text-primary)]">{conflict.overstayDuration}</span>. 
                          Penalty accrued: <span className="font-bold text-rose-600">{conflict.penalty}</span>
                        </p>
                      )}

                      {conflict.type === 'DOUBLE_BOOKING' && (
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> 
                          {conflict.details}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {conflict.type === 'OVERSTAY' && (
                        <>
                          <button 
                            disabled={resolving === conflict.id}
                            onClick={() => handleResolve(conflict.id, 'charge')}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Charge Penalty & Extend
                          </button>
                          <button 
                            disabled={resolving === conflict.id}
                            onClick={() => handleResolve(conflict.id, 'tow')}
                            className="btn-secondary text-xs py-1.5 px-3 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Mark for Towing
                          </button>
                        </>
                      )}

                      {conflict.type === 'DOUBLE_BOOKING' && (
                        <>
                          <button 
                            disabled={resolving === conflict.id}
                            onClick={() => handleResolve(conflict.id, 'reassign')}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" /> Reassign Slot
                          </button>
                          <button 
                            disabled={resolving === conflict.id}
                            onClick={() => handleResolve(conflict.id, 'cancel')}
                            className="btn-secondary text-xs py-1.5 px-3 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConflictManager;
