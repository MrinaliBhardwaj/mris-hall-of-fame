"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "pink" | "dark";

export const THEMES: Theme[] = ["light", "pink", "dark"];
export const THEME_STORAGE_KEY = "portfolio-theme";
const DEFAULT_THEME: Theme = "pink";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Inline, blocking script — applied before hydration so the chosen theme
 * (or the pink default) is on `<html>` for the very first paint, with
 * no flash of the wrong palette.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="pink"&&t!=="dark"){t="${DEFAULT_THEME}";}var c=document.documentElement.classList;c.remove("theme-light","theme-pink","theme-dark");c.add("theme-"+t);}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  // Pick up the persisted theme on mount (the inline script already applied
  // it to <html> before paint — this just syncs React state to match).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (THEMES as string[]).includes(stored)) {
        setThemeState(stored as Theme);
      }
    } catch {
      // localStorage unavailable — fall back to the default.
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-pink", "theme-dark");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — theme just won't persist this session.
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
