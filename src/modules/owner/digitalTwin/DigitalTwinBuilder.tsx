import React from 'react';
import DigitalTwin from '../../admin/digitalTwin/DigitalTwin';

export const DigitalTwinBuilder: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Layout Builder & Floor Canvas
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Digital Twin Studio</h1>
          <p className="text-xs text-slate-400 mt-1">Full drag-and-drop layout builder, floor manager, slot property editor, and live publishing.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 min-h-[700px]">
        <DigitalTwin />
      </div>
    </div>
  );
};
