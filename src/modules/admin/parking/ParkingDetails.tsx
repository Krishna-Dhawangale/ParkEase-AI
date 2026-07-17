import * as Dialog from '@radix-ui/react-dialog';
import {
  Accessibility,
  Clock,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../../lib/utils';
import type { ParkingZone } from './data';
import ParkingStatus from './ParkingStatus';

interface ParkingDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: ParkingZone | null;
}

const ParkingDetails = ({ open, onOpenChange, zone }: ParkingDetailsProps) => {
  if (!zone) return null;

  const capacityPct = Math.round((zone.occupiedSlots / zone.totalSlots) * 100) || 0;
  const trend = zone.occupancyHistory.map((value, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] ?? `D${index + 1}`,
    occupancy: value,
  }));

  const slotMix = [
    { label: 'EV', value: zone.evSlots, icon: Zap, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300' },
    { label: 'VIP', value: zone.vipSlots, icon: Star, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300' },
    { label: 'Accessible', value: zone.disabledSlots, icon: Accessibility, color: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-300' },
    { label: 'Emergency', value: zone.emergencySlots, icon: Truck, color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right dark:border-slate-800 dark:bg-slate-950">
          <div className="relative h-56 shrink-0 overflow-hidden">
            <img src={zone.imageUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
            <Dialog.Close className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-slate-950/90 dark:text-slate-200">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            <div className="absolute bottom-4 left-5 right-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <ParkingStatus status={zone.status} />
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-950/90 dark:text-slate-200">{zone.type}</span>
              </div>
              <Dialog.Title className="text-2xl font-bold text-white">{zone.name}</Dialog.Title>
              <Dialog.Description className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                <MapPin className="h-4 w-4" />
                {zone.city} · {zone.address}
              </Dialog.Description>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {slotMix.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label} slots</p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Capacity</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{zone.availableSlots} slots currently available</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{capacityPct}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${capacityPct >= 95 ? 'bg-rose-500' : capacityPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacityPct}%` }} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.totalSlots}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-xs text-slate-500">Occupied</p>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.occupiedSlots}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-xs text-slate-500">Available</p>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.availableSlots}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Pricing</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      ['Base hourly', formatCurrency(zone.basePrice)],
                      ['Weekday rate', formatCurrency(zone.weekdayRate)],
                      ['Weekend rate', formatCurrency(zone.weekendRate)],
                      ['Monthly pass', formatCurrency(zone.monthlyPass)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-900">
                        <span className="text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Occupancy Trend</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recent seven-day utilization</p>
                    </div>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`detail-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.26} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                        <Area type="monotone" dataKey="occupancy" stroke="#2563eb" strokeWidth={2.5} fill={`url(#detail-${zone.id})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Operations</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4" /> Working hours</div>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.workingHoursOpen} - {zone.workingHoursClose}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><IndianRupee className="h-4 w-4" /> Today</div>
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(zone.revenueToday)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><ShieldCheck className="h-4 w-4" /> Manager</div>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.manager}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><MapPin className="h-4 w-4" /> Coordinates</div>
                      <p className="font-bold text-slate-900 dark:text-white">{zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Map Preview</h3>
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.24)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.24)_1px,transparent_1px)] bg-[length:34px_34px]" />
                <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/15 p-2">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-600 text-white shadow-xl">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-3 text-sm shadow-sm dark:bg-slate-950/95">
                  <p className="font-bold text-slate-900 dark:text-white">{zone.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">{zone.latitude.toFixed(5)}, {zone.longitude.toFixed(5)}</p>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Features</h3>
              <div className="flex flex-wrap gap-2">
                {zone.features.map((feature) => (
                  <span key={feature} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {feature}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">Last updated {zone.lastUpdated}</p>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ParkingDetails;
