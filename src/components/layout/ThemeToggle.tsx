"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "nocturne.theme";
type Theme = "light" | "dark";

/**
 * Light / dark switch. The actual theme is applied pre-paint by an inline
 * script in the layout (no flash); this control just reads the current value
 * after mount and toggles it, persisting the choice.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Read the theme the no-flash script already applied to <html>, after mount
    // (server can't know localStorage). This deliberate post-mount sync is correct.
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setTheme(next);
  }

  // Render a stable, neutral button before mount to avoid hydration mismatch.
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle colour theme"
      }
      className="inline-flex h-9 w-9 items-center justify-center text-ink transition-colors hover:text-gold"
    >
      {theme === null ? (
        <Sun className="h-[1.1rem] w-[1.1rem] opacity-0" aria-hidden="true" />
      ) : isDark ? (
        <Sun className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      )}
    </button>
  );
}
