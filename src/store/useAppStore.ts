import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  activeFilterPanel: string | null;
  globalSearchQuery: string;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterPanel: (panel: string | null) => void;
  setGlobalSearch: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  activeFilterPanel: null,
  globalSearchQuery: '',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setFilterPanel: (panel) => set({ activeFilterPanel: panel }),
  setGlobalSearch: (query) => set({ globalSearchQuery: query }),
}));
