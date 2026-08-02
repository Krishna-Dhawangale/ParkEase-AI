import React, { useRef, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import type { TwinBuilderProject } from '../data';
import { Plus, Trash2 } from 'lucide-react';

interface FloorNavigatorProps {
  project: TwinBuilderProject;
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  addFloor: () => void;
  deleteFloor: (id: string) => void;
  layoutEditMode: boolean;
  readOnly?: boolean;
}

export const FloorNavigator: React.FC<FloorNavigatorProps> = ({
  project,
  activeFloorId,
  setActiveFloorId,
  addFloor,
  deleteFloor,
  layoutEditMode,
  readOnly
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 overflow-x-auto overflow-y-hidden p-1.5 custom-scrollbar bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 shadow-2xl"
    >
      {!readOnly && layoutEditMode && (
        <button 
          onClick={addFloor}
          title="Add new floor"
          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-slate-800 text-brand-400 hover:bg-brand-500 hover:text-white transition-all ml-1 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
        </button>
      )}

      {project.floors.map((floor) => {
        const isActive = activeFloorId === floor.id;
        return (
          <div
            key={floor.id}
            className={cn(
              "flex items-center shrink-0 rounded-full transition-all border group",
              isActive
                ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/20"
                : "bg-slate-800 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
            )}
          >
            <button
              onClick={() => setActiveFloorId(floor.id)}
              className="flex items-center px-4 h-8 text-[11px] font-semibold whitespace-nowrap outline-none"
            >
              {floor.name}
            </button>
            {!readOnly && layoutEditMode && project.floors.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete ${floor.name}?`)) {
                    deleteFloor(floor.id);
                  }
                }}
                className={cn(
                  "flex items-center justify-center w-6 h-6 mr-1 rounded-full hover:bg-rose-500 hover:text-white transition-colors",
                  isActive ? "text-brand-100" : "text-slate-500 opacity-0 group-hover:opacity-100"
                )}
                title="Delete floor"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
