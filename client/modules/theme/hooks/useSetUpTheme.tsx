import { STORAGE, STORAGE_KEY } from "@/modules/theme/const";
import { useThemeStore, Store } from "@/modules/theme/stores/thmeStore";
import { useEffect } from "react";

export default function useSetUpTheme() {
  const setTheme = useThemeStore((state) => state.handleTheme);
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Store["theme"];

    if (savedTheme) {
      document.body.classList.add(savedTheme);
      setTheme(savedTheme);
      return;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark");
      setTheme(STORAGE.DARK_CLASS);
      return;
    }
    setTheme(null);
  }, [setTheme]);
}
