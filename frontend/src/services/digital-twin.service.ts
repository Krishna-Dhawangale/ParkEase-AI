import type { TwinBuilderProject } from '../portals/client-admin/digitalTwin/data';

// Simulating a backend database that stores the project per tenant
const mockDatabase = new Map<string, TwinBuilderProject>();

export const DigitalTwinService = {
  async getProject(tenantId: string): Promise<any | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = mockDatabase.get(tenantId);
        resolve(data ? JSON.parse(JSON.stringify(data)) : null);
      }, 500); // simulate network delay
    });
  },

  async saveProject(tenantId: string, state: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDatabase.set(tenantId, JSON.parse(JSON.stringify(state)));
        // We still save to localStorage just so it persists across page reloads in this demo environment, 
        // but this acts as the "backend" API.
        window.localStorage.setItem(`parkease_digital_twin_${tenantId}`, JSON.stringify(state));
        resolve();
      }, 800); // simulate network delay
    });
  },
};
