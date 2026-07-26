import { motion } from 'framer-motion';
import {
  Download, Share2, Navigation, Clock, Car, MapPin, CheckCircle2,
  Copy, QrCode, Smartphone, ChevronRight, Leaf, Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const booking = {
  id: 'PE7X2A1',
  otp: '847261',
  vehicle: 'KA 05 MN 4521',
  slot: 'A-12',
  floor: 'Ground Floor',
  parking: 'Central Metro Parking Hub',
  address: 'MG Road, Near Central Station, Bengaluru',
  entryTime: 'Today, 12:30 PM',
  exitTime: 'Today, 02:30 PM',
  duration: '2 hours',
  amount: '₹129.80',
  greenScore: '+12',
};

export function TicketPage() {
  const navigate = useNavigate();
  const qrData = JSON.stringify({ id: booking.id, slot: booking.slot, otp: booking.otp });

  return (
    <div className="min-h-full flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-5">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">Booking Confirmed</span>
          </div>
          <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Your Parking Ticket</h1>
          <p className="text-sm text-txt-secondary mt-1">Show this at the parking entry gate</p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Ticket container with torn edge effect */}
          <div className="card overflow-hidden">
            {/* Ticket top - Brand header */}
            <div className="gradient-brand p-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-txt-primary" />
                  <span className="font-bold text-txt-primary">ParkEase AI</span>
                </div>
                <div className="text-right">
                  <div className="text-txt-primary/70 text-[11px]">Booking ID</div>
                  <div className="text-txt-primary font-bold">{booking.id}</div>
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <div className="text-txt-primary/70 text-xs">PARKING SLOT</div>
                <div className="text-4xl font-bold text-txt-primary mt-0.5">Slot {booking.slot}</div>
                <div className="text-txt-primary/80 text-sm">{booking.floor} · {booking.parking}</div>
              </div>
            </div>

            {/* Perforation line */}
            <div className="flex items-center px-4 py-2">
              <div className="flex-1 border-t-2 border-dashed border-bdr" />
              <div className="w-6 h-6 rounded-full bg-bg-primary border border-bdr mx-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--border)] dark:bg-bg-secondary" />
              </div>
              <div className="flex-1 border-t-2 border-dashed border-bdr" />
            </div>

            {/* QR Code + OTP */}
            <div className="px-5 py-3">
              <div className="flex items-center gap-4">
                {/* QR Code */}
                <div className="flex-shrink-0 p-2 border-2 border-bdr rounded-xl bg-white dark:bg-white">
                  <QRCodeSVG
                    value={qrData}
                    size={96}
                    bgColor="white"
                    fgColor="var(--text-primary)"
                    level="M"
                    includeMargin={false}
                  />
                </div>

                {/* OTP */}
                <div className="flex-1">
                  <div className="text-xs text-txt-secondary mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Entry OTP
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold tracking-[0.3em] text-txt-primary">
                      {booking.otp}
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-bg-primary dark:hover:bg-[var(--border)] transition-colors">
                      <Copy className="w-3.5 h-3.5 text-txt-secondary" />
                    </button>
                  </div>
                  <p className="text-[11px] text-txt-secondary mt-1">Valid for 30 min post entry time</p>
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="px-5 pb-5 space-y-2.5">
              <div className="h-px bg-[var(--border)] dark:bg-bg-secondary" />

              {[
                { icon: Car, label: 'Vehicle', value: booking.vehicle },
                { icon: MapPin, label: 'Location', value: booking.address },
                { icon: Clock, label: 'Entry Time', value: booking.entryTime },
                { icon: Clock, label: 'Exit Time', value: booking.exitTime },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" />
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <span className="text-xs text-txt-secondary">{item.label}</span>
                    <span className="text-xs font-semibold text-txt-primary text-right">{item.value}</span>
                  </div>
                </div>
              ))}

              <div className="h-px bg-[var(--border)] dark:bg-bg-secondary" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-txt-primary">Amount Paid</span>
                <span className="text-lg font-bold text-brand">{booking.amount}</span>
              </div>

              {/* Green badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20">
                <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-700 dark:text-green-400">
                  You saved 1.9kg CO₂ and earned {booking.greenScore} green points! 🌿
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <button className="btn-primary py-3">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="btn-secondary py-3">
            <Share2 className="w-4 h-4" />
            Share Ticket
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <button className="btn-secondary py-3">
            <Navigation className="w-4 h-4" />
            Navigate
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost py-3 border border-bdr"
          >
            Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Info */}
        <div className="text-center text-xs text-txt-secondary pb-4">
          <p>Having issues? <span className="text-brand font-semibold cursor-pointer">Contact support</span></p>
        </div>
      </div>
    </div>
  );
}
