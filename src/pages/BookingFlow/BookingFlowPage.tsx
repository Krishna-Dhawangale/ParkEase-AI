import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Car, Brain, Calendar, CreditCard, CheckCircle2,
  ChevronRight, ChevronLeft, Zap, Clock, Leaf, IndianRupee,
  Check, Search, Navigation, Smartphone, Building2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, label: 'Destination', icon: MapPin },
  { id: 2, label: 'Parking', icon: Building2 },
  { id: 3, label: 'Vehicle', icon: Car },
  { id: 4, label: 'AI Slot', icon: Brain },
  { id: 5, label: 'Schedule', icon: Calendar },
  { id: 6, label: 'Payment', icon: CreditCard },
  { id: 7, label: 'Confirmed', icon: CheckCircle2 },
];

const parkingOptions = [
  { id: 'p1', name: 'Central Metro Hub', distance: '0.3 km', price: '₹60/hr', available: 47, recommended: true },
  { id: 'p2', name: 'Tech Park Multi-Level', distance: '0.8 km', price: '₹40/hr', available: 23, recommended: false },
  { id: 'p3', name: 'Airport Express', distance: '1.2 km', price: '₹120/hr', available: 89, recommended: false },
];

const vehicles = [
  { id: 'v1', number: 'KA 05 MN 4521', type: 'Sedan', brand: 'Maruti Dzire', color: 'White' },
  { id: 'v2', number: 'KA 01 AB 1234', type: 'SUV', brand: 'Hyundai Creta', color: 'Black' },
];

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '⚡', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'debit', label: 'Debit Card', icon: '💳', desc: 'All banks supported' },
  { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, PhonePe balance' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
];

