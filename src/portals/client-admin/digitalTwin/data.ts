// ─── Digital Twin Builder – Mock Data & Types ───────────────────────────────────

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'ev' | 'vip' | 'emergency' | 'maintenance';

export interface ParkingSlot {
  id: string;
  label: string;
  row: number;
  col: number;
  status: SlotStatus;
  vehiclePlate?: string;
  sensor: 'online' | 'offline';
  lastUpdated: string;
}

export interface ParkingFloor {
  id: string;
  name: string;
  level: number;
  rows: number;
  cols: number;
  totalSlots: number;
  occupiedSlots: number;
  slots: ParkingSlot[];
}

export interface TwinLayout {
  id: string;
  name: string;
  floors: ParkingFloor[];
  lastSaved: string;
  version: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const slotStatuses: SlotStatus[] = ['available', 'occupied', 'reserved', 'ev', 'vip', 'emergency', 'maintenance'];

const vehicles = [
  'MH 12 AB 1234', 'KA 05 MN 5678', 'DL 01 CA 9012', 'TN 09 BZ 3456',
  'GJ 06 DF 7890', 'RJ 14 GH 2345', 'UP 32 JK 6789', 'MP 09 LM 0123',
  'AP 28 NP 4567', 'WB 74 QR 8901',
];

function generateSlots(rows: number, cols: number, floorId: string): ParkingSlot[] {
  const slots: ParkingSlot[] = [];
  const rowLabels = 'ABCDEFGHIJKLMNOP';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.random();
      let status: SlotStatus;
      if (rand < 0.45) status = 'occupied';
      else if (rand < 0.7) status = 'available';
      else if (rand < 0.8) status = 'reserved';
      else if (rand < 0.87) status = 'ev';
      else if (rand < 0.93) status = 'vip';
      else if (rand < 0.97) status = 'maintenance';
      else status = 'emergency';

      const label = `${rowLabels[r]}${String(c + 1).padStart(2, '0')}`;
      slots.push({
        id: `${floorId}-${label}`,
        label,
        row: r,
        col: c,
        status,
        vehiclePlate: status === 'occupied' ? vehicles[Math.floor(Math.random() * vehicles.length)] : undefined,
        sensor: Math.random() > 0.08 ? 'online' : 'offline',
        lastUpdated: `${Math.floor(Math.random() * 55) + 1} min ago`,
      });
    }
  }
  return slots;
}

// ─── Status Config ──────────────────────────────────────────────────────────────

