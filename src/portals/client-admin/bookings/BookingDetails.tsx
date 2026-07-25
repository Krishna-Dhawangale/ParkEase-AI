import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, Calendar, Clock, Car, User, Mail, CreditCard, 
  MapPin, Hash, IndianRupee, AlertCircle, FileText
} from 'lucide-react';
import { cn } from '../../../lib/utils';

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
  status: string;
  source: string;
}

interface BookingDetailsProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Completed: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  Cancelled: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  Pending: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'No-Show': { color: 'text-slate-500 dark:text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/50' },
  Overstay: { color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;
  const sc = statusConfig[booking.status] || statusConfig['Pending'];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:border-slate-800 dark:bg-slate-950">
          
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Booking {booking.id}</h2>
                <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", sc.bg, sc.color)}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Source: {booking.source}</p>
            </div>
            <Dialog.Close className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer & Vehicle Info */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Customer Information</h3>
                <div className="card p-4 space-y-3 bg-[var(--bg-secondary)] border-none">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="font-medium text-[var(--text-primary)]">{booking.customer}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{booking.email}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Vehicle Information</h3>
                <div className="card p-4 space-y-3 bg-[var(--bg-secondary)] border-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="font-bold text-[var(--text-primary)]">{booking.vehicle}</span>
                    </div>
                    <span className="badge bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">{booking.vehicleType}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Parking & Payment Details */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Time & Location</h3>
                <div className="card p-4 space-y-3 bg-[var(--bg-secondary)] border-none">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[var(--brand)]" />
                        <span className="font-bold text-[var(--text-primary)]">{booking.slot}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] pl-6">{booking.zone}</p>
                    </div>
                  </div>
                  <div className="border-t border-[var(--border)] pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Clock className="w-4 h-4" /> Check-in
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{booking.checkIn}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Clock className="w-4 h-4" /> Check-out
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{booking.checkOut}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Hash className="w-4 h-4" /> Duration
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{booking.duration}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Payment Summary</h3>
                <div className="card p-4 space-y-3 bg-[var(--bg-secondary)] border-none">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <IndianRupee className="w-4 h-4" /> Total Amount
                    </div>
                    <span className="font-bold text-[var(--text-primary)] text-lg">{booking.amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <CreditCard className="w-4 h-4" /> Method
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{booking.paymentMethod}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-end gap-3">
            {booking.status === 'Active' && (
              <button className="btn-secondary text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                End Booking Manually
              </button>
            )}
            <button className="btn-secondary">
              <FileText className="w-4 h-4" /> Download Receipt
            </button>
            <button className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BookingDetails;
