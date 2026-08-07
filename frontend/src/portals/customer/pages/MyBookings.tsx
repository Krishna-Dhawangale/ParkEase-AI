import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
<<<<<<< HEAD
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';

export function MyBookings() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);

  const [bookings, setBookings] = React.useState<any[]>([]);

  React.useEffect(() => {
    const raw = localStorage.getItem('parkease_customer_bookings');
    if (raw) {
      setBookings(JSON.parse(raw).reverse());
    }
  }, []);

=======
import { 
  Calendar, Clock, Car, ChevronRight, Download, MapPin, 
  Receipt, ShieldCheck, QrCode, Phone, AlertCircle, HelpCircle, Navigation,
  Box, X, Star, Zap, Check, Loader2, Timer, Wifi, WifiOff, Battery, Activity,
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Eye, Compass, Radio, Layers
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingService } from '../../../services/booking.service';
import { SlotService } from '../../../services/slot.service';
import { useCountdown } from '../../../hooks/useCountdown';
import { useDigitalTwinWs } from '../../../hooks/useDigitalTwinWs';
import type { Booking, MyBookingsData, DigitalTwinState } from '../../../types/models';

// --- Countdown Badge Component ---
function CountdownBadge({ endTime, onExpire }: { endTime: string; onExpire?: () => void }) {
  const { formatted, isExpired, totalSeconds } = useCountdown(endTime, onExpire);

  if (isExpired) {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        Expired
      </span>
    );
  }

  const isUrgent = totalSeconds < 600; // < 10 min
