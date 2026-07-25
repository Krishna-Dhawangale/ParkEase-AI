import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Ban,
  ChevronLeft,
  ChevronRight,
  Car,
  IndianRupee,
  TrendingUp,
  TimerOff,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import BookingDetails from './BookingDetails';
import ConflictManager from './ConflictManager';
import { useWebSocketStore } from '../../../store';

// ─── Types ──────────────────────────────────────────────────────────────────────

type BookingStatus = 'Active' | 'Completed' | 'Cancelled' | 'Pending' | 'No-Show' | 'Overstay';

interface Booking {
  id: string;
  customer: string;
  email: string;
  vehicle: string;
  vehicleType: string;
  slot: string;
  zone: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  amount: string;
  paymentMethod: string;
  status: BookingStatus;
  source: 'App' | 'Walk-in' | 'Web' | 'Partner';
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const mockBookings: Booking[] = [];

const statusConfig: Record<BookingStatus, { color: string; bg: string }> = {
  Active: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Completed: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  Cancelled: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  Pending: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'No-Show': { color: 'text-slate-500 dark:text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/50' },
  Overstay: { color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
};

// ─── Component ──────────────────────────────────────────────────────────────────

const BookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const { lastMessage } = useWebSocketStore();

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'BOOKING_UPDATE') {
      const newBooking: Booking = {
        id: lastMessage.payload.id,
        customer: 'Live Walk-in',
        email: 'guest@example.com',
        vehicle: 'NEW ' + Math.floor(Math.random() * 9999),
        vehicleType: 'Sedan',
        slot: 'TBD',
        zone: 'General',
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: '--',
        duration: '0m',
        amount: '₹0',
        paymentMethod: 'N/A',
        status: lastMessage.payload.status as BookingStatus,
        source: 'App',
      };
      setBookings(prev => [newBooking, ...prev]);
    }
  }, [lastMessage]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | BookingStatus>('All');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isConflictManagerOpen, setIsConflictManagerOpen] = useState(false);
  const perPage = 8;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) ||
        b.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || b.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus, bookings]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const counts = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((b) => b.status === 'Active').length,
    completed: bookings.filter((b) => b.status === 'Completed').length,
    revenue: '₹0',
  }), [bookings]);

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Bookings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage all parking reservations across your facility.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsConflictManagerOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            <AlertCircle className="h-4 w-4" />
            Resolve Conflicts
          </button>
          <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:flex">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Today\'s Bookings', value: counts.total, icon: CalendarCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Active Now', value: counts.active, icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Completed', value: counts.completed, icon: CheckCircle2, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
          { label: 'Revenue', value: counts.revenue, icon: IndianRupee, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Active', 'Pending', 'Completed', 'Cancelled', 'No-Show', 'Overstay'] as const).map((status) => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setPage(1); }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterStatus === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-72"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Slot</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map((booking) => {
                const sc = statusConfig[booking.status];
                return (
                  <tr key={booking.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{booking.id}</p>
                      <p className="text-xs text-slate-500">{booking.checkIn} – {booking.checkOut}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{booking.customer}</p>
                      <p className="text-xs text-slate-500">{booking.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{booking.vehicle}</p>
                      <p className="text-xs text-slate-500">{booking.vehicleType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{booking.slot}</p>
                      <p className="text-xs text-slate-500">{booking.zone}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{booking.duration}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{booking.amount}</p>
                      <p className="text-xs text-slate-500">{booking.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{booking.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", sc.bg, sc.color)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-500">No bookings match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(page - 1) * perPage + 1}</span>–<span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * perPage, filtered.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-sm font-semibold transition-colors",
                    p === page
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <BookingDetails 
        booking={selectedBooking} 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />

      <ConflictManager 
        isOpen={isConflictManagerOpen} 
        onClose={() => setIsConflictManagerOpen(false)} 
      />
    </div>
  );
};

export default BookingList;
