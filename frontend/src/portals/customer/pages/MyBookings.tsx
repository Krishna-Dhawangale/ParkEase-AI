import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { 
  Calendar, Clock, Car, ChevronRight, Download, MapPin, 
  Receipt, ShieldCheck, QrCode, Phone, AlertCircle, HelpCircle, Navigation,
  Box, X, Star, Zap, Check
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  id: string;
  bookingRef: string;
  name: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  slot: string;
  floor: string;
  vehicle: string;
  vehicleModel: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  amount: string;
  baseAmount: string;
  taxAmount: string;
  paymentMethod: string;
  image: string;
  qrToken: string;
}

export function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Completed');
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState(false);

  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('parkease-user-bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(() => {
    return allBookings.length > 0 ? allBookings[0].id : null;
  });

  // Filter bookings based on active tab
  const filteredBookings = allBookings.filter(b => {
    if (activeTab === 'Completed') return b.status === 'Completed';
    if (activeTab === 'Upcoming') return b.status === 'Upcoming';
    if (activeTab === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  // Currently selected booking object
  const selectedBooking = allBookings.find(b => b.id === selectedBookingId) || filteredBookings[0] || allBookings[0];

  const handleDownloadReceipt = () => {
    const receiptContent = `
========================================
         PARKEASE AI - RECEIPT
========================================
Booking Reference : ${selectedBooking.bookingRef}
Facility          : ${selectedBooking.name}
Address           : ${selectedBooking.address}
Date & Time       : ${selectedBooking.date} (${selectedBooking.time})
Floor & Slot      : ${selectedBooking.floor} - Slot ${selectedBooking.slot}
Vehicle           : ${selectedBooking.vehicle} (${selectedBooking.vehicleModel})
----------------------------------------
Base Fee          : ${selectedBooking.baseAmount}
Service & Taxes   : ${selectedBooking.taxAmount}
TOTAL PAID        : ${selectedBooking.amount}
Payment Method    : ${selectedBooking.paymentMethod}
Status            : ${selectedBooking.status}
----------------------------------------
Thank you for parking with ParkEase AI!
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${selectedBooking.bookingRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
          {(['Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                const firstMatch = allBookings.find(b => b.status === tab);
                if (firstMatch) setSelectedBookingId(firstMatch.id);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
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
                  className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5 ${
                    isSelected 
                      ? 'border-black ring-2 ring-black/5 shadow-md bg-gray-50/30' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full sm:w-32 h-32 sm:h-24 rounded-2xl overflow-hidden shrink-0 relative group">
                    <img src={booking.image} alt={booking.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-gray-400 block">{booking.bookingRef}</span>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">{booking.name}</h3>
                      </div>
                      <Badge 
                        variant={booking.status === 'Completed' ? 'success' : booking.status === 'Upcoming' ? 'default' : 'error'} 
                        className={`text-xs px-2.5 py-0.5 border-none font-semibold ${
                          booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          booking.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {booking.time}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <Car className="w-4 h-4 text-gray-400 shrink-0" />
                        {booking.vehicle}
                      </div>
                      <div className="flex items-center gap-1 text-gray-900 font-bold text-base">
                        {booking.amount}
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90 text-black' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Booking Details & Digital QR Gate Pass */}
        <div className="sticky top-24">
          {selectedBooking ? (
            <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-100 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Active Selection</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mt-0.5">{selectedBooking.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate max-w-[220px]">{selectedBooking.address}</span>
                  </p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 text-xs border-none font-semibold px-2.5 py-1">
                  {selectedBooking.status}
                </Badge>
              </div>

              {/* Digital QR Gate Pass */}
              <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/60 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <QrCode className="w-4 h-4 text-black" />
                  <span>Gate Scanner Pass</span>
                </div>
                
                <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-gray-200/80 mx-auto">
                  <QRCodeSVG 
                    value={selectedBooking.qrToken} 
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div>
                  <p className="text-[11px] font-mono font-bold text-gray-900 tracking-wider">
                    {selectedBooking.bookingRef}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Scan at entrance/exit barrier camera
                  </p>
                </div>
              </div>

              {/* Booking Specifications Breakdown */}
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Date & Duration</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.date} ({selectedBooking.duration})</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Time Window</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.time}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Assigned Slot</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.floor} • {selectedBooking.slot}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.vehicle}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between py-2 bg-gray-50 px-3 rounded-xl">
                  <span className="font-bold text-gray-900">Total Paid</span>
                  <span className="font-bold text-gray-900 text-base">{selectedBooking.amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsDigitalTwinOpen(true)}
                  className="w-full bg-white text-gray-900 border border-gray-300 font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Box className="w-4 h-4 text-black" /> View Live Spot (Digital Twin)
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  className="w-full bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Tax Receipt
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedBooking.address)}`, '_blank')}
                    className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-gray-600" /> Directions
                  </button>

                  <button
                    onClick={() => navigate('/customer/support')}
                    className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-gray-600" /> Get Help
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

      {/* Contextual Digital Twin Modal for Active Booking */}
      <AnimatePresence>
        {isDigitalTwinOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDigitalTwinOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{selectedBooking.name}</h3>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Session
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Tracking Reserved Slot: <strong className="text-gray-900">{selectedBooking.slot}</strong> ({selectedBooking.floor})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDigitalTwinOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live Viewport */}
              <div className="py-6 flex-1 overflow-y-auto space-y-4">
                <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 text-white space-y-5">
                  <div className="flex justify-between items-center text-xs font-mono border-b border-gray-800 pb-3">
                    <span className="text-emerald-400 font-bold">RESERVED SLOT: {selectedBooking.slot}</span>
                    <span className="text-amber-400 font-bold">VEHICLE: {selectedBooking.vehicle}</span>
                    <span className="text-blue-400 font-bold">STATUS: {selectedBooking.status}</span>
                  </div>

                  <div className="py-8 text-center space-y-4">
                    <div className="inline-block p-4 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 ring-8 ring-emerald-500/10 animate-pulse">
                      <Car className="w-12 h-12 text-emerald-400 mx-auto" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Your Vehicle Spot Highlighted</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                        Floor {selectedBooking.floor} • Spot {selectedBooking.slot}. Gate barrier sensors will automatically detect {selectedBooking.vehicle} on approach.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-gray-800 pt-3">
                    <span>LIVE SENSOR SYNC: ONLINE</span>
                    <span>SESSION START: {selectedBooking.time}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end shrink-0">
                <button
                  onClick={() => setIsDigitalTwinOpen(false)}
                  className="bg-black text-white font-semibold py-2.5 px-6 rounded-xl text-xs hover:bg-gray-800 transition-colors"
                >
                  Close Twin Monitor
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
