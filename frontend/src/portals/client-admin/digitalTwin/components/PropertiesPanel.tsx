import React from 'react';
import { cn } from '../../../../lib/utils';
import type { TwinCanvasObject } from '../data';
import { Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selected: TwinCanvasObject | null;
  updateObject: (id: string, updates: Partial<TwinCanvasObject>, message?: string) => void;
  deleteSelected: () => void;
  layoutEditMode: boolean;
  readOnly?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selected,
  updateObject,
  deleteSelected,
  layoutEditMode,
  readOnly
}) => {
  if (!layoutEditMode) return null;

  return (
    <div className="flex w-[220px] flex-col bg-[#0b101a] border-l border-slate-800/80 p-3 text-slate-300 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar shadow-2xl z-20">
      <div className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
        Properties
      </div>
      
      {!selected ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center px-4 opacity-50">
          <div className="w-12 h-12 rounded-full border border-dashed border-slate-600 mb-3 flex items-center justify-center">
            <div className="w-3 h-3 bg-slate-700 rounded-sm rotate-45" />
          </div>
          <p className="text-[11px] leading-relaxed">Select an object on the canvas to view or edit.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Main Info */}
          <div>
            <h3 className="text-xs font-bold text-white mb-3 capitalize flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              {selected.type.replace('-', ' ')}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Identifier</label>
                <input
                  type="text"
                  value={selected.name || selected.id}
                  onChange={(e) => updateObject(selected.id, { name: e.target.value })}
                  disabled={readOnly || selected.locked}
                  className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner"
                />
              </div>

              {selected.type.includes('slot') && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                    <select
                      value={selected.status}
                      onChange={(e) => updateObject(selected.id, { status: e.target.value as any })}
                      disabled={readOnly || selected.locked}
                      className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner appearance-none"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                      <option value="disabled">Disabled</option>
                      <option value="ev">EV Charging</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Shape</label>
                    <select
                      value={selected.shape || 'rectangle'}
                      onChange={(e) => updateObject(selected.id, { shape: e.target.value as any })}
                      disabled={readOnly || selected.locked}
                      className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner appearance-none"
                    >
                      <option value="rectangle">Rectangle (Default)</option>
                      <option value="circle">Circle / Oval</option>
                      <option value="diamond">Diamond</option>
                      <option value="hexagon">Hexagon</option>
                      <option value="custom">Custom Shape</option>
                    </select>
                  </div>
                  {selected.shape === 'custom' && (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Custom Path (CSS clip-path)</label>
                      <input
                        type="text"
                        placeholder="e.g. polygon(50% 0, 100% 100%, 0 100%)"
                        value={selected.customShapePath || ''}
                        onChange={(e) => updateObject(selected.id, { customShapePath: e.target.value })}
                        disabled={readOnly || selected.locked}
                        className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner font-mono text-[10px]"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-800/50 w-full" />

          {/* Position & Size */}
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3">Geometry</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex bg-slate-900/50 rounded border border-slate-700/60 overflow-hidden focus-within:border-brand-500 transition-colors">
                <span className="bg-slate-800/50 text-slate-400 text-[10px] font-bold px-2 py-1.5 flex items-center border-r border-slate-700/60">X</span>
                <input
                  type="number"
                  value={Math.round(selected.x)}
                  onChange={(e) => updateObject(selected.id, { x: Number(e.target.value) })}
                  disabled={readOnly || selected.locked}
                  className="w-full bg-transparent px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex bg-slate-900/50 rounded border border-slate-700/60 overflow-hidden focus-within:border-brand-500 transition-colors">
                <span className="bg-slate-800/50 text-slate-400 text-[10px] font-bold px-2 py-1.5 flex items-center border-r border-slate-700/60">Y</span>
                <input
                  type="number"
                  value={Math.round(selected.y)}
                  onChange={(e) => updateObject(selected.id, { y: Number(e.target.value) })}
                  disabled={readOnly || selected.locked}
                  className="w-full bg-transparent px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex bg-slate-900/50 rounded border border-slate-700/60 overflow-hidden focus-within:border-brand-500 transition-colors">
                <span className="bg-slate-800/50 text-slate-400 text-[10px] font-bold px-2 py-1.5 flex items-center border-r border-slate-700/60">W</span>
                <input
                  type="number"
                  value={Math.round(selected.width)}
                  onChange={(e) => updateObject(selected.id, { width: Math.max(10, Number(e.target.value)) })}
                  disabled={readOnly || selected.locked}
                  className="w-full bg-transparent px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex bg-slate-900/50 rounded border border-slate-700/60 overflow-hidden focus-within:border-brand-500 transition-colors">
                <span className="bg-slate-800/50 text-slate-400 text-[10px] font-bold px-2 py-1.5 flex items-center border-r border-slate-700/60">H</span>
                <input
                  type="number"
                  value={Math.round(selected.height)}
                  onChange={(e) => updateObject(selected.id, { height: Math.max(10, Number(e.target.value)) })}
                  disabled={readOnly || selected.locked}
                  className="w-full bg-transparent px-2 py-1.5 text-xs text-white outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Rotation</span>
                <span className="text-brand-400">{selected.rotation}&deg;</span>
              </label>
              <input
                type="range"
                min="0"
                max="359"
                value={selected.rotation || 0}
                onChange={(e) => updateObject(selected.id, { rotation: Number(e.target.value) })}
                disabled={readOnly || selected.locked}
                className="w-full accent-brand-500 disabled:opacity-50 h-1.5 bg-slate-800 rounded-lg appearance-none outline-none"
              />
            </div>
          </div>

          <div className="h-px bg-slate-800/50 w-full" />
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3">State</h3>
              <label className="flex items-center justify-between cursor-pointer group" onClick={() => updateObject(selected.id, { locked: !selected.locked })}>
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Lock Item</span>
                <div className={cn("w-7 h-4 rounded-full transition-colors relative", selected.locked ? 'bg-amber-500' : 'bg-slate-700')}>
                  <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform shadow-sm", selected.locked ? 'translate-x-3.5 right-0.5' : 'left-0.5')} />
                </div>
              </label>
            </div>

          {selected.type.includes('slot') && (
            <>
              <div className="h-px bg-slate-800/50 w-full" />
              <div>
                <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3">Toggles</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer group" onClick={() => { if (!readOnly && !selected.locked) updateObject(selected.id, { status: selected.status === 'ev' ? 'available' : 'ev' }) }}>
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">EV Charging</span>
                    <div className={cn("w-7 h-4 rounded-full transition-colors relative", selected.status === 'ev' ? 'bg-brand-500' : 'bg-slate-700')}>
                      <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform shadow-sm", selected.status === 'ev' ? 'translate-x-3.5 right-0.5' : 'left-0.5')} />
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group" onClick={() => { if (!readOnly && !selected.locked) updateObject(selected.id, { status: selected.status === 'disabled' ? 'available' : 'disabled' }) }}>
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Disabled</span>
                    <div className={cn("w-7 h-4 rounded-full transition-colors relative", selected.status === 'disabled' ? 'bg-rose-500' : 'bg-slate-700')}>
                      <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform shadow-sm", selected.status === 'disabled' ? 'translate-x-3.5 right-0.5' : 'left-0.5')} />
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="mt-auto pt-4 border-t border-slate-800/50">
            <button
              onClick={deleteSelected} disabled={readOnly || selected.locked}
              className="flex w-full items-center justify-center gap-2 py-2 rounded border border-rose-900/50 text-rose-500 text-xs font-bold hover:bg-rose-950/40 hover:border-rose-800 hover:text-rose-400 transition-all group disabled:opacity-50 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              Delete Object
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
