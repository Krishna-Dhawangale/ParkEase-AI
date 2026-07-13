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

interface AuthStore {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: localStorage.getItem('parkease-auth') === 'true',
  user: localStorage.getItem('parkease-user') ? { email: localStorage.getItem('parkease-user')! } : null,
  login: (email) => {
    localStorage.setItem('parkease-auth', 'true');
    localStorage.setItem('parkease-user', email);
    set({ isAuthenticated: true, user: { email } });
  },
  logout: () => {
    localStorage.removeItem('parkease-auth');
    localStorage.removeItem('parkease-user');
    set({ isAuthenticated: false, user: null });
  },
}));
