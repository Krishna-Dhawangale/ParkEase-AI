import type { AuthResponse, AuthUser, LoginCredentials, RegisterCredentials, Role } from '../types/auth';
import { useTenantStore } from '../store';
import { auth, db } from '../lib/firebase';
import { ApiClient } from '../lib/api-client';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { ref, get, set, child, update } from 'firebase/database';

// Helper to sync Firebase Auth user to our AuthUser
const getOrCreateUserProfile = async (user: FirebaseUser, defaultRole: Role = 'CUSTOMER'): Promise<AuthUser> => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `users/${user.uid}`));

  if (snapshot.exists()) {
    // Return the profile stored in Realtime DB
    const data = snapshot.val();
    
    // requiresPasswordChange: trust DB value first; fall back to FORCE_RESET photoURL for legacy users
    const requiresPasswordChange = data.requiresPasswordChange === true 
      || user.photoURL === 'FORCE_RESET';

    // Force super admin role for the known SA email, regardless of what's in DB
    let role: Role = data.role || defaultRole;
    if (user.email === 'admin.parkease.ai@gmail.com') {
      role = 'SUPER_ADMIN';
    }

    return {
      id: user.uid,
      email: user.email || '',
      role,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      tenantId: data.tenantId,
      isEmailVerified: user.emailVerified,
      accountStatus: data.accountStatus || 'ACTIVE',
      createdAt: data.createdAt || user.metadata.creationTime || new Date().toISOString(),
      requiresPasswordChange,
      profileSetupComplete: data.profileSetupComplete === true,
      phone: data.phone || '',
      city: data.city || '',
      contactEmail: data.contactEmail || '',
      onboardingStatus: data.onboardingStatus || 'ACCOUNT_CREATED'
    };
  } else {
    // If no document exists, create a default CUSTOMER profile
    const nameParts = (user.displayName || '').split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // For local dev, hardcode the super admin just in case they haven't set it in firestore manually
    let role = defaultRole;
    if (user.email === 'admin.parkease.ai@gmail.com') {
      role = 'SUPER_ADMIN';
    }

    const newUserProfile: AuthUser = {
      id: user.uid,
      email: user.email || '',
      role: role,
      firstName,
      lastName,
      isEmailVerified: user.emailVerified,
      accountStatus: 'ACTIVE',
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };

    await set(ref(db, `users/${user.uid}`), newUserProfile);
    return newUserProfile;
  }
};

