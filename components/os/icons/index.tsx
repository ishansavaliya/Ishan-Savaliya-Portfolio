"use client";

import type { ComponentType } from "react";
import type { AppId } from "@/types/os";
import {
  FinderGlyph,
  TerminalGlyph,
  VSCodeGlyph,
  BrowserGlyph,
  MailGlyph,
  AIGlyph,
  MusicGlyph,
  NotesGlyph,
  SettingsGlyph,
  LaunchpadGlyph,
  ResumeGlyph,
} from "./AppGlyphs";

export const APP_GLYPHS: Record<AppId, ComponentType> = {
  finder: FinderGlyph,
  terminal: TerminalGlyph,
  vscode: VSCodeGlyph,
  browser: BrowserGlyph,
  contact: MailGlyph,
  "ai-assistant": AIGlyph,
  spotify: MusicGlyph,
  notes: NotesGlyph,
  settings: SettingsGlyph,
  launchpad: LaunchpadGlyph,
  resume: ResumeGlyph,
};

/** Renders the squircle app icon for a given app id. */
export function AppGlyph({
  appId,
  size,
  className,
}: {
  appId: AppId;
  /** Pixel size, or "full" to fill the parent (used by the magnifying dock). */
  size: number | "full";
  className?: string;
}) {
  const Glyph = APP_GLYPHS[appId] ?? FinderGlyph;
  const dims =
    size === "full"
      ? { width: "100%", height: "100%" }
      : { width: size, height: size };
  return (
    <span
      className={className}
      style={{
        ...dims,
        display: "inline-block",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
      }}
    >
      <Glyph />
    </span>
  );
}
