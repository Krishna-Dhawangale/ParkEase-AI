import type { AuthResponse, AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth';
import { mockUsers, mockTenants, normalizeEmail, persistMockUsers } from './api.mock';
import { useTenantStore } from '../store';

// Helper to generate a fake JWT
const generateFakeJwt = (user: AuthUser): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day
  }));
  const signature = 'fake-signature';
  return `${header}.${payload}.${signature}`;
};

// Default passwords for seed users (only used when no mockPassword entry exists)
const SEED_PASSWORDS: Record<string, string> = {
  'admin@parkease.com': 'admin123',
  'user@parkease.com': 'user123',
};

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const email = normalizeEmail(credentials.email ?? '');
    const password = credentials.password ?? '';

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Development-only: log which users exist for debugging
      if (import.meta.env.DEV) {
        console.warn('[AuthService] User not found for email:', email);
        console.warn('[AuthService] Available users:', mockUsers.map(u => u.email));
      }
      throw new Error('Invalid email or password');
    }

    // Check account status — DISABLED and SUSPENDED cannot login
    // INVITED is allowed (first-time login with temporary password)
    if (user.accountStatus === 'DISABLED') {
      throw new Error('Your account has been disabled. Please contact support.');
    }

    // Check password against mockPasswords (for temporary/changed passwords)
    // or fall back to seed passwords for hardcoded users
    const mockPasswords: Record<string, string> = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    const storedPassword = mockPasswords[email];
    
    if (storedPassword) {
      // A specific password was set for this user (temporary or changed)
      if (password !== storedPassword) {
        if (import.meta.env.DEV) {
          console.warn('[AuthService] Password mismatch for:', email);
        }
        throw new Error('Invalid email or password');
      }
    } else {
      // No specific password — check seed defaults
      const seedPassword = SEED_PASSWORDS[email];
      if (!seedPassword || password !== seedPassword) {
        if (import.meta.env.DEV) {
          console.warn('[AuthService] No password entry found for:', email);
        }
        throw new Error('Invalid email or password');
      }
    }

    // Set tenant context if applicable
    if (user.tenantId) {
      const tenant = mockTenants.find(t => t.id === user.tenantId);
      if (tenant) {
        useTenantStore.getState().setTenant(tenant);
      }
    }

    return {
      token: generateFakeJwt(user),
      user
    };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const email = normalizeEmail(credentials.email ?? '');

    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: AuthUser = {
      id: `new-user-${Date.now()}`,
      email,
      role: credentials.role,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      isEmailVerified: false,
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    persistMockUsers();

    // Store password
    const mockPasswords: Record<string, string> = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    if (credentials.password) {
      mockPasswords[email] = credentials.password;
      localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
    }

    return {
      token: generateFakeJwt(newUser),
      user: newUser
    };
  },

  validateToken: async (token: string): Promise<AuthUser> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      
      const user = mockUsers.find(u => u.id === payload.sub);
      if (!user) throw new Error('User not found');
      
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  changePassword: async (userId: string, currentPass: string, newPass: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const email = normalizeEmail(user.email);
    const mockPasswords: Record<string, string> = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    
    // Verify current password
    const storedPassword = mockPasswords[email];
    const seedPassword = SEED_PASSWORDS[email];
    const expectedPassword = storedPassword || seedPassword;

    if (expectedPassword && currentPass !== expectedPassword) {
      throw new Error('Incorrect current password.');
    }

    // Save new password (replaces temporary password)
    mockPasswords[email] = newPass;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    // Update user state
    user.requiresPasswordChange = false;
    user.accountStatus = 'ACTIVE';
    
    // Advance onboarding status if applicable
    if (user.onboardingStatus === 'ACCOUNT_CREATED') {
      user.onboardingStatus = 'PASSWORD_CHANGED';
    }

    // Persist user state changes
    persistMockUsers();
  },

  updateProfile: async (userId: string, data: Partial<AuthUser>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    Object.assign(user, data);
    persistMockUsers();
  }
};
