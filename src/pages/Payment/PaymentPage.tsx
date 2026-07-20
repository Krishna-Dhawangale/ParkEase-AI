import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Smartphone, Building2, Wallet, Shield, Check, Zap,
  ChevronRight, Lock, IndianRupee, Leaf, Brain, Info, ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', desc: 'Pay via UPI ID or QR code' },
  { id: 'credit', label: 'Credit Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', desc: 'Visa, Mastercard, Amex, RuPay' },
  { id: 'debit', label: 'Debit Card', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', desc: 'All major bank cards' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', desc: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, color: 'text-[var(--brand)]', bg: 'bg-[var(--brand)]/5 dark:bg-[var(--brand-light)]/10', desc: 'All 50+ banks supported' },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate('/ticket');
    }, 2500);
  };

  const summaryItems = [
    { label: 'Parking – Central Metro Hub', value: '₹120.00' },
    { label: 'Duration – 2 hours', value: '' },
    { label: 'Platform fee', value: '₹5.00' },
    { label: 'AI route savings', value: '-₹15.00', green: true },
    { label: 'GST (18%)', value: '₹19.80' },
  ];

  return (
    <div className="min-h-full flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/book')} className="btn-ghost p-2">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">Payment</h1>
            <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">Secure payment powered by ParkEase Pay™</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Payment methods */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-[var(--text-primary)] dark:text-white mb-4">Select Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map((method, i) => (
                  <motion.button
                    key={method.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                      selectedMethod === method.id
                        ? 'border-[var(--brand)] bg-[var(--brand)]/5 dark:bg-[var(--brand-light)]/5'
                        : 'border-[var(--border)] dark:border-[var(--border)] hover:border-[var(--brand)]/30'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', method.bg)}>
                      <method.icon className={cn('w-5 h-5', method.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)] dark:text-white text-sm">{method.label}</div>
                      <div className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{method.desc}</div>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedMethod === method.id ? 'border-[var(--brand)] bg-[var(--brand)]' : 'border-[var(--border)] dark:border-[var(--border)]'
                    )}>
                      {selectedMethod === method.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* UPI Input */}
            {selectedMethod === 'upi' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5"
              >
                <h3 className="font-bold text-[var(--text-primary)] dark:text-white mb-4">Enter UPI ID</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="input-field pr-24"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-[var(--brand)] bg-[var(--brand)]/10 rounded-lg hover:bg-[var(--brand)]/20 transition-colors">
                    Verify
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Supports GPay, PhonePe, Paytm, BHIM, any UPI app</p>

                <div className="mt-4 p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] border border-[var(--border)] dark:border-[var(--border)]">
                  <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-white mb-2">Scan QR Code</p>
                  {/* QR placeholder */}
                  <div className="w-32 h-32 mx-auto bg-white dark:bg-[var(--border)] rounded-xl border border-[var(--border)] dark:border-[var(--border)] flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-0.5 p-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={cn('w-3 h-3 rounded-sm', Math.random() > 0.5 ? 'bg-[var(--text-primary)] dark:bg-white' : 'bg-transparent')} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedMethod === 'credit' || selectedMethod === 'debit' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 space-y-4"
              >
                <h3 className="font-bold text-[var(--text-primary)] dark:text-white">Card Details</h3>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Card Number</label>
                  <input placeholder="1234 5678 9012 3456" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Expiry</label>
                    <input placeholder="MM / YY" className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">CVV</label>
                    <input placeholder="•••" className="input-field" type="password" maxLength={3} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Name on Card</label>
                  <input placeholder="GIRISH KUMAR" className="input-field" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[var(--brand)]" />
                  <span className="text-xs text-[var(--text-secondary)]">Save this card for future bookings</span>
                </label>
              </motion.div>
            ) : null}

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['PCI DSS', 'SSL Secured', '3D Secure', 'RBI Compliant'].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Lock className="w-3 h-3" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h3 className="font-bold text-[var(--text-primary)] dark:text-white mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
                  <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">Slot A-12</div>
                    <div className="text-xs text-[var(--text-secondary)]">Central Metro Hub · 2 hrs</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {summaryItems.map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{item.label}</span>
                      {item.value && (
                        <span className={cn('font-semibold', item.green ? 'text-green-600' : 'text-[var(--text-primary)] dark:text-white')}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border)] dark:border-[var(--border)] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--text-primary)] dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-[var(--brand)]">₹129.80</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Green savings */}
            <div className="card p-4 border-green-100 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-green-700 dark:text-green-400">Environmental Impact</span>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-700 dark:text-green-400">0.8L</div>
                  <div className="text-[10px] text-green-600/70">Fuel saved</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-700 dark:text-green-400">1.9kg</div>
                  <div className="text-[10px] text-green-600/70">CO₂ reduced</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-700 dark:text-green-400">+12 pts</div>
                  <div className="text-[10px] text-green-600/70">Green score</div>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <motion.button
              onClick={handlePay}
              disabled={processing}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 text-base relative overflow-hidden disabled:opacity-80"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing payment...
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₹129.80 Securely
                </>
              )}
            </motion.button>

            <p className="text-center text-[11px] text-[var(--text-secondary)]">
              Your payment is secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
