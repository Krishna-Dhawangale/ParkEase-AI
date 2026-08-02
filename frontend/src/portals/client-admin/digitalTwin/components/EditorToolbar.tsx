import React from 'react';
import { cn } from '../../../../lib/utils';
import {
  MousePointer2, Move, Box, Hand, ParkingSquare, Grid3X3, DoorOpen, Camera, Sparkles, Type, Trash2
} from 'lucide-react';
import { componentPalette } from '../data';

export type ToolMode = 'select' | 'move' | 'wall' | 'road' | 'slot' | 'zone' | 'gate' | 'camera' | 'object' | 'text';

interface EditorToolbarProps {
  tool: ToolMode;
  setTool: (tool: ToolMode) => void;
  deleteSelected: () => void;
  hasSelection: boolean;
  layoutEditMode: boolean;
}

const toolItems: { id: ToolMode; label: string; icon: React.ElementType; shortcut?: string }[] = [
  { id: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { id: 'move', label: 'Move', icon: Move, shortcut: 'M' },
  { id: 'wall', label: 'Draw Wall', icon: Box },
  { id: 'road', label: 'Road', icon: Hand },
  { id: 'text', label: 'Add Text', icon: Type, shortcut: 'T' },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  tool,
  setTool,
  deleteSelected,
  hasSelection,
  layoutEditMode
}) => {
  if (!layoutEditMode) return null;

  return (
    <div className="flex w-[200px] flex-col bg-slate-900 border-r border-slate-800 p-3 text-white overflow-y-auto overscroll-contain overflow-x-hidden custom-scrollbar">
      <div className="mb-4 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Tools</div>
      <div className="flex flex-col gap-1">
        {toolItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTool(item.id)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all text-left",
              tool === item.id 
                ? "bg-brand-600 text-white shadow-md shadow-brand-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && (
              <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                {item.shortcut}
              </span>
            )}
          </button>
        ))}

        <div className="my-4 border-t border-slate-800" />
        
        <button
          onClick={deleteSelected}
          disabled={!hasSelection}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all text-left text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <div className="mt-8">
        <div className="mb-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Components (Drag & Drop)</div>
        <div className="grid grid-cols-3 gap-1.5">
          {componentPalette.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/parkease-component', item.type);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              className="flex flex-col items-center justify-center gap-1 rounded-md border border-slate-800/80 bg-slate-900/50 p-1.5 hover:border-brand-500 hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing group"
              title={`Drag ${item.label} to canvas`}
            >
              <div 
                className="w-6 h-6 rounded-sm shadow-sm text-[10px] border border-slate-700 group-hover:border-brand-400 group-hover:shadow-brand-500/20 transition-all flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: item.fill, color: item.stroke }}
              >
                {/* Fallback visual indicator for components without icons */}
                {item.type.includes('gate') ? 'G' : item.type.includes('slot') ? 'P' : item.type.includes('camera') ? 'C' : ''}
              </div>
              <span className="text-[9px] font-semibold text-slate-500 text-center leading-[1.1] w-full truncate px-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pb-4">
        <div className="mb-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Legend</div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Occupied</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Reserved</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Disabled</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> EV</div>
        </div>
      </div>
    </div>
  );
};
