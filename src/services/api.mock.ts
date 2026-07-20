import type { AuthUser } from '../types/auth';
import type { ParkingOwnerProfile, ParkingLot } from '../types/models';

export const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    email: 'user@parkease.com',
    role: 'USER',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'owner-1',
    email: 'owner@parkease.com',
    role: 'OWNER',
    firstName: 'Jane',
    lastName: 'Smith',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    email: 'admin@parkease.com',
    role: 'ADMIN',
    firstName: 'Super',
    lastName: 'Admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  }
];

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

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'lot-1',
    ownerId: 'owner-1',
    name: 'Downtown Central Parking',
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
