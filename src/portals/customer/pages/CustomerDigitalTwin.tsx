import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DigitalTwin } from '../../../components/DigitalTwin';
import { BookingModal } from './BookingModal';

export function CustomerDigitalTwin() {
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId: string }>();

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] overflow-hidden">
      <div className="absolute top-6 left-6 z-20 flex gap-2">
         <button onClick={() => navigate('/customer')} className="bg-[#10172A]/80 backdrop-blur-md border border-[#2B3446] px-4 py-2 rounded-lg text-sm font-bold text-white shadow-xl hover:bg-[#1E293B] transition-colors">
            ← Back to Portal
         </button>
      </div>

      <div className="flex-1 w-full h-full relative">
        <DigitalTwin facilityId={facilityId} />
        {facilityId && <BookingModal facilityId={facilityId} />}
      </div>
    </div>
  );
}
