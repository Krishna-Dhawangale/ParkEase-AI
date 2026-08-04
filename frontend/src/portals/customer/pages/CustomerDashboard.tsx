import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Car, Clock, CheckCircle2, Wallet, Info, 
  MapPin, HelpCircle, ChevronRight, ChevronDown
} from 'lucide-react';
import { GlowingCard } from '../../../components/ui/GlowingCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuthStore } from '../../../store';
import { RevealTransition } from '../../../components/motion/RevealTransition';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const summaryCards = [
    { title: 'Upcoming Bookings', value: '2', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', link: '/customer/bookings', linkText: 'View bookings' },
    { title: 'Vehicles', value: '2', icon: Car, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '/customer/vehicles', linkText: 'Manage vehicles' },
    { title: 'Recent Activity', value: '5', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', link: '/customer/bookings', linkText: 'View activity' },
  ];

  const upcomingBookings = [
    {
      id: '1',
      name: 'Empress Mall Parking',
      date: '24 May 2025',
      time: '10:00 AM - 12:00 PM',
      vehicle: 'MH 31 AB 1234',
      status: 'Confirmed',
      amount: '₹60.00',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=200&h=150',
    },
    {
      id: '2',
      name: 'VR Nagpur Parking',
      date: '21 May 2025',
      time: '06:00 PM - 09:00 PM',
      vehicle: 'MH 31 CD 5678',
      status: 'Confirmed',
      amount: '₹75.00',
      image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80&w=200&h=150',
    }
  ];

  const recentActivity = [
    { id: '1', title: 'Booking Confirmed', desc: 'Empress Mall Parking', time: '2 min ago', icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { id: '2', title: 'Payment Successful', desc: '₹60.00 paid for booking', time: '15 min ago', icon: Wallet, iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
    { id: '3', title: 'Vehicle Added', desc: 'MH 31 EF 9012', time: '1 hr ago', icon: Car, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { id: '4', title: 'Profile Updated', desc: 'Personal information updated', time: '1 day ago', icon: Info, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.firstName || 'Prathamesh'}! 👋</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" />
          May 20 - May 26, 2025
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </button>
      </div>

      {/* Summary Cards */}
      <RevealTransition delay={0.1} staggerChildren>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, i) => (
            <GlowingCard key={i} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => navigate(card.link)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group">
                  {card.linkText}
                  <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </GlowingCard>
          ))}
        </div>
      </RevealTransition>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Bookings</h2>
            <button onClick={() => navigate('/customer/bookings')} className="text-sm font-medium text-gray-600 hover:text-gray-900">View all</button>
          </div>
          
          <RevealTransition delay={0.2} staggerChildren>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <GlowingCard key={booking.id} className="p-5 flex items-center gap-5 group cursor-pointer" onClick={() => navigate('/customer/bookings')}>
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={booking.image} alt={booking.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{booking.name}</h3>
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">{booking.status}</Badge>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Car className="w-4 h-4 text-gray-400" />
                      {booking.vehicle}
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 font-bold text-lg">
                      {booking.amount}
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
                    </div>
                  </div>
                </div>
              </GlowingCard>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-xl text-gray-700 border-gray-200" onClick={() => navigate('/customer/bookings')}>
              View All Bookings <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            </div>
          </RevealTransition>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button onClick={() => navigate('/customer/bookings')} className="text-sm font-medium text-gray-600 hover:text-gray-900">View all</button>
          </div>
          
          <RevealTransition delay={0.4}>
          <GlowingCard className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            </GlowingCard>
          </RevealTransition>
        </div>
      </div>

      {/* Bottom Cards */}
      <RevealTransition delay={0.6} staggerChildren>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <GlowingCard className="p-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Book Parking</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Find the best parking spots<br />Search nearby parking locations and book in seconds.
          </p>
          <Button variant="primary" className="w-full h-11" onClick={() => navigate('/customer/search')}>
            Find Parking
          </Button>
        </GlowingCard>

        <GlowingCard className="p-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">My Bookings</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            View and manage bookings<br />Check upcoming, past and cancelled bookings.
          </p>
          <Button variant="primary" className="w-full h-11" onClick={() => navigate('/customer/bookings')}>
            View Bookings
          </Button>
        </GlowingCard>

        <GlowingCard className="p-6 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Need Help?</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            We're here to help you<br />with your queries.
          </p>
          <div className="mt-auto pt-6">
             <Button variant="outline" className="w-full h-11 bg-white" onClick={() => navigate('/customer/support')}>
              <HelpCircle className="w-4 h-4 mr-2 text-gray-500" />
              Contact Support
            </Button>
          </div>
        </GlowingCard>
      </div>
      </RevealTransition>
      
      <div className="text-center pb-4">
        <p className="text-xs text-gray-400">© 2025 ParkEase AI. All rights reserved.</p>
      </div>
    </div>
  );
}
