import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CalendarCheck,
  Camera,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Landmark,
  Layers3,
  LockKeyhole,
  MapPin,
  Navigation,
  QrCode,
  ShieldCheck,
  Smartphone,
  Ticket,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const journey = [
  {
    title: 'Plan Trip',
    desc: 'User chooses a destination such as mall, airport, hospital, campus, or station.',
    icon: MapPin,
    owner: 'User app',
    route: '/search',
  },
  {
    title: 'Discover Parking',
    desc: 'Nearby facilities show live availability, price, distance, security, EV support, and green score.',
    icon: Building2,
    owner: 'Parking search',
    route: '/search',
  },
  {
    title: 'AI Slot Match',
    desc: 'Recommendation engine ranks slots by walking distance, congestion, exit path, vehicle fit, and predicted demand.',
    icon: Brain,
    owner: 'AI engine',
    route: '/ai-recommendation',
  },
  {
    title: 'Digital Twin Check',
    desc: 'Live parking layout confirms slot status, floor, lane flow, camera coverage, and emergency buffers.',
    icon: Layers3,
    owner: 'Digital twin',
    route: '/digital-twin',
  },
  {
    title: 'Reserve Time Slot',
    desc: 'Booking engine locks the selected slot, detects overlaps, and stores vehicle, timing, and facility data.',
    icon: CalendarCheck,
    owner: 'Booking service',
    route: '/book',
  },
  {
    title: 'Pay Online',
    desc: 'UPI, cards, wallet, or net banking completes the booking with GST, platform fee, and savings details.',
    icon: CircleDollarSign,
    owner: 'Payment gateway',
    route: '/payment',
  },
  {
    title: 'Issue Ticket',
    desc: 'System generates booking ID, secure OTP, QR code, receipt, navigation instruction, and notification.',
    icon: Ticket,
    owner: 'Ticket service',
    route: '/ticket',
  },
  {
    title: 'Verify Entry',
    desc: 'Gate staff or scanner validates QR and OTP, captures vehicle camera data, and opens the barrier.',
    icon: QrCode,
    owner: 'Security gate',
    route: '/ticket',
  },
  {
    title: 'Park And Monitor',
    desc: 'Timer, occupancy, wrong-slot detection, overstay alerts, and digital twin status update in real time.',
    icon: Camera,
    owner: 'Operations',
    route: '/admin',
  },
  {
    title: 'Exit And Close',
    desc: 'Exit OTP validates the booking, penalties are calculated if needed, receipt is emailed, and slot is released.',
    icon: ShieldCheck,
    owner: 'Exit gate',
    route: '/notifications',
  },
];

const actors = [
  { label: 'Driver', icon: Car, items: ['Register and manage profile', 'Add petrol, diesel, CNG, or EV vehicle', 'Book, pay, navigate, rate'] },
  { label: 'Parking Owner', icon: Landmark, items: ['Configure facility layout', 'Manage floors, slots, pricing, staff', 'Track revenue and occupancy'] },
  { label: 'Security Staff', icon: LockKeyhole, items: ['Verify OTP and QR at gate', 'Monitor cameras and barriers', 'Handle alerts and incidents'] },
  { label: 'Super Admin', icon: Cloud, items: ['Manage SaaS tenants', 'Monitor platform health', 'Control plans, roles, and global analytics'] },
];

const aiModules = [
  { title: 'Slot Recommendation', value: '96.2%', desc: 'Explainable ranking for best slot selection', icon: Brain, color: 'brand' },
  { title: 'Occupancy Prediction', value: '94%', desc: 'Peak demand forecast for 6 PM today', icon: Gauge, color: 'amber' },
  { title: 'Conflict Resolution', value: 'Auto', desc: 'Detects double bookings and reallocates fairly', icon: GitBranch, color: 'danger' },
  { title: 'Emergency Buffer', value: 'Adaptive', desc: 'Keeps emergency slots ready based on risk and demand', icon: AlertTriangle, color: 'info' },
  { title: 'Green Parking Score', value: '+12', desc: 'Fuel, CO2, walking distance, and route efficiency score', icon: Zap, color: 'success' },
  { title: 'Health Analytics', value: '94/100', desc: 'Cameras, barriers, usage, revenue, and model status', icon: BarChart3, color: 'brand' },
];

const architecture = [
  { layer: 'Frontend Layer', detail: 'React web portal for user, owner admin, analytics, and prototype flows.', icon: Smartphone },
  { layer: 'API Layer', detail: 'Authentication, booking, payment, OTP, notification, admin, and SaaS APIs.', icon: Cpu },
  { layer: 'AI Layer', detail: 'Recommendation, demand forecast, heatmap, conflict, emergency, and explanation services.', icon: Brain },
  { layer: 'Realtime Layer', detail: 'Digital twin updates, gate events, slot changes, alerts, and live dashboard signals.', icon: Zap },
  { layer: 'Database Layer', detail: 'Users, vehicles, facilities, floors, slots, bookings, payments, tickets, cameras, logs.', icon: Database },
  { layer: 'Integration Layer', detail: 'Google Maps, payment gateway, email/SMS, cameras, barriers, and future IoT sensors.', icon: Navigation },
];

