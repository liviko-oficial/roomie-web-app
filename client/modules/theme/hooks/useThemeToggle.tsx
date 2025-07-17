"use client";
import { STORAGE, STORAGE_KEY } from "@/modules/theme/const";
import { useThemeStore } from "@/modules/theme/stores/thmeStore";
import { useEffect, useRef } from "react";
const useThemeToggle = () => {
  const setTheme = useThemeStore((state) => state.handleTheme);
  const body = useRef<HTMLBodyElement | null>(null);
  const handleTheme = () => {
    if (!body.current) return;
    const theme = localStorage.getItem(STORAGE_KEY);
    if (!theme || STORAGE.isLight(theme)) {
      localStorage.setItem(STORAGE_KEY, STORAGE.DARK_CLASS);
      body.current.classList.remove(STORAGE.LIGHT_CLASS);
      body.current.classList.add(STORAGE.DARK_CLASS);
      setTheme(STORAGE.DARK_CLASS);
    } else {
      localStorage.setItem(STORAGE_KEY, STORAGE.LIGHT_CLASS);
      body.current.classList.remove(STORAGE.DARK_CLASS);
      body.current.classList.add(STORAGE.LIGHT_CLASS);
      setTheme(STORAGE.LIGHT_CLASS);
    }
  };

  useEffect(() => {
    body.current = window.document.querySelector("body");
  }, []);
  return handleTheme;
};

export default useThemeToggle;
