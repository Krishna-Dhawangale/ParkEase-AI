import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('parkease-theme') as Theme) || 'light',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('parkease-theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('parkease-theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    set({ theme: t });
  },
}));

interface SidebarStore {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggleSidebar: () => set((s) => ({ collapsed: !s.collapsed })),
}));

<<<<<<< HEAD
import type { AuthUser } from '../types/auth';

interface AuthStore {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const initialToken = localStorage.getItem('parkease-token');
const initialUserStr = localStorage.getItem('parkease-user');
let initialUser: AuthUser | null = null;
if (initialUserStr) {
  try {
    initialUser = JSON.parse(initialUserStr);
  } catch (e) {
    // Ignore parse error
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!initialToken && !!initialUser,
  user: initialUser,
  token: initialToken,
  login: (token, user) => {
    localStorage.setItem('parkease-token', token);
    localStorage.setItem('parkease-user', JSON.stringify(user));
    set({ isAuthenticated: true, user, token });
  },
  logout: () => {
    localStorage.removeItem('parkease-token');
    localStorage.removeItem('parkease-user');
    set({ isAuthenticated: false, user: null, token: null });
  },
=======
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
>>>>>>> origin/feature/admin-portal
}));
