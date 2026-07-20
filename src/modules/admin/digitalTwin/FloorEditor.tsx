import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slotStatusConfig, type ParkingFloor, type ParkingSlot, type SlotStatus } from './data';
import type { ToolType } from './Toolbar';
import { cn } from '../../../lib/utils';

interface FloorEditorProps {
  floor: ParkingFloor;
  activeTool: ToolType;
  zoom: number;
  showGrid: boolean;
  selectedSlotId: string | null;
  onSelectSlot: (slot: ParkingSlot | null) => void;
  onUpdateSlot: (slotId: string, updates: Partial<ParkingSlot>) => void;
  onDeleteSlot: (slotId: string) => void;
  onAddSlot: (row: number, col: number) => void;
}

const SLOT_SIZE = 52;
const SLOT_GAP = 6;
const PADDING = 32;

const FloorEditor = ({
  floor,
  activeTool,
  zoom,
  showGrid,
  selectedSlotId,
  onSelectSlot,
  onUpdateSlot,
  onDeleteSlot,
  onAddSlot,
}: FloorEditorProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const canvasWidth = floor.cols * (SLOT_SIZE + SLOT_GAP) + PADDING * 2;
  const canvasHeight = floor.rows * (SLOT_SIZE + SLOT_GAP) + PADDING * 2;

  const handleSlotClick = useCallback((slot: ParkingSlot) => {
    if (activeTool === 'select') {
      onSelectSlot(selectedSlotId === slot.id ? null : slot);
    } else if (activeTool === 'delete') {
      onDeleteSlot(slot.id);
    }
  }, [activeTool, selectedSlotId, onSelectSlot, onDeleteSlot]);

  const handleEmptyCellClick = useCallback((row: number, col: number) => {
    if (activeTool === 'add') {
      onAddSlot(row, col);
    } else {
      onSelectSlot(null);
    }
  }, [activeTool, onAddSlot, onSelectSlot]);

  // Build a lookup map for quick access
  const slotMap = new Map<string, ParkingSlot>();
  floor.slots.forEach(s => slotMap.set(`${s.row}-${s.col}`, s));

  const rowLabels = 'ABCDEFGHIJKLMNOP';

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-auto bg-slate-50 dark:bg-slate-950/50"
    >
      {/* Canvas */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        <div
          className="relative"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {/* Grid Background */}
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={canvasWidth}
              height={canvasHeight}
            >
              <defs>
                <pattern
                  id="grid"
                  width={SLOT_SIZE + SLOT_GAP}
                  height={SLOT_SIZE + SLOT_GAP}
                  patternUnits="userSpaceOnUse"
                  x={PADDING}
                  y={PADDING}
                >
                  <rect width={SLOT_SIZE + SLOT_GAP} height={SLOT_SIZE + SLOT_GAP} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* Row Labels */}
          {Array.from({ length: floor.rows }).map((_, r) => (
            <div
              key={`row-${r}`}
              className="absolute flex items-center justify-center text-[10px] font-bold text-slate-300 dark:text-slate-600"
              style={{
                left: PADDING - 20,
                top: PADDING + r * (SLOT_SIZE + SLOT_GAP) + SLOT_SIZE / 2 - 6,
                width: 16,
                height: 12,
              }}
            >
              {rowLabels[r]}
            </div>
          ))}

          {/* Column Labels */}
          {Array.from({ length: floor.cols }).map((_, c) => (
            <div
              key={`col-${c}`}
              className="absolute flex items-center justify-center text-[10px] font-bold text-slate-300 dark:text-slate-600"
              style={{
                left: PADDING + c * (SLOT_SIZE + SLOT_GAP) + SLOT_SIZE / 2 - 8,
                top: PADDING - 18,
                width: 16,
                height: 12,
              }}
            >
              {String(c + 1).padStart(2, '0')}
            </div>
          ))}

          {/* Slot Grid */}
          {Array.from({ length: floor.rows }).map((_, r) =>
            Array.from({ length: floor.cols }).map((_, c) => {
              const slot = slotMap.get(`${r}-${c}`);
              const x = PADDING + c * (SLOT_SIZE + SLOT_GAP);
              const y = PADDING + r * (SLOT_SIZE + SLOT_GAP);

              if (!slot) {
                // Empty cell — show add hint
                return (
                  <button
                    key={`empty-${r}-${c}`}
                    onClick={() => handleEmptyCellClick(r, c)}
                    className={cn(
                      'absolute rounded-lg border-2 border-dashed transition-all',
                      activeTool === 'add'
                        ? 'border-blue-300 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-100/50 cursor-crosshair dark:border-blue-600 dark:bg-blue-500/5 dark:hover:bg-blue-500/10'
                        : 'border-slate-200 bg-transparent dark:border-slate-800'
                    )}
                    style={{ left: x, top: y, width: SLOT_SIZE, height: SLOT_SIZE }}
                  />
                );
              }

              const statusConf = slotStatusConfig[slot.status];
              const isSelected = selectedSlotId === slot.id;
              const isHovered = hoveredSlot === slot.id;

              return (
                <motion.button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  onMouseEnter={() => setHoveredSlot(slot.id)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, delay: (r * floor.cols + c) * 0.003 }}
                  className={cn(
                    'absolute flex flex-col items-center justify-center rounded-lg border-2 transition-all',
                    activeTool === 'delete' && 'cursor-not-allowed hover:opacity-50',
                    activeTool === 'select' && 'cursor-pointer',
                    isSelected && 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-950',
                    slot.sensor === 'offline' && 'opacity-60'
                  )}
                  style={{
                    left: x,
                    top: y,
                    width: SLOT_SIZE,
                    height: SLOT_SIZE,
                    backgroundColor: statusConf.bg,
                    borderColor: isSelected ? '#3B82F6' : statusConf.border,
                    boxShadow: isHovered ? `0 0 0 3px ${statusConf.color}20` : 'none',
                  }}
                >
                  <span className="text-[10px] font-bold" style={{ color: statusConf.color }}>
                    {slot.label}
                  </span>
                  {slot.status === 'occupied' && (
                    <span className="mt-0.5 text-[7px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[42px]">
                      {slot.vehiclePlate?.split(' ').slice(-1)[0]}
                    </span>
                  )}
                  {slot.sensor === 'offline' && (
                    <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-rose-500 dark:border-slate-900" />
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Tooltip for hovered slot */}
      <AnimatePresence>
        {hoveredSlot && activeTool === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            {(() => {
              const slot = floor.slots.find(s => s.id === hoveredSlot);
              if (!slot) return null;
              const conf = slotStatusConfig[slot.status];
              return (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: conf.color }} />
                    <span className="font-semibold text-slate-900 dark:text-white">{slot.label}</span>
                  </div>
                  <span className="text-slate-400">·</span>
                  <span className={conf.textClass}>{conf.label}</span>
                  {slot.vehiclePlate && (
                    <>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{slot.vehiclePlate}</span>
                    </>
                  )}
                  <span className="text-slate-400">·</span>
                  <span className={slot.sensor === 'online' ? 'text-emerald-500' : 'text-rose-500'}>
                    Sensor {slot.sensor}
                  </span>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloorEditor;
