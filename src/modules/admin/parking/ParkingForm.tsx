import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2, MapPin } from 'lucide-react';
import { useForm, type Resolver } from 'react-hook-form';
import * as z from 'zod';
import type { ParkingZone } from './data';
import { cityOptions, statusOptions, typeOptions } from './data';

const parkingSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['Indoor', 'Outdoor', 'Covered', 'VIP']),
  status: z.enum(['Active', 'Maintenance', 'Closed', 'Full']),
  city: z.string().min(2, 'Choose a city'),
  address: z.string().min(8, 'Enter a full address'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  totalSlots: z.coerce.number().int().min(1, 'Total slots must be at least 1'),
  occupiedSlots: z.coerce.number().int().min(0, 'Occupied slots cannot be negative'),
  evSlots: z.coerce.number().int().min(0),
  vipSlots: z.coerce.number().int().min(0),
  disabledSlots: z.coerce.number().int().min(0),
  emergencySlots: z.coerce.number().int().min(0),
  basePrice: z.coerce.number().min(0, 'Base price cannot be negative'),
  weekdayRate: z.coerce.number().min(0),
  weekendRate: z.coerce.number().min(0),
  monthlyPass: z.coerce.number().min(0),
  workingHoursOpen: z.string().min(1),
  workingHoursClose: z.string().min(1),
  manager: z.string().min(3, 'Manager name is required'),
  imageUrl: z.string().min(1, 'Add an image URL or upload a local image'),
  features: z.string().optional(),
}).refine((data) => data.occupiedSlots <= data.totalSlots, {
  message: 'Occupied slots cannot exceed total capacity',
  path: ['occupiedSlots'],
}).refine((data) => data.evSlots + data.vipSlots + data.disabledSlots + data.emergencySlots <= data.totalSlots, {
  message: 'Special purpose slots cannot exceed total capacity',
  path: ['evSlots'],
});

type ParkingFormInput = z.input<typeof parkingSchema>;
export type ParkingFormData = z.output<typeof parkingSchema>;

interface ParkingFormProps {
  initialData?: ParkingZone | null;
  onSubmit: (data: ParkingFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200';

const ParkingForm = ({ initialData, onSubmit, onCancel, isSubmitting }: ParkingFormProps) => {
  const [uploadedName, setUploadedName] = useState('');

  const defaults = useMemo<ParkingFormData>(() => ({
    name: initialData?.name ?? '',
    type: initialData?.type ?? 'Indoor',
    status: initialData?.status ?? 'Active',
    city: initialData?.city ?? 'Bengaluru',
    address: initialData?.address ?? '',
    latitude: initialData?.latitude ?? 12.9716,
    longitude: initialData?.longitude ?? 77.5946,
    totalSlots: initialData?.totalSlots ?? 120,
    occupiedSlots: initialData?.occupiedSlots ?? 0,
    evSlots: initialData?.evSlots ?? 8,
    vipSlots: initialData?.vipSlots ?? 4,
    disabledSlots: initialData?.disabledSlots ?? 4,
    emergencySlots: initialData?.emergencySlots ?? 2,
    basePrice: initialData?.basePrice ?? 80,
    weekdayRate: initialData?.weekdayRate ?? 80,
    weekendRate: initialData?.weekendRate ?? 110,
    monthlyPass: initialData?.monthlyPass ?? 5500,
    workingHoursOpen: initialData?.workingHoursOpen ?? '06:00',
    workingHoursClose: initialData?.workingHoursClose ?? '23:00',
    manager: initialData?.manager ?? '',
    imageUrl: initialData?.imageUrl ?? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80',
    features: initialData?.features.join(', ') ?? 'CCTV, ANPR cameras, Security patrol',
  }), [initialData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParkingFormInput, unknown, ParkingFormData>({
    resolver: zodResolver(parkingSchema) as Resolver<ParkingFormInput, unknown, ParkingFormData>,
    defaultValues: defaults,
  });

  const imageUrl = watch('imageUrl');
  const latitude = Number(watch('latitude') || 0);
  const longitude = Number(watch('longitude') || 0);
  const totalSlots = Number(watch('totalSlots') || 0);
  const occupiedSlots = Number(watch('occupiedSlots') || 0);
  const occupancy = totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Parking Name</label>
              <input {...register('name')} className={inputClass} placeholder="Terminal 2 Premium Deck" />
              {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Type</label>
              <select {...register('type')} className={inputClass}>
                {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={inputClass}>
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>City</label>
              <select {...register('city')} className={inputClass}>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Manager</label>
              <input {...register('manager')} className={inputClass} placeholder="Operations owner" />
              {errors.manager && <p className="mt-1 text-xs font-medium text-rose-600">{errors.manager.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input {...register('address')} className={inputClass} placeholder="Street, campus, gate or tower details" />
              {errors.address && <p className="mt-1 text-xs font-medium text-rose-600">{errors.address.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Latitude</label>
              <input {...register('latitude')} type="number" step="0.0001" className={inputClass} />
              {errors.latitude && <p className="mt-1 text-xs font-medium text-rose-600">{errors.latitude.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Longitude</label>
              <input {...register('longitude')} type="number" step="0.0001" className={inputClass} />
              {errors.longitude && <p className="mt-1 text-xs font-medium text-rose-600">{errors.longitude.message}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Capacity Planning</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{occupancy}% occupied in the current mock feed</p>
              </div>
              <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${Math.min(100, occupancy)}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ['totalSlots', 'Total Slots'],
                ['occupiedSlots', 'Occupied'],
                ['evSlots', 'EV Slots'],
                ['vipSlots', 'VIP Slots'],
                ['disabledSlots', 'Disabled Slots'],
                ['emergencySlots', 'Emergency Slots'],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input {...register(name as keyof ParkingFormInput)} type="number" min="0" className={inputClass} />
                  {errors[name as keyof ParkingFormData] && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{errors[name as keyof ParkingFormData]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>Base Price (Rs.)</label>
              <input {...register('basePrice')} type="number" min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weekday Rate</label>
              <input {...register('weekdayRate')} type="number" min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weekend Rate</label>
              <input {...register('weekendRate')} type="number" min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Monthly Pass</label>
              <input {...register('monthlyPass')} type="number" min="0" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Opens</label>
              <input {...register('workingHoursOpen')} type="time" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Closes</label>
              <input {...register('workingHoursClose')} type="time" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Features</label>
              <input {...register('features')} className={inputClass} placeholder="CCTV, EV charging, Valet, ANPR cameras" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <img src={imageUrl} alt="" className="h-44 w-full object-cover" />
            <div className="space-y-3 p-4">
              <label className={labelClass}>Parking Image</label>
              <input {...register('imageUrl')} className={inputClass} placeholder="https://..." />
              {errors.imageUrl && <p className="text-xs font-medium text-rose-600">{errors.imageUrl.message}</p>}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-brand-500/10">
                <ImagePlus className="h-4 w-4" />
                Upload mock image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setUploadedName(file.name);
                    setValue('imageUrl', URL.createObjectURL(file), { shouldValidate: true });
                  }}
                />
              </label>
              {uploadedName && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{uploadedName}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <MapPin className="h-4 w-4 text-brand-600" />
              Google Maps Location
            </div>
            <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px)] bg-[length:28px_28px]" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/15 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-950/95 dark:text-slate-300">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? 'Save changes' : 'Create parking'}
        </button>
      </div>
    </form>
  );
};

export default ParkingForm;
