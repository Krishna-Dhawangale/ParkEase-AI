export type Role = 'USER' | 'OWNER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
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
