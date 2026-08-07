import React, { useMemo } from 'react';
import { useDigitalTwinStore } from './store';
import { X, Navigation, Calendar, User, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RightPanel: React.FC = () => {
  const selectedSlotId = useDigitalTwinStore((state) => state.selectedSlotId);
  const setSelectedSlot = useDigitalTwinStore((state) => state.setSelectedSlot);
  const layout = useDigitalTwinStore((state) => state.layout);
  const liveData = useDigitalTwinStore((state) => state.liveData);

  const slot = useMemo(() => layout?.parkingSlots.find(s => s.id === selectedSlotId), [layout, selectedSlotId]);
  const live = selectedSlotId ? liveData[selectedSlotId] : null;

  return (
    <AnimatePresence>
      {selectedSlotId && slot && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-[380px] bg-[#070B17]/95 backdrop-blur-2xl border-l border-white/10 z-50 p-6 flex flex-col shadow-2xl text-slate-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">{slot.id}</h2>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                {slot.type === 'EV' ? 'EV Charging Hub' : slot.type === 'Accessible' ? 'Accessible Parking' : 'Premium Standard'}
              </p>
            </div>
            <button
              onClick={() => setSelectedSlot(null)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${
                live?.status === 'Occupied' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' : 
                live?.status === 'Reserved' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                slot.type === 'EV' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' : 
                'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                live?.status === 'Occupied' ? 'bg-[#EF4444]' : 
                live?.status === 'Reserved' ? 'bg-[#F59E0B]' :
                slot.type === 'EV' ? 'bg-[#3B82F6]' : 'bg-[#22C55E]'
              }`} />
              {(live?.status || 'Available').toUpperCase()}
            </div>
          </div>

          {/* Info Details */}
          {(live?.status === 'Occupied' || live?.status === 'Reserved') ? (
            <div className="flex-1 space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-1">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-400">License Plate</span>
                </div>
                <div className="text-xl font-mono text-white tracking-widest bg-black/30 p-2 rounded-md inline-block border border-white/10">
                  {live.vehicleNumber || 'MH31 XX 1234'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Owner</span>
                  </div>
                  <div className="text-sm font-medium text-white">{live.owner || 'Corporate Guest'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Type</span>
                  </div>
                  <div className="text-sm font-medium text-white">Sedan</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Entry</span>
                  </div>
                  <div className="text-sm font-medium text-white">10:15 AM</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Duration</span>
                  </div>
                  <div className="text-sm font-medium text-white">2h 45m</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center opacity-50">
               <div className="w-20 h-20 rounded-full border border-dashed border-slate-500 flex items-center justify-center mb-4">
                 <div className="w-10 h-10 rounded-full bg-slate-800" />
               </div>
               <p className="text-sm font-medium text-slate-400">Slot is currently empty.</p>
               <p className="text-xl font-bold text-white mt-2">$4.00 / hr</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-xl text-sm font-extrabold tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <Navigation className="w-4 h-4" /> NAVIGATE TO SLOT
            </button>
            {(!live || live.status === 'Available') && (
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all border border-white/10">
                RESERVE NOW
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
