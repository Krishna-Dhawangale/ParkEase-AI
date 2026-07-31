import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Calendar, Clock, Car, ChevronRight, Download } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export function MyBookings() {
  const navigate = useNavigate();

  const bookings = [
    {
      id: '1',
      name: 'Empress Mall Parking',
      date: '24 May 2025',
      time: '10:00 AM - 12:00 PM',
      vehicle: 'MH 31 AB 1234',
      status: 'Completed',
      amount: '₹60.00',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=200&h=150',
    },
    {
      id: '2',
      name: 'VR Nagpur Parking',
      date: '21 May 2025',
      time: '06:00 PM - 09:00 PM',
      vehicle: 'MH 31 CD 5678',
      status: 'Completed',
      amount: '₹75.00',
      image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80&w=200&h=150',
    }
  ];

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
            <Card key={booking.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 hover:shadow-md transition-shadow group cursor-pointer border border-transparent hover:border-gray-200">
              <div className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0">
                <img src={booking.image} alt={booking.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{booking.name}</h3>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-none">{booking.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {booking.time}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Car className="w-4 h-4 text-gray-400" />
                    {booking.vehicle}
                  </div>
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    {booking.amount}
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
              <h3 className="font-bold text-gray-900 mb-6">Select a booking to view details</h3>
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-500">Booking details, QR code and<br />receipt will appear here.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
