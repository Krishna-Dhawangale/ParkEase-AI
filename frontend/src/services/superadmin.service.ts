import { mockTenants, mockUsers } from './api.mock';
import type { Tenant } from '../types/models';
import type { AuthUser, Role } from '../types/auth';
import { secondaryAuth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';

export const SuperAdminService = {
  getOrganizations: async (): Promise<Tenant[]> => {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `tenants`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  },

  createOrganization: async (data: any): Promise<any> => {
    // 1. Create Tenant in Firestore
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: data.organization.name || '',
      slug: (data.organization.name || '').toLowerCase().replace(/\s+/g, '-'),
      status: 'ONBOARDING',
      plan: data.subscription?.planId || 'BASIC',
      type: data.organization.type || 'MALL',
      contactPerson: data.contact?.name || '',
      contactEmail: data.contact?.email || '',
      contactPhone: data.contact?.phone || '',
      address: data.address,
      gstNumber: data.organization.gstNumber,
      website: data.organization.website,
      internalNotes: data.organization.internalNotes,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(ref(db, 'tenants/' + newTenant.id), newTenant);

    // 2. Create Client Admin via Secondary Firebase App
    const tempPassword = generateSecureTempPassword();
    let firebaseUser;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.clientAdmin.email,
        tempPassword
      );
      firebaseUser = userCredential.user;

      // Update profile with name and our hidden FORCE_RESET flag
      await updateProfile(firebaseUser, {
        displayName: `${data.clientAdmin.firstName} ${data.clientAdmin.lastName}`.trim(),
        photoURL: 'FORCE_RESET'
      });

      // Sign out of the secondary app so it's clean for the next use
      await signOut(secondaryAuth);
    } catch (error: any) {
      console.error('[Firebase] Failed to provision client admin:', error);
      throw new Error(`Failed to create admin account: ${error.message}`);
    }

    // 3. Return combined payload expected by the UI and save User Profile to Firestore
    const clientAdmin: AuthUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      role: 'CLIENT_ADMIN',
      firstName: data.clientAdmin.firstName,
      lastName: data.clientAdmin.lastName,
      tenantId: newTenant.id,
      isEmailVerified: false,
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    
    // Save the client admin profile to the 'users' collection in Realtime DB
    await set(ref(db, 'users/' + clientAdmin.id), clientAdmin);

    return {
      organization: newTenant,
      clientAdmin,
      temporaryPassword: tempPassword
    };
  },

  getClientAdmins: async (): Promise<AuthUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(u => u.role === 'CLIENT_ADMIN' || u.role === 'CLIENT_OWNER');
  },

  createClientAdmin: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    tenantId: string;
  }): Promise<{ user: AuthUser; temporaryPassword: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (mockUsers.some(u => u.email === data.email)) {
      throw new Error('Email already in use.');
    }

    const tempPassword = generateSecureTempPassword();

    const newUser: AuthUser = {
      id: `admin-${Date.now()}`,
      email: data.email,
      role: 'CLIENT_ADMIN',
      firstName: data.firstName,
      lastName: data.lastName,
      tenantId: data.tenantId,
      isEmailVerified: true, // Auto-verified since SA creates it
      requiresPasswordChange: true,
      accountStatus: 'ACTIVE',
      onboardingStatus: 'ACCOUNT_CREATED',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    
    // In a real system, we'd store the hash of tempPassword in the DB.
    // For our mock, we will intercept login in auth.service to allow 'password123' OR this tempPassword
    // Actually, to make it completely correct without modifying auth.service deeply, 
    // we can add a mockPasswords map in api.mock.ts, but let's just let auth.service accept anything if requiresPasswordChange is true, OR we store it temporarily.
    // We will just store it in localStorage for the mock backend to verify.
    const mockPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    mockPasswords[newUser.email] = tempPassword;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    return { user: newUser, temporaryPassword: tempPassword };
  },

  resetClientAdminPassword: async (userId: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const tempPassword = generateSecureTempPassword();
    user.requiresPasswordChange = true;
    
    const mockPasswords = JSON.parse(localStorage.getItem('mockPasswords') || '{}');
    mockPasswords[user.email] = tempPassword;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    return tempPassword;
  },

  updateAccountStatus: async (userId: string, status: 'ACTIVE' | 'DISABLED'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.accountStatus = status;
  }
};

function generateSecureTempPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let pass = "";
  // Ensure at least one of each required type
  pass += "A"; // upper
  pass += "a"; // lower
  pass += "1"; // number
  pass += "!"; // special
  
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}
