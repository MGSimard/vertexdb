"use client";

import { useTheme } from "next-themes";
import { PowerOn, PowerOff } from "@/components/icons";

export function ThemeToggle() {
  const theme = useTheme();

  const themeToggle = () => {
    theme.setTheme(theme.theme === "light" ? "dark" : "light");
  };

  return (
    <button type="button" onClick={themeToggle} className="themeToggle">
      {theme.theme === "light" ? <PowerOn /> : <PowerOff />}
    </button>
  );
}