function StepOne({ onNext }: { onNext: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const suggestions = ['Central Station, MG Road', 'Whitefield IT Park', 'Kempegowda Airport', 'Bangalore City Mall', 'Manipal Hospital'];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] dark:text-white mb-2">Where are you going?</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search destination..."
            className="input-field pl-11 py-3.5"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Popular Destinations</p>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setSelected(s); setQuery(s); }}
            className={cn(
              'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left',
              selected === s
                ? 'border-[var(--brand)] bg-[var(--brand)]/5'
                : 'border-[var(--border)] dark:border-[var(--border)] hover:border-[var(--brand)]/30'
            )}
          >
            <MapPin className={cn('w-4 h-4 flex-shrink-0', selected === s ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)]')} />
            <span className="text-sm text-[var(--text-primary)] dark:text-white">{s}</span>
            {selected === s && <Check className="w-4 h-4 text-[var(--brand)] ml-auto" />}
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={!selected} className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepTwo({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState('');
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">Choose your parking facility near the destination.</p>
      {parkingOptions.map(p => (
        <button
          key={p.id}
          onClick={() => setSelected(p.id)}
          className={cn(
            'w-full p-4 rounded-2xl border-2 text-left transition-all',
            selected === p.id ? 'border-[var(--brand)] bg-[var(--brand)]/5' : 'border-[var(--border)] dark:border-[var(--border)]'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text-primary)] dark:text-white text-sm">{p.name}</span>
                {p.recommended && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[var(--brand)] text-white rounded-md">AI Pick</span>
                )}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                <Navigation className="w-3 h-3" />{p.distance}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{p.price}</div>
              <div className="text-xs text-green-600">{p.available} free</div>
            </div>
          </div>
          <div className="h-1.5 bg-[var(--border)] dark:bg-[var(--border)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${(p.available / 120) * 100}%` }} />
          </div>
        </button>
      ))}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3"><ChevronLeft className="w-4 h-4" /> Back</button>
        <button onClick={onNext} disabled={!selected} className="btn-primary flex-1 py-3 disabled:opacity-50">Continue <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function StepThree({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState('');
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">Select the vehicle you're driving today.</p>
      {vehicles.map(v => (
        <button
          key={v.id}
          onClick={() => setSelected(v.id)}
          className={cn(
            'w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4',
            selected === v.id ? 'border-[var(--brand)] bg-[var(--brand)]/5' : 'border-[var(--border)] dark:border-[var(--border)]'
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--border)] flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-primary)] dark:text-white text-sm">{v.number}</div>
            <div className="text-xs text-[var(--text-secondary)]">{v.brand} · {v.type} · {v.color}</div>
          </div>
          {selected === v.id && <Check className="w-5 h-5 text-[var(--brand)]" />}
        </button>
      ))}
      <button className="w-full p-4 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--brand)]/30 transition-all">
        + Add New Vehicle
      </button>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3"><ChevronLeft className="w-4 h-4" /> Back</button>
        <button onClick={onNext} disabled={!selected} className="btn-primary flex-1 py-3 disabled:opacity-50">Continue <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function StepFour({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl gradient-brand text-white">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5" />
          <span className="font-bold">AI Recommended</span>
          <span className="ml-auto text-sm font-semibold bg-white/20 px-2.5 py-0.5 rounded-lg">96.2% confidence</span>
        </div>
        <div className="text-4xl font-bold mb-1">Slot A-12</div>
        <div className="text-white/80 text-sm">Ground Floor · Central Metro Hub</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Walk', value: '3 min' },
            { label: 'Congestion', value: 'Low' },
            { label: 'CO₂ Saved', value: '1.9kg' },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-xl p-2.5 text-center">
              <div className="font-bold">{s.value}</div>
              <div className="text-white/60 text-[11px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-center text-[var(--text-secondary)]">Not satisfied? <button className="text-[var(--brand)] font-semibold">View alternatives →</button></p>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3"><ChevronLeft className="w-4 h-4" /> Back</button>
        <button onClick={onNext} className="btn-primary flex-1 py-3">Confirm Slot <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function StepFive({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('2');
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Entry Time</label>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Duration</label>
        <div className="grid grid-cols-4 gap-2">
          {['1', '2', '3', '4'].map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                'py-2.5 rounded-xl text-sm font-semibold border transition-all',
                duration === d ? 'border-[var(--brand)] bg-[var(--brand)] text-white' : 'border-[var(--border)] dark:border-[var(--border)] text-[var(--text-secondary)]'
              )}
            >
              {d}h
            </button>
          ))}
        </div>
        <input type="range" min="1" max="12" value={duration} onChange={e => setDuration(e.target.value)} className="w-full mt-2 accent-[var(--brand)]" />
        <p className="text-center text-xs text-[var(--brand)] font-semibold mt-1">{duration} hour{parseInt(duration) > 1 ? 's' : ''} · Ends at {startTime || '--:--'}</p>
      </div>
      <div className="p-4 rounded-2xl bg-[var(--brand)]/5 dark:bg-[var(--brand-light)]/5 border border-[var(--brand)]/20">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--text-secondary)]">Parking charge</span>
          <span className="font-bold text-[var(--text-primary)] dark:text-white">₹{60 * parseInt(duration)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Duration</span>
          <span className="font-bold text-[var(--text-primary)] dark:text-white">{duration}h × ₹60/hr</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3"><ChevronLeft className="w-4 h-4" /> Back</button>
        <button onClick={onNext} className="btn-primary flex-1 py-3">Continue <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function StepSix({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState('upi');
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Parking charge</span><span className="font-semibold text-[var(--text-primary)] dark:text-white">₹120.00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Platform fee</span><span className="font-semibold text-[var(--text-primary)] dark:text-white">₹5.00</span>
        </div>
        <div className="flex justify-between text-xs text-green-600">
          <span>AI savings</span><span className="font-semibold">-₹15.00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">GST (18%)</span><span className="font-semibold text-[var(--text-primary)] dark:text-white">₹19.80</span>
        </div>
        <div className="border-t border-[var(--border)] dark:border-[var(--border)] pt-2 flex justify-between">
          <span className="font-bold text-[var(--text-primary)] dark:text-white">Total</span>
          <span className="font-bold text-lg text-[var(--brand)]">₹129.80</span>
        </div>
      </div>
      <div className="space-y-2">
        {paymentMethods.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
              selected === m.id ? 'border-[var(--brand)] bg-[var(--brand)]/5' : 'border-[var(--border)] dark:border-[var(--border)]'
            )}
          >
            <span className="text-xl">{m.icon}</span>
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] dark:text-white">{m.label}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">{m.desc}</div>
            </div>
            {selected === m.id && <Check className="w-4 h-4 text-[var(--brand)] ml-auto" />}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3"><ChevronLeft className="w-4 h-4" /> Back</button>
        <button onClick={onNext} className="btn-primary flex-1 py-3 text-sm">Pay ₹129.80 <Zap className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function StepSeven() {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-5">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-10 h-10 text-white" />
      </motion.div>
      <div>
        <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white">Booking Confirmed!</h3>
        <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm mt-1">Your slot has been reserved successfully</p>
      </div>
      <div className="card p-5 text-left space-y-2.5">
        {[
          ['Booking ID', 'PE7X2A1'],
          ['Slot', 'A-12, Ground Floor'],
          ['Parking', 'Central Metro Hub'],
          ['Vehicle', 'KA 05 MN 4521'],
          ['Duration', '2 hours'],
          ['Amount Paid', '₹129.80'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">{label}</span>
            <span className="font-semibold text-[var(--text-primary)] dark:text-white">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/ticket')} className="btn-primary flex-1 py-3">
          View Ticket
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1 py-3">
          Dashboard
        </button>
      </div>
    </div>
  );
}

export function BookingFlowPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => setCurrentStep(s => Math.min(7, s + 1));
  const goBack = () => setCurrentStep(s => Math.max(1, s - 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepOne onNext={goNext} />;
      case 2: return <StepTwo onNext={goNext} onBack={goBack} />;
      case 3: return <StepThree onNext={goNext} onBack={goBack} />;
      case 4: return <StepFour onNext={goNext} onBack={goBack} />;
      case 5: return <StepFive onNext={goNext} onBack={goBack} />;
      case 6: return <StepSix onNext={goNext} onBack={goBack} />;
      case 7: return <StepSeven />;
      default: return null;
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-lg">
        {/* Progress stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--border)] dark:bg-[var(--border)] z-0">
            <motion.div
              className="h-full bg-[var(--brand)] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center z-10">
              <motion.div
                animate={{
                  backgroundColor: currentStep > step.id ? 'var(--brand)' : currentStep === step.id ? 'var(--brand)' : undefined,
                  scale: currentStep === step.id ? 1.1 : 1,
                }}
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                  currentStep > step.id && 'border-[var(--brand)] bg-[var(--brand)]',
                  currentStep === step.id && 'border-[var(--brand)] bg-[var(--brand)] shadow-glow',
                  currentStep < step.id && 'border-[var(--border)] dark:border-[var(--border)] bg-white dark:bg-[var(--bg-card)]',
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <step.icon className={cn('w-4 h-4', currentStep >= step.id ? 'text-white' : 'text-[var(--text-secondary)]')} />
                )}
              </motion.div>
              <span className={cn(
                'text-[10px] font-semibold mt-1 hidden sm:block',
                currentStep >= step.id ? 'text-[var(--brand)] dark:text-[var(--brand-light)]' : 'text-[var(--text-secondary)]'
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-white">
            {steps[currentStep - 1]?.label}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-0.5">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
