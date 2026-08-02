import { create } from 'zustand';
import type { LiveSlotData, ParkingLayoutJSON } from './types';

interface DigitalTwinState {
  layout: ParkingLayoutJSON | null;
  liveData: Record<string, LiveSlotData>;
  hoveredSlotId: string | null;
  selectedSlotId: string | null;
  viewMode: '3D' | '2D';
  filters: {
    Available: boolean;
    Occupied: boolean;
    Reserved: boolean;
    EV: boolean;
    Disabled: boolean;
  };
  layers: {
    Slots: boolean;
    Roads: boolean;
    Walkways: boolean;
    CCTV: boolean;
    Trees: boolean;
    EV: boolean;
    Labels: boolean;
  };
  cameraTarget: [number, number, number] | null;
  
  setLayout: (layout: ParkingLayoutJSON) => void;
  updateLiveData: (data: LiveSlotData[]) => void;
  setHoveredSlot: (id: string | null) => void;
  setSelectedSlot: (id: string | null) => void;
  setViewMode: (mode: '3D' | '2D') => void;
  toggleFilter: (filter: keyof DigitalTwinState['filters']) => void;
  toggleLayer: (layer: keyof DigitalTwinState['layers']) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
}

export const useDigitalTwinStore = create<DigitalTwinState>((set) => ({
  layout: null,
  liveData: {},
  hoveredSlotId: null,
  selectedSlotId: null,
  viewMode: '3D',
  filters: {
    Available: true,
    Occupied: true,
    Reserved: true,
    EV: true,
    Disabled: true,
  },
  layers: {
    Slots: true,
    Roads: true,
    Walkways: true,
    CCTV: true,
    Trees: true,
    EV: true,
    Labels: true,
  },
  cameraTarget: null,

  setLayout: (layout) => set({ layout }),
  updateLiveData: (data) => set((state) => {
    const newData = { ...state.liveData };
    data.forEach(slot => { newData[slot.id] = slot; });
    return { liveData: newData };
  }),
  setHoveredSlot: (id) => set({ hoveredSlotId: id }),
  setSelectedSlot: (id) => set({ selectedSlotId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFilter: (filter) => set((state) => ({
    filters: { ...state.filters, [filter]: !state.filters[filter] }
  })),
  toggleLayer: (layer) => set((state) => ({
    layers: { ...state.layers, [layer]: !state.layers[layer] }
  })),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
