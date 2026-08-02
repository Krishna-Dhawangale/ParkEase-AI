import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
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


  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer')}>Home</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">My Bookings</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button className="px-4 py-1.5 rounded-md bg-white text-sm font-medium shadow-sm">Upcoming</button>
          <button className="px-4 py-1.5 rounded-md text-gray-600 hover:text-gray-900 text-sm font-medium">Completed</button>
          <button className="px-4 py-1.5 rounded-md text-gray-600 hover:text-gray-900 text-sm font-medium">Cancelled</button>
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
}