const prototypeMap = [
  ['Landing', 'Project value, feature overview, enterprise positioning'],
  ['Dashboard', 'Live occupancy, bookings, revenue, AI alert summary'],
  ['Find Parking', 'Destination search, facility discovery, filters, map'],
  ['AI Recommendation', 'Explainable AI slot selection and alternatives'],
  ['Digital Twin', 'Interactive parking layout with live slot states'],
  ['Book Parking', 'End-to-end reservation wizard from destination to confirmation'],
  ['Payment', 'Secure checkout and booking summary'],
  ['My Tickets', 'QR, OTP, booking ID, gate-ready digital ticket'],
  ['Admin', 'Owner command center, staff, alerts, cameras, barriers'],
  ['Analytics / AI Insights', 'Demand forecast, reports, revenue, health score'],
];

const colorClasses: Record<string, string> = {
  brand: 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
};

export function ProjectWorkflowPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 text-[#0F766E] dark:text-[#14B8A6] text-xs font-bold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SRS-aligned prototype workflow
          </div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">ParkEase AI Project Workflow</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-2 leading-relaxed">
            This screen translates the SRS into the product journey: search nearby parking, get an explainable AI slot, reserve, pay, receive OTP and QR ticket, verify at the gate, monitor through a digital twin, and manage operations through a SaaS admin layer.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 min-w-full sm:min-w-[420px]">
          {[
            ['500', 'Total slots'],
            ['10', 'Workflow stages'],
            ['6', 'AI modules'],
          ].map(([value, label]) => (
            <div key={label} className="card-flat p-4 text-center">
              <div className="text-2xl font-bold text-[#111827] dark:text-white">{value}</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="card-flat p-5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-[#111827] dark:text-white">End-to-End User Journey</h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">From planning a trip to secure exit verification.</p>
          </div>
          <span className="badge badge-brand">Complete flow</span>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-3">
          {journey.map((step, index) => (
            <motion.a
              key={step.title}
              href={step.route}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="group rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 hover:border-[#0F766E]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                </div>
                <span className="text-[10px] font-bold text-[#9CA3AF]">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">{step.title}</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed mt-1 min-h-[54px]">{step.desc}</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#0F766E] dark:text-[#14B8A6]">{step.owner}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#0F766E]" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <div className="grid xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 card-flat p-5">
          <h2 className="font-bold text-[#111827] dark:text-white mb-4">AI And Smart Parking Modules</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiModules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.04 }}
                className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4"
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', colorClasses[module.color])}>
                  <module.icon className="w-4 h-4" />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#111827] dark:text-white">{module.title}</h3>
                  <span className="text-sm font-bold text-[#0F766E] dark:text-[#14B8A6]">{module.value}</span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed mt-1">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="card-flat p-5">
          <h2 className="font-bold text-[#111827] dark:text-white mb-4">System Actors</h2>
          <div className="space-y-3">
            {actors.map((actor) => (
              <div key={actor.label} className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center">
                    <actor.icon className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827] dark:text-white">{actor.label}</h3>
                </div>
                <div className="space-y-1.5">
                  {actor.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-[#6B7280] dark:text-[#94A3B8]">
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <section className="card-flat p-5">
          <h2 className="font-bold text-[#111827] dark:text-white mb-4">SaaS Architecture Blueprint</h2>
          <div className="space-y-3">
            {architecture.map((layer, index) => (
              <div key={layer.layer} className="flex gap-3 rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <layer.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#9CA3AF]">L{index + 1}</span>
                    <h3 className="text-sm font-bold text-[#111827] dark:text-white">{layer.layer}</h3>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed mt-1">{layer.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-flat p-5">
          <h2 className="font-bold text-[#111827] dark:text-white mb-4">Prototype Screen Map</h2>
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#334155]">
            {prototypeMap.map(([screen, purpose], index) => (
              <div
                key={screen}
                className={cn(
                  'grid grid-cols-[130px_1fr] gap-3 px-4 py-3 bg-white dark:bg-[#1E293B]',
                  index !== prototypeMap.length - 1 && 'border-b border-[#E5E7EB] dark:border-[#334155]'
                )}
              >
                <span className="text-xs font-bold text-[#111827] dark:text-white">{screen}</span>
                <span className="text-xs text-[#6B7280] dark:text-[#94A3B8]">{purpose}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Project scope from SRS</span>
            </div>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
              The prototype focuses on the final-year demonstrable workflow while leaving autonomous vehicle communication, IoT sensors, drone monitoring, blockchain records, and AR navigation as future expansion modules.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
