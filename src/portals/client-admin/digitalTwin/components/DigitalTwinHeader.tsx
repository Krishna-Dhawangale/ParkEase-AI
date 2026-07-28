import React from 'react';
import { ArrowLeft, RotateCcw, RotateCw, Save, Upload, Loader2, Undo, Settings } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { TwinBuilderProject } from '../data';

interface DigitalTwinHeaderProps {
  project: TwinBuilderProject;
  mallName: string;
  readOnly: boolean;
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveLayout: () => void;
  publishLayout: () => void;
  previewMode: '2D' | '3D' | 'Simulation';
  setPreviewMode: (mode: '2D' | '3D' | 'Simulation') => void;
  showSettingsMenu?: () => void;
  saving?: boolean;
  layoutEditMode?: boolean;
  setLayoutEditMode?: (mode: boolean) => void;
}

export const DigitalTwinHeader: React.FC<DigitalTwinHeaderProps> = ({
  project,
  mallName,
  readOnly,
  activeFloorId,
  setActiveFloorId,
  undo,
  redo,
  canUndo,
  canRedo,
  saveLayout,
  publishLayout,
  previewMode,
  setPreviewMode,
  showSettingsMenu,
  saving = false,
  layoutEditMode,
  setLayoutEditMode
}) => {
  return (
    <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 text-white">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors" title="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold tracking-tight">
              {readOnly ? 'Digital Twin Replica' : 'Digital Twin Builder'}
            </h1>
            {!readOnly && (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                Draft v{project.version}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">{mallName}</p>
        </div>
      </div>

      {/* Center/Right */}
      <div className="flex items-center gap-3">
        {saving && (
          <span className="flex items-center gap-2 text-xs text-slate-400 mr-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving...
          </span>
        )}

        <select 
          value={activeFloorId} 
          onChange={(event) => setActiveFloorId(event.target.value)} 
          className="h-8 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold outline-none focus:border-slate-700"
        >
          {project.floors.map((floor) => (
            <option key={floor.id} value={floor.id}>{floor.name}</option>
          ))}
        </select>

        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
          <button 
            onClick={() => setPreviewMode('2D')}
            className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors", previewMode === '2D' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200")}
          >
            2D
          </button>
          <button 
            onClick={() => setPreviewMode('3D')}
            className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors", previewMode === '3D' ? "bg-emerald-900 text-emerald-400" : "text-slate-400 hover:text-slate-200")}
          >
            3D
          </button>
        </div>

        {!readOnly && (
          <>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            
                        {setLayoutEditMode && (
              <button 
                onClick={() => setLayoutEditMode(!layoutEditMode)} 
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors border", layoutEditMode ? "border-brand-500/50 bg-brand-500/10 text-brand-400" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700")}
              >
                {layoutEditMode ? 'Lock Layout (View Mode)' : 'Edit Layout'}
              </button>
            )}
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button onClick={undo} disabled={!canUndo} className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors" title="Undo">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors" title="Redo">
              <RotateCw className="h-4 w-4" />
            </button>
            
            <button onClick={showSettingsMenu} className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Settings">
              <Settings className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button 
              onClick={saveLayout} 
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              Save Draft
            </button>
            <button 
              onClick={publishLayout} 
              className="inline-flex h-8 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-900/20"
            >
              Publish
            </button>
          </>
        )}
      </div>
    </div>
  );
};