export const slotStatusConfig: Record<SlotStatus, { label: string; color: string; bg: string; border: string; textClass: string; bgClass: string }> = {
  available:   { label: 'Available',   color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0', textClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500' },
  occupied:    { label: 'Occupied',    color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', textClass: 'text-rose-600 dark:text-rose-400', bgClass: 'bg-rose-500' },
  reserved:    { label: 'Reserved',    color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A', textClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500' },
  ev:          { label: 'EV Charging', color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', textClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-500' },
  vip:         { label: 'VIP',         color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE', textClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-500' },
  emergency:   { label: 'Emergency',   color: '#EA580C', bg: '#FFEDD5', border: '#FED7AA', textClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500' },
  maintenance: { label: 'Maintenance', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB', textClass: 'text-slate-500 dark:text-slate-400', bgClass: 'bg-slate-400' },
};

// ─── Mock Layout ────────────────────────────────────────────────────────────────

function createFloor(id: string, name: string, level: number, rows: number, cols: number): ParkingFloor {
  const slots = generateSlots(rows, cols, id);
  return {
    id,
    name,
    level,
    rows,
    cols,
    totalSlots: slots.length,
    occupiedSlots: slots.filter(s => s.status === 'occupied').length,
    slots,
  };
}

export const mockTwinLayout: TwinLayout = {
  id: 'layout-001',
  name: 'ParkEase Central Complex',
  floors: [
    createFloor('F1', 'Ground Floor', 0, 6, 10),
    createFloor('F2', 'Level 1', 1, 8, 12),
    createFloor('F3', 'Level 2', 2, 5, 8),
    createFloor('F4', 'Rooftop', 3, 4, 6),
  ],
  lastSaved: '5 minutes ago',
  version: 12,
};

export type TwinObjectType =
  | 'parking-slot'
  | 'vip-slot'
  | 'ev-slot'
  | 'bike-slot'
  | 'truck-slot'
  | 'reserved-slot'
  | 'disabled-slot'
  | 'road'
  | 'wall'
  | 'walkway'
  | 'entry-gate'
  | 'exit-gate'
  | 'barrier'
  | 'camera'
  | 'lift'
  | 'stairs'
  | 'fire-exit'
  | 'fire-extinguisher'
  | 'charging-station'
  | 'security-cabin'
  | 'text'
  | 'arrow'
  | 'rectangle'
  | 'circle';

export type TwinObjectStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'vip'
  | 'disabled'
  | 'ev'
  | 'bike'
  | 'truck'
  | 'maintenance'
  | 'emergency'
  | 'walkway'
  | 'no-parking';

export interface TwinCanvasObject {
  id: string;
  type: TwinObjectType;
  name: string;
  layer: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fill: string;
  stroke: string;
  status?: TwinObjectStatus;
  price?: number;
  capacity?: number;
  sensorId?: string;
  cameraId?: string;
  locked?: boolean;
  hidden?: boolean;
  text?: string;
  zIndex: number;
}

export interface TwinFloorPlan {
  id: string;
  name: string;
  level: number;
  objects: TwinCanvasObject[];
}

export interface TwinBuilderProject {
  id: string;
  mallName: string;
  parkingName: string;
  location: string;
  canvas: { width: number; height: number; gridSize: number };
  floors: TwinFloorPlan[];
  activeFloorId: string;
  lastSaved: string;
  version: number;
}

const object = (item: TwinCanvasObject): TwinCanvasObject => item;

export const twinStatusConfig: Record<TwinObjectStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#35b779', bg: '#dcfce7' },
  occupied: { label: 'Occupied', color: '#f05252', bg: '#fee2e2' },
  reserved: { label: 'Reserved', color: '#3b82f6', bg: '#dbeafe' },
  vip: { label: 'VIP', color: '#8b5cf6', bg: '#ede9fe' },
  disabled: { label: 'Disabled', color: '#2563eb', bg: '#dbeafe' },
  ev: { label: 'EV Charging', color: '#22c55e', bg: '#dcfce7' },
  bike: { label: 'Bike Zone', color: '#fb7185', bg: '#ffe4e6' },
  truck: { label: 'Truck', color: '#64748b', bg: '#f1f5f9' },
  maintenance: { label: 'Maintenance', color: '#f59e0b', bg: '#fef3c7' },
  emergency: { label: 'Emergency', color: '#ef4444', bg: '#fee2e2' },
  walkway: { label: 'Walkway', color: '#d1d5db', bg: '#f3f4f6' },
  'no-parking': { label: 'No Parking', color: '#fbbf24', bg: '#fef3c7' },
};

export const componentPalette: {
  type: TwinObjectType;
  label: string;
  layer: string;
  fill: string;
  stroke: string;
  status?: TwinObjectStatus;
  width: number;
  height: number;
}[] = [
  { type: 'parking-slot', label: 'Parking Slot', layer: 'Parking Slots', fill: '#dcfce7', stroke: '#35b779', status: 'available', width: 72, height: 118 },
  { type: 'disabled-slot', label: 'Disabled Slot', layer: 'Parking Slots', fill: '#dbeafe', stroke: '#2563eb', status: 'disabled', width: 92, height: 118 },
  { type: 'ev-slot', label: 'EV Charging Slot', layer: 'Parking Slots', fill: '#dcfce7', stroke: '#22c55e', status: 'ev', width: 72, height: 118 },
  { type: 'vip-slot', label: 'VIP Slot', layer: 'Zones', fill: '#ede9fe', stroke: '#8b5cf6', status: 'vip', width: 124, height: 118 },
  { type: 'bike-slot', label: 'Bike Zone', layer: 'Zones', fill: '#ffe4e6', stroke: '#fb7185', status: 'bike', width: 112, height: 72 },
  { type: 'truck-slot', label: 'Truck Bay', layer: 'Zones', fill: '#f1f5f9', stroke: '#64748b', status: 'truck', width: 150, height: 110 },
  { type: 'reserved-slot', label: 'Reserved Slot', layer: 'Parking Slots', fill: '#dbeafe', stroke: '#3b82f6', status: 'reserved', width: 72, height: 118 },
  { type: 'entry-gate', label: 'Entry Gate', layer: 'Gates', fill: '#ecfdf5', stroke: '#10b981', width: 116, height: 34 },
  { type: 'exit-gate', label: 'Exit Gate', layer: 'Gates', fill: '#fef2f2', stroke: '#ef4444', width: 116, height: 34 },
  { type: 'barrier', label: 'Boom Barrier', layer: 'Gates', fill: '#fef3c7', stroke: '#111827', width: 130, height: 14 },
  { type: 'camera', label: 'Camera', layer: 'Cameras', fill: '#dbeafe', stroke: '#3b82f6', width: 34, height: 34 },
  { type: 'lift', label: 'Lift / Elevator', layer: 'Objects', fill: '#e5e7eb', stroke: '#64748b', width: 78, height: 78 },
  { type: 'stairs', label: 'Staircase', layer: 'Objects', fill: '#f3f4f6', stroke: '#94a3b8', width: 92, height: 132 },
  { type: 'fire-extinguisher', label: 'Fire Extinguisher', layer: 'Objects', fill: '#fee2e2', stroke: '#ef4444', width: 36, height: 58 },
  { type: 'wall', label: 'Wall', layer: 'Walls', fill: '#d1d5db', stroke: '#6b7280', width: 260, height: 22 },
  { type: 'road', label: 'Road', layer: 'Roads', fill: '#e5e7eb', stroke: '#cbd5e1', width: 320, height: 94 },
  { type: 'walkway', label: 'Walkway', layer: 'Zones', fill: '#f3f4f6', stroke: '#d1d5db', status: 'walkway', width: 112, height: 230 },
  { type: 'arrow', label: 'Traffic Arrow', layer: 'Roads', fill: 'transparent', stroke: '#ffffff', width: 72, height: 34 },
  { type: 'text', label: 'Text', layer: 'Texts', fill: 'transparent', stroke: 'transparent', width: 118, height: 38 },
];

const basementObjects: TwinCanvasObject[] = [
  object({ id: 'wall-north', type: 'wall', name: 'North wall', layer: 'Walls', x: 80, y: 40, width: 900, height: 26, rotation: 0, opacity: 1, fill: '#d1d5db', stroke: '#6b7280', zIndex: 1 }),
  object({ id: 'wall-south', type: 'wall', name: 'South wall', layer: 'Walls', x: 80, y: 690, width: 900, height: 26, rotation: 0, opacity: 1, fill: '#d1d5db', stroke: '#6b7280', zIndex: 1 }),
  object({ id: 'wall-west', type: 'wall', name: 'West wall', layer: 'Walls', x: 58, y: 58, width: 26, height: 650, rotation: 0, opacity: 1, fill: '#d1d5db', stroke: '#6b7280', zIndex: 1 }),
  object({ id: 'wall-east', type: 'wall', name: 'East wall', layer: 'Walls', x: 980, y: 58, width: 26, height: 650, rotation: 0, opacity: 1, fill: '#d1d5db', stroke: '#6b7280', zIndex: 1 }),
  object({ id: 'core-lift', type: 'lift', name: 'Lift Lobby', layer: 'Objects', x: 450, y: 300, width: 220, height: 160, rotation: 0, opacity: 1, fill: '#e5e7eb', stroke: '#64748b', text: 'LIFT', zIndex: 3 }),
  object({ id: 'stairs-main', type: 'stairs', name: 'Main Staircase', layer: 'Objects', x: 610, y: 330, width: 110, height: 130, rotation: 0, opacity: 1, fill: '#f8fafc', stroke: '#94a3b8', text: 'STAIRS', zIndex: 4 }),
  object({ id: 'walkway-01', type: 'walkway', name: 'No Parking Walkway', layer: 'Zones', x: 760, y: 295, width: 70, height: 190, rotation: 0, opacity: 1, fill: '#fef3c7', stroke: '#fbbf24', status: 'no-parking', zIndex: 2 }),
  object({ id: 'gate-entry', type: 'entry-gate', name: 'Entry Gate', layer: 'Gates', x: 130, y: 720, width: 105, height: 36, rotation: 0, opacity: 1, fill: '#dcfce7', stroke: '#10b981', text: 'ENTRY', zIndex: 6 }),
  object({ id: 'gate-exit', type: 'exit-gate', name: 'Exit Gate', layer: 'Gates', x: 820, y: 720, width: 105, height: 36, rotation: 0, opacity: 1, fill: '#fee2e2', stroke: '#ef4444', text: 'EXIT', zIndex: 6 }),
  object({ id: 'barrier-entry', type: 'barrier', name: 'Entry Barrier', layer: 'Gates', x: 118, y: 678, width: 120, height: 14, rotation: 0, opacity: 1, fill: '#fef3c7', stroke: '#111827', zIndex: 5 }),
  object({ id: 'camera-north', type: 'camera', name: 'Camera C-01', layer: 'Cameras', x: 520, y: 35, width: 36, height: 36, rotation: 0, opacity: 1, fill: '#dbeafe', stroke: '#3b82f6', cameraId: 'CAM-B1-01', zIndex: 7 }),
  object({ id: 'camera-west', type: 'camera', name: 'Camera C-02', layer: 'Cameras', x: 62, y: 355, width: 36, height: 36, rotation: 0, opacity: 1, fill: '#dbeafe', stroke: '#3b82f6', cameraId: 'CAM-B1-02', zIndex: 7 }),
  object({ id: 'camera-south', type: 'camera', name: 'Camera C-03', layer: 'Cameras', x: 545, y: 690, width: 36, height: 36, rotation: 0, opacity: 1, fill: '#dbeafe', stroke: '#3b82f6', cameraId: 'CAM-B1-03', zIndex: 7 }),
  object({ id: 'disabled-a1', type: 'disabled-slot', name: 'Disabled A1', layer: 'Parking Slots', x: 125, y: 250, width: 105, height: 92, rotation: 0, opacity: 1, fill: '#dbeafe', stroke: '#2563eb', status: 'disabled', price: 0, sensorId: 'SEN-D-A1', zIndex: 4 }),
  object({ id: 'disabled-a2', type: 'disabled-slot', name: 'Disabled A2', layer: 'Parking Slots', x: 125, y: 344, width: 105, height: 92, rotation: 0, opacity: 1, fill: '#dbeafe', stroke: '#2563eb', status: 'disabled', price: 0, sensorId: 'SEN-D-A2', zIndex: 4 }),
  object({ id: 'vip-b1', type: 'vip-slot', name: 'VIP B1', layer: 'Zones', x: 865, y: 85, width: 116, height: 104, rotation: 0, opacity: 1, fill: '#ede9fe', stroke: '#8b5cf6', status: 'vip', price: 240, capacity: 1, text: 'VIP', zIndex: 5 }),
  object({ id: 'bike-zone-1', type: 'bike-slot', name: 'Bike Zone', layer: 'Zones', x: 875, y: 540, width: 115, height: 78, rotation: 0, opacity: 1, fill: '#ffe4e6', stroke: '#fb7185', status: 'bike', capacity: 12, text: 'Bike Zone', zIndex: 5 }),
  object({ id: 'ev-a1', type: 'ev-slot', name: 'EV Bay A1', layer: 'Parking Slots', x: 708, y: 603, width: 62, height: 104, rotation: 0, opacity: 1, fill: '#dcfce7', stroke: '#22c55e', status: 'ev', price: 130, sensorId: 'SEN-EV-A1', zIndex: 4 }),
  ...Array.from({ length: 9 }).map((_, i) => object({
    id: `north-${i + 1}`,
    type: i === 3 ? 'parking-slot' : i === 6 ? 'reserved-slot' : 'parking-slot',
    name: `North Row ${i + 1}`,
    layer: 'Parking Slots',
    x: 165 + i * 78,
    y: 86,
    width: 60,
    height: 110,
    rotation: 0,
    opacity: 1,
    fill: i === 3 ? '#fee2e2' : i === 6 ? '#dbeafe' : '#dcfce7',
    stroke: i === 3 ? '#ef4444' : i === 6 ? '#3b82f6' : '#35b779',
    status: i === 3 ? 'occupied' : i === 6 ? 'reserved' : 'available',
    price: 90,
    sensorId: `SEN-N-${i + 1}`,
    zIndex: 4,
  })),
  ...Array.from({ length: 8 }).map((_, i) => object({
    id: `south-${i + 1}`,
    type: i === 4 ? 'reserved-slot' : 'parking-slot',
    name: `South Row ${i + 1}`,
    layer: 'Parking Slots',
    x: 205 + i * 78,
    y: 600,
    width: 64,
    height: 108,
    rotation: 0,
    opacity: 1,
    fill: i === 4 ? '#dbeafe' : '#dcfce7',
    stroke: i === 4 ? '#3b82f6' : '#35b779',
    status: i === 4 ? 'reserved' : 'available',
    price: 90,
    sensorId: `SEN-S-${i + 1}`,
    zIndex: 4,
  })),
  ...Array.from({ length: 5 }).map((_, i) => object({
    id: `east-${i + 1}`,
    type: i === 2 ? 'parking-slot' : 'parking-slot',
    name: `East Bay ${i + 1}`,
    layer: 'Parking Slots',
    x: 865,
    y: 245 + i * 91,
    width: 116,
    height: 72,
    rotation: 0,
    opacity: 1,
    fill: i === 2 ? '#fee2e2' : '#dcfce7',
    stroke: i === 2 ? '#ef4444' : '#35b779',
    status: i === 2 ? 'occupied' : 'available',
    price: 90,
    sensorId: `SEN-E-${i + 1}`,
    zIndex: 4,
  })),
  object({ id: 'arrow-1', type: 'arrow', name: 'North Direction', layer: 'Texts', x: 395, y: 250, width: 72, height: 34, rotation: 180, opacity: 1, fill: 'transparent', stroke: '#ffffff', text: 'ARROW', zIndex: 6 }),
  object({ id: 'arrow-2', type: 'arrow', name: 'Ramp Direction', layer: 'Texts', x: 255, y: 425, width: 72, height: 34, rotation: -90, opacity: 1, fill: 'transparent', stroke: '#ffffff', text: 'ARROW', zIndex: 6 }),
  object({ id: 'arrow-3', type: 'arrow', name: 'Exit Direction', layer: 'Texts', x: 410, y: 510, width: 72, height: 34, rotation: 0, opacity: 1, fill: 'transparent', stroke: '#ffffff', text: 'ARROW', zIndex: 6 }),
];

export const mockTwinBuilderProject: TwinBuilderProject = {
  id: 'dt-mall-delhi-001',
  mallName: 'Mall of Delhi',
  parkingName: 'Main Retail Parking',
  location: 'Saket District Centre, Delhi NCR',
  canvas: { width: 1120, height: 820, gridSize: 20 },
  floors: [
    { id: 'terrace', name: 'Terrace', level: 5, objects: basementObjects.slice(0, 8).map((item) => ({ ...item, id: `terrace-${item.id}` })) },
    { id: 'floor-2', name: 'Floor 2', level: 4, objects: basementObjects.slice(0, 14).map((item) => ({ ...item, id: `f2-${item.id}` })) },
    { id: 'floor-1', name: 'Floor 1', level: 3, objects: basementObjects.slice(0, 18).map((item) => ({ ...item, id: `f1-${item.id}` })) },
    { id: 'ground', name: 'Ground Floor', level: 2, objects: basementObjects.slice(0, 22).map((item) => ({ ...item, id: `g-${item.id}` })) },
    { id: 'basement-1', name: 'Basement 1', level: 1, objects: basementObjects },
    { id: 'basement-2', name: 'Basement 2', level: 0, objects: basementObjects.map((item, index) => ({ ...item, id: `b2-${item.id}`, x: item.x + (index % 3) * 8, y: item.y + (index % 2) * 8 })) },
  ],
  activeFloorId: 'basement-1',
  lastSaved: 'Autosaved 18 seconds ago',
  version: 42,
};
