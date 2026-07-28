import { create } from 'zustand';
import type { AuthUser } from '../types/auth';
import { resolveUserPermissions } from '../lib/rbac';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  /** User's preference: light, dark, or follow system */
  preference: ThemePreference;
  /** Actually applied theme after resolving 'system' */
  resolvedTheme: ResolvedTheme;
  /** Legacy alias for resolvedTheme for backwards compat */
  theme: ResolvedTheme;
  /** Set theme preference */
  setTheme: (pref: ThemePreference) => void;
  /** Cycle through: light → dark → system → light */
  cycleTheme: () => void;
  /** Legacy toggle for backwards compat (light ↔ dark) */
  toggleTheme: () => void;
  /** Initialize system listener — call once at app start */
  initSystemListener: () => (() => void);
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === 'system') return getSystemTheme();
  return pref;
}

function applyThemeToDOM(resolved: ResolvedTheme): void {
  const root = document.documentElement;

  // Add scoped transition class for smooth switching
  root.classList.add('theme-transitioning');

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 300);
}

const savedPref = (localStorage.getItem('parkease-theme') as ThemePreference) || 'system';
const initialResolved = resolveTheme(savedPref);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  preference: savedPref,
  resolvedTheme: initialResolved,
  theme: initialResolved,

  setTheme: (pref) => {
    localStorage.setItem('parkease-theme', pref);
    const resolved = resolveTheme(pref);
    applyThemeToDOM(resolved);
    set({ preference: pref, resolvedTheme: resolved, theme: resolved });
  },

  cycleTheme: () => {
    const current = get().preference;
    const next: ThemePreference =
      current === 'light' ? 'dark' :
      current === 'dark' ? 'system' : 'light';
    get().setTheme(next);
  },

  toggleTheme: () => {
    // Legacy compat: toggles resolved theme between light/dark
    const current = get().resolvedTheme;
    const next: ThemePreference = current === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },

  initSystemListener: () => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const state = get();
      if (state.preference === 'system') {
        const resolved = getSystemTheme();
        applyThemeToDOM(resolved);
        set({ resolvedTheme: resolved, theme: resolved });
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  },
}));

// Legacy alias so existing code using `theme` still works
// Components can use: const { resolvedTheme: theme } = useThemeStore();


interface SidebarStore {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggleSidebar: () => set((s) => ({ collapsed: !s.collapsed })),
}));

interface AuthStore {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const initialToken = localStorage.getItem('parkease-token');
const initialUserStr = localStorage.getItem('parkease-user');
let initialUser: AuthUser | null = null;

if (initialUserStr) {
  try {
    initialUser = JSON.parse(initialUserStr);
    if (initialUser) {
      // Normalize legacy roles & permissions
      if ((initialUser.role as any) === 'ADMIN') {
        initialUser.role = 'SUPER_ADMIN';
      }
      if (!initialUser.permissions || initialUser.permissions.length === 0) {
        initialUser.permissions = resolveUserPermissions(initialUser.role, initialUser.subRole);
      }
    }
  } catch (e) {
    initialUser = null;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!initialToken && !!initialUserStr,
  user: initialUser,
  token: initialToken,
  login: (token, user) => {
    // Normalize role & permissions on login
    const normalizedUser = { ...user };
    if ((normalizedUser.role as any) === 'ADMIN') {
      normalizedUser.role = 'SUPER_ADMIN';
    }
    if (!normalizedUser.permissions || normalizedUser.permissions.length === 0) {
      normalizedUser.permissions = resolveUserPermissions(normalizedUser.role, normalizedUser.subRole);
    }

    localStorage.setItem('parkease-token', token);
    localStorage.setItem('parkease-user', JSON.stringify(normalizedUser));
    set({ isAuthenticated: true, user: normalizedUser, token });
  },
  updateUser: (user) => {
    localStorage.setItem('parkease-user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('parkease-token');
    localStorage.removeItem('parkease-user');
    localStorage.removeItem('parkease-tenant');
    set({ isAuthenticated: false, user: null, token: null });
    useTenantStore.getState().clearTenant();
  },
}));

import type { Tenant } from '../types/models';

interface TenantStore {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

const initialTenantStr = localStorage.getItem('parkease-tenant');
let initialTenant: Tenant | null = null;
if (initialTenantStr) {
  try {
    initialTenant = JSON.parse(initialTenantStr);
  } catch (e) {}
}

export const useTenantStore = create<TenantStore>((set) => ({
  currentTenant: initialTenant,
  setTenant: (tenant) => {
    localStorage.setItem('parkease-tenant', JSON.stringify(tenant));
    set({ currentTenant: tenant });
  },
  clearTenant: () => {
    localStorage.removeItem('parkease-tenant');
    set({ currentTenant: null });
  }
}));

interface AdminSidebarStore {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useAdminSidebarStore = create<AdminSidebarStore>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));

export interface WebSocketMessage {
  type: 'BOOKING_UPDATE' | 'DEVICE_STATUS' | 'METRICS_UPDATE';
  payload: any;
  timestamp: number;
}

interface WebSocketStore {
  isConnected: boolean;
  isReconnecting: boolean;
  lastMessage: WebSocketMessage | null;
  setConnectionStatus: (status: { isConnected?: boolean; isReconnecting?: boolean }) => void;
  setLastMessage: (msg: WebSocketMessage) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  isReconnecting: false,
  lastMessage: null,
  setConnectionStatus: (status) => set((state) => ({ ...state, ...status })),
  setLastMessage: (msg) => set({ lastMessage: msg }),
}));
