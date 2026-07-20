import type { AuthUser } from './auth';

export type SlotStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'BLOCKED'
  | 'MAINTENANCE'
  | 'DISABLED'
  | 'EV_CHARGING'
  | 'VIP';

export interface ParkingOwnerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  contactPhone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  documents: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSlot {
  id: string;
  name: string; // e.g., 'A1', 'VIP-1'
  status: SlotStatus;
  type: 'STANDARD' | 'COMPACT' | 'LARGE' | 'MOTORCYCLE' | 'ACCESSIBLE' | 'EV';
  pricePerHour?: number; // Optional override for specific slots
  x: number; // Grid X coordinate
  y: number; // Grid Y coordinate
  w: number; // Width in grid units
  h: number; // Height in grid units
}

export interface ParkingLayout {
  width: number; // Total grid width
  height: number; // Total grid height
  slots: ParkingSlot[];
  obstacles: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'WALL' | 'PILLAR' | 'LANE' | 'ENTRY' | 'EXIT';
  }[];
}

export interface ParkingLot {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: number;
  basePricePerHour: number;
  currency: string;
  features: string[]; // e.g., 'CCTV', 'Covered', 'Valet'
  operatingHours: {
    [dayOfWeek: string]: { open: string; close: string; isClosed: boolean };
  };
  layout: ParkingLayout;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
