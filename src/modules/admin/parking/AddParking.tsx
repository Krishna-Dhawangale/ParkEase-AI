import * as Dialog from '@radix-ui/react-dialog';
import { Building2, X } from 'lucide-react';
import { useState } from 'react';
import ParkingForm, { type ParkingFormData } from './ParkingForm';

interface AddParkingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: ParkingFormData) => void;
}

const AddParking = ({ open, onOpenChange, onAdd }: AddParkingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ParkingFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    onAdd(data);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Parking Location
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure capacity, pricing, operating hours, and map metadata.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <ParkingForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddParking;
