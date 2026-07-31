// ─── Client Facility Service ─────────────────────────────────────────────────
// Manages client-owned facilities. All data is scoped by tenantId.
// Connected to Firebase Realtime Database.

import { ref, get, set, child, remove } from 'firebase/database';
import { db } from '../../../lib/firebase';

export type FacilityStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'LIVE';

export type SlotCategory = 'REGULAR' | 'EV' | 'ACCESSIBLE';

export interface FacilitySlotConfig {
  category: SlotCategory;
  count: number;
}

export interface FacilityContactInfo {
  managerName: string;
  phone: string;
  email: string;
}

export interface FacilityPricing {
  hourlyRate: number;
  minimumCharge: number;
  dailyMaximum: number;
  gracePeriodMinutes: number;
  overstayPenaltyRate: number;
}

export interface ClientFacility {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  description: string;
  // Location
  address: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  // Operating hours
  is24x7: boolean;
  openTime: string;
  closeTime: string;
  // Structure
  floors: number;
  totalCapacity: number;
  slotCategories: FacilitySlotConfig[];
  // Contact
  contact: FacilityContactInfo;
  // Pricing
  pricing?: FacilityPricing;
  pricingConfigured: boolean;
  // Status
  status: FacilityStatus;
  rejectionReason?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const FacilityService = {
  // Get all facilities for a tenant
  async getByTenant(tenantId: string): Promise<ClientFacility[]> {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `facilities`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data).filter((f: any) => f.tenantId === tenantId) as ClientFacility[];
    }
    return [];
  },

  subscribeToTenantFacilities(tenantId: string, callback: (facilities: ClientFacility[]) => void) {
    import('firebase/database').then(({ onValue, ref }) => {
      const dbRef = ref(db, 'facilities');
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data).filter((f: any) => f.tenantId === tenantId) as ClientFacility[];
          callback(list);
        } else {
          callback([]);
        }
      });
    });
  },

  // Get a single facility
  async getById(tenantId: string, facilityId: string): Promise<ClientFacility | null> {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `facilities/${facilityId}`));
    if (snapshot.exists()) {
      const facility = snapshot.val() as ClientFacility;
      if (facility.tenantId === tenantId) return facility;
    }
    return null;
  },

  subscribeToFacility(tenantId: string, facilityId: string, callback: (facility: ClientFacility | null) => void) {
    import('firebase/database').then(({ onValue, ref }) => {
      const dbRef = ref(db, `facilities/${facilityId}`);
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const facility = snapshot.val() as ClientFacility;
          if (facility.tenantId === tenantId) {
            callback(facility);
            return;
          }
        }
        callback(null);
      });
    });
  },

  // Create a new facility as DRAFT
  async create(tenantId: string, data: Omit<ClientFacility, 'id' | 'tenantId' | 'status' | 'createdAt' | 'updatedAt' | 'pricingConfigured'>): Promise<ClientFacility> {
    const now = new Date().toISOString();
    const facility: ClientFacility = {
      ...data,
      id: `fac-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tenantId,
      status: 'DRAFT',
      pricingConfigured: false,
      createdAt: now,
      updatedAt: now,
    };
    
    await set(ref(db, `facilities/${facility.id}`), facility);
    return facility;
  },

  // Update a facility
  async update(tenantId: string, facilityId: string, data: Partial<ClientFacility>): Promise<ClientFacility> {
    const facility = await this.getById(tenantId, facilityId);
    if (!facility) throw new Error('Facility not found.');
    
    const updated: ClientFacility = {
      ...facility,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // Firebase Realtime DB throws an error if a property is explicitly 'undefined'
    Object.keys(updated).forEach(key => {
      if ((updated as any)[key] === undefined) {
        delete (updated as any)[key];
      }
    });
    
    await set(ref(db, `facilities/${facilityId}`), updated);
    return updated;
  },

  // Submit for approval
  async submitForApproval(tenantId: string, facilityId: string): Promise<ClientFacility> {
    return await this.update(tenantId, facilityId, {
      status: 'PENDING_APPROVAL',
      rejectionReason: undefined,
    });
  },

  // Withdraw an approval request
  async withdrawApproval(tenantId: string, facilityId: string): Promise<ClientFacility> {
    return await this.update(tenantId, facilityId, {
      status: 'DRAFT',
    });
  },

  // Delete a facility
  async delete(tenantId: string, facilityId: string): Promise<void> {
    const facility = await this.getById(tenantId, facilityId);
    if (!facility) throw new Error('Facility not found or unauthorized');

    const dbRef = ref(db, `facilities/${facilityId}`);
    await remove(dbRef);
  },

  async goLive(tenantId: string, facilityId: string): Promise<void> {
    const facility = await this.getById(tenantId, facilityId);
    if (!facility) throw new Error('Facility not found or unauthorized');

    const dbRef = ref(db, `facilities/${facilityId}`);
    await set(dbRef, {
      ...facility,
      status: 'LIVE',
      updatedAt: new Date().toISOString()
    });
  }
};
