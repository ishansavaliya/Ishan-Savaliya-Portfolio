import type { ComponentType } from "react";

/** Unique identifier for each application in Ishan OS. */
export type AppId =
  | "finder"
  | "terminal"
  | "vscode"
  | "browser"
  | "contact"
  | "ai-assistant"
  | "notes"
  | "settings"
  | "resume"
  | "write-blog"
  | "launchpad";

/** Metadata that describes a registered application. */
export interface AppDefinition {
  id: AppId;
  title: string;
  /** Lucide icon name or path to an icon image in /public. */
  icon: string;
  /** Whether the app shows in the Dock. */
  inDock: boolean;
  /** Default window geometry. */
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  /** If true, window cannot be resized (e.g. Launchpad full-screen overlay). */
  resizable?: boolean;
  /** The React component rendered inside the window body. */
  component: ComponentType;
  /** Accent for the dock running indicator / theming. */
  accent?: string;
}

/** A live window instance on the desktop. */
export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Geometry snapshot to restore from a maximized state. */
  prevGeometry?: { x: number; y: number; width: number; height: number };
}
