import type { AppDefinition, AppId } from "@/types/os";
import { makePlaceholder } from "@/components/apps/Placeholder";
import { Terminal } from "@/components/apps/terminal/Terminal";
import { Finder } from "@/components/apps/finder/Finder";
import { VSCode } from "@/components/apps/vscode/VSCode";
import { Contact } from "@/components/apps/contact/Contact";
import { AIAssistant } from "@/components/apps/ai/AIAssistant";
import { Browser } from "@/components/apps/browser/Browser";
import { Settings } from "@/components/apps/settings/Settings";
import { Notes } from "@/components/apps/notes/Notes";
import { Resume } from "@/components/apps/resume/Resume";
import { Launchpad } from "@/components/apps/launchpad/Launchpad";
import { Music } from "@/components/apps/music/Music";

/**
 * Central registry of all Ishan OS applications.
 * Components are placeholders during Phase 1 and get swapped for the real
 * app implementations in their respective phases.
 */
export const APPS: Record<AppId, AppDefinition> = {
  finder: {
    id: "finder",
    title: "Finder",
    icon: "Folder",
    inDock: true,
    defaultSize: { width: 820, height: 540 },
    minSize: { width: 480, height: 320 },
    resizable: true,
    accent: "#2f80ff",
    component: Finder,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "SquareTerminal",
    inDock: true,
    defaultSize: { width: 720, height: 460 },
    minSize: { width: 420, height: 280 },
    resizable: true,
    accent: "#2bd576",
    component: Terminal,
  },
  vscode: {
    id: "vscode",
    title: "Visual Studio Code",
    icon: "Code2",
    inDock: true,
    defaultSize: { width: 900, height: 580 },
    minSize: { width: 520, height: 340 },
    resizable: true,
    accent: "#2f80ff",
    component: VSCode,
  },
  browser: {
    id: "browser",
    title: "Browser",
    icon: "Globe",
    inDock: true,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 520, height: 340 },
    resizable: true,
    accent: "#4b9eff",
    component: Browser,
  },
  contact: {
    id: "contact",
    title: "Contact",
    icon: "Mail",
    inDock: true,
    defaultSize: { width: 560, height: 600 },
    minSize: { width: 420, height: 440 },
    resizable: true,
    accent: "#ff4d8d",
    component: Contact,
  },
  "ai-assistant": {
    id: "ai-assistant",
    title: "Ask Ishan AI",
    icon: "Sparkles",
    inDock: true,
    defaultSize: { width: 520, height: 640 },
    minSize: { width: 380, height: 480 },
    resizable: true,
    accent: "#9b6bff",
    component: AIAssistant,
  },
  spotify: {
    id: "spotify",
    title: "Music",
    icon: "Music",
    inDock: true,
    defaultSize: { width: 760, height: 520 },
    minSize: { width: 480, height: 360 },
    resizable: true,
    accent: "#1ed760",
    component: Music,
  },
  notes: {
    id: "notes",
    title: "Notes",
    icon: "StickyNote",
    inDock: true,
    defaultSize: { width: 720, height: 500 },
    minSize: { width: 440, height: 320 },
    resizable: true,
    accent: "#ffbd2e",
    component: Notes,
  },
  settings: {
    id: "settings",
    title: "System Settings",
    icon: "Settings",
    inDock: true,
    defaultSize: { width: 760, height: 540 },
    minSize: { width: 520, height: 380 },
    resizable: true,
    accent: "#8a8f98",
    component: Settings,
  },
  resume: {
    id: "resume",
    title: "Resume",
    icon: "FileText",
    inDock: false,
    defaultSize: { width: 720, height: 760 },
    minSize: { width: 480, height: 520 },
    resizable: true,
    accent: "#ff5f57",
    component: Resume,
  },
  launchpad: {
    id: "launchpad",
    title: "Launchpad",
    icon: "LayoutGrid",
    inDock: true,
    defaultSize: { width: 980, height: 640 },
    resizable: true,
    accent: "#ffffff",
    component: Launchpad,
  },
};

export function getApp(id: AppId): AppDefinition | undefined {
  return APPS[id];
}

/** Apps that appear in the Dock, in display order. */
export const DOCK_ORDER: AppId[] = [
  "finder",
  "launchpad",
  "terminal",
  "vscode",
  "browser",
  "ai-assistant",
  "spotify",
  "notes",
  "contact",
  "settings",
];

export function dockApps(): AppDefinition[] {
  return DOCK_ORDER.map((id) => APPS[id]).filter((a) => a.inDock);
}
