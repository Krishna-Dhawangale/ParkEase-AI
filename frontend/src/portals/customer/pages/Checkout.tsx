import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Car, Plus, Shield, 
  Video, Key, Lightbulb, Check, Navigation, Ticket, ChevronDown, Star,
  Loader2, AlertCircle, MapPin, Clock, Timer, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { QRCodeSVG } from 'qrcode.react';
import { BookingService } from '../../../services/booking.service';
import { SlotService, type SlotAvailabilityParams } from '../../../services/slot.service';
import { useCountdown } from '../../../hooks/useCountdown';
import type { Booking, SlotWithAvailability } from '../../../types/models';
import type { Vehicle } from './VehiclesPage';

// --- Payment Timer Component ---
function PaymentTimer({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
  const { formatted, isExpired, totalSeconds } = useCountdown(expiresAt, onExpire);
  if (isExpired) return <span className="text-red-600 font-bold text-sm">Expired</span>;
  return (
    <span className={`font-mono font-bold text-sm ${totalSeconds < 60 ? 'text-red-600 animate-pulse' : 'text-amber-600'}`}>
      <Timer className="w-3.5 h-3.5 inline mr-1" />
      {formatted}
    </span>
  );
}

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};

  const facilityId = navState.facilityId || 'f-demo';
  const facilityName = navState.facilityName || 'Empress Mall Parking';
  const basePricePerHour = navState.basePricePerHour || 30;
  const preSelectedSlotId = navState.selectedSlotId || null;

  const [step, setStep] = useState(1);
  
  // Date State
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 4);
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [durationHours, setDurationHours] = useState(2);

  // Slots state
  const [slots, setSlots] = useState<SlotWithAvailability[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(preSelectedSlotId);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Booking state
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // --- Vehicles State ---
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('parkease-vehicles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    if (vehicles.length > 0) {
      const primary = vehicles.find(v => v.isPrimary);
      return primary ? primary.id : vehicles[0].id;
    }
    return '';
  });

  // Modal State for adding vehicle inside Checkout
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newBodyType, setNewBodyType] = useState<'Hatchback' | 'Sedan' | 'SUV' | 'EV' | 'Bike'>('Hatchback');
  const [newFuelType, setNewFuelType] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG'>('Petrol');
  const [newColor, setNewColor] = useState('White');

  // Keep selected vehicle in sync
  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null;
  }, [vehicles, selectedVehicleId]);

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newModel) return;

    const created: Vehicle = {
      id: `v-${Date.now()}`,
      plate: newPlate.toUpperCase(),
      model: newModel,
      bodyType: newBodyType,
      fuelType: newFuelType,
      color: newColor,
      isPrimary: vehicles.length === 0,
      image: newFuelType === 'Electric' 
        ? 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=300&h=200' 
        : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=300&h=200'
    };

    const updated = [...vehicles, created];
    setVehicles(updated);
    localStorage.setItem('parkease-vehicles', JSON.stringify(updated));
    setSelectedVehicleId(created.id);
    setIsAddVehicleModalOpen(false);
    setNewPlate('');
    setNewModel('');
  };

  // Compute start/end time
  const computeTimes = useCallback(() => {
    const [timePart, ampm] = selectedTime.split(' ');
    const [hourStr, minStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    const start = new Date(selectedDate);
    start.setHours(hour, parseInt(minStr), 0, 0);
    
    const end = new Date(start);
    end.setHours(start.getHours() + durationHours);
    
    return { start, end };
  }, [selectedDate, selectedTime, durationHours]);

  const { start: startTime, end: endTime } = computeTimes();
  const exitTimeStr = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Fetch available slots when facility/date/time changes
  useEffect(() => {
    if (!facilityId) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const { start, end } = computeTimes();
        const params: SlotAvailabilityParams = {
          facility_id: facilityId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        };
        const result = await SlotService.getAvailableSlots(params);
        setSlots(result);
        // Auto-select pre-selected slot or first available
        if (preSelectedSlotId) {
          const found = result.find(s => s.id === preSelectedSlotId && s.isBookable);
          if (found) setSelectedSlotId(found.id);
        }
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [facilityId, selectedDate, selectedTime, durationHours]);

  // Selected slot info
  const selectedSlot = slots.find(s => s.id === selectedSlotId);
  const slotRate = selectedSlot?.pricePerHour ?? basePricePerHour;
  const parkingCharges = Math.ceil(slotRate * durationHours * 100) / 100;
  const convenienceFee = 5.00;
  const totalAmount = parkingCharges + convenienceFee;

  // --- Step 2: Create Booking (PENDING_PAYMENT) ---
  const handleProceedToPayment = async () => {
    if (!selectedSlotId || !facilityId) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const { start, end } = computeTimes();
      const booking = await BookingService.createBooking({
        facility_id: facilityId,
        floor_id: selectedSlot?.floorId || '',
        slot_id: selectedSlotId,
        vehicle_id: selectedVehicle?.id || 'demo-vehicle-id',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
      setCreatedBooking(booking);
      setStep(2);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // --- Step 2 → 3: Confirm Payment ---
  const handleConfirmPayment = async () => {
    if (!createdBooking) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const confirmed = await BookingService.confirmBooking(createdBooking.id);
      setConfirmedBooking(confirmed);
      setStep(3);
    } catch (err: any) {
      setBookingError(err.message || 'Payment confirmation failed');
    } finally {
      setBookingLoading(false);
    }
  };

  // Payment TTL expired
  const handlePaymentExpired = () => {
    setBookingError('Payment window expired. Please create a new booking.');
    setCreatedBooking(null);
    setStep(1);
  };

  const finalBooking = confirmedBooking || createdBooking;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer')}>Home</span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer/bookings')}>My Bookings</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Book Parking</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-4xl mx-auto border-b border-gray-100 pb-8 pt-4">
        {[
          { num: 1, label: 'Select Slot & Time' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Confirmation' },
          { num: 4, label: 'Navigation' },
        ].map((s, i, arr) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-3 ${step >= s.num ? '' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? 'bg-black text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`font-bold ${step >= s.num ? 'text-gray-900' : 'text-gray-600'}`}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-6"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Error Banner */}
      {bookingError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium flex-1">{bookingError}</p>
          <button onClick={() => setBookingError(null)} className="text-red-400 hover:text-red-600">
            <span className="text-xs font-bold">Dismiss</span>
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Step 1 — Select Slot & Time */}
        {step === 1 && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Select Date & Time</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-4">Date</p>
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-bold text-gray-900">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500 font-medium">
                    <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                    {daysInMonth.map((dayObj, i) => {
                      const d = dayObj.date;
                      d.setHours(0, 0, 0, 0);
                      const isPast = d.getTime() < today.getTime();
                      const isTooFar = d.getTime() > maxDate.getTime();
                      const isDisabled = isPast || isTooFar;
                      const isSelected = selectedDate.getTime() === d.getTime();
                      
                      let className = "py-2 cursor-pointer rounded-full transition-colors ";
                      if (isSelected) {
                        className += "bg-black text-white font-bold";
                      } else if (isDisabled) {
                        className += "text-gray-300 cursor-not-allowed";
                      } else if (!dayObj.isCurrentMonth) {
                        className += "text-gray-400 hover:bg-gray-100";
                      } else {
                        className += "text-gray-900 hover:bg-gray-100";
                      }
                      
                      return (
                        <div key={i} className={className} onClick={() => !isDisabled && setSelectedDate(d)}>
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex-[1.2]">
                <p className="text-sm font-medium text-gray-500 mb-4">Entry Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'].map(time => (
                    <div 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`border rounded-lg py-2 text-center text-xs font-medium cursor-pointer transition-colors ${selectedTime === time ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'}`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="mt-8">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <select 
                  value={durationHours} 
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-1 font-bold text-gray-900 text-sm bg-white cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(h => (
                    <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="text-right text-xs text-gray-500 font-medium mt-1">
                Exit by <span className="text-gray-900 font-bold">{exitTimeStr}</span>
              </div>
            </div>
          </Card>

          {/* Available Slots Grid */}
          {facilityId && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Available Slots</h2>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Checking availability...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No slots found for this facility and time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isMaintenance = slot.status === 'MAINTENANCE';
                    const isUnavailable = !slot.isBookable || isMaintenance;
                    
                    return (
                      <div
                        key={slot.id}
                        onClick={() => !isUnavailable && setSelectedSlotId(slot.id)}
                        className={`relative rounded-lg p-2 text-center text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md scale-105'
                            : isMaintenance
                              ? 'bg-amber-50 text-amber-400 border-amber-200 cursor-not-allowed'
                              : isUnavailable
                                ? 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:shadow-sm'
                        }`}
                        title={
                          isMaintenance ? 'Under maintenance' :
                          isUnavailable ? 'Already booked' :
                          `${slot.name} — ₹${slot.pricePerHour || basePricePerHour}/hr`
                        }
                      >
                        {slot.name}
                        {slot.type === 'EV' && <span className="block text-[8px] mt-0.5">⚡ EV</span>}
                        {slot.type === 'ACCESSIBLE' && <span className="block text-[8px] mt-0.5">♿</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-[10px] font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></div> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-50 border border-red-100"></div> Booked
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-50 border border-amber-200"></div> Maintenance
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-black"></div> Selected
                </div>
              </div>
            </Card>
          )}

          {/* Vehicle Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Select Vehicle <span className="text-gray-400 font-normal text-sm ml-1">(Optional)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => {
                const isSelected = selectedVehicleId ? selectedVehicleId === v.id : v.id === selectedVehicle?.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? 'border-black bg-gray-50/50' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <Car className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{v.plate}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{v.model} • {v.color}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-black' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                    </div>
                  </div>
                );
              })}

              <div 
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-600 font-medium text-sm min-h-[72px]"
              >
                <Plus className="w-4 h-4" /> Add New Vehicle
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-gray-50/50">
            <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-5 flex items-center gap-4 w-full md:w-auto flex-1">
                <Shield className="w-8 h-8 text-gray-900 shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">Your Safety, Our Priority</h3>
                  <p className="text-[11px] text-gray-500 leading-snug">All our parking facilities are verified and monitored 24x7 for your safety.</p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-around flex-[1.5] w-full bg-white">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Video className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div><p className="font-bold text-[11px] text-gray-900">24x7 CCTV</p><p className="text-[9px] text-gray-500">Surveillance</p></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Key className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div><p className="font-bold text-[11px] text-gray-900">Secure Entry</p><p className="text-[9px] text-gray-500">Digital Access</p></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Lightbulb className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div><p className="font-bold text-[11px] text-gray-900">Well Lit</p><p className="text-[9px] text-gray-500">Parking Areas</p></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && createdBooking && (
        <div className="flex-[1.5] space-y-6">
          {/* Payment TTL warning */}
          {createdBooking.paymentExpiresAt && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Complete payment before timer expires</span>
              </div>
              <PaymentTimer expiresAt={createdBooking.paymentExpiresAt} onExpire={handlePaymentExpired} />
            </div>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">UPI</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Google Pay', color: '', icon: '₹' },
                    { name: 'PhonePe', color: 'bg-[#5f259f]', icon: 'P' },
                    { name: 'Paytm', color: 'bg-[#002e6e]', icon: 'P' },
                    { name: 'BHIM', color: '', icon: 'B' },
                  ].map(pm => (
                    <div key={pm.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                      <div className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors ${pm.color} ${pm.color ? 'text-white' : 'text-gray-700'} font-bold text-sm`}>
                        {pm.icon}
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 text-center">{pm.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">Cards</p>
                <div className="grid grid-cols-4 gap-4">
                  {['VISA', 'Mastercard', 'RuPay', 'More'].map(name => (
                    <div key={name} className="flex flex-col items-center gap-2 cursor-pointer group">
                      <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors font-bold text-xs text-gray-700">
                        {name}
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 text-center">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 text-center">
                <p className="text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Secure Payments</p>
              </div>
            </div>
          </Card>
        </div>
        )}
        
        {/* Step 3 — Confirmation */}
        {step === 3 && confirmedBooking && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-4 max-w-md">
              Your parking slot <strong>{confirmedBooking.slotName}</strong> at <strong>{confirmedBooking.facilityName}</strong> has been booked.
            </p>

            {/* QR Code */}
            {confirmedBooking.qrCodeToken && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6 inline-block">
                <QRCodeSVG value={confirmedBooking.qrCodeToken} size={120} level="H" />
                <p className="text-[10px] font-mono font-bold text-gray-500 mt-2">{confirmedBooking.id}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button variant="primary" className="h-12 px-8 text-base shadow-sm" onClick={() => setStep(4)}>
                Start Navigation <Navigation className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="h-12 px-6" onClick={() => navigate('/customer/bookings')}>
                View My Bookings
              </Button>
            </div>
          </Card>
        </div>
        )}
        
        {/* Step 4 — Navigation */}
        {step === 4 && confirmedBooking && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-0 overflow-hidden h-[500px] relative">
             <div className="absolute inset-0 bg-gray-900 flex items-center justify-center flex-col">
               <Navigation className="w-16 h-16 text-brand-500 mb-4 animate-bounce" />
               <h3 className="text-xl font-bold text-white mb-2">Navigating to Slot {confirmedBooking.slotName}</h3>
               <p className="text-gray-400 text-sm">{confirmedBooking.floorName && `${confirmedBooking.floorName} • `}Follow the highlighted path</p>
               <Button variant="primary" className="mt-8" onClick={() => navigate('/customer/bookings')}>View Ticket</Button>
             </div>
          </Card>
        </div>
        )}

        {/* Right Column — Booking Summary (Steps 1 & 2) */}
        {step < 3 && (
        <div className="flex-1 space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h2>
            
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight">{facilityName}</h3>
                {selectedSlot && (
                  <p className="text-[11px] text-gray-500 mb-2">
                    {selectedSlot.floorName && `${selectedSlot.floorName} • `}Slot {selectedSlot.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-900 font-bold">
                  {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Entry Time</span>
                <span className="text-gray-900 font-bold">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Duration</span>
                <span className="text-gray-900 font-bold">{durationHours} Hour{durationHours > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Exit Time</span>
                <span className="text-gray-900 font-bold">{exitTimeStr}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Slot</span>
                <span className="text-gray-900 font-bold">{selectedSlot?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Vehicle</span>
                <span className="text-gray-900 font-bold">{selectedVehicle ? selectedVehicle.plate : 'Not selected'}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Parking Charges</span>
                <span className="text-gray-900 font-bold">₹{parkingCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Convenience Fee</span>
                <span className="text-gray-900 font-bold">₹{convenienceFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-bold text-lg">Total Amount</span>
              <span className="text-gray-900 font-bold text-2xl">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              {step === 1 ? (
                <Button 
                  variant="primary" 
                  className="w-full h-12 text-base shadow-sm" 
                  onClick={handleProceedToPayment}
                  disabled={!selectedSlotId || bookingLoading || !facilityId}
                >
                  {bookingLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating Booking...</>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-full h-12 text-base shadow-sm" 
                  onClick={handleConfirmPayment}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing Payment...</>
                  ) : (
                    'Proceed to Pay'
                  )}
                </Button>
              )}
              <Button variant="outline" className="w-full h-12 bg-white">
                <Ticket className="w-4 h-4 mr-2 text-gray-600" /> Apply Coupon
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Free cancellation</p>
                <p className="text-[11px] text-gray-500">Up to 30 mins before entry</p>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Safe & Secure</p>
                <p className="text-[11px] text-gray-500">24x7 CCTV & Security</p>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Instant Confirmation</p>
                <p className="text-[11px] text-gray-500">Get booking in seconds</p>
              </div>
            </div>
          </Card>
        </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {isAddVehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddVehicleModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100"
            >
              <button
                onClick={() => setIsAddVehicleModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Add New Vehicle</h3>
                    <p className="text-xs text-gray-500">Register license plate and vehicle details</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 40 GD 3868"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Model & Make</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti Suzuki Desire"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Body Type</label>
                    <select
                      value={newBodyType}
                      onChange={(e) => setNewBodyType(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="EV">Electric / EV</option>
                      <option value="Bike">Two Wheeler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fuel Type</label>
                    <select
                      value={newFuelType}
                      onChange={(e) => setNewFuelType(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. White"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md mt-4"
                >
                  Save & Select Vehicle
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
