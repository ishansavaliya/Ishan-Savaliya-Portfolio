"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/lib/store/useWindowStore";
import {
  resolveWallpaper,
  useSettingsStore,
} from "@/lib/store/useSettingsStore";
import { TopBar } from "./TopBar";
import { Dock } from "./Dock";
import { Window } from "./Window";
import { BootScreen } from "./BootScreen";
import { LoginScreen } from "./LoginScreen";
import { Spotlight } from "./Spotlight";
import { DesktopIcons } from "./DesktopIcons";
import { AudioEngine } from "./AudioEngine";

type Stage = "boot" | "login" | "desktop";

export function Desktop() {
  const [stage, setStage] = useState<Stage>("boot");
  const [spotlight, setSpotlight] = useState(false);
  const windows = useWindowStore((s) => s.windows);
  const openApp = useWindowStore((s) => s.openApp);

  const theme = useSettingsStore((s) => s.theme);
  const wallpaperId = useSettingsStore((s) => s.wallpaperId);
  const customWallpaper = useSettingsStore((s) => s.customWallpaper);
  const background = resolveWallpaper(wallpaperId, customWallpaper);

  // Apply theme to <html> for CSS variables.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Skip boot/login if already logged in this session.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      sessionStorage.getItem("ishan-os-logged-in") === "1" ||
      params.has("skip")
    ) {
      setStage("desktop");
      const auto = params.get("open");
      if (auto) openApp(auto as never);
    }
  }, [openApp]);

  // ⌘+Space / Ctrl+Space → Spotlight.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setSpotlight((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleLogin() {
    sessionStorage.setItem("ishan-os-logged-in", "1");
    setStage("desktop");
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {stage === "boot" && <BootScreen onDone={() => setStage("login")} />}

      <AnimatePresence>
        {stage === "login" && <LoginScreen onLogin={handleLogin} />}
      </AnimatePresence>

      {stage === "desktop" && (
        <>
          <TopBar onSpotlight={() => setSpotlight(true)} />

          <DesktopIcons onOpen={openApp} />

          {/* Window layer */}
          <div className="absolute inset-0">
            {windows.map((win) => (
              <Window key={win.id} win={win} />
            ))}
          </div>

          <Dock />
          <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />
          <AudioEngine />
        </>
      )}
    </div>
  );
}
