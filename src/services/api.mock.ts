import type { AuthUser } from '../types/auth';
import type { ParkingOwnerProfile, ParkingLot } from '../types/models';

import type { Tenant } from '../types/models';

// [DEVELOPMENT MOCK]
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Phoenix Mall',
    slug: 'phoenix-mall',
    status: 'ACTIVE',
    plan: 'PRO',
    contactEmail: 'admin@phoenixmall.com',
    contactPhone: '+1-555-0192',
    isOnboarded: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// [DEVELOPMENT MOCK]
export const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    email: 'user@parkease.com',
    role: 'CUSTOMER',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'owner-1',
    email: 'owner@parkease.com',
    role: 'CLIENT_OWNER',
    tenantId: 'tenant-1',
    firstName: 'Jane',
    lastName: 'Smith',
    isEmailVerified: true,
    requiresPasswordChange: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    email: 'admin@parkease.com',
    role: 'SUPER_ADMIN',
    firstName: 'Super',
    lastName: 'Admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  }
];

// [DEVELOPMENT MOCK]
export const mockOwnerProfiles: ParkingOwnerProfile[] = [
  {
    id: 'profile-1',
    userId: 'owner-1',
    businessName: 'Prime Parking LLC',
    businessRegistrationNumber: 'BUS-123456',
    taxId: 'TAX-789012',
    contactPhone: '+1-555-0192',
    status: 'APPROVED',
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// [DEVELOPMENT MOCK]
export const mockParkingLots: ParkingLot[] = [
  {
    id: 'lot-1',
    tenantId: 'tenant-1',
    name: 'Phoenix Mall Central Parking',
    description: 'Secure, covered parking in the heart of downtown.',
    address: {
      street: '123 Main St',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    capacity: 50,
    basePricePerHour: 15.00,
    currency: 'USD',
    features: ['CCTV', 'Covered', 'EV Charging', '24/7'],
    operatingHours: {
      monday: { open: '00:00', close: '23:59', isClosed: false },
      tuesday: { open: '00:00', close: '23:59', isClosed: false },
      wednesday: { open: '00:00', close: '23:59', isClosed: false },
      thursday: { open: '00:00', close: '23:59', isClosed: false },
      friday: { open: '00:00', close: '23:59', isClosed: false },
      saturday: { open: '00:00', close: '23:59', isClosed: false },
      sunday: { open: '00:00', close: '23:59', isClosed: false },
    },
    layout: {
      width: 10,
      height: 10,
      slots: [],
      obstacles: []
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
