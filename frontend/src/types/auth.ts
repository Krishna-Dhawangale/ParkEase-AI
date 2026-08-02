export type Role =
  | 'CUSTOMER'
  | 'CLIENT_OWNER'
  | 'CLIENT_ADMIN'
  | 'ADMIN'
  | 'PARKING_MANAGER'
  | 'SECURITY_GUARD'
  | 'CASHIER'
  | 'MAINTENANCE'
  | 'SUPER_ADMIN'
  | 'SUPER_ADMIN_SUPPORT'
  | 'USER'
  | 'OWNER';

export type SubRole =
  | 'FACILITY_ADMIN'
  | 'MANAGER'
  | 'SECURITY_GUARD'
  | 'CASHIER'
  | 'MAINTENANCE_ENGINEER';

export type Permission =
  | 'SEARCH_PARKING'
  | 'SLOT_BOOK'
  | 'WALLET_USE'
  | 'TICKET_VIEW'
  | 'REVIEW_SUBMIT'
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
  | 'SUPER_ADMIN_ALL';

export interface AuthUser {
  id: string;
  uid?: string;
  email: string;
  role: Role;
  permissions?: string[];
  subRole?: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isEmailVerified: boolean;
  tenantId?: string; // Nullable for CUSTOMER and SUPER_ADMIN
  requiresPasswordChange?: boolean;
  profileSetupComplete?: boolean; // true after /admin/welcome is submitted
  accountStatus?: 'ACTIVE' | 'DISABLED';
  // Simplified onboardingStatus — approval/live status for the FACILITY, not the user login flow
  onboardingStatus?: 'ACCOUNT_CREATED' | 'PASSWORD_CHANGED' | 'PROFILE_SETUP_COMPLETE' | 'APPROVED' | 'LIVE';
  // Contact details set during welcome setup
  phone?: string;
  city?: string;
  contactEmail?: string;
  createdAt: string;
}


export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password?: string; // Optional for this frontend mock
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role;
}
