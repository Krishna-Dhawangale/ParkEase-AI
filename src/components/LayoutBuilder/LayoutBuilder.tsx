import React, { useState, useCallback, useMemo } from 'react';
import type { ParkingLayout, SlotStatus, ParkingSlot } from '../../types/models';

interface LayoutBuilderProps {
  initialLayout?: ParkingLayout;
  onSave?: (layout: ParkingLayout) => void;
}

type ToolType = 'SLOT' | 'WALL' | 'LANE' | 'ENTRY' | 'EXIT' | 'ERASER';

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ 
  initialLayout, 
  onSave 
}) => {
  const [gridSize, setGridSize] = useState({ width: 15, height: 10 });
  const [selectedTool, setSelectedTool] = useState<ToolType>('SLOT');
  const [selectedSlotStatus, setSelectedSlotStatus] = useState<SlotStatus>('AVAILABLE');
  
  // State for the grid cells
  const [cells, setCells] = useState<Record<string, any>>(() => {
    const initialCells: Record<string, any> = {};
    if (initialLayout) {
      setGridSize({ width: initialLayout.width, height: initialLayout.height });
      initialLayout.slots.forEach(slot => {
        initialCells[`${slot.x},${slot.y}`] = { type: 'SLOT', slot };
      });
      initialLayout.obstacles.forEach(obs => {
        initialCells[`${obs.x},${obs.y}`] = { type: obs.type, obstacle: obs };
      });
    }
    return initialCells;
  });

  const [isDrawing, setIsDrawing] = useState(false);

  const handleCellInteract = useCallback((x: number, y: number) => {
    setCells(prev => {
      const key = `${x},${y}`;
      const next = { ...prev };

      if (selectedTool === 'ERASER') {
        delete next[key];
        return next;
      }

      if (selectedTool === 'SLOT') {
        next[key] = {
          type: 'SLOT',
          slot: {
            id: `slot-${Date.now()}-${x}-${y}`,
            name: `${String.fromCharCode(65 + y)}${x}`,
            status: selectedSlotStatus,
            type: 'STANDARD',
            x, y, w: 1, h: 1
          }
        };
      } else {
        next[key] = {
          type: selectedTool,
          obstacle: {
            id: `obs-${Date.now()}-${x}-${y}`,
            type: selectedTool,
            x, y, w: 1, h: 1
          }
        };
      }
      return next;
    });
  }, [selectedTool, selectedSlotStatus]);

  const handlePointerDown = (x: number, y: number) => {
    setIsDrawing(true);
    handleCellInteract(x, y);
  };

  const handlePointerEnter = (x: number, y: number) => {
    if (isDrawing) {
      handleCellInteract(x, y);
    }
  };

  const handlePointerUp = () => setIsDrawing(false);

  const getCellColor = (x: number, y: number) => {
    const cell = cells[`${x},${y}`];
    if (!cell) return 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-30';
    
    if (cell.type === 'SLOT') {
      const statusColors: Record<SlotStatus, string> = {
        AVAILABLE: 'bg-green-500',
        OCCUPIED: 'bg-red-500',
        RESERVED: 'bg-yellow-500',
        BLOCKED: 'bg-gray-400',
        MAINTENANCE: 'bg-orange-500',
        DISABLED: 'bg-purple-500',
        EV_CHARGING: 'bg-blue-500',
        VIP: 'bg-amber-400'
      };
      return `${statusColors[cell.slot.status as SlotStatus]} text-white`;
    }
    
    switch (cell.type) {
      case 'WALL': return 'bg-slate-800';
      case 'LANE': return 'bg-slate-300';
      case 'ENTRY': return 'bg-emerald-600 flex items-center justify-center text-white text-xs';
      case 'EXIT': return 'bg-rose-600 flex items-center justify-center text-white text-xs';
      default: return 'bg-transparent';
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    
    const layout: ParkingLayout = {
      width: gridSize.width,
      height: gridSize.height,
      slots: [],
      obstacles: []
    };

    Object.values(cells).forEach(cell => {
      if (cell.type === 'SLOT') {
        layout.slots.push(cell.slot);
      } else {
        layout.obstacles.push(cell.obstacle);
      }
    });

    onSave(layout);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 h-full" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      {/* Toolbox */}
      <div className="w-full md:w-64 bg-white dark:bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Grid Size</h3>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={gridSize.width} 
              onChange={e => setGridSize(s => ({ ...s, width: Number(e.target.value) || 1 }))}
              className="input-field w-20"
              min="5" max="50"
            />
            <span className="flex items-center">x</span>
            <input 
              type="number" 
              value={gridSize.height} 
              onChange={e => setGridSize(s => ({ ...s, height: Number(e.target.value) || 1 }))}
              className="input-field w-20"
              min="5" max="50"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['SLOT', 'WALL', 'LANE', 'ENTRY', 'EXIT', 'ERASER'] as ToolType[]).map(tool => (
              <button
                key={tool}
                onClick={() => setSelectedTool(tool)}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  selectedTool === tool 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {selectedTool === 'SLOT' && (
          <div>
            <h3 className="font-semibold mb-3">Slot Status</h3>
            <select 
              value={selectedSlotStatus}
              onChange={e => setSelectedSlotStatus(e.target.value as SlotStatus)}
              className="input-field w-full"
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="BLOCKED">Blocked</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="DISABLED">Disabled</option>
              <option value="EV_CHARGING">EV Charging</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--color-border)]">
          <button onClick={handleSave} className="btn-primary w-full">Save Layout</button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 rounded-xl border border-[var(--color-border)] flex items-center justify-center p-8">
        <div 
          className="grid gap-[2px] bg-gray-300 dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-700"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 40px)`,
            gridTemplateRows: `repeat(${gridSize.height}, 40px)`,
            touchAction: 'none' // prevent scrolling while painting on touch devices
          }}
        >
          {Array.from({ length: gridSize.height }).map((_, y) => (
            Array.from({ length: gridSize.width }).map((_, x) => {
              const cell = cells[`${x},${y}`];
              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-10 h-10 border border-black/5 cursor-pointer transition-colors ${getCellColor(x, y)}`}
                  onPointerDown={(e) => {
                    // Only start drawing on primary click (usually left click)
                    if (e.isPrimary) {
                      e.currentTarget.releasePointerCapture(e.pointerId); // Allows pointerenter to fire on other elements
                      handlePointerDown(x, y);
                    }
                  }}
                  onPointerEnter={(e) => {
                    if (e.buttons === 1 || e.buttons === 32) { // 1 is left click, 32 is pen contact
                      handlePointerEnter(x, y);
                    }
                  }}
                  title={cell?.type === 'SLOT' ? cell.slot.name : ''}
                >
                  {cell?.type === 'ENTRY' && 'EN'}
                  {cell?.type === 'EXIT' && 'EX'}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};
