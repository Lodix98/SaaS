"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const icons = {
    light: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M12 2v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      </svg>
    ),
  };

  const labels = { light: "Light", dark: "Dark", system: "System" };

  return (
    <div className="relative">
      <button
        onClick={() => {
          const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
          const next = themes[(themes.indexOf(theme) + 1) % 3];
          setTheme(next);
        }}
        className="flex items-center gap-2 p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        aria-label={`Current: ${labels[theme]}. Click to change.`}
        title={`Theme: ${labels[theme]}. Click to cycle.`}
      >
        {icons[theme]}
        <span className="hidden sm:inline text-sm font-medium capitalize">{labels[theme]}</span>
      </button>
    </div>
  );
}