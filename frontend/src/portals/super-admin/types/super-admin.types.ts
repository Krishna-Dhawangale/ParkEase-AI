// ─── Super Admin Portal — Domain Types ──────────────────────────────────────

// ─── Pagination ─────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Organizations ──────────────────────────────────────────────────────────

export type OrganizationType =
  | 'MALL'
  | 'AIRPORT'
  | 'HOSPITAL'
  | 'HOTEL'
  | 'CORPORATE_CAMPUS'
  | 'UNIVERSITY'
  | 'COMMERCIAL_PARKING'
  | 'OTHER';

export type OrganizationStatus =
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'SUSPENDED'
  | 'TERMINATED';

export interface Organization {
  id: string;
  name: string;
  businessName: string;
  type: OrganizationType;
  website?: string;
  status: OrganizationStatus;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  facilityCount: number;
  planId: string | null;
  subscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationPayload {
  organization: {
    name: string;
    businessName: string;
    type: OrganizationType;
    website?: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  subscription: {
    planId: string;
    billingCycle: BillingCycle;
    startDate: string;
  };
  clientAdmin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// ─── Client Admins ──────────────────────────────────────────────────────────

export type ClientAdminStatus = 'INVITED' | 'ACTIVE' | 'LOCKED' | 'DISABLED';

export interface ClientAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationId: string;
  organizationName: string;
  role: 'CLIENT_OWNER' | 'CLIENT_ADMIN';
  status: ClientAdminStatus;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// ─── Onboarding ─────────────────────────────────────────────────────────────

export type OnboardingStage =
  | 'ACCOUNT_CREATED'
  | 'CLIENT_ADMIN_CREATED'
  | 'FIRST_LOGIN'
  | 'PASSWORD_CHANGED'
  | 'PROFILE_COMPLETED'
  | 'FACILITY_CREATED'
  | 'DIGITAL_TWIN_CONFIGURED'
  | 'GO_LIVE_REQUESTED'
  | 'UNDER_REVIEW'
  | 'LIVE';

export interface OnboardingEntry {
  organizationId: string;
  organizationName: string;
  type: OrganizationType;
  currentStage: OnboardingStage;
  stageCompletedAt: Record<OnboardingStage, string | null>;
  createdAt: string;
}

// ─── Facilities ─────────────────────────────────────────────────────────────

export type FacilityApprovalStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'LIVE'
  | 'PAUSED'
  | 'SUSPENDED';

export interface SAFacility {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  type: OrganizationType;
  approvalStatus: FacilityApprovalStatus;
  capacity: number;
  currentOccupancy: number;
  floors: number;
  slots: number;
  digitalTwinStatus: DigitalTwinSyncStatus;
  deviceHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'NO_DEVICES';
  bookingsToday: number;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  operatingHours?: string;
  pricingConfigured: boolean;
  entryExitConfigured: boolean;
}

export interface FacilityReviewComment {
  id: string;
  facilityId: string;
  actorId: string;
  actorName: string;
  action: 'SUBMITTED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'SUSPENDED' | 'COMMENT';
  comment: string;
  createdAt: string;
}

// ─── Digital Twin Monitor ───────────────────────────────────────────────────

export type DigitalTwinSyncStatus = 'SYNCED' | 'DEGRADED' | 'DISCONNECTED' | 'OUTDATED' | 'NOT_CONFIGURED';

export interface DigitalTwinEntry {
  id: string;
  organizationId: string;
  organizationName: string;
  facilityId: string;
  facilityName: string;
  publishedVersion: number | null;
  floors: number;
  slots: number;
  lastUpdated: string | null;
  wsConnected: boolean;
  syncStatus: DigitalTwinSyncStatus;
}

// ─── Devices ────────────────────────────────────────────────────────────────

export type DeviceType =
  | 'ENTRY_CAMERA'
  | 'EXIT_CAMERA'
  | 'OCCUPANCY_CAMERA'
  | 'BARRIER_CONTROLLER'
  | 'OTP_QR_TERMINAL'
  | 'DISPLAY'
  | 'SENSOR'
  | 'GATEWAY';

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  organizationId: string;
  organizationName: string;
  facilityId: string;
  facilityName: string;
  location: string;
  status: DeviceStatus;
  lastHeartbeat: string | null;
}

// ─── Incidents ──────────────────────────────────────────────────────────────

export type IncidentSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'MONITORING' | 'RESOLVED';

export interface Incident {
  id: string;
  severity: IncidentSeverity;
  service: string;
  organizationId: string | null;
  organizationName: string | null;
  facilityId: string | null;
  facilityName: string | null;
  description: string;
  startedAt: string;
  resolvedAt: string | null;
  status: IncidentStatus;
  assignedTo: string | null;
  timeline: IncidentTimelineEntry[];
}

export interface IncidentTimelineEntry {
  id: string;
  action: string;
  actor: string;
  note: string;
  createdAt: string;
}

// ─── SaaS Plans ─────────────────────────────────────────────────────────────

export interface SaaSPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxFacilities: number;
  maxSlots: number;
  maxClientAdmins: number;
  maxCameras: number;
  analyticsRetentionDays: number;
  supportLevel: 'BASIC' | 'PRIORITY' | 'DEDICATED';
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  startDate: string;
  renewalDate: string;
  status: SubscriptionStatus;
  createdAt: string;
}

// ─── Invoices / Billing ─────────────────────────────────────────────────────

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'PAST_DUE' | 'VOID' | 'REFUNDED';

export interface Invoice {
  id: string;
  organizationId: string;
  organizationName: string;
  planName: string;
  billingPeriod: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: InvoiceStatus;
  createdAt: string;
}

// ─── Revenue ────────────────────────────────────────────────────────────────

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalSaaSRevenue: number;
  outstandingInvoices: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
}

