"use client";
import { STORAGE, STORAGE_KEY } from "@/modules/theme/const";
import { useEffect, useRef } from "react";
const useToggle = () => {
  const body = useRef<HTMLBodyElement | null>(null);
  useEffect(() => {
    body.current = window.document.querySelector("body");
  }, []);
  return () => {
    if (!body.current) return;
    const theme = localStorage.getItem(STORAGE_KEY);
    if (!theme || STORAGE.isLight(theme)) {
      localStorage.setItem(STORAGE_KEY, STORAGE.DARK_CLASS);
      body.current.classList.remove(STORAGE.LIGHT_CLASS);
      body.current.classList.add(STORAGE.DARK_CLASS);
    } else {
      localStorage.setItem(STORAGE_KEY, STORAGE.LIGHT_CLASS);
      body.current.classList.remove(STORAGE.DARK_CLASS);
      body.current.classList.add(STORAGE.LIGHT_CLASS);
    }
  };
};

export default useToggle;
