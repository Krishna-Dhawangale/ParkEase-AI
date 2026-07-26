import { create } from 'zustand';

interface SuperAdminSidebarStore {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const useSASidebarStore = create<SuperAdminSidebarStore>((set) => ({
  isCollapsed: false,
  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
}));
