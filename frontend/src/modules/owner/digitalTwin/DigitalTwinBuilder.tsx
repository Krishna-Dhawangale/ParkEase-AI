import React from 'react';
import DigitalTwin from '../../../portals/client-admin/digitalTwin/DigitalTwin';

export const DigitalTwinBuilder: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-txt-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-bdr shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Layout Builder & Floor Canvas
            </span>
          </div>
          <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Facility Digital Twin Studio</h1>
          <p className="text-xs text-txt-secondary mt-1">Full drag-and-drop layout builder, floor manager, slot property editor, and live publishing.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-bdr overflow-hidden bg-bg-card min-h-[700px]">
        <DigitalTwin />
      </div>
    </div>
  );
};
