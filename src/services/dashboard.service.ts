import { recentBookings, recentAlerts, revenueData, occupancyData, peakHourData, kpiCards } from '../portals/client-admin/dashboard/data';

// This service abstracts the data fetching for the dashboard.
// In the future, these methods will make actual API calls to the Node.js backend.

export const DashboardService = {
  getKPIs: async (tenantId: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return kpiCards; // [DEVELOPMENT MOCK]
  },
  
  getRevenueData: async (tenantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return revenueData; // [DEVELOPMENT MOCK]
  },

  getOccupancyData: async (tenantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return occupancyData; // [DEVELOPMENT MOCK]
  },

  getPeakHourData: async (tenantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return peakHourData; // [DEVELOPMENT MOCK]
  },

  getRecentBookings: async (tenantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return recentBookings; // [DEVELOPMENT MOCK]
  },

  getRecentAlerts: async (tenantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return recentAlerts; // [DEVELOPMENT MOCK]
  }
};
