"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Landing-page theme, persisted, independent of the OS theme. */
export function useLandingTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("ishan-landing-theme") as Theme) || "dark";
    setTheme(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ishan-landing-theme", theme);
  }, [theme, ready]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle, ready };
}
