"use client";
import useSetUpTheme from "@/modules/theme/hooks/useSetUpTheme";
import useThemeToggle from "@/modules/theme/hooks/useThemeToggle";
import { useThemeStore } from "@/modules/theme/stores/thmeStore";
import React, { HTMLAttributes } from "react";
interface Props extends HTMLAttributes<HTMLButtonElement> {
  body?: string;
}
function ThemeToggle({ body, ...rest }: Props) {
  useSetUpTheme();
  const handleTheme = useThemeToggle();
  const theme = useThemeStore((state) => state.theme);
  return (
    <button onClick={() => handleTheme()} {...rest}>
      {theme}
    </button>
  );
}

export default ThemeToggle;
