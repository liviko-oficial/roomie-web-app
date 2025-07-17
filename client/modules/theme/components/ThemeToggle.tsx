"use client";
import { cn } from "@/lib/utils";
import useSetUpTheme from "@/modules/theme/hooks/useSetUpTheme";
import useThemeToggle from "@/modules/theme/hooks/useThemeToggle";
import { useThemeStore } from "@/modules/theme/stores/thmeStore";
import React, { HTMLAttributes } from "react";
function ThemeToggle({
  className,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) {
  useSetUpTheme();
  const handleTheme = useThemeToggle();
  const theme = useThemeStore((state) => state.theme);
  return (
    <button
      className={cn("bg-primary-300/20 px-2 py-3 rounded-3xl", className)}
      onClick={() => handleTheme()}
      {...rest}
    >
      {theme}
    </button>
  );
}

export default ThemeToggle;
