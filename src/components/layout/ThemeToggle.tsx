"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PowerOn, PowerOff } from "@/components/icons";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const themeToggle = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  useEffect(() => setMounted(true), []);

  return (
    <button type="button" onClick={themeToggle} id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
      {mounted && (resolvedTheme === "light" ? <PowerOn /> : <PowerOff />)}
    </button>
  );
}
