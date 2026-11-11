"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode); the switch still applies for this visit
    }
    setTheme(next);
  };

  const label = theme === "light" ? "Switch to night mode" : "Switch to day mode";

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <span className={theme !== "light" ? "on" : ""}>Night</span>
      <span className="muted" aria-hidden="true">/</span>
      <span className={theme === "light" ? "on" : ""}>Day</span>
    </button>
  );
}