const mapFirebaseError = (error: any, defaultMessage: string = 'Authentication failed'): string => {
  const code = error?.code;
  const message = error?.message || 'No message';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return `Invalid email or password. Detailed Error: ${code} - ${message}`;
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'permission-denied':
      return 'Database Error: Permissions denied. Please set Realtime Database rules to true.';
    default:
      // If it's a DB error, it might not have 'auth/' prefix
      if (error?.message?.includes('Missing or insufficient permissions') || error?.message?.includes('Permission denied')) {
        return 'Database Error: Permissions denied. Please set Realtime Database rules to true.';
      }
      return defaultMessage;
  }
};

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const firebaseIdToken = await userCredential.user.getIdToken();
      
      // Keep Firebase RTDB in sync (always works — no backend needed)
      const firebaseProfile = await getOrCreateUserProfile(userCredential.user);

      // Attempt to sync with FastAPI backend & obtain custom ParkEase JWT
      // If the backend is down, gracefully fall back to Firebase-only auth
      let token: string;
      let user: AuthUser;

      try {
        const backendRes = await ApiClient.post<any>('/auth/firebase-login', { 
          id_token: firebaseIdToken,
          role: firebaseProfile.role,
          tenant_id: firebaseProfile.tenantId
        });
        user = backendRes.user as AuthUser;
        // Ensure frontend enforces password change if Firebase RTDB has it set to true
        user.requiresPasswordChange = user.requiresPasswordChange || firebaseProfile.requiresPasswordChange || (backendRes.user as any).requires_password_change;
        token = backendRes.access_token;
      } catch (backendError: any) {
        // Backend is down or returned an error — fall back to Firebase RTDB profile
        console.warn('[AuthService] Backend unavailable, using Firebase-only auth:', backendError.message);
        user = firebaseProfile;
        token = firebaseIdToken; // Use the Firebase ID token as our auth token
      }

      return { token, user };
    } catch (error: any) {
      console.error('[Firebase Login Error]', error);
      throw new Error(mapFirebaseError(error, 'Invalid email or password'));
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      
      // Update the user's profile with their first and last name in Auth
      const displayName = `${credentials.firstName} ${credentials.lastName}`.trim();
      await firebaseUpdateProfile(userCredential.user, { displayName });

      // Create their profile in Realtime DB
      const firebaseProfile = await getOrCreateUserProfile(userCredential.user, credentials.role);
      
      // Override the names in DB to ensure accuracy from registration form
      firebaseProfile.firstName = credentials.firstName;
      firebaseProfile.lastName = credentials.lastName;
      await set(ref(db, `users/${firebaseProfile.uid || firebaseProfile.id}`), firebaseProfile);

      const firebaseIdToken = await userCredential.user.getIdToken();
      
      // Attempt to sync with FastAPI backend — fall back to Firebase profile if backend is down
      let token: string;
      let user: AuthUser;

      try {
        const backendRes = await ApiClient.post<any>('/auth/firebase-login', { 
          id_token: firebaseIdToken,
          role: credentials.role || 'CUSTOMER'
        });
        token = backendRes.access_token;
        user = backendRes.user as AuthUser;
      } catch (backendError: any) {
        console.warn('[AuthService] Backend unavailable during register, using Firebase-only auth:', backendError.message);
        user = firebaseProfile;
        token = firebaseIdToken;
      }

      return { token, user };
    } catch (error: any) {
      console.error('[Firebase Register Error]', error);
      throw new Error(mapFirebaseError(error, 'Registration failed'));
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    if (!email) throw new Error('Email is required');
    try {
      await sendPasswordResetEmail(auth, email);
      if (import.meta.env.DEV) {
        console.log(`[AuthService] Password reset sent for: ${email}`);
      }
    } catch (error: any) {
      console.error('[Firebase Reset Password Error]', error);
      throw new Error(mapFirebaseError(error, 'Failed to send password reset email'));
    }
  },

  loginWithGoogle: async (): Promise<AuthResponse> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Create/read profile from Firebase RTDB (always works)
      const firebaseProfile = await getOrCreateUserProfile(userCredential.user);
      const firebaseIdToken = await userCredential.user.getIdToken();

      // Attempt to sync with FastAPI backend — fall back to Firebase profile if backend is down
      let token: string;
      let user: AuthUser;

      try {
        const backendRes = await ApiClient.post<any>('/auth/firebase-login', { 
          id_token: firebaseIdToken 
        });
        token = backendRes.access_token;
        user = backendRes.user as AuthUser;
        // Merge requiresPasswordChange from RTDB
        user.requiresPasswordChange = user.requiresPasswordChange || firebaseProfile.requiresPasswordChange;
      } catch (backendError: any) {
        console.warn('[AuthService] Backend unavailable during Google login, using Firebase-only auth:', backendError.message);
        user = firebaseProfile;
        token = firebaseIdToken;
      }

      return { token, user };
    } catch (error: any) {
      console.error('[Firebase Google Login Error]', error);
      throw new Error(mapFirebaseError(error, 'Google authentication failed'));
    }
  },

  validateToken: async (token: string): Promise<AuthUser> => {
    // In a real full-stack app, this validates the JWT.
    // For client-only Firebase, onAuthStateChanged is typically used instead.
    // We will attempt to get the current logged-in user directly.
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
        unsubscribe(); // Stop listening once we get the initial state
        if (firebaseUser) {
          try {
            const user = await getOrCreateUserProfile(firebaseUser);
            resolve(user);
          } catch (e) {
            reject(new Error('Invalid token'));
          }
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  },

  changePassword: async (userId: string, currentPass: string, newPass: string): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated. Please log in again.');

    // Step 1: Re-authenticate the user with their current (temp) password
    try {
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPass);
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error: any) {
      throw new Error('Current password is incorrect. Please try again.');
    }

    // Step 2: Update to the new password in Firebase Auth
    await updatePassword(currentUser, newPass);

    // Step 3: Clear the FORCE_RESET photoURL tag in Firebase Auth
    await firebaseUpdateProfile(currentUser, { photoURL: '' });

    // Step 4: Clear requiresPasswordChange flag in Realtime Database
    await update(ref(db, `users/${currentUser.uid}`), {
      requiresPasswordChange: false
    });
    
    // Step 5: Clear flag in Postgres Backend
    try {
      const { ApiClient } = await import('../lib/api-client');
      await ApiClient.post('/users/me/password-changed', {});
    } catch (e) {
      console.warn("Failed to update password flag in backend", e);
    }
  },

  updateProfile: async (userId: string, data: Partial<AuthUser>): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) throw new Error('User not found or not authenticated');
    
    try {
      if (data.firstName || data.lastName) {
        const nameParts = (currentUser.displayName || '').split(' ');
        const currentFirst = nameParts[0] || '';
        const currentLast = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const newFirst = data.firstName || currentFirst;
        const newLast = data.lastName || currentLast;
        
        await firebaseUpdateProfile(currentUser, {
          displayName: `${newFirst} ${newLast}`.trim()
        });
      }

      // Sync to Firebase Realtime Database
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, data);
    } catch (error: any) {
      throw new Error(mapFirebaseError(error, 'Failed to update profile'));
    }
  }
};
