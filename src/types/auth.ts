export type Role =
  | 'CUSTOMER'
  | 'CLIENT_OWNER'
  | 'CLIENT_ADMIN'
  | 'PARKING_MANAGER'
  | 'SECURITY_GUARD'
  | 'CASHIER'
  | 'MAINTENANCE'
  | 'SUPER_ADMIN'
  | 'SUPER_ADMIN_SUPPORT';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
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
