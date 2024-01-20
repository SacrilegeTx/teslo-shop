import { create } from 'zustand';

interface StateInterface {
  isSideMenuOpen: boolean;
  openToggleSideMenu: () => void;
  closeToggleSideMenu: () => void;
}

export const useUiStore = create<StateInterface>()((set) => ({
  isSideMenuOpen: false,
  openToggleSideMenu: () => {
    set(() => ({ isSideMenuOpen: true }));
  },
  closeToggleSideMenu: () => {
    set(() => ({ isSideMenuOpen: false }));
  },
}));
