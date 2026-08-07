export type SlotStatus = 'Available' | 'Occupied' | 'Reserved' | 'Disabled' | 'EV';
export type SlotType = 'Regular' | 'EV' | 'Accessible';

export interface ParkingSlotLayout {
  id: string;
  type: SlotType;
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number, number];
}

export interface LiveSlotData {
  id: string;
  status: SlotStatus;
  vehicleNumber?: string;
  owner?: string;
  bookedUntil?: string;
  camera?: string;
}

export interface BuildingLayout {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  label?: string;
}

export interface RoadLayout {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}

export interface WalkwayLayout {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}

export interface TreeLayout {
  id: string;
  position: [number, number, number];
  scale: number;
}

export interface CameraLayout {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
}

export interface GateLayout {
  id: string;
  type: 'Entry' | 'Exit';
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface EVChargerLayout {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ParkingLayoutJSON {
  building?: BuildingLayout;
  roads: RoadLayout[];
  walkways: WalkwayLayout[];
  gates: GateLayout[];
  cameras: CameraLayout[];
  trees: TreeLayout[];
  evChargers: EVChargerLayout[];
  parkingSlots: ParkingSlotLayout[];
  walls?: RoadLayout[];
}

// WebSocket Event Payloads
export interface WSEventLayoutUpdated {
  layout: ParkingLayoutJSON;
}

export interface WSEventSlotUpdated {
  slotId: string;
  status: SlotStatus;
  vehicleNumber?: string;
  owner?: string;
  bookedUntil?: string;
}

export interface WSEventVehicleEntered {
  slotId: string;
  vehicleNumber: string;
  timestamp: string;
}

export interface WSEventVehicleExited {
  slotId: string;
  timestamp: string;
}
