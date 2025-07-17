import { create } from "zustand";
import { STORAGE } from "../const";
export interface Store {
  theme: typeof STORAGE.DARK_CLASS | typeof STORAGE.LIGHT_CLASS | null;
  handleTheme: (theme: Store["theme"]) => void;
}

export const useThemeStore = create<Store>((set) => ({
  theme: null,
  handleTheme(theme) {
    set({ theme });
  },
}));

export const useThemeValue = () => useThemeStore((state) => state.theme);