// ─── Support Tickets ────────────────────────────────────────────────────────

export type TicketCategory =
  | 'TECHNICAL'
  | 'DIGITAL_TWIN'
  | 'DEVICE'
  | 'CAMERA'
  | 'BOOKING'
  | 'PAYMENT'
  | 'BILLING'
  | 'ACCOUNT'
  | 'OTHER';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CLIENT' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  organizationId: string;
  organizationName: string;
  facilityId: string | null;
  facilityName: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  assignedTo: string | null;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Complaints ─────────────────────────────────────────────────────────────

export type ComplaintCategory =
  | 'BOOKING_MISMATCH'
  | 'SLOT_UNAVAILABLE'
  | 'GATE_FAILURE'
  | 'OTP_FAILURE'
  | 'QR_FAILURE'
  | 'INCORRECT_CHARGE'
  | 'SAFETY_ISSUE'
  | 'UNAUTHORIZED_OCCUPATION'
  | 'OTHER';

export type ComplaintStatus = 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  organizationId: string;
  organizationName: string;
  facilityId: string;
  facilityName: string;
  bookingId: string | null;
  category: ComplaintCategory;
  priority: TicketPriority;
  description: string;
  status: ComplaintStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit ──────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'ORGANIZATION_CREATED'
  | 'ORGANIZATION_UPDATED'
  | 'ORGANIZATION_SUSPENDED'
  | 'ORGANIZATION_REACTIVATED'
  | 'CLIENT_ADMIN_CREATED'
  | 'CLIENT_ADMIN_DISABLED'
  | 'CLIENT_ADMIN_ENABLED'
  | 'PASSWORD_RESET_INITIATED'
  | 'SESSION_REVOKED'
  | 'FACILITY_APPROVED'
  | 'FACILITY_CHANGES_REQUESTED'
  | 'FACILITY_REJECTED'
  | 'FACILITY_SUSPENDED'
  | 'PLAN_CREATED'
  | 'PLAN_UPDATED'
  | 'SUBSCRIPTION_CHANGED'
  | 'SUBSCRIPTION_CANCELLED'
  | 'INVOICE_UPDATED'
  | 'ROLE_CHANGED'
  | 'SETTINGS_CHANGED'
  | 'SUPER_ADMIN_LOGIN'
  | 'SUPER_ADMIN_LOGOUT';

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  organizationId: string | null;
  organizationName: string | null;
  metadata: Record<string, string | number | boolean>;
  timestamp: string;
}