>>>>>>> d63686c104185579b973a7d90ddb2651c3425076

  return (
    <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
      isUrgent ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-700'
    }`}>
      <Timer className="w-3 h-3" />
      {formatted}
    </span>
  );
}

// --- Digital Twin Studio Modal Component ---
function DigitalTwinModal({ 
  booking, 
  onClose 
}: { 
  booking: Booking; 
  onClose: () => void;
}) {
  const { telemetry, isConnected, subscribe, unsubscribe } = useDigitalTwinWs();
  const [initialState, setInitialState] = useState<DigitalTwinState | null>(null);
  const [loadingTwin, setLoadingTwin] = useState(true);
  // Track countdown for display only — do NOT pass onClose as the expiry callback.
  // Passing onClose here caused the modal to instantly close for already-expired
  // bookings because useCountdown fires the callback on the very first tick when
  // endTime is in the past (the black-screen flash the user was seeing).
  const countdown = useCountdown(booking.endTime);

<<<<<<< HEAD
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {bookings.map((booking) => (
            <Card 
              key={booking.bookingId} 
              className={`p-5 flex flex-col sm:flex-row items-center gap-5 hover:shadow-md transition-shadow group cursor-pointer border ${selectedBooking?.bookingId === booking.bookingId ? 'border-brand-500 ring-1 ring-brand-500' : 'border-transparent hover:border-gray-200'}`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                <Car className="w-8 h-8 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg truncate">Slot {booking.slotId?.split('-').pop()} - Facility {booking.facilityId}</h3>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-none">{booking.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Car className="w-4 h-4 text-gray-400" />
                    {booking.vehicleNo}
                  </div>
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    ₹150.00
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
           {/* Placeholder for Details Side Panel */}
            <Card className="p-6 sticky top-8">
              {!selectedBooking ? (
                <>
                  <h3 className="font-bold text-gray-900 mb-6">Select a booking to view details</h3>
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                    <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-500">Booking details, QR code and<br />receipt will appear here.</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                   <h3 className="font-bold text-gray-900 mb-2">Booking Ticket</h3>
                   <p className="text-sm text-gray-500 mb-6">{selectedBooking.bookingId}</p>
                   
                   <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
                     <QRCodeSVG 
                        value={JSON.stringify({
                           b: selectedBooking.bookingId,
                           u: selectedBooking.userName,
                           v: selectedBooking.vehicleNo,
                           o: selectedBooking.otp,
                           d: selectedBooking.date,
                           t: `${selectedBooking.startTime}-${selectedBooking.endTime}`
                        })} 
                        size={200}
                     />
                   </div>

                   <div className="w-full space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-500">OTP Code</span>
                       <span className="font-bold text-xl tracking-widest text-brand-600">{selectedBooking.otp}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-500">Vehicle</span>
                       <span className="font-semibold text-gray-900">{selectedBooking.vehicleNo}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-500">Slot</span>
                       <span className="font-semibold text-gray-900">{selectedBooking.slotId?.split('-').pop()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-500">Time</span>
                       <span className="font-semibold text-gray-900">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                     </div>
                   </div>

                   <Button className="w-full mt-6" variant="outline">
                     <Download className="w-4 h-4 mr-2" />
                     Download Ticket
                   </Button>
                </div>
              )}
            </Card>
=======
  // Digital Twin Interactive Controls State
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeFloor, setActiveFloor] = useState<'Floor 1' | 'Floor 2' | 'Basement B1'>('Floor 1');
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<any | null>(null);
  const [isSimulatingArrival, setIsSimulatingArrival] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Load initial state via REST, then subscribe to WebSocket
  useEffect(() => {
    const init = async () => {
      try {
        if (booking.slotId) {
          const state = await SlotService.getSlotTwin(booking.slotId, booking.id);
          setInitialState(state);
        }
      } catch (err) {
        console.error('Failed to load Digital Twin state:', err);
      } finally {
        setLoadingTwin(false);
      }
    };
    init();

    if (booking.slotId) {
      subscribe(booking.slotId, booking.id);
    }

    return () => {
      unsubscribe();
    };
  }, [booking.slotId, booking.id]);

  const currentSensor = telemetry?.sensorStatus || initialState?.sensorStatus || 'ONLINE';
  const currentOccupancy = isSimulatingArrival ? true : (telemetry?.occupancyDetected ?? initialState?.occupancyDetected ?? false);
  const currentBattery = telemetry?.batteryLevel ?? initialState?.batteryLevel ?? 98;

  // Grid slots layout mockup
  const slotsGrid = useMemo(() => {
    return Array.from({ length: 20 }, (_, idx) => {
      const slotNum = idx + 101;
      const slotName = `A-${slotNum}`;
      const isUserSlot = slotName === booking.slotName || (booking.slotName && booking.slotName.includes(String(slotNum))) || idx === 2;
      const isEV = idx % 5 === 4;
      const isOccupied = !isUserSlot && (idx % 3 === 0 || idx % 7 === 1);
      return {
        id: `slot-${idx}`,
        name: isUserSlot ? (booking.slotName || 'A-101') : slotName,
        isUserSlot,
        isEV,
        isOccupied: isUserSlot ? currentOccupancy : isOccupied,
        status: isUserSlot ? (currentOccupancy ? 'OCCUPIED' : 'BOOKED_YOU') : (isOccupied ? 'OCCUPIED' : 'AVAILABLE'),
        price: 30,
        vehiclePlate: isUserSlot ? booking.vehiclePlate : (isOccupied ? `MH 31 ${1000 + idx}` : undefined),
      };
    });
  }, [booking.slotName, booking.vehiclePlate, currentOccupancy]);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.75, prev + delta), 1.6));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full h-full max-w-[1700px] max-h-[96vh] bg-[#0c0e12] rounded-none md:rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden text-white font-sans"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-gray-800/80 bg-gray-950/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Box className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">{booking.facilityName}</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live 3D Twin
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Assigned Spot: <strong className="text-emerald-300 font-mono font-bold">{booking.slotName || 'A-101'}</strong> ({booking.floorName || 'Floor 1'}) • Vehicle: <strong className="text-amber-300 font-mono">{booking.vehiclePlate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View 3D/2D Toggle */}
            <div className="bg-gray-900 border border-gray-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setViewMode('3D')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === '3D' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                3D View
              </button>
              <button
                onClick={() => setViewMode('2D')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === '2D' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                2D Floor Plan
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 transition-colors"
              title="Close Twin Viewport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="px-6 py-2.5 bg-gray-900/60 border-b border-gray-800/80 flex items-center justify-between overflow-x-auto text-xs font-mono shrink-0 divide-x divide-gray-800/80">
          <div className="px-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-gray-400">WS CONNECTION:</span>
            <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {isConnected ? 'ONLINE (10ms)' : 'RECONNECTING'}
            </span>
          </div>

          <div className="px-3 flex items-center gap-2">
            <Car className={`w-3.5 h-3.5 ${currentOccupancy ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-gray-400">SPOT STATUS:</span>
            <span className={currentOccupancy ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {currentOccupancy ? 'VEHICLE DETECTED' : 'SPOT RESERVED FOR YOU'}
            </span>
          </div>

          <div className="px-3 flex items-center gap-2">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-400">SENSOR BATTERY:</span>
            <span className="text-emerald-400 font-bold">{currentBattery}%</span>
          </div>

          <div className="px-3 flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">SESSION REMAINING:</span>
            <span className="text-cyan-400 font-bold">{countdown.formatted}</span>
          </div>
>>>>>>> d63686c104185579b973a7d90ddb2651c3425076
        </div>

        {/* Main Body Grid Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Main 3D Grid Canvas Viewport */}
          <div className="flex-1 relative bg-[#090b0e] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Ambient Lighting & Grid Layer */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <div 
                className="absolute inset-0 transition-transform duration-500" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px), linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                  backgroundSize: '40px 40px',
                  transform: viewMode === '3D' ? `perspective(700px) rotateX(55deg) scale(${zoomLevel})` : `scale(${zoomLevel})`
                }}
              />
            </div>

            {/* Dynamic Parking Slots Grid */}
            <div 
              className="relative z-10 transition-transform duration-300 grid grid-cols-4 sm:grid-cols-5 gap-4 md:gap-6 p-6 max-w-4xl"
              style={{ 
                transform: viewMode === '3D' 
                  ? `perspective(800px) rotateX(45deg) rotateZ(-5deg) scale(${zoomLevel})` 
                  : `scale(${zoomLevel})`
              }}
            >
              {slotsGrid.map((slot: any) => {
                const isSelected = selectedSlotDetails?.id === slot.id;
                let bgClass = "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600";
                
                if (slot.isUserSlot) {
                  bgClass = "border-2 border-emerald-400 bg-gradient-to-b from-emerald-500/30 to-teal-900/50 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-4 ring-emerald-400/20 animate-pulse";
                } else if (slot.isOccupied) {
                  bgClass = "border-gray-800 bg-red-950/40 text-red-400 border-red-900/50";
                } else if (slot.isEV) {
                  bgClass = "border-cyan-800/80 bg-cyan-950/30 text-cyan-400 hover:border-cyan-500";
                } else {
                  bgClass = "border-emerald-900/40 bg-emerald-950/20 text-emerald-400 hover:border-emerald-500";
                }

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotDetails(slot)}
                    className={`relative rounded-2xl p-4 h-28 md:h-32 flex flex-col justify-between cursor-pointer transition-all ${bgClass} ${isSelected ? 'ring-2 ring-white scale-105 z-20' : ''}`}
                  >
                    {/* Top Slot Label */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs md:text-sm tracking-wider">{slot.name}</span>
                      {slot.isEV && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                      {slot.isUserSlot && (
                        <span className="bg-emerald-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">YOUR SPOT</span>
                      )}
                    </div>

                    {/* Slot Content Visualization */}
                    <div className="flex items-center justify-center my-auto">
                      {slot.isOccupied || (slot.isUserSlot && currentOccupancy) ? (
                        <div className="flex flex-col items-center">
                          <Car className={`w-8 h-8 ${slot.isUserSlot ? 'text-emerald-300 animate-bounce' : 'text-red-400'}`} />
                          <span className="text-[9px] font-mono mt-1 text-gray-300 truncate max-w-[70px]">{slot.vehiclePlate}</span>
                        </div>
                      ) : slot.isUserSlot ? (
                        <div className="flex flex-col items-center text-center">
                          <Navigation className="w-7 h-7 text-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold text-emerald-300 mt-1 uppercase">RESERVED</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Bottom Status */}
                    <div className="text-[9px] font-mono text-right opacity-70">
                      {slot.isUserSlot ? 'LIVE TRACK' : slot.isOccupied ? 'BUSY' : 'READY'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Interactive Controls */}
            <div className="absolute right-6 bottom-6 flex flex-col gap-2.5 z-20">
              <div className="bg-gray-950/90 backdrop-blur-md rounded-2xl border border-gray-800 p-1.5 flex flex-col gap-1 shadow-xl">
                <button 
                  onClick={() => handleZoom(0.15)}
                  className="p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleZoom(-0.15)}
                  className="p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setZoomLevel(1)}
                  className="p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Floor Selector */}
            <div className="absolute top-6 left-6 z-20 bg-gray-950/90 backdrop-blur-md border border-gray-800 rounded-2xl p-1.5 flex items-center gap-1.5 text-xs">
              {(['Floor 1', 'Floor 2', 'Basement B1'] as const).map(fl => (
                <button
                  key={fl}
                  onClick={() => setActiveFloor(fl)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeFloor === fl ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-white'}`}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>

          {/* Right Control & Telemetry Panel */}
          <div className="w-full lg:w-96 bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-800 p-6 flex flex-col space-y-6 overflow-y-auto shrink-0">
            
            {/* Live Navigation & Action CTA */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-5 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" /> Wayfinding Studio
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-bold">Active</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-1">Target: Slot {booking.slotName || 'A-101'}</h4>
                <p className="text-xs text-gray-400">
                  {booking.floorName || 'Floor 1'} • Follow green path from Entrance Gate #1.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsNavigating(!isNavigating)}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isNavigating 
                      ? 'bg-amber-500 text-black shadow-amber-500/25 hover:bg-amber-400' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  {isNavigating ? 'Stop Turn-By-Turn Path' : 'Start Navigation Guidance'}
                </button>

                <button
                  onClick={() => setIsSimulatingArrival(!isSimulatingArrival)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  {isSimulatingArrival ? 'Reset Occupancy Sensor' : 'Simulate Vehicle Arrival'}
                </button>
              </div>
            </div>

            {/* Selected Slot Inspector */}
            {selectedSlotDetails ? (
              <div className="bg-gray-900/80 rounded-2xl p-5 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold text-white font-mono">SLOT INSPECTOR</span>
                  <button onClick={() => setSelectedSlotDetails(null)} className="text-gray-400 hover:text-white text-xs">Clear</button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slot ID</span>
                    <span className="font-bold text-white font-mono">{selectedSlotDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold ${selectedSlotDetails.isOccupied ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedSlotDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="font-bold text-cyan-400">{selectedSlotDetails.isEV ? 'EV Charging' : 'Standard'}</span>
                  </div>
                  {selectedSlotDetails.vehiclePlate && (
                    <div className="flex justify-between pt-1 border-t border-gray-800">
                      <span className="text-gray-400">Vehicle</span>
                      <span className="font-bold text-amber-300 font-mono">{selectedSlotDetails.vehiclePlate}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Facility IoT Telemetry Summary */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facility IoT Sensors</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">CCTV Camera #1</p>
                  <p className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Stream
                  </p>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Gate Barrier</p>
                  <p className="font-bold text-cyan-400 mt-1">Ready for Pass</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-gray-800 text-xs space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Map Legend</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400"></div>
                  <span className="text-gray-300">Your Reserved Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-950/60 border border-red-800"></div>
                  <span className="text-gray-300">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-950/60 border border-cyan-800"></div>
                  <span className="text-gray-300">EV Station</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-950/40 border border-emerald-800"></div>
                  <span className="text-gray-300">Available</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main MyBookings Page ---
export function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Active' | 'Past' | 'Cancelled'>('Active');
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState(false);
  const [twinBooking, setTwinBooking] = useState<Booking | null>(null);

  const [bookingsData, setBookingsData] = useState<MyBookingsData>({ active: [], past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const data = await BookingService.getMyBookings();
      setBookingsData(data);
      // Auto-select first booking in current tab
      const tabBookings = data[activeTab.toLowerCase() as keyof MyBookingsData];
      if (tabBookings.length > 0 && !selectedBookingId) {
        setSelectedBookingId(tabBookings[0].id);
      }
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedBookingId]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Get bookings for current tab
  const filteredBookings = bookingsData[activeTab.toLowerCase() as keyof MyBookingsData] || [];
  const selectedBooking = filteredBookings.find(b => b.id === selectedBookingId) || filteredBookings[0];

  const handleTabChange = (tab: 'Active' | 'Past' | 'Cancelled') => {
    setActiveTab(tab);
    const tabBookings = bookingsData[tab.toLowerCase() as keyof MyBookingsData];
    if (tabBookings.length > 0) {
      setSelectedBookingId(tabBookings[0].id);
    } else {
      setSelectedBookingId(null);
    }
  };

  const handleOpenTwin = (booking: Booking) => {
    setTwinBooking(booking);
    setIsDigitalTwinOpen(true);
  };

  const handleCloseTwin = () => {
    setIsDigitalTwinOpen(false);
    setTwinBooking(null);
  };

  const handleCountdownExpire = () => {
    // Re-fetch bookings when a countdown expires (booking moves from Active → Past)
    fetchBookings();
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
      await BookingService.cancelBooking(booking.id, 'User cancelled');
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleDownloadReceipt = (booking: Booking) => {
    const startDate = new Date(booking.startTime).toLocaleString();
    const endDate = new Date(booking.endTime).toLocaleString();
    const receiptContent = `
========================================
         PARKEASE AI - RECEIPT
========================================
Booking Reference : ${booking.id}
Facility          : ${booking.facilityName}
Date & Time       : ${startDate} to ${endDate}
Floor & Slot      : ${booking.floorName || 'N/A'} - ${booking.slotName || 'N/A'}
Vehicle           : ${booking.vehiclePlate}
----------------------------------------
TOTAL PAID        : ₹${booking.totalAmount.toFixed(2)}
Currency          : ${booking.currency}
Status            : ${booking.status}
----------------------------------------
Thank you for parking with ParkEase AI!
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Format time for display (UTC → local)
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans pb-24">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs md:text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer/search')}>Find Parking</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-semibold">My Bookings</span>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-xs md:text-sm text-gray-500 font-normal mt-0.5">Manage reservations, digital gate passes and receipts</p>
        </div>

        <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/60 self-start sm:self-auto">
          {(['Active', 'Past', 'Cancelled'] as const).map((tab) => {
            const count = bookingsData[tab.toLowerCase() as keyof MyBookingsData]?.length || 0;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchBookings}>Try Again</Button>
        </div>
      )}

      {/* Grid Layout */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Bookings List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-bold text-gray-900 text-lg">No {activeTab.toLowerCase()} bookings</h3>
                <p className="text-xs text-gray-500">You don't have any {activeTab.toLowerCase()} parking reservations.</p>
                <Button onClick={() => navigate('/customer/search')} className="mt-4 text-xs">
                  Find & Book Parking
                </Button>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const isSelected = selectedBookingId === booking.id;
                return (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBookingId(booking.id)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-black ring-2 ring-black/5 shadow-md bg-gray-50/30' 
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] font-bold font-mono text-gray-400 block">{booking.id}</span>
                            <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">{booking.facilityName}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Countdown for active bookings */}
                            {booking.isActive && activeTab === 'Active' && (
                              <CountdownBadge endTime={booking.endTime} onExpire={handleCountdownExpire} />
                            )}
                            <Badge 
                              variant={booking.status === 'COMPLETED' ? 'success' : booking.status === 'CANCELLED' ? 'error' : 'default'} 
                              className={`text-xs px-2.5 py-0.5 border-none font-semibold ${
                                booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                                booking.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                                booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700' :
                                booking.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                                'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {formatDate(booking.startTime)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                          </div>
                          {booking.slotName && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {booking.floorName && `${booking.floorName} • `}{booking.slotName}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <Car className="w-4 h-4 text-gray-400 shrink-0" />
                            {booking.vehiclePlate}
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Digital Twin button — ONLY for active bookings */}
                            {booking.isActive && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenTwin(booking); }}
                                className="relative group overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl shadow-md hover:shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 border border-emerald-400/30"
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                                </span>
                                <Box className="w-3.5 h-3.5 text-emerald-100 group-hover:rotate-12 transition-transform" />
                                <span className="tracking-wide">View Digital Twin</span>
                              </button>
                            )}
                            <div className="flex items-center gap-1 text-gray-900 font-bold text-base">
                              ₹{booking.totalAmount.toFixed(2)}
                              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90 text-black' : ''}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Booking Details */}
          <div className="sticky top-24">
            {selectedBooking ? (
              <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-100 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Booking Details</span>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mt-0.5">{selectedBooking.facilityName}</h3>
                  </div>
                  <Badge className={`text-xs border-none font-semibold px-2.5 py-1 ${
                    selectedBooking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                    selectedBooking.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                    selectedBooking.status === 'ACTIVE' || selectedBooking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedBooking.status}
                  </Badge>
                </div>

                {/* QR Gate Pass — only for CONFIRMED / ACTIVE */}
                {selectedBooking.qrCodeToken && selectedBooking.isActive && (
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/60 text-center space-y-3">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <QrCode className="w-4 h-4 text-black" />
                      <span>Gate Scanner Pass</span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-gray-200/80 mx-auto">
                      <QRCodeSVG 
                        value={selectedBooking.qrCodeToken} 
                        size={140}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-mono font-bold text-gray-900 tracking-wider">
                        {selectedBooking.id}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Scan at entrance/exit barrier camera
                      </p>
                    </div>
                  </div>
                )}

                {/* Booking Specifications */}
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900">{formatDate(selectedBooking.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Time Window</span>
                    <span className="font-semibold text-gray-900">
                      {formatTime(selectedBooking.startTime)} – {formatTime(selectedBooking.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Assigned Slot</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBooking.floorName && `${selectedBooking.floorName} • `}{selectedBooking.slotName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Vehicle</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-gray-50 px-3 rounded-xl">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="font-bold text-gray-900 text-base">₹{selectedBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  {/* Digital Twin — hero CTA for active bookings */}
                  {selectedBooking.isActive && (
                    <button
                      onClick={() => handleOpenTwin(selectedBooking)}
                      className="relative group overflow-hidden w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold py-3.5 px-5 rounded-2xl text-xs md:text-sm hover:from-emerald-500 hover:to-cyan-500 active:scale-[0.98] transition-all flex items-center justify-between shadow-xl shadow-emerald-500/25 border border-emerald-400/30 ring-2 ring-emerald-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
                        </span>
                        <Box className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-wide text-sm font-bold">View Live Spot (Digital Twin)</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs text-[10px] uppercase tracking-wider font-extrabold text-emerald-100 group-hover:bg-white/25 transition-colors">
                        <span>NAVIGATE</span>
                        <Navigation className="w-3.5 h-3.5 text-cyan-200 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  )}

                  {/* Cancel — only for pending/confirmed */}
                  {(selectedBooking.status === 'PENDING_PAYMENT' || selectedBooking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking)}
                      className="w-full bg-red-50 text-red-700 border border-red-200 font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel Booking
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadReceipt(selectedBooking)}
                    className="w-full bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Tax Receipt
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('/customer/support')}
                      className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-gray-600" /> Get Help
                    </button>
                    <button
                      onClick={() => navigate('/customer/search')}
                      className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-gray-600" /> Book More
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <Card className="p-8 text-center space-y-4">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-bold text-gray-900 text-base">Select a booking to view details</h3>
                <p className="text-xs text-gray-500">Booking details, QR gate pass and tax receipt will appear here.</p>
              </Card>
            )}
          </div>

        </div>
      )}

      {/* Digital Twin Modal */}
      <AnimatePresence>
        {isDigitalTwinOpen && twinBooking && (
          <DigitalTwinModal booking={twinBooking} onClose={handleCloseTwin} />
        )}
      </AnimatePresence>
    </div>
  );
}
