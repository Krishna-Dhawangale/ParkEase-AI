import { motion } from 'framer-motion';
import { Car, MoreHorizontal } from 'lucide-react';
import { recentBookings, type BookingStatus } from './data';

// ─── Status Badge ───────────────────────────────────────────────────────────────

const statusStyles: Record<BookingStatus, string> = {
  Active:    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Completed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Pending:   'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

// ─── Recent Bookings ────────────────────────────────────────────────────────────

const RecentBookings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Bookings</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Last 8 bookings</p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Vehicle
              </th>
              <th className="hidden px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 md:table-cell">
                User
              </th>
              <th className="hidden px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 lg:table-cell">
                Slot
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Time
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {recentBookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.04 }}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
              >
                <td className="whitespace-nowrap px-6 py-3">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {booking.id}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {booking.vehicle}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {booking.vehicleType}
                    </p>
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-6 py-3 md:table-cell">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {booking.user}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-6 py-3 lg:table-cell">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {booking.slot}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {booking.time}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {booking.amount}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentBookings;
