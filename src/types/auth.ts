export type Role = 'USER' | 'OWNER' | 'SUPER_ADMIN';

export type SubRole = 
  | 'FACILITY_ADMIN' 
  | 'MANAGER' 
  | 'SECURITY_GUARD' 
  | 'CASHIER' 
  | 'MAINTENANCE_ENGINEER';

export type Permission =
  // Customer Permissions
  | 'SEARCH_PARKING'
  | 'SLOT_BOOK'
  | 'WALLET_USE'
  | 'TICKET_VIEW'
  | 'REVIEW_SUBMIT'
  // Parking Operator / Facility Admin Permissions
  | 'FACILITY_CREATE'
  | 'FACILITY_EDIT'
  | 'FACILITY_DELETE'
  | 'BOOKING_MANAGE'
  | 'CUSTOMER_MANAGE'
  | 'PRICING_EDIT'
  | 'STAFF_MANAGE'
  | 'SECURITY_CONTROL'
  | 'WORK_ORDER_MANAGE'
  | 'AUDIT_LOG_VIEW'
  | 'AI_INSIGHTS_VIEW'
  // Operator Sub-role Permissions
  | 'STAFF_VIEW'
  | 'CUSTOMER_VIEW'
  | 'ANPR_VIEW'
  | 'GATE_CONTROL'
  | 'INCIDENT_REPORT'
  | 'WALKIN_BOOKING'
  | 'PAYMENT_COLLECT'
  | 'RECEIPT_PRINT'
  | 'WORK_ORDER_VIEW'
  | 'WORK_ORDER_UPDATE'
  // Superadmin Permissions
  | 'SUPER_ADMIN_ALL';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  subRole?: SubRole;
  permissions: Permission[];
  facilityId?: string; // Scoped for multi-tenant owner/staff
  firstName: string;
  lastName: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  subRole?: SubRole;
  permissions: Permission[];
  facilityId?: string;
  exp: number;
  iat: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role;
  subRole?: SubRole;
}
