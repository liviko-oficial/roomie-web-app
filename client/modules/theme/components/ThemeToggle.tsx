"use client";
import useSetUpTheme from "@/modules/theme/hooks/useSetUpTheme";
import useToggle from "@/modules/theme/hooks/useToggle";
import React, { HTMLAttributes } from "react";
interface Props extends HTMLAttributes<HTMLButtonElement> {
  body?: string;
}
function ThemeToggle({ body, ...rest }: Props) {
  useSetUpTheme();
  const handleTheme = useToggle();
  return (
    <button onClick={() => handleTheme()} {...rest}>
      {body}
    </button>
  );
}

export default ThemeToggle;
