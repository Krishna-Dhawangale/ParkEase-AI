import { motion } from 'framer-motion';
import {
  MousePointer2,
  Hand,
  Plus,
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Download,
  Upload,
  Maximize2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export type ToolType = 'select' | 'pan' | 'add' | 'delete';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onImport: () => void;
}

const tools: { id: ToolType; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'pan', icon: Hand, label: 'Pan', shortcut: 'H' },
  { id: 'add', icon: Plus, label: 'Add Slot', shortcut: 'A' },
  { id: 'delete', icon: Trash2, label: 'Delete', shortcut: 'D' },
];

const Toolbar = ({
  activeTool,
  onToolChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showGrid,
  onToggleGrid,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
}: ToolbarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Tool Selection */}
      <div className="flex items-center gap-0.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                activeTool === tool.id && 'bg-blue-50 text-blue-600 hover:bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10'
              )}
            >
              <Icon className="h-4 w-4" />
              {activeTool === tool.id && (
                <motion.div
                  layoutId="active-tool"
                  className="absolute inset-0 rounded-lg border-2 border-blue-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        <div className="mx-2 h-5 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Undo/Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>

      {/* Center: Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={onZoomOut}
          title="Zoom Out (-)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomReset}
          title="Reset Zoom"
          className="flex h-8 items-center justify-center rounded-lg px-2 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          title="Zoom In (+)"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="mx-2 h-5 w-px bg-slate-200 dark:bg-slate-700" />

        <button
          onClick={onToggleGrid}
          title="Toggle Grid (G)"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
            showGrid && 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
          )}
        >
          <Grid3X3 className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomReset}
          title="Fit to Screen"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Right: Import/Export */}
      <div className="flex items-center gap-1">
        <button
          onClick={onImport}
          title="Import Layout"
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          onClick={onExport}
          title="Export Layout"
          className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition-all hover:bg-blue-700"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Toolbar;
