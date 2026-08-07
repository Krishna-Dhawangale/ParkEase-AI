import type { ParkingLayoutJSON, ParkingSlotLayout, RoadLayout, WalkwayLayout, CameraLayout, EVChargerLayout, BuildingLayout } from './types';

function generateSlots(): ParkingSlotLayout[] {
  const slots: ParkingSlotLayout[] = [];
  let idCounter = 1;

  // Reverting to the beautifully composed 4x15 layout that fits perfectly in the Isometric camera
  const startX = -20;
  const startZ = -8;
  const rowSpacing = 6.5;
  const colSpacing = 2.6;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 15; col++) {
      const isEV = row === 3 && col > 11;
      const isDisabled = row === 0 && col < 3;
      let type: 'Regular' | 'EV' | 'Accessible' = 'Regular';
      if (isEV) type = 'EV';
      if (isDisabled) type = 'Accessible';

      slots.push({
        id: `A${idCounter.toString().padStart(2, '0')}`,
        type,
        position: [startX + col * colSpacing, 0, startZ + row * rowSpacing],
        rotation: [0, 0, 0],
      });
      idCounter++;
    }
  }
  return slots;
}

export const mockParkingLayout: ParkingLayoutJSON = {
  building: {
    position: [0, 0, -18],
    size: [16, 8, 8],
    label: 'Main Office'
  },
  roads: [
    // Main horizontal roads
    { id: 'R1', position: [0, -0.01, -12], size: [46, 0.1, 4.5], rotation: [0, 0, 0] },
    { id: 'R2', position: [0, -0.01, 12], size: [46, 0.1, 4.5], rotation: [0, 0, 0] },
    { id: 'R3', position: [0, -0.01, 0], size: [46, 0.1, 4.5], rotation: [0, 0, 0] },
    
    // Vertical connection roads
    { id: 'R4', position: [-20, -0.01, 0], size: [4.5, 0.1, 28], rotation: [0, 0, 0] },
    { id: 'R5', position: [20, -0.01, 0], size: [4.5, 0.1, 28], rotation: [0, 0, 0] },
  ],
  walkways: [
    // Walkway across the main office
    { id: 'W1', position: [0, 0.02, -14.5], size: [16, 0.1, 2], rotation: [0, 0, 0] }
  ],
  gates: [
    { id: 'G1', type: 'Entry', position: [-20, 0, -14], rotation: [0, Math.PI / 2, 0] },
    { id: 'G2', type: 'Exit', position: [-20, 0, 14], rotation: [0, Math.PI / 2, 0] },
  ],
  cameras: [
    { id: 'CCTV-01', position: [-18, 5, -12], rotation: [0, Math.PI / 4, 0], label: 'Entry Cam' },
    { id: 'CCTV-02', position: [0, 5, 0], rotation: [0, 0, 0], label: 'Main Area' },
    { id: 'CCTV-03', position: [-18, 5, 12], rotation: [0, Math.PI - Math.PI / 4, 0], label: 'Exit Cam' },
    { id: 'CCTV-04', position: [18, 5, 0], rotation: [0, -Math.PI / 2, 0], label: 'East Wing' },
  ],
  evChargers: [
    { id: 'EV-1', position: [14, 0, 10.5], rotation: [0, 0, 0] },
    { id: 'EV-2', position: [16.5, 0, 10.5], rotation: [0, 0, 0] },
    { id: 'EV-3', position: [19, 0, 10.5], rotation: [0, 0, 0] },
  ],
  trees: [],
  parkingSlots: generateSlots()
};
