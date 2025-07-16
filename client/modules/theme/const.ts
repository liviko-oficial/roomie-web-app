export const STORAGE_KEY = "theme";
export const STORAGE = {
  DARK_CLASS: "dark",
  LIGHT_CLASS: "light",
  isLight: (str: string | null) => str && str === "light",
};
