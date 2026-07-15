"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const icons = {
    light: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4" />
      </svg>
    ),
  };

  const labels = { light: "Light", dark: "Dark", system: "System" };

  const nextTheme = (() => {
    const themes = ["light", "dark", "system"] as const;
    return themes[(themes.indexOf(theme) + 1) % 3];
  })();

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="flex items-center gap-2 p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
      aria-label={`Theme: ${labels[theme]}. Click for ${labels[nextTheme]}.`}
      title={`Theme: ${labels[theme]}. Click for ${labels[nextTheme]}.`}
    >
      {icons[theme]}
      <span className="hidden sm:inline text-sm font-medium capitalize">{labels[theme]}</span>
    </button>
  );
}