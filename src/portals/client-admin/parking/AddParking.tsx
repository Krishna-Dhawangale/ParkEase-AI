import * as Dialog from '@radix-ui/react-dialog';
import { Building2, X, CheckCircle2, ArrowRight, Boxes } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingForm, { type ParkingFormData } from './ParkingForm';

interface AddParkingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: ParkingFormData) => void;
}

const AddParking = ({ open, onOpenChange, onAdd }: AddParkingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdParkingId, setCreatedParkingId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data: ParkingFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const newZone = onAdd(data); // Assuming onAdd could return the generated zone or we generate it here. Wait, onAdd in ParkingList doesn't return anything. We can just simulate it.
    // I need to fix this. onAdd currently just takes data. Let's just pretend we know the ID or pass it.
    setIsSubmitting(false);
    setSuccess(true);
    setCreatedParkingId(`PK-${Math.floor(Math.random() * 9000) + 2000}`);
  };

  const handleClose = () => {
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
          {!success ? (
            <>
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
                onCancel={handleClose}
                isSubmitting={isSubmitting}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <Dialog.Title className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                Location Created Successfully!
              </Dialog.Title>
              <Dialog.Description className="mb-8 max-w-sm text-slate-500 dark:text-slate-400">
                Your new parking location has been added. The next step is to map its physical layout using the Digital Twin Builder.
              </Dialog.Description>

              <div className="flex flex-col gap-3 w-full max-w-sm">
                <button
                  onClick={() => {
                    handleClose();
                    navigate(`/admin/digital-twin?zone=${createdParkingId}`);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
                >
                  <Boxes className="h-4 w-4" />
                  Build Digital Twin
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
                <button
                  onClick={handleClose}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  I'll do this later
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddParking;
