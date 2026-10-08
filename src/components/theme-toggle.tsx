"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * Icons are swapped by the `dark` class via CSS, so the server-rendered HTML
 * is always correct (next-themes injects the class before hydration) and no
 * mounted-state effect is needed.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line bg-surface text-foreground/80 transition-colors hover:text-acid"
    >
      <Sun
        size={16}
        className="absolute transition-all duration-300 dark:rotate-90 dark:scale-0"
      />
      <Moon
        size={16}
        className="absolute -rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}
