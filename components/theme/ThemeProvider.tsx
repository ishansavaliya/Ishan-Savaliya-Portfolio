"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";
const KEY = "ishan-landing-theme";

interface Ctx {
  theme: Theme;
  toggle: () => void;
  ready: boolean;
}

const ThemeCtx = createContext<Ctx>({ theme: "dark", toggle: () => {}, ready: false });

/**
 * Site-wide light/dark theme for the classic portfolio + crawlable /(site)
 * pages. Persists to localStorage and applies `data-theme` to <html>. A
 * blocking inline script in the root layout applies the saved value before
 * paint, so there is no dark flash on refresh.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved =
      (document.documentElement.dataset.theme as Theme) ||
      (localStorage.getItem(KEY) as Theme) ||
      "dark";
    setTheme(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
  }, [theme, ready]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return <ThemeCtx.Provider value={{ theme, toggle, ready }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

/** Inline script string — run before paint to set the theme and avoid flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${KEY}')||'dark';document.documentElement.dataset.theme=t;}catch(e){}})();`;
