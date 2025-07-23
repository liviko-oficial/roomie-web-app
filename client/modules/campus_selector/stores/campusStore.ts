import { create } from "zustand";
import campus, { Options } from "./options";
type Store = {
  state: Options[string];
  handleChange: (key: keyof Options) => void;
};
export const useCampusStore = create<Store>((set) => ({
  state: { ...campus["ciudad_mexico"] },
  handleChange: (key) => set({ state: { ...campus[key] } }),
}));
