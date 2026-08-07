// ─── Client Facility Service ─────────────────────────────────────────────────
// Manages client-owned facilities. All data is scoped by tenantId.
// Connected to PostgreSQL Backend API, falls back to localStorage if backend is down.

import { ApiClient } from '../../../lib/api-client';

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

const STORAGE_KEY = 'parkease_mock_client_facilities';

// Helper to get local mock data
function getLocalFacilities(): ClientFacility[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const clientFacs: ClientFacility[] = raw ? JSON.parse(raw) : [];

    // Sync status from SA if available (in case SA approved it)
    const rawSA = localStorage.getItem('parkease_sa_facilities');
    if (rawSA) {
      const saFacs: any[] = JSON.parse(rawSA);
      return clientFacs.map(cf => {
        const saMatch = saFacs.find(sf => sf.id === cf.id);
        if (saMatch) {
          let syncedStatus = saMatch.approvalStatus;
          // map SA status back to Client status terminology if needed
          if (syncedStatus === 'UNDER_REVIEW') syncedStatus = 'PENDING_APPROVAL';
          return { ...cf, status: syncedStatus };
        }
        return cf;
      });
    }
    return clientFacs;
  } catch {
    return [];
  }
}

// Helper to save local mock data and sync to Super Admin
function saveLocalFacilities(facilities: ClientFacility[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));

    // Sync to SA
    const rawSA = localStorage.getItem('parkease_sa_facilities');
    const saFacs: any[] = rawSA ? JSON.parse(rawSA) : [];

    facilities.forEach(cf => {
      const index = saFacs.findIndex(f => f.id === cf.id);
      
      let orgName = 'Unknown Organization';
      try {
        const orgsRaw = localStorage.getItem('parkease_sa_organizations');
        if (orgsRaw) {
          const org = JSON.parse(orgsRaw).find((o: any) => o.id === cf.tenantId);
          if (org) orgName = org.name;
        }
      } catch {}

      let approvalStatus = cf.status;
      if (approvalStatus === 'PENDING_APPROVAL') approvalStatus = 'UNDER_REVIEW';

      const saFacility = {
        id: cf.id,
        name: cf.name,
        organizationId: cf.tenantId,
        organizationName: orgName,
        city: cf.city,
        state: cf.state,
        coordinates: cf.latitude && cf.longitude ? { lat: Number(cf.latitude), lng: Number(cf.longitude) } : undefined,
        type: cf.type as any, // Mapped loosely
        approvalStatus: approvalStatus,
        capacity: cf.totalCapacity,
        currentOccupancy: index >= 0 ? saFacs[index].currentOccupancy : 0,
        floors: cf.floors,
        slots: cf.slotCategories.reduce((acc, cat) => acc + cat.count, 0),
        digitalTwinStatus: index >= 0 ? saFacs[index].digitalTwinStatus : 'PENDING',
        deviceHealth: index >= 0 ? saFacs[index].deviceHealth : 'NO_DEVICES',
        bookingsToday: index >= 0 ? saFacs[index].bookingsToday : 0,
        submittedAt: cf.status === 'PENDING_APPROVAL' ? new Date().toISOString() : (index >= 0 ? saFacs[index].submittedAt : null),
        approvedAt: cf.approvedAt || (index >= 0 ? saFacs[index].approvedAt : null),
        createdAt: cf.createdAt,
        updatedAt: cf.updatedAt,
        operatingHours: `${cf.openTime} - ${cf.closeTime}`,
        pricingConfigured: cf.pricingConfigured,
        entryExitConfigured: index >= 0 ? saFacs[index].entryExitConfigured : false,
      };

      if (index >= 0) {
        saFacs[index] = { ...saFacs[index], ...saFacility };
      } else {
        saFacs.push(saFacility);
      }
    });

    localStorage.setItem('parkease_sa_facilities', JSON.stringify(saFacs));
  } catch {}
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const FacilityService = {
  // Get all facilities for a tenant
  async getByTenant(tenantId: string): Promise<ClientFacility[]> {
    try {
      const facilities = await ApiClient.get<any[]>('/facilities/');
      return facilities.map(f => ({ ...f, tenantId: f.tenant_id, id: f.id })).filter((f: any) => f.tenantId === tenantId);
    } catch (error) {
      console.warn('[FacilityService] Backend unavailable, using local mock data');
      const facilities = getLocalFacilities();
      return facilities.filter(f => f.tenantId === tenantId);
    }
  },

  subscribeToTenantFacilities(tenantId: string, callback: (facilities: ClientFacility[]) => void) {
    this.getByTenant(tenantId).then(callback).catch(() => callback([]));
    const interval = setInterval(() => {
        this.getByTenant(tenantId).then(callback).catch(() => callback([]));
    }, 5000);
    return () => clearInterval(interval);
  },

  // Get a single facility
  async getById(tenantId: string, facilityId: string): Promise<ClientFacility | null> {
    try {
      const facility: any = await ApiClient.get(`/facilities/${facilityId}`);
      if (facility.tenant_id === tenantId || facility.tenantId === tenantId) {
        return { ...facility, tenantId: facility.tenant_id };
      }
      return null;
    } catch (error) {
      const facilities = getLocalFacilities();
      return facilities.find(f => f.id === facilityId && f.tenantId === tenantId) || null;
    }
  },

  subscribeToFacility(tenantId: string, facilityId: string, callback: (facility: ClientFacility | null) => void) {
    this.getById(tenantId, facilityId).then(callback).catch(() => callback(null));
    const interval = setInterval(() => {
        this.getById(tenantId, facilityId).then(callback).catch(() => callback(null));
    }, 5000);
    return () => clearInterval(interval);
  },

  // Create a new facility as DRAFT
  async create(tenantId: string, data: Omit<ClientFacility, 'id' | 'tenantId' | 'status' | 'createdAt' | 'updatedAt' | 'pricingConfigured'>): Promise<ClientFacility> {
    const payload = {
      ...data,
      tenantId: tenantId,
      status: 'DRAFT' as FacilityStatus
    };
    
    try {
      return await ApiClient.post<ClientFacility>('/facilities/', payload);
    } catch (error) {
      console.error('[FacilityService] Backend error on create:', error);
      console.warn('[FacilityService] Backend unavailable, saving locally');
      const facilities = getLocalFacilities();
      const newFacility: ClientFacility = {
        ...payload,
        id: `fac-${uid()}`,
        pricingConfigured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      facilities.push(newFacility);
      saveLocalFacilities(facilities);
      return newFacility;
    }
  },

  // Update a facility
  async update(tenantId: string, facilityId: string, data: Partial<ClientFacility>): Promise<ClientFacility> {
    try {
      return await ApiClient.patch<ClientFacility>(`/facilities/${facilityId}`, data);
    } catch (error) {
      console.error('[FacilityService] Backend error on update:', error);
      console.warn('[FacilityService] Backend unavailable, updating locally');
      const facilities = getLocalFacilities();
      const index = facilities.findIndex(f => f.id === facilityId && f.tenantId === tenantId);
      
      if (index === -1) throw new Error('Facility not found');
      
      facilities[index] = {
        ...facilities[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      saveLocalFacilities(facilities);
      return facilities[index];
    }
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
    try {
      await ApiClient.delete(`/facilities/${facilityId}`);
    } catch (error) {
      console.warn('[FacilityService] Backend unavailable, deleting locally');
      const facilities = getLocalFacilities();
      const newFacilities = facilities.filter(f => !(f.id === facilityId && f.tenantId === tenantId));
      saveLocalFacilities(newFacilities);

      try {
        const rawSA = localStorage.getItem('parkease_sa_facilities');
        if (rawSA) {
          const saFacs = JSON.parse(rawSA).filter((f: any) => f.id !== facilityId);
          localStorage.setItem('parkease_sa_facilities', JSON.stringify(saFacs));
        }
      } catch {}
    }
  },

  // Simulate payment then go live
  async processPaymentAndGoLive(tenantId: string, facilityId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await this.update(tenantId, facilityId, { status: 'LIVE' });
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });
  },

  async goLive(tenantId: string, facilityId: string): Promise<void> {
    await this.update(tenantId, facilityId, { status: 'LIVE' });
  }
};
