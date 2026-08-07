import type { AuthUser } from './auth';

export interface Tenant {
  id: string;
  name: string; // e.g., 'Phoenix Mall', 'Airport Authority'
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'DRAFT' | 'ONBOARDING' | 'INACTIVE';
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  type?: string;
  contactPerson?: string;
  contactEmail: string;
  contactPhone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  gstNumber?: string;
  website?: string;
  internalNotes?: string;
  isOnboarded?: boolean;
  subscriptionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

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
  tenantId: string;
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
  features: string[];
  operatingHours: {
    [dayOfWeek: string]: { open: string; close: string; isClosed: boolean };
  };
  layout: ParkingLayout;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- NEW HIERARCHY MODELS ---

export interface Facility {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  facilityId: string;
  name: string;
  level: number;
  layout: ParkingLayout;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- BOOKING SYSTEM TYPES ---

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  floorId?: string;
  floorName?: string;
  slotId?: string;
  slotName?: string;
  vehicleId?: string;
  vehiclePlate: string;
  startTime: string;          // ISO 8601 UTC — frontend computes countdown
  endTime: string;            // ISO 8601 UTC — frontend computes countdown
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  qrCodeToken?: string;
  isActive: boolean;          // Computed by backend
  paymentExpiresAt?: string;  // For PENDING_PAYMENT TTL countdown
  createdAt: string;
}

export interface MyBookingsData {
  active: Booking[];
  past: Booking[];
  cancelled: Booking[];
}

export interface BookingCreatePayload {
  facility_id: string;
  floor_id: string;
  slot_id: string;
  vehicle_id: string;
  start_time: string;   // ISO 8601 UTC
  end_time: string;     // ISO 8601 UTC
}

export interface SlotWithAvailability extends ParkingSlot {
  floorId: string;
  floorName: string;
  isBookable: boolean;  // Computed: no overlap AND not MAINTENANCE
}

export interface DigitalTwinState {
  slotId: string;
  slotName: string;
  floorName: string;
  status: string;
  sensorStatus: string;
  occupancyDetected: boolean;
  batteryLevel: number;
  lastUpdated: string;
  bookingEndTime?: string;  // Frontend computes countdown
  vehiclePlate?: string;
}

// --- API RESPONSE ENVELOPE ---

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
