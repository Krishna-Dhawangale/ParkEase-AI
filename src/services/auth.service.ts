import type { AuthResponse, AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth';
import { mockUsers } from './api.mock';

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

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      token: generateFakeJwt(user),
      user
    };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mockUsers.some(u => u.email === credentials.email)) {
      throw new Error('Email already registered');
    }

    const newUser: AuthUser = {
      id: `new-user-${Date.now()}`,
      email: credentials.email,
      role: credentials.role,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    };

    // In a real app, we'd save this to the DB. For mock, we'll just push to the array.
    mockUsers.push(newUser);

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
  }
};
