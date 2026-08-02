import type { TwinBuilderProject } from '../portals/client-admin/digitalTwin/data';

// Simulating a backend database that stores the project per tenant+facility
const mockDatabase = new Map<string, any>();

// Custom event name for same-tab real-time sync
export const DIGITAL_TWIN_SYNC_EVENT = 'parkease-digital-twin-sync';

/**
 * Build a unique storage key per facility.
 * If no facilityId is provided, falls back to tenant-level (legacy).
 */
function storageKey(tenantId: string, facilityId?: string): string {
  if (facilityId) {
    return `parkease_digital_twin_${tenantId}_${facilityId}`;
  }
  return `parkease_digital_twin_${tenantId}`;
}

export const DigitalTwinService = {
  async getProject(tenantId: string, facilityId?: string): Promise<any | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = storageKey(tenantId, facilityId);
        const data = mockDatabase.get(key);
        if (data) {
          resolve(JSON.parse(JSON.stringify(data)));
        } else {
          // Try localStorage fallback
          const raw = window.localStorage.getItem(key);
          resolve(raw ? JSON.parse(raw) : null);
        }
      }, 300);
    });
  },

  async saveProject(tenantId: string, state: any, facilityId?: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = storageKey(tenantId, facilityId);
        const json = JSON.stringify(state);
        mockDatabase.set(key, JSON.parse(json));
        // Persist to localStorage for page reload survival
        window.localStorage.setItem(key, json);

        // Dispatch a custom event so the User Portal (same tab) gets notified instantly
        window.dispatchEvent(new CustomEvent(DIGITAL_TWIN_SYNC_EVENT, {
          detail: { key, value: json, tenantId, facilityId }
        }));

        resolve();
      }, 300);
    });
  },

  /**
   * Clean up all digital twin keys from localStorage
   */
  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (
        key.startsWith('parkease_digital_twin_') ||
        key.startsWith('parkease-ai.digital-twin-builder.')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => window.localStorage.removeItem(k));
    mockDatabase.clear();
  }
};
