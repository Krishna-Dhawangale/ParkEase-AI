import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Car } from 'lucide-react';
import { useDigitalTwinStore } from '../../../components/DigitalTwin/store';
import { useAuthStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  facilityId: string;
}

export function BookingModal({ facilityId }: BookingModalProps) {
  const selectedSlotId = useDigitalTwinStore((state) => state.selectedSlotId);
  const setSelectedSlot = useDigitalTwinStore((state) => state.setSelectedSlot);
  const liveData = useDigitalTwinStore((state) => state.liveData);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [vehicleNo, setVehicleNo] = useState(user?.vehicles?.[0]?.plateNumber || '');

  if (!selectedSlotId) return null;

  const slotLiveState = liveData[selectedSlotId];
  const isOccupied = slotLiveState?.status === 'Occupied';

  const handleBook = () => {
    // Generate a unique OTP and Booking ID
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const bookingId = `BK-${Date.now().toString().slice(-6)}`;

    // Create a booking record (in real app, this goes to backend)
    const bookingData = {
      bookingId,
      facilityId,
      slotId: selectedSlotId,
      userName: user?.firstName + ' ' + user?.lastName,
      vehicleNo,
      date,
      startTime,
      endTime,
      otp,
      status: 'CONFIRMED'
    };

    // Save to local storage for demo purposes
    const existingBookings = JSON.parse(localStorage.getItem('parkease_customer_bookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('parkease_customer_bookings', JSON.stringify(existingBookings));

    setSelectedSlot(null);
    navigate('/customer/bookings');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Book Slot {selectedSlotId.split('-').pop()}</h2>
          <button 
            onClick={() => setSelectedSlot(null)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isOccupied && (
             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
               This slot is currently occupied. You can book it for a future time.
             </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Start Time
                </label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> End Time
                </label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                <Car className="w-4 h-4" /> Vehicle Number
              </label>
              <input 
                type="text" 
                placeholder="e.g. MH-12-AB-1234"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Total Amount</span>
            <span className="text-2xl font-bold text-white">₹150</span>
          </div>
          
          <button 
            onClick={handleBook}
            disabled={!vehicleNo || !date || !startTime || !endTime}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Pay & Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
