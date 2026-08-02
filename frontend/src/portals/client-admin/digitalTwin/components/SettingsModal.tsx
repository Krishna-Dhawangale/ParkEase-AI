import React from 'react';
import { cn } from '../../../../lib/utils';
import { Eye, EyeOff, Lock, Unlock, ShieldAlert, Download, Upload, Zap, Layers, History, X } from 'lucide-react';
import type { BuilderSnapshot, TwinBuilderProject } from '../data';

interface SettingsModalProps {
  onClose: () => void;
  versionHistory: BuilderSnapshot[];
  restoreSnapshot: (snapshot: BuilderSnapshot) => void;
  layerNames: string[];
  hiddenLayers: string[];
  setHiddenLayers: React.Dispatch<React.SetStateAction<string[]>>;
  lockedLayers: string[];
  setLockedLayers: React.Dispatch<React.SetStateAction<string[]>>;
  validation: string[];
  generateParkingLayout: () => void;
  triggerImport: () => void;
  exportJson: () => void;
  project: TwinBuilderProject;
  updateCanvasSettings?: (updates: Partial<TwinBuilderProject['canvas']>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  versionHistory,
  restoreSnapshot,
  layerNames,
  hiddenLayers,
  setHiddenLayers,
  lockedLayers,
  setLockedLayers,
  validation,
  generateParkingLayout,
  triggerImport,
  exportJson,
  project,
  updateCanvasSettings
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-[800px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold">Digital Twin Settings</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              
              {/* Layers */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Layers</h3>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2 space-y-1">
                  {layerNames.map((layer) => {
                    const hidden = hiddenLayers.includes(layer);
                    const locked = lockedLayers.includes(layer);
                    return (
                      <div key={layer} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-800/50 transition-colors">
                        <span>{layer}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setHiddenLayers((items) => hidden ? items.filter((item) => item !== layer) : [...items, layer])} 
                            className={cn("p-1.5 rounded-md transition-colors", hidden ? "bg-slate-800 text-slate-400" : "text-emerald-400 hover:bg-slate-800")}
                            title={hidden ? "Show Layer" : "Hide Layer"}
                          >
                            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => setLockedLayers((items) => locked ? items.filter((item) => item !== layer) : [...items, layer])} 
                            className={cn("p-1.5 rounded-md transition-colors", locked ? "bg-slate-800 text-slate-400" : "text-blue-400 hover:bg-slate-800")}
                            title={locked ? "Unlock Layer" : "Lock Layer"}
                          >
                            {locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Canvas Settings */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Canvas Layout</h3>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Canvas Shape</label>
                    <select
                      value={project.canvas.shape || 'rectangle'}
                      onChange={(e) => updateCanvasSettings && updateCanvasSettings({ shape: e.target.value as any })}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="rectangle">Rectangle (Standard)</option>
                      <option value="circle">Circular</option>
                      <option value="diamond">Diamond</option>
                      <option value="hexagon">Hexagon</option>
                      <option value="custom">Custom Polygon</option>
                    </select>
                  </div>
                  {project.canvas.shape === 'custom' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">CSS clip-path Polygon</label>
                      <input
                        type="text"
                        placeholder="e.g. polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                        value={project.canvas.customShapePath || ''}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ customShapePath: e.target.value })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono outline-none"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={project.canvas.width}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ width: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={project.canvas.height}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ height: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Data & Export */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4 text-brand-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Data Management</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={exportJson} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold hover:bg-slate-700 transition-colors">
                    <Download className="h-4 w-4" /> Export JSON
                  </button>
                  <button onClick={triggerImport} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold hover:bg-slate-700 transition-colors">
                    <Upload className="h-4 w-4" /> Import JSON
                  </button>
                  <button onClick={generateParkingLayout} className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-950/30 border border-emerald-900/50 px-4 py-3 text-sm font-bold text-emerald-400 hover:bg-emerald-900/40 transition-colors">
                    <Zap className="h-4 w-4" /> Auto-Generate Layout
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Validation */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Smart Validation</h3>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  {validation.length > 0 ? (
                    <div className="space-y-2">
                      {validation.map((warning) => (
                        <div key={warning} className="flex gap-3 rounded-lg bg-amber-950/30 p-3 text-xs font-medium text-amber-200 border border-amber-900/30">
                          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" /> {warning}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-emerald-950/30 p-4 text-center text-xs font-bold text-emerald-400 border border-emerald-900/30">
                      No validation issues detected. Layout is optimal.
                    </div>
                  )}
                </div>
              </section>

              {/* Version History */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-brand-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Version History</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{versionHistory.length} saved</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2 space-y-1 max-h-[240px] overflow-y-auto">
                  {versionHistory.map((snapshot) => (
                    <button
                      key={snapshot.id}
                      onClick={() => restoreSnapshot(snapshot)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-brand-950/30 hover:text-brand-300 group"
                    >
                      <div>
                        <p className="text-sm font-bold group-hover:text-brand-300">Version {snapshot.version}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{snapshot.label}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {new Date(snapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  ))}
                  {versionHistory.length === 0 && (
                    <div className="p-6 text-center text-xs font-medium text-slate-500">
                      Auto-saved versions will appear here.
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
