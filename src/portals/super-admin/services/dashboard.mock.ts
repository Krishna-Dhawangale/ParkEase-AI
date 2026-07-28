import type { 
  SADashboardData, 
  SADashboardAlert, 
  SADashboardOrganization, 
  SADashboardFacilityApproval,
  SADashboardSystemHealth
} from '../types/super-admin.types';

// ZERO DATA STATE for production deployment defaults.
// Do not populate this with fake marketing numbers.

export const mockDashboardData: SADashboardData = {
  organizations: {
    total: 0,
    active: 0
  },
  subscriptions: {
    active: 0
  },
  facilities: {
    total: 0,
    live: 0,
    pendingApproval: 0
  },
  revenue: {
    currentPeriod: 0,
    paid: 0,
    outstanding: 0,
    overdue: 0,
    history: []
  },
  platform: {
    bookingsToday: 0,
    activeSessions: 0
  },
  digitalTwins: {
    connected: 0,
    disconnected: 0,
    degraded: 0
  },
  devices: {
    online: 0,
    offline: 0,
    warning: 0
  },
  support: {
    openTickets: 0,
    openComplaints: 0
  }
};

export const mockDashboardAlerts: SADashboardAlert[] = [];

export const mockDashboardOrganizations: SADashboardOrganization[] = [];

export const mockDashboardApprovals: SADashboardFacilityApproval[] = [];

export const mockDashboardSystemHealth: SADashboardSystemHealth[] = [
  { service: 'Node.js API', status: 'Unknown' },
  { service: 'Database', status: 'Unknown' },
  { service: 'WebSocket', status: 'Unknown' },
  { service: 'Authentication', status: 'Unknown' },
  { service: 'Payment Integration', status: 'Unknown' },
  { service: 'Notification Service', status: 'Unknown' },
  { service: 'Computer Vision Service', status: 'Unknown' },
];
