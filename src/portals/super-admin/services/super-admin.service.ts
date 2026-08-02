// ─── Super Admin Mock Service Layer ─────────────────────────────────────────
// Simulates REST API backend. All data starts EMPTY (zero-data rule).
// Uses in-memory Maps for O(1) lookups. Persists to localStorage for demo.

import type {
  Organization, CreateOrganizationPayload, OrganizationStatus,
  ClientAdmin, ClientAdminStatus,
  OnboardingEntry, OnboardingStage,
  SAFacility, FacilityApprovalStatus, FacilityReviewComment,
  DigitalTwinEntry,
  Device, DeviceStatus,
  Incident, IncidentStatus,
  SaaSPlan,
  Subscription, SubscriptionStatus,
  Invoice, InvoiceStatus,
  RevenueMetrics,
  SupportTicket, TicketStatus,
  Complaint, ComplaintStatus,
  AuditLog, AuditAction,
  SecurityOverview,
  SystemService,
  SANotification,
  SearchResult,
  PlatformSettings,
  PaginationParams, PaginatedResponse,
  SADashboardData,
  SADashboardAlert,
  SADashboardOrganization,
  SADashboardFacilityApproval,
  SADashboardSystemHealth
} from '../types/super-admin.types';
import { 
  mockDashboardData,
  mockDashboardAlerts,
  mockDashboardOrganizations,
  mockDashboardApprovals,
  mockDashboardSystemHealth
} from './dashboard.mock';
import { mockUsers, normalizeEmail, persistMockUsers } from '../../../services/api.mock';
import { secondaryAuth, db } from '../../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { ref, set, get, child, onValue } from 'firebase/database';

// ─── Storage Keys ───────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'parkease_sa_';
const keys = {
  orgs: `${STORAGE_PREFIX}organizations`,
  admins: `${STORAGE_PREFIX}client_admins`,
  facilities: `${STORAGE_PREFIX}facilities`,
  plans: `${STORAGE_PREFIX}plans`,
  subscriptions: `${STORAGE_PREFIX}subscriptions`,
  invoices: `${STORAGE_PREFIX}invoices`,
  tickets: `${STORAGE_PREFIX}tickets`,
  complaints: `${STORAGE_PREFIX}complaints`,
  audit: `${STORAGE_PREFIX}audit_logs`,
  notifications: `${STORAGE_PREFIX}notifications`,
  reviewComments: `${STORAGE_PREFIX}review_comments`,
  settings: `${STORAGE_PREFIX}settings`,
} as const;

// ─── In-Memory Store ────────────────────────────────────────────────────────

const store = {
  organizations: new Map<string, Organization>(),
  clientAdmins: new Map<string, ClientAdmin>(),
  facilities: new Map<string, SAFacility>(),
  plans: new Map<string, SaaSPlan>(),
  subscriptions: new Map<string, Subscription>(),
  invoices: new Map<string, Invoice>(),
  tickets: new Map<string, SupportTicket>(),
  complaints: new Map<string, Complaint>(),
  auditLogs: [] as AuditLog[],
  notifications: [] as SANotification[],
  reviewComments: [] as FacilityReviewComment[],
  settings: {
    credentialExpirationDays: 7,
    defaultBookingGraceMinutes: 15,
    facilityApprovalRequired: true,
    supportEmail: 'support@parkease.ai',
    notificationsEnabled: true,
    maintenanceMode: false,
  } as PlatformSettings,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const delay = (ms = 300) => new Promise<void>(r => setTimeout(r, ms));
const now = () => new Date().toISOString();

function persist<T>(key: string, map: Map<string, T>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(map.values())));
  } catch { /* ignore quota errors */ }
}

function persistArray(key: string, arr: unknown[]) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch { /* ignore */ }
}

function hydrateMap<T extends { id: string }>(key: string, map: Map<string, T>) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const items: T[] = JSON.parse(raw);
    items.forEach(item => map.set(item.id, item));
  } catch { /* ignore */ }
}

function hydrateArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

// Hydrate on module load
hydrateMap(keys.orgs, store.organizations);
hydrateMap(keys.admins, store.clientAdmins);
hydrateMap(keys.facilities, store.facilities);
hydrateMap(keys.plans, store.plans);
hydrateMap(keys.subscriptions, store.subscriptions);
hydrateMap(keys.invoices, store.invoices);
hydrateMap(keys.tickets, store.tickets);
hydrateMap(keys.complaints, store.complaints);
store.auditLogs = hydrateArray(keys.audit);
store.notifications = hydrateArray(keys.notifications);
store.reviewComments = hydrateArray(keys.reviewComments);
try {
  const raw = localStorage.getItem(keys.settings);
  if (raw) store.settings = { ...store.settings, ...JSON.parse(raw) };
} catch { /* ignore */ }

// ─── Dev Utility: Reset All Data ────────────────────────────────────────────

export function clearAllSAData(): void {
  // Clear all SA store keys
  Object.values(keys).forEach(k => localStorage.removeItem(k));
  // Clear auth mock stores
  localStorage.removeItem('mockPasswords');
  localStorage.removeItem('parkease_mock_users');
  // Reset in-memory store
  store.organizations.clear();
  store.clientAdmins.clear();
  store.facilities.clear();
  store.subscriptions.clear();
  store.invoices.clear();
  store.tickets.clear();
  store.complaints.clear();
  store.auditLogs = [];
  store.notifications = [];
  store.reviewComments = [];
}


// ─── Pagination Helper ─────────────────────────────────────────────────────

function paginate<T>(items: T[], params: PaginationParams): PaginatedResponse<T> {
  const { page = 1, pageSize = 20 } = params;
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { data: items.slice(start, start + pageSize), total, page, pageSize, totalPages };
}

// ─── Audit Helper ───────────────────────────────────────────────────────────

