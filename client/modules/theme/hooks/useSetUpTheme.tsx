import { STORAGE_KEY } from "@/modules/theme/const";
import { useEffect } from "react";

export default function useSetUpTheme() {
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme) {
      document.body.classList.add(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.body.classList.add("dark");
      }
    }
  }, []);
}