// ─── Security ───────────────────────────────────────────────────────────────

export interface SecurityOverview {
  failedLoginAttempts: number;
  lockedAccounts: number;
  disabledAccounts: number;
  recentPasswordResets: number;
  activeSessions: number;
  recentSecurityEvents: AuditLog[];
}

// ─── System Health ──────────────────────────────────────────────────────────

export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | 'UNKNOWN';

export interface SystemService {
  name: string;
  status: ServiceStatus;
  latency: number | null;
  lastChecked: string | null;
  message: string | null;
}

// ─── RBAC ───────────────────────────────────────────────────────────────────

export type SuperAdminRole =
  | 'PLATFORM_OWNER'
  | 'SUPER_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'FINANCE_ADMIN'
  | 'SECURITY_ADMIN';

export interface SuperAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: SuperAdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface SADashboardData {
  organizations: {
    total: number;
    active: number;
  };
  subscriptions: {
    active: number;
  };
  facilities: {
    total: number;
    live: number;
    pendingApproval: number;
  };
  revenue: {
    currentPeriod: number;
    paid: number;
    outstanding: number;
    overdue: number;
    history: { date: string; amount: number }[];
  };
  platform: {
    bookingsToday: number;
    activeSessions: number;
  };
  digitalTwins: {
    connected: number;
    disconnected: number;
    degraded: number;
  };
  devices: {
    online: number;
    offline: number;
    warning: number;
  };
  support: {
    openTickets: number;
    openComplaints: number;
  };
}

export interface SADashboardAlert {
  id: string;
  type: 'DIGITAL_TWIN' | 'DEVICE' | 'APPROVAL' | 'SUBSCRIPTION' | 'PAYMENT' | 'TICKET' | 'SECURITY';
  title: string;
  resource: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface SADashboardOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  facilities: number;
  plan: string;
  status: OrganizationStatus;
  createdAt: string;
}

export interface SADashboardFacilityApproval {
  id: string;
  name: string;
  organizationName: string;
  city: string;
  submittedAt: string;
  readinessScore: number;
  totalChecks: number;
}

export interface SADashboardSystemHealth {
  service: 'Node.js API' | 'Database' | 'WebSocket' | 'Authentication' | 'Payment Integration' | 'Notification Service' | 'Computer Vision Service';
  status: 'Operational' | 'Degraded' | 'Offline' | 'Unknown';
}

// ─── Notifications ──────────────────────────────────────────────────────────

export type NotificationType =
  | 'FACILITY_GO_LIVE_REQUEST'
  | 'DEVICE_OFFLINE'
  | 'DIGITAL_TWIN_DISCONNECTED'
  | 'SUBSCRIPTION_PAST_DUE'
  | 'CRITICAL_COMPLAINT'
  | 'SECURITY_EVENT'
  | 'SYSTEM_INCIDENT'
  | 'TICKET_ESCALATION';

export interface SANotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: string;
}

// ─── Global Search ──────────────────────────────────────────────────────────

export interface SearchResult {
  type: 'organization' | 'facility' | 'client_admin' | 'invoice' | 'ticket';
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

// ─── Platform Settings ──────────────────────────────────────────────────────

export interface PlatformSettings {
  credentialExpirationDays: number;
  defaultBookingGraceMinutes: number;
  facilityApprovalRequired: boolean;
  supportEmail: string;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
}