function addAudit(action: AuditAction, resource: string, resourceId: string, orgId?: string | null, orgName?: string | null, metadata: Record<string, string | number | boolean> = {}) {
  const entry: AuditLog = {
    id: uid(),
    actor: 'Super Admin',
    actorRole: 'SUPER_ADMIN',
    action,
    resource,
    resourceId,
    organizationId: orgId ?? null,
    organizationName: orgName ?? null,
    metadata,
    timestamp: now(),
  };
  store.auditLogs.unshift(entry);
  if (store.auditLogs.length > 500) store.auditLogs = store.auditLogs.slice(0, 500);
  persistArray(keys.audit, store.auditLogs);
}

function addNotification(type: SANotification['type'], title: string, message: string, link: string) {
  const n: SANotification = { id: uid(), type, title, message, read: false, link, createdAt: now() };
  store.notifications.unshift(n);
  if (store.notifications.length > 100) store.notifications = store.notifications.slice(0, 100);
  persistArray(keys.notifications, store.notifications);
}

// ─── Service ────────────────────────────────────────────────────────────────

export const SuperAdminService = {
  async getSupportTickets(params?: any) { return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 }; },


  // ─── Dashboard ──────────────────────────────────────────────────────────

  async getDashboard(): Promise<{ 
    metrics: SADashboardData; 
    alerts: SADashboardAlert[];
    organizations: SADashboardOrganization[];
    approvals: SADashboardFacilityApproval[];
    health: SADashboardSystemHealth[];
  }> {
    await delay(800);
    // Fetch facilities from Firebase Realtime DB
    let approvals: SADashboardFacilityApproval[] = [];
    try {
      const facilitiesSnapshot = await get(child(ref(db), 'facilities'));
      if (facilitiesSnapshot.exists()) {
        const firebaseFacilities = Object.values(facilitiesSnapshot.val()) as any[];
        
        // Also fetch tenants to map tenantId to organizationName
        const tenantsSnapshot = await get(child(ref(db), 'tenants'));
        const tenants = tenantsSnapshot.exists() ? tenantsSnapshot.val() : {};

        approvals = firebaseFacilities
          .filter(f => f.status === 'PENDING_APPROVAL')
          .map(f => ({
            id: f.id,
            name: f.name,
            organizationName: tenants[f.tenantId]?.name || 'Unknown Organization',
            city: f.city || 'Unknown',
            submittedAt: f.updatedAt || f.createdAt || new Date().toISOString(),
            readinessScore: f.pricingConfigured ? 100 : 50,
            totalChecks: 2
          }));
      }
    } catch (err) {
      console.error('[Firebase] Failed to fetch approvals:', err);
    }

    return {
      metrics: mockDashboardData,
      alerts: mockDashboardAlerts,
      organizations: mockDashboardOrganizations,
      approvals,
      health: mockDashboardSystemHealth
    };
  },

  subscribeToApprovals(callback: (approvals: SADashboardFacilityApproval[]) => void): () => void {
    const facilitiesRef = ref(db, 'facilities');
    const tenantsRef = ref(db, 'tenants');
    
    let currentTenants: Record<string, any> = {};
    
    const unsubscribeTenants = onValue(tenantsRef, (snapshot: any) => {
      if (snapshot.exists()) {
        currentTenants = snapshot.val();
      }
    });

    const unsubscribeFacilities = onValue(facilitiesRef, (snapshot: any) => {
      if (snapshot.exists()) {
        const firebaseFacilities = Object.values(snapshot.val()) as any[];
        const approvals = firebaseFacilities
          .filter(f => f.status === 'PENDING_APPROVAL')
          .map(f => ({
            id: f.id,
            name: f.name,
            organizationName: currentTenants[f.tenantId]?.name || 'Unknown Organization',
            city: f.city || 'Unknown',
            submittedAt: f.updatedAt || f.createdAt || new Date().toISOString(),
            readinessScore: f.pricingConfigured ? 100 : 50,
            totalChecks: 2
          }));
        callback(approvals);
      } else {
        callback([]);
      }
    });

    return () => {
      unsubscribeTenants();
      unsubscribeFacilities();
    };
  },

  // ─── Organizations ──────────────────────────────────────────────────────

  async getOrganizations(params: PaginationParams & { status?: string; type?: string; plan?: string }): Promise<PaginatedResponse<Organization>> {
    await delay();
    let items = Array.from(store.organizations.values());
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(o => o.name.toLowerCase().includes(q) || o.businessName.toLowerCase().includes(q) || o.primaryContact.email.toLowerCase().includes(q));
    }
    if (params.status) items = items.filter(o => o.status === params.status);
    if (params.type) items = items.filter(o => o.type === params.type);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async getOrganization(id: string): Promise<Organization | null> {
    await delay(150);
    return store.organizations.get(id) ?? null;
  },

  async createOrganization(payload: CreateOrganizationPayload): Promise<{ organization: Organization; clientAdmin: ClientAdmin; subscription: Subscription; temporaryPassword: string }> {
    await delay(600);
    const orgId = uid();
    const subId = uid();
    const adminId = uid();
    const plan = store.plans.get(payload.subscription.planId);

    const org: Organization = {
      id: orgId,
      name: payload.organization.name,
      businessName: payload.organization.businessName,
      type: payload.organization.type,
      website: payload.organization.website,
      status: 'ONBOARDING',
      primaryContact: payload.contact,
      address: payload.address,
      facilityCount: 0,
      planId: payload.subscription.planId,
      subscriptionId: subId,
      createdAt: now(),
      updatedAt: now(),
    };

    const sub: Subscription = {
      id: subId,
      organizationId: orgId,
      organizationName: org.name,
      planId: payload.subscription.planId,
      planName: plan?.name ?? 'Unknown',
      billingCycle: payload.subscription.billingCycle,
      amount: plan ? (payload.subscription.billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.annualPrice) : 0,
      startDate: payload.subscription.startDate,
      renewalDate: payload.subscription.billingCycle === 'MONTHLY'
        ? new Date(new Date(payload.subscription.startDate).getTime() + 30 * 86400000).toISOString()
        : new Date(new Date(payload.subscription.startDate).getTime() + 365 * 86400000).toISOString(),
      status: 'ACTIVE',
      createdAt: now(),
    };

    const adminEmail = normalizeEmail(payload.clientAdmin.email);
    const admin: ClientAdmin = {
      id: adminId,
      firstName: payload.clientAdmin.firstName,
      lastName: payload.clientAdmin.lastName,
      email: adminEmail,
      phone: payload.clientAdmin.phone,
      organizationId: orgId,
      organizationName: org.name,
      role: 'CLIENT_OWNER',
      status: 'INVITED',
      mustChangePassword: true,
      lastLoginAt: null,
      createdAt: now(),
    };

    store.organizations.set(orgId, org);
    store.subscriptions.set(subId, sub);
    store.clientAdmins.set(adminId, admin);

    persist(keys.orgs, store.organizations);
    persist(keys.subscriptions, store.subscriptions);
    persist(keys.admins, store.clientAdmins);

    addAudit('ORGANIZATION_CREATED', 'Organization', orgId, orgId, org.name, { type: org.type });
    addAudit('CLIENT_ADMIN_CREATED', 'ClientAdmin', adminId, orgId, org.name, { email: admin.email });

    // Generate first invoice
    const invId = uid();
    const inv: Invoice = {
      id: invId,
      organizationId: orgId,
      organizationName: org.name,
      planName: sub.planName,
      billingPeriod: `${new Date(sub.startDate).toLocaleDateString('en-IN')} — ${new Date(sub.renewalDate).toLocaleDateString('en-IN')}`,
      amount: sub.amount,
      dueDate: sub.startDate,
      paidDate: null,
      status: 'ISSUED',
      createdAt: now(),
    };
    store.invoices.set(invId, inv);
    persist(keys.invoices, store.invoices);

    const temporaryPassword = `Temp${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random() * 90 + 10)}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        adminEmail,
        temporaryPassword
      );
      
      await updateProfile(userCredential.user, {
        displayName: `${admin.firstName} ${admin.lastName}`.trim(),
        photoURL: 'FORCE_RESET'
      });

      // Save user profile to Realtime DB
      await set(ref(db, `users/${userCredential.user.uid}`), {
        id: userCredential.user.uid,
        email: adminEmail,
        role: 'CLIENT_OWNER',
        tenantId: orgId,
        firstName: admin.firstName,
        lastName: admin.lastName,
        isEmailVerified: true,
        accountStatus: 'ACTIVE',
        requiresPasswordChange: true,
        createdAt: now()
      });
      
      // Save the organization tenant to DB
      await set(ref(db, `tenants/${orgId}`), {
        id: orgId,
        name: org.name,
        slug: org.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'ACTIVE',
        createdAt: now(),
        updatedAt: now()
      });

      await signOut(secondaryAuth);
    } catch (error: any) {
      console.error('[Firebase] Failed to provision client admin:', error);
      throw new Error(`Failed to create admin account: ${error.message}`);
    }

    const mockPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    mockPasswords[adminEmail] = temporaryPassword;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    // Sync to mockUsers — the single auth source of truth
    mockUsers.push({
      id: adminId,
      email: adminEmail,
      role: 'CLIENT_OWNER',
      tenantId: orgId,
      firstName: admin.firstName,
      lastName: admin.lastName,
      isEmailVerified: true,
      requiresPasswordChange: true,
      accountStatus: 'ACTIVE',
      onboardingStatus: 'ACCOUNT_CREATED',
      createdAt: now()
    });
    persistMockUsers();

    return { organization: org, clientAdmin: admin, subscription: sub, temporaryPassword };
  },

  async updateOrganizationStatus(id: string, status: OrganizationStatus, reason?: string): Promise<Organization | null> {
    await delay();
    const org = store.organizations.get(id);
    if (!org) return null;
    org.status = status;
    org.updatedAt = now();
    store.organizations.set(id, org);
    persist(keys.orgs, store.organizations);
    const action: AuditAction = status === 'SUSPENDED' ? 'ORGANIZATION_SUSPENDED' : 'ORGANIZATION_REACTIVATED';
    addAudit(action, 'Organization', id, id, org.name, reason ? { reason } : {});
    return org;
  },

  async deleteOrganization(id: string): Promise<void> {
    await delay(400);
    const org = store.organizations.get(id);
    if (!org) return;

    // Cascade: remove client admins for this org
    const adminsToDelete = Array.from(store.clientAdmins.values()).filter(a => a.organizationId === id);
    const mockPasswords: Record<string, string> = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    
    for (const admin of adminsToDelete) {
      // Remove from mockUsers auth store
      const idx = mockUsers.findIndex(u => u.id === admin.id || u.email === normalizeEmail(admin.email));
      if (idx !== -1) mockUsers.splice(idx, 1);
      // Remove password
      delete mockPasswords[normalizeEmail(admin.email)];
      // Remove from clientAdmins store
      store.clientAdmins.delete(admin.id);
    }

    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
    persistMockUsers();
    persist(keys.admins, store.clientAdmins);

    // Cascade: remove subscriptions
    Array.from(store.subscriptions.values()).filter(s => s.organizationId === id).forEach(s => store.subscriptions.delete(s.id));
    persist(keys.subscriptions, store.subscriptions);

    // Cascade: remove invoices
    Array.from(store.invoices.values()).filter(i => i.organizationId === id).forEach(i => store.invoices.delete(i.id));
    persist(keys.invoices, store.invoices);

    // Cascade: remove facilities
    Array.from(store.facilities.values()).filter(f => f.organizationId === id).forEach(f => store.facilities.delete(f.id));
    persist(keys.facilities, store.facilities);

    // Remove organization
    store.organizations.delete(id);
    persist(keys.orgs, store.organizations);

    addAudit('ORGANIZATION_CREATED', 'Organization', id, id, org.name, { action: 'DELETED' });
  },

  // ─── Client Admins ──────────────────────────────────────────────────────

  async getClientAdmins(params: PaginationParams & { status?: string; organizationId?: string }): Promise<PaginatedResponse<ClientAdmin>> {
    await delay();
    let items = Array.from(store.clientAdmins.values());
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.organizationName.toLowerCase().includes(q));
    }
    if (params.status) items = items.filter(a => a.status === params.status);
    if (params.organizationId) items = items.filter(a => a.organizationId === params.organizationId);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async updateClientAdminStatus(id: string, status: ClientAdminStatus): Promise<ClientAdmin | null> {
    await delay();
    const admin = store.clientAdmins.get(id);
    if (!admin) return null;
    admin.status = status;
    store.clientAdmins.set(id, admin);
    persist(keys.admins, store.clientAdmins);
    
    // Also update mockUser for auth flow
    const authUser = mockUsers.find((u: any) => u.id === id || u.email === admin.email);
    if (authUser) {
      authUser.accountStatus = status === 'DISABLED' ? 'DISABLED' : 'ACTIVE';
      persistMockUsers();
    }

    const action: AuditAction = status === 'DISABLED' ? 'CLIENT_ADMIN_DISABLED' : 'CLIENT_ADMIN_ENABLED';
    addAudit(action, 'ClientAdmin', id, admin.organizationId, admin.organizationName, { email: admin.email });
    return admin;
  },

  async resetClientAdminPassword(id: string): Promise<{ tempPassword: string }> {
    await delay(400);
    const admin = store.clientAdmins.get(id);
    if (!admin) throw new Error('Admin not found');
    admin.mustChangePassword = true;
    store.clientAdmins.set(id, admin);
    persist(keys.admins, store.clientAdmins);
    
    // Update mockUser
    const authUser = mockUsers.find((u: any) => u.id === id || u.email === admin.email);
    if (authUser) {
      authUser.requiresPasswordChange = true;
      persistMockUsers();
    }

    addAudit('PASSWORD_RESET_INITIATED', 'ClientAdmin', id, admin.organizationId, admin.organizationName, { email: admin.email });
    const tempPassword = `Temp${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random() * 90 + 10)}`;
    
    // Save to mock passwords for login simulator
    const normalizedEmail = normalizeEmail(admin.email);
    const mockPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    mockPasswords[normalizedEmail] = tempPassword;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    return { tempPassword };
  },

  async createClientAdmin(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    organizationId: string;
    role?: string;
  }): Promise<{ user: ClientAdmin; temporaryPassword: string }> {
    await delay(600);
    const org = store.organizations.get(payload.organizationId);
    if (!org) throw new Error("Organization not found.");
    
    // Check duplicate
    const normalizedEmail = normalizeEmail(payload.email);
    const existing = Array.from(store.clientAdmins.values()).find(a => normalizeEmail(a.email) === normalizedEmail);
    if (existing) {
      throw new Error("An account already exists with this email address.");
    }

    const adminId = uid();
    const admin: ClientAdmin = {
      id: adminId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: normalizedEmail,
      phone: payload.phone || '',
      organizationId: org.id,
      organizationName: org.name,
      role: 'CLIENT_ADMIN',
      status: 'INVITED',
      mustChangePassword: true,
      lastLoginAt: null,
      createdAt: now(),
    };

    store.clientAdmins.set(adminId, admin);
    persist(keys.admins, store.clientAdmins);

    // Sync to mockUsers — the single auth source of truth
    mockUsers.push({
      id: adminId,
      email: normalizedEmail,
      role: 'CLIENT_ADMIN',
      tenantId: org.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      isEmailVerified: true,
      requiresPasswordChange: true,
      accountStatus: 'ACTIVE',
      onboardingStatus: 'ACCOUNT_CREATED',
      createdAt: now()
    });
    persistMockUsers();

    addAudit('CLIENT_ADMIN_CREATED', 'ClientAdmin', adminId, org.id, org.name, { email: admin.email });

    const temporaryPassword = `Temp${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random() * 90 + 10)}`;
    
    const mockPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    mockPasswords[normalizedEmail] = temporaryPassword;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    return { user: admin, temporaryPassword };
  },

  async deleteClientAdmin(id: string): Promise<void> {
    await delay(300);
    const admin = store.clientAdmins.get(id);
    if (!admin) return;

    // Remove from mockUsers
    const idx = mockUsers.findIndex(u => u.id === id || u.email === normalizeEmail(admin.email));
    if (idx !== -1) mockUsers.splice(idx, 1);
    persistMockUsers();

    // Remove password
    const mockPasswords: Record<string, string> = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    delete mockPasswords[normalizeEmail(admin.email)];
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    // Remove from store
    store.clientAdmins.delete(id);
    persist(keys.admins, store.clientAdmins);

    addAudit('CLIENT_ADMIN_DISABLED', 'ClientAdmin', id, admin.organizationId, admin.organizationName, { email: admin.email, action: 'DELETED' });
  },

  // ─── Onboarding ─────────────────────────────────────────────────────────

  async getOnboardingPipeline(): Promise<OnboardingEntry[]> {
    await delay();
    return Array.from(store.organizations.values()).map(org => {
      const admins = Array.from(store.clientAdmins.values()).filter(a => a.organizationId === org.id);
      const facilities = Array.from(store.facilities.values()).filter(f => f.organizationId === org.id);
      const hasAdmin = admins.length > 0;
      const adminLoggedIn = admins.some(a => a.lastLoginAt !== null);
      const passwordChanged = admins.some(a => !a.mustChangePassword);
      const hasFacility = facilities.length > 0;
      const hasTwin = facilities.some(f => f.digitalTwinStatus !== 'NOT_CONFIGURED');
      const requested = facilities.some(f => f.approvalStatus === 'UNDER_REVIEW');
      const approved = facilities.some(f => f.approvalStatus === 'APPROVED');
      const live = facilities.some(f => f.approvalStatus === 'LIVE');

      let currentStage: OnboardingStage = 'ACCOUNT_CREATED';
      if (hasAdmin) currentStage = 'CLIENT_ADMIN_CREATED';
      if (adminLoggedIn) currentStage = 'FIRST_LOGIN';
      if (passwordChanged) currentStage = 'PASSWORD_CHANGED';
      if (org.status === 'ACTIVE') currentStage = 'PROFILE_COMPLETED';
      if (hasFacility) currentStage = 'FACILITY_CREATED';
      if (hasTwin) currentStage = 'DIGITAL_TWIN_CONFIGURED';
      if (requested) currentStage = 'UNDER_REVIEW';
      if (approved) currentStage = 'GO_LIVE_REQUESTED';
      if (live) currentStage = 'LIVE';

      const stageCompletedAt: Record<OnboardingStage, string | null> = {
        ACCOUNT_CREATED: org.createdAt,
        CLIENT_ADMIN_CREATED: hasAdmin ? admins[0].createdAt : null,
        FIRST_LOGIN: adminLoggedIn ? admins.find(a => a.lastLoginAt)?.lastLoginAt ?? null : null,
        PASSWORD_CHANGED: passwordChanged ? now() : null,
        PROFILE_COMPLETED: org.status === 'ACTIVE' ? org.updatedAt : null,
        FACILITY_CREATED: hasFacility ? facilities[0].createdAt : null,
        DIGITAL_TWIN_CONFIGURED: hasTwin ? facilities.find(f => f.digitalTwinStatus !== 'NOT_CONFIGURED')?.updatedAt ?? null : null,
        GO_LIVE_REQUESTED: requested ? facilities.find(f => f.approvalStatus === 'UNDER_REVIEW')?.submittedAt ?? null : null,
        UNDER_REVIEW: requested ? now() : null,
        LIVE: live ? facilities.find(f => f.approvalStatus === 'LIVE')?.approvedAt ?? null : null,
      };

      return { organizationId: org.id, organizationName: org.name, type: org.type, currentStage, stageCompletedAt, createdAt: org.createdAt };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // ─── Facilities ─────────────────────────────────────────────────────────

  async getFacilities(params: PaginationParams & { status?: string; organizationId?: string; type?: string }): Promise<PaginatedResponse<SAFacility>> {
    await delay();
    let items = Array.from(store.facilities.values());
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(f => f.name.toLowerCase().includes(q) || f.organizationName.toLowerCase().includes(q) || f.city.toLowerCase().includes(q));
    }
    if (params.status) items = items.filter(f => f.approvalStatus === params.status);
    if (params.organizationId) items = items.filter(f => f.organizationId === params.organizationId);
    if (params.type) items = items.filter(f => f.type === params.type);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async getFacility(id: string): Promise<SAFacility | null> {
    await delay(150);
    const facRef = ref(db, `facilities/${id}`);
    const snapshot = await get(facRef);
    if (!snapshot.exists()) return null;
    
    const f = snapshot.val();
    
    const tenantRef = ref(db, `tenants/${f.tenantId}`);
    const tenantSnap = await get(tenantRef);
    const orgName = tenantSnap.exists() ? tenantSnap.val().name : 'Unknown Organization';
    
    return {
      id: f.id,
      name: f.name,
      organizationId: f.tenantId,
      organizationName: orgName,
      city: f.city || 'Unknown',
      state: f.state || 'Unknown',
      type: f.type || 'COMMERCIAL',
      approvalStatus: f.status === 'PENDING_APPROVAL' ? 'UNDER_REVIEW' : f.status,
      capacity: f.totalCapacity || 0,
      currentOccupancy: 0,
      floors: f.floors || 1,
      slots: f.totalCapacity || 0,
      digitalTwinStatus: 'NOT_CONFIGURED',
      deviceHealth: 'NO_DEVICES',
      bookingsToday: 0,
      submittedAt: f.status === 'PENDING_APPROVAL' ? (f.updatedAt || f.createdAt) : null,
      approvedAt: f.approvedAt || null,
      createdAt: f.createdAt || new Date().toISOString(),
      updatedAt: f.updatedAt || new Date().toISOString(),
      pricingConfigured: f.pricingConfigured || false,
      entryExitConfigured: false
    };
  },

  subscribeToFacilityApprovals(params: PaginationParams & { status?: string }, callback: (res: PaginatedResponse<SAFacility>) => void): () => void {
    const facilitiesRef = ref(db, 'facilities');
    const tenantsRef = ref(db, 'tenants');
    
    let currentTenants: Record<string, any> = {};
    
    const unsubscribeTenants = onValue(tenantsRef, (snapshot: any) => {
      if (snapshot.exists()) {
        currentTenants = snapshot.val();
      }
    });

    const unsubscribeFacilities = onValue(facilitiesRef, (snapshot: any) => {
      if (snapshot.exists()) {
        const firebaseFacilities = Object.values(snapshot.val()) as any[];
        
        let items: SAFacility[] = firebaseFacilities
          .filter(f => ['PENDING_APPROVAL', 'CHANGES_REQUESTED', 'APPROVED', 'DRAFT'].includes(f.status))
          .map(f => ({
            id: f.id,
            name: f.name,
            organizationId: f.tenantId,
            organizationName: currentTenants[f.tenantId]?.name || 'Unknown Organization',
            city: f.city || 'Unknown',
            state: f.state || 'Unknown',
            type: f.type || 'COMMERCIAL',
            approvalStatus: f.status === 'PENDING_APPROVAL' ? 'UNDER_REVIEW' : f.status,
            capacity: f.totalCapacity || 0,
            currentOccupancy: 0,
            floors: f.floors || 1,
            slots: f.totalCapacity || 0,
            digitalTwinStatus: 'NOT_CONFIGURED',
            deviceHealth: 'NO_DEVICES',
            bookingsToday: 0,
            submittedAt: f.status === 'PENDING_APPROVAL' ? (f.updatedAt || f.createdAt) : null,
            approvedAt: f.approvedAt || null,
            createdAt: f.createdAt || new Date().toISOString(),
            updatedAt: f.updatedAt || new Date().toISOString(),
            pricingConfigured: f.pricingConfigured || false,
            entryExitConfigured: false
          }));

        if (params.status) {
          items = items.filter(f => f.approvalStatus === params.status);
        }
        
        if (params.search) {
          const q = params.search.toLowerCase();
          items = items.filter(f => f.name.toLowerCase().includes(q) || f.organizationName.toLowerCase().includes(q));
        }
        
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const total = items.length;
        const totalPages = Math.ceil(total / params.pageSize);
        const pagedData = items.slice((params.page - 1) * params.pageSize, params.page * params.pageSize);
        
        callback({
          data: pagedData,
          total,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: totalPages === 0 ? 1 : totalPages
        });
      } else {
        callback({ data: [], total: 0, page: 1, pageSize: params.pageSize, totalPages: 1 });
      }
    });

    return () => {
      unsubscribeTenants();
      unsubscribeFacilities();
    };
  },

  async approveFacility(id: string, comment?: string): Promise<SAFacility | null> {
    await delay(400);
    const facRef = ref(db, `facilities/${id}`);
    const snapshot = await get(facRef);
    if (!snapshot.exists()) return null;
    
    const facility = snapshot.val();
    const ts = new Date().toISOString();
    
    await set(facRef, {
      ...facility,
      status: 'APPROVED',
      approvedAt: ts,
      updatedAt: ts
    });
    
    addAudit('FACILITY_APPROVED', 'Facility', id, facility.tenantId, 'Organization');
    store.reviewComments.push({ id: uid(), facilityId: id, actorId: 'sa-1', actorName: 'Super Admin', action: 'APPROVED', comment: comment ?? 'Approved for Go-Live', createdAt: now() });
    persistArray(keys.reviewComments, store.reviewComments);
    
    // Update the mock user's onboardingStatus
    const authUser = mockUsers.find((u: any) => u.tenantId === facility.tenantId);
    if (authUser) {
      authUser.onboardingStatus = 'APPROVED';
      persistMockUsers();
    }
    
    return this.getFacility(id);
  },

  async requestFacilityChanges(id: string, comment: string): Promise<SAFacility | null> {
    await delay(400);
    const facRef = ref(db, `facilities/${id}`);
    const snapshot = await get(facRef);
    if (!snapshot.exists()) return null;
    
    const facility = snapshot.val();
    const ts = new Date().toISOString();
    
    await set(facRef, {
      ...facility,
      status: 'CHANGES_REQUESTED',
      rejectionReason: comment,
      updatedAt: ts
    });
    
    addAudit('FACILITY_CHANGES_REQUESTED', 'Facility', id, facility.tenantId, 'Organization', { comment });
    store.reviewComments.push({ id: uid(), facilityId: id, actorId: 'sa-1', actorName: 'Super Admin', action: 'CHANGES_REQUESTED', comment, createdAt: now() });
    persistArray(keys.reviewComments, store.reviewComments);

    return this.getFacility(id);
  },

  async rejectFacility(id: string, reason: string): Promise<SAFacility | null> {
    await delay(400);
    const facRef = ref(db, `facilities/${id}`);
    const snapshot = await get(facRef);
    if (!snapshot.exists()) return null;
    
    const facility = snapshot.val();
    const ts = new Date().toISOString();
    
    await set(facRef, {
      ...facility,
      status: 'REJECTED',
      rejectionReason: reason,
      updatedAt: ts
    });
    
    addAudit('FACILITY_REJECTED', 'Facility', id, facility.tenantId, 'Organization', { reason });
    store.reviewComments.push({ id: uid(), facilityId: id, actorId: 'sa-1', actorName: 'Super Admin', action: 'REJECTED', comment: reason, createdAt: now() });
    persistArray(keys.reviewComments, store.reviewComments);

    return this.getFacility(id);
  },

  async suspendFacility(id: string, reason: string): Promise<SAFacility | null> {
    await delay(400);
    const f = store.facilities.get(id);
    if (!f) return null;
    f.approvalStatus = 'SUSPENDED';
    f.updatedAt = now();
    store.facilities.set(id, f);
    persist(keys.facilities, store.facilities);
    addAudit('FACILITY_SUSPENDED', 'Facility', id, f.organizationId, f.organizationName, { reason });
    return f;
  },

  async getFacilityReviewComments(facilityId: string): Promise<FacilityReviewComment[]> {
    await delay(150);
    return store.reviewComments.filter(c => c.facilityId === facilityId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // ─── Digital Twins ──────────────────────────────────────────────────────

  async getDigitalTwins(): Promise<DigitalTwinEntry[]> {
    await delay();
    return Array.from(store.facilities.values()).map(f => ({
      id: `dt-${f.id}`,
      organizationId: f.organizationId,
      organizationName: f.organizationName,
      facilityId: f.id,
      facilityName: f.name,
      publishedVersion: f.digitalTwinStatus !== 'NOT_CONFIGURED' ? 1 : null,
      floors: f.floors,
      slots: f.slots,
      lastUpdated: f.updatedAt,
      wsConnected: f.digitalTwinStatus === 'SYNCED',
      syncStatus: f.digitalTwinStatus,
    }));
  },

  // ─── Devices ────────────────────────────────────────────────────────────

  async getDevices(params: PaginationParams & { type?: string; status?: string; organizationId?: string }): Promise<PaginatedResponse<Device>> {
    await delay();
    // No devices by default — empty state
    const items: Device[] = [];
    return paginate(items, params);
  },

  // ─── Plans ──────────────────────────────────────────────────────────────

  async getPlans(): Promise<SaaSPlan[]> {
    await delay(150);
    return Array.from(store.plans.values()).sort((a, b) => a.monthlyPrice - b.monthlyPrice);
  },

  async createPlan(data: Omit<SaaSPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SaaSPlan> {
    await delay(400);
    const plan: SaaSPlan = { ...data, id: uid(), createdAt: now(), updatedAt: now() };
    store.plans.set(plan.id, plan);
    persist(keys.plans, store.plans);
    addAudit('PLAN_CREATED', 'Plan', plan.id, null, null, { name: plan.name });
    return plan;
  },

  async updatePlan(id: string, data: Partial<SaaSPlan>): Promise<SaaSPlan | null> {
    await delay();
    const plan = store.plans.get(id);
    if (!plan) return null;
    Object.assign(plan, data, { updatedAt: now() });
    store.plans.set(id, plan);
    persist(keys.plans, store.plans);
    addAudit('PLAN_UPDATED', 'Plan', id, null, null, { name: plan.name });
    return plan;
  },

  // ─── Subscriptions ──────────────────────────────────────────────────────

  async getSubscriptions(params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Subscription>> {
    await delay();
    let items = Array.from(store.subscriptions.values());
    if (params.status) items = items.filter(s => s.status === params.status);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(s => s.organizationName.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<Subscription | null> {
    await delay();
    const sub = store.subscriptions.get(id);
    if (!sub) return null;
    sub.status = status;
    store.subscriptions.set(id, sub);
    persist(keys.subscriptions, store.subscriptions);
    addAudit('SUBSCRIPTION_CHANGED', 'Subscription', id, sub.organizationId, sub.organizationName, { status });
    return sub;
  },

  // ─── Invoices ───────────────────────────────────────────────────────────

  async getInvoices(params: PaginationParams & { status?: string; organizationId?: string }): Promise<PaginatedResponse<Invoice>> {
    await delay();
    let items = Array.from(store.invoices.values());
    if (params.status) items = items.filter(i => i.status === params.status);
    if (params.organizationId) items = items.filter(i => i.organizationId === params.organizationId);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(i => i.organizationName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  // ─── Revenue ────────────────────────────────────────────────────────────

  async getRevenue(): Promise<RevenueMetrics> {
    await delay(200);
    const subs = Array.from(store.subscriptions.values());
    const invoices = Array.from(store.invoices.values());
    const activeSubs = subs.filter(s => s.status === 'ACTIVE');
    const mrr = activeSubs.reduce((sum, s) => sum + (s.billingCycle === 'MONTHLY' ? s.amount : s.amount / 12), 0);
    return {
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      totalSaaSRevenue: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0),
      outstandingInvoices: invoices.filter(i => i.status === 'ISSUED' || i.status === 'PAST_DUE').reduce((sum, i) => sum + i.amount, 0),
      newSubscriptions: subs.filter(s => new Date(s.createdAt).getTime() > Date.now() - 30 * 86400000).length,
      cancelledSubscriptions: subs.filter(s => s.status === 'CANCELLED').length,
    };
  },

  // ─── Support ────────────────────────────────────────────────────────────

  async getTickets(params: PaginationParams & { status?: string; category?: string; priority?: string }): Promise<PaginatedResponse<SupportTicket>> {
    await delay();
    let items = Array.from(store.tickets.values());
    if (params.status) items = items.filter(t => t.status === params.status);
    if (params.category) items = items.filter(t => t.category === params.category);
    if (params.priority) items = items.filter(t => t.priority === params.priority);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(t => t.subject.toLowerCase().includes(q) || t.organizationName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicket | null> {
    await delay();
    const t = store.tickets.get(id);
    if (!t) return null;
    t.status = status;
    t.updatedAt = now();
    store.tickets.set(id, t);
    persist(keys.tickets, store.tickets);
    return t;
  },

  // ─── Complaints ─────────────────────────────────────────────────────────

  async getComplaints(params: PaginationParams & { status?: string; category?: string }): Promise<PaginatedResponse<Complaint>> {
    await delay();
    let items = Array.from(store.complaints.values());
    if (params.status) items = items.filter(c => c.status === params.status);
    if (params.category) items = items.filter(c => c.category === params.category);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(c => c.userName.toLowerCase().includes(q) || c.organizationName.toLowerCase().includes(q));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(items, params);
  },

  async updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint | null> {
    await delay();
    const c = store.complaints.get(id);
    if (!c) return null;
    c.status = status;
    c.updatedAt = now();
    store.complaints.set(id, c);
    persist(keys.complaints, store.complaints);
    return c;
  },

  // ─── Audit ──────────────────────────────────────────────────────────────

  async getAuditLogs(params: PaginationParams & { action?: string }): Promise<PaginatedResponse<AuditLog>> {
    await delay();
    let items = [...store.auditLogs];
    if (params.action) items = items.filter(l => l.action === params.action);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(l => l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || (l.organizationName?.toLowerCase() ?? '').includes(q));
    }
    return paginate(items, params);
  },

  // ─── Security ───────────────────────────────────────────────────────────

  async getSecurityOverview(): Promise<SecurityOverview> {
    await delay(200);
    const admins = Array.from(store.clientAdmins.values());
    const recentSecurity = store.auditLogs.filter(l =>
      ['PASSWORD_RESET_INITIATED', 'CLIENT_ADMIN_DISABLED', 'SESSION_REVOKED', 'SUPER_ADMIN_LOGIN'].includes(l.action)
    ).slice(0, 20);

    return {
      failedLoginAttempts: 0,
      lockedAccounts: admins.filter(a => a.status === 'LOCKED').length,
      disabledAccounts: admins.filter(a => a.status === 'DISABLED').length,
      recentPasswordResets: store.auditLogs.filter(l => l.action === 'PASSWORD_RESET_INITIATED').length,
      activeSessions: 1,
      recentSecurityEvents: recentSecurity,
    };
  },

  // ─── System Health ──────────────────────────────────────────────────────

  async getSystemHealth(): Promise<SystemService[]> {
    await delay(300);
    return [
      { name: 'Node.js API', status: 'OPERATIONAL', latency: 45, lastChecked: now(), message: null },
      { name: 'Database', status: 'OPERATIONAL', latency: 12, lastChecked: now(), message: null },
      { name: 'WebSocket', status: 'OPERATIONAL', latency: 8, lastChecked: now(), message: null },
      { name: 'Authentication', status: 'OPERATIONAL', latency: 32, lastChecked: now(), message: null },
      { name: 'Payment Gateway', status: 'UNKNOWN', latency: null, lastChecked: null, message: 'No payment integration configured' },
      { name: 'Notification Service', status: 'UNKNOWN', latency: null, lastChecked: null, message: 'No notification provider configured' },
      { name: 'Computer Vision', status: 'UNKNOWN', latency: null, lastChecked: null, message: 'No CV integration configured' },
      { name: 'Maps Integration', status: 'UNKNOWN', latency: null, lastChecked: null, message: 'No maps provider configured' },
    ];
  },

  // ─── Notifications ──────────────────────────────────────────────────────

  async getNotifications(): Promise<SANotification[]> {
    await delay(100);
    return store.notifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay(50);
    const n = store.notifications.find(n => n.id === id);
    if (n) n.read = true;
    persistArray(keys.notifications, store.notifications);
  },

  async markAllNotificationsRead(): Promise<void> {
    await delay(50);
    store.notifications.forEach(n => n.read = true);
    persistArray(keys.notifications, store.notifications);
  },

  getUnreadCount(): number {
    // Re-read from localStorage to pick up notifications written by other services (e.g. Client Admin)
    try {
      const raw = localStorage.getItem(keys.notifications);
      if (raw) {
        const fromStorage: SANotification[] = JSON.parse(raw);
        // Merge: update in-memory store with any new entries
        const inMemoryIds = new Set(store.notifications.map(n => n.id));
        fromStorage.forEach(n => {
          if (!inMemoryIds.has(n.id)) store.notifications.unshift(n);
        });
      }
    } catch { /* ignore */ }
    return store.notifications.filter(n => !n.read).length;
  },

  // ─── Settings ───────────────────────────────────────────────────────────

  async getSettings(): Promise<PlatformSettings> {
    await delay(100);
    return { ...store.settings };
  },

  async updateSettings(data: Partial<PlatformSettings>): Promise<PlatformSettings> {
    await delay(300);
    Object.assign(store.settings, data);
    try { localStorage.setItem(keys.settings, JSON.stringify(store.settings)); } catch { /* ignore */ }
    addAudit('SETTINGS_CHANGED', 'Settings', 'platform', null, null, data as Record<string, string | number | boolean>);
    return { ...store.settings };
  },

  // ─── Global Search ──────────────────────────────────────────────────────

  async search(query: string): Promise<SearchResult[]> {
    await delay(200);
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    store.organizations.forEach(o => {
      if (o.name.toLowerCase().includes(q) || o.businessName.toLowerCase().includes(q)) {
        results.push({ type: 'organization', id: o.id, title: o.name, subtitle: `${o.type} · ${o.status}`, link: `/super-admin/organizations/${o.id}` });
      }
    });

    store.facilities.forEach(f => {
      if (f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q)) {
        results.push({ type: 'facility', id: f.id, title: f.name, subtitle: `${f.organizationName} · ${f.city}`, link: `/super-admin/facilities/${f.id}` });
      }
    });

    store.clientAdmins.forEach(a => {
      if (`${a.firstName} ${a.lastName}`.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) {
        results.push({ type: 'client_admin', id: a.id, title: `${a.firstName} ${a.lastName}`, subtitle: a.organizationName, link: '/super-admin/client-admins' });
      }
    });

    store.tickets.forEach(t => {
      if (t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) {
        results.push({ type: 'ticket', id: t.id, title: t.subject, subtitle: `${t.organizationName} · ${t.status}`, link: '/super-admin/support' });
      }
    });

    return results.slice(0, 15);
  },

  // ─── Seed Default Plans (called once on first load) ─────────────────────

  seedDefaultPlans() {
    if (store.plans.size > 0) return;
    const defaults: Omit<SaaSPlan, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { name: 'Starter', monthlyPrice: 9999, annualPrice: 99999, maxFacilities: 2, maxSlots: 200, maxClientAdmins: 3, maxCameras: 4, analyticsRetentionDays: 30, supportLevel: 'BASIC', features: ['Digital Twin', 'Basic Analytics', 'Email Support'], isActive: true },
      { name: 'Professional', monthlyPrice: 29999, annualPrice: 299999, maxFacilities: 10, maxSlots: 1000, maxClientAdmins: 10, maxCameras: 20, analyticsRetentionDays: 90, supportLevel: 'PRIORITY', features: ['Digital Twin', 'Advanced Analytics', 'Priority Support', 'AI Predictions', 'Device Monitoring'], isActive: true },
      { name: 'Enterprise', monthlyPrice: 99999, annualPrice: 999999, maxFacilities: 999, maxSlots: 99999, maxClientAdmins: 999, maxCameras: 999, analyticsRetentionDays: 365, supportLevel: 'DEDICATED', features: ['Digital Twin', 'Enterprise Analytics', 'Dedicated Support', 'AI Predictions', 'Device Monitoring', 'Custom Integrations', 'SLA'], isActive: true },
    ];
    defaults.forEach(d => {
      const plan: SaaSPlan = { ...d, id: uid(), createdAt: now(), updatedAt: now() };
      store.plans.set(plan.id, plan);
    });
    persist(keys.plans, store.plans);
  },
};

// Seed default plans on first load
SuperAdminService.seedDefaultPlans();
