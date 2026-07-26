// ─── Client Facility Service ─────────────────────────────────────────────────
// Manages client-owned facilities. All data is scoped by tenantId.
// Uses localStorage for persistence in the mock/frontend-only architecture.

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

const STORAGE_KEY = 'parkease_client_facilities';

function loadAll(): ClientFacility[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(facilities: ClientFacility[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));
  } catch { /* ignore quota */ }
}

const delay = (ms = 400) => new Promise<void>(r => setTimeout(r, ms));

export const FacilityService = {
  // Get all facilities for a tenant (tenant-scoped)
  async getByTenant(tenantId: string): Promise<ClientFacility[]> {
    await delay(300);
    return loadAll().filter(f => f.tenantId === tenantId);
  },

  // Get a single facility (must belong to tenant)
  async getById(tenantId: string, facilityId: string): Promise<ClientFacility | null> {
    await delay(200);
    const facility = loadAll().find(f => f.id === facilityId && f.tenantId === tenantId);
    return facility ?? null;
  },

  // Create a new facility as DRAFT
  async create(tenantId: string, data: Omit<ClientFacility, 'id' | 'tenantId' | 'status' | 'createdAt' | 'updatedAt' | 'pricingConfigured'>): Promise<ClientFacility> {
    await delay();
    const all = loadAll();
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
    all.push(facility);
    saveAll(all);
    return facility;
  },

  // Update a facility (must be DRAFT or REJECTED to edit freely)
  async update(tenantId: string, facilityId: string, data: Partial<ClientFacility>): Promise<ClientFacility> {
    await delay();
    const all = loadAll();
    const idx = all.findIndex(f => f.id === facilityId && f.tenantId === tenantId);
    if (idx === -1) throw new Error('Facility not found.');
    const updated: ClientFacility = {
      ...all[idx],
      ...data,
      id: all[idx].id,
      tenantId,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    saveAll(all);
    return updated;
  },

  // Submit for approval — also bridges to Super Admin store
  async submitForApproval(tenantId: string, facilityId: string): Promise<ClientFacility> {
    const updated = await FacilityService.update(tenantId, facilityId, {
      status: 'PENDING_APPROVAL',
      rejectionReason: undefined,
    });

    // ── Bridge: write this facility into the SA facilities localStorage ──────
    // SA service key: 'parkease_sa_facilities'
    // SA service key: 'parkease_sa_notifications'
    try {
      const SA_FAC_KEY = 'parkease_sa_facilities';
      const SA_NOTIF_KEY = 'parkease_sa_notifications';
      const rawFacs = localStorage.getItem(SA_FAC_KEY);
      const saFacs: any[] = rawFacs ? JSON.parse(rawFacs) : [];

      // Build an SAFacility-shaped object from the client facility
      const saFacility = {
        id: updated.id,
        name: updated.name,
        organizationId: updated.tenantId,
        organizationName: updated.name, // will be overwritten by org name if available
        city: updated.city,
        state: updated.state,
        type: updated.type,
        approvalStatus: 'UNDER_REVIEW',
        capacity: updated.totalCapacity,
        currentOccupancy: 0,
        floors: updated.floors,
        slots: updated.totalCapacity,
        digitalTwinStatus: 'NOT_CONFIGURED',
        deviceHealth: 'NO_DEVICES',
        bookingsToday: 0,
        submittedAt: new Date().toISOString(),
        approvedAt: null,
        createdAt: updated.createdAt,
        updatedAt: new Date().toISOString(),
        pricingConfigured: updated.pricingConfigured,
        entryExitConfigured: false,
      };

      // Try to get org name from SA org store
      try {
        const SA_ORG_KEY = 'parkease_sa_organizations';
        const rawOrgs = localStorage.getItem(SA_ORG_KEY);
        if (rawOrgs) {
          const orgs: any[] = JSON.parse(rawOrgs);
          const org = orgs.find((o: any) => o.id === tenantId);
          if (org) saFacility.organizationName = org.name;
        }
      } catch { /* ignore */ }

      // Remove old entry with same id if exists, then push updated
      const filtered = saFacs.filter((f: any) => f.id !== updated.id);
      filtered.push(saFacility);
      localStorage.setItem(SA_FAC_KEY, JSON.stringify(filtered));

      // Add a notification in SA notification store
      const rawNotifs = localStorage.getItem(SA_NOTIF_KEY);
      const saNotifs: any[] = rawNotifs ? JSON.parse(rawNotifs) : [];
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'FACILITY_APPROVAL',
        title: 'Facility Submitted for Approval',
        message: `"${updated.name}" has been submitted and is awaiting your review.`,
        read: false,
        link: `/super-admin/facility-approvals/${updated.id}`,
        createdAt: new Date().toISOString(),
      };
      saNotifs.unshift(newNotif);
      localStorage.setItem(SA_NOTIF_KEY, JSON.stringify(saNotifs));
    } catch (e) {
      console.warn('[FacilityService] Failed to bridge to SA store:', e);
    }

    return updated;
  },

  // Withdraw an approval request
  async withdrawApproval(tenantId: string, facilityId: string): Promise<ClientFacility> {
    const updated = await FacilityService.update(tenantId, facilityId, {
      status: 'DRAFT',
    });

    // Bridge: update SA facilities to DRAFT
    try {
      const SA_FAC_KEY = 'parkease_sa_facilities';
      const rawFacs = localStorage.getItem(SA_FAC_KEY);
      if (rawFacs) {
        const saFacs: any[] = JSON.parse(rawFacs);
        const idx = saFacs.findIndex(f => f.id === facilityId);
        if (idx !== -1) {
          saFacs[idx].approvalStatus = 'DRAFT';
          localStorage.setItem(SA_FAC_KEY, JSON.stringify(saFacs));
        }
      }
    } catch (e) {
      console.warn('[FacilityService] Failed to bridge withdraw to SA store:', e);
    }
    return updated;
  },

  // Delete a facility
  async delete(tenantId: string, facilityId: string): Promise<void> {
    await delay(300);
    const all = loadAll().filter(f => !(f.id === facilityId && f.tenantId === tenantId));
    saveAll(all);

    // Bridge: remove from SA facilities if it was synced
    try {
      const SA_FAC_KEY = 'parkease_sa_facilities';
      const rawFacs = localStorage.getItem(SA_FAC_KEY);
      if (rawFacs) {
        const saFacs: any[] = JSON.parse(rawFacs);
        const filtered = saFacs.filter(f => f.id !== facilityId);
        localStorage.setItem(SA_FAC_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('[FacilityService] Failed to bridge delete to SA store:', e);
    }
  },
};
