"use client";

import { useState } from "react";
import {
  Files,
  Search,
  GitBranch,
  Bug,
  Blocks,
  ChevronDown,
  ChevronRight,
  X,
  FileCode2,
  FileText,
} from "lucide-react";
import { Globe } from "lucide-react";
import { FILES, FILE_TREE, DEFAULT_FILE, type FileTreeNode } from "./files";
import { highlightLine } from "./highlight";
import { cn } from "@/lib/utils";

/**
 * VS Code app — shows Ishan's portfolio data as a real editor workspace
 * (file tree, tabs, syntax highlighting, minimap, terminal panel). A button in
 * the status bar opens the actual vscode.dev in a new tab (it blocks iframing).
 */
export function VSCode() {
  return <VSCodePortfolio />;
}

function VSCodePortfolio() {
  const [openTabs, setOpenTabs] = useState<string[]>([DEFAULT_FILE]);
  const [active, setActive] = useState(DEFAULT_FILE);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["root", "src"])
  );

  function openFile(path: string) {
    if (!FILES[path]) return;
    setOpenTabs((t) => (t.includes(path) ? t : [...t, path]));
    setActive(path);
  }
  function closeTab(path: string, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== path);
      if (active === path && next.length) setActive(next[next.length - 1]);
      return next;
    });
  }
  function toggle(path: string) {
    setExpanded((s) => {
      const n = new Set(s);
      n.has(path) ? n.delete(path) : n.add(path);
      return n;
    });
  }

  const file = FILES[active];
  const lines = file ? file.content.split("\n") : [];

  const renderTree = (nodes: FileTreeNode[], depth = 0): React.ReactNode =>
    nodes.map((node) => {
      const isOpen = expanded.has(node.path);
      if (node.type === "folder") {
        return (
          <div key={node.path}>
            <button
              onClick={() => toggle(node.path)}
              className="flex w-full items-center gap-1 px-2 py-0.5 text-[13px] text-[#cccccc] hover:bg-white/5"
              style={{ paddingLeft: 8 + depth * 12 }}
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {node.name}
            </button>
            {isOpen && node.children && renderTree(node.children, depth + 1)}
          </div>
        );
      }
      const isMd = node.name.endsWith(".md");
      return (
        <button
          key={node.path}
          onClick={() => openFile(node.path)}
          className={cn(
            "flex w-full items-center gap-1.5 px-2 py-0.5 text-[13px] hover:bg-white/5",
            active === node.path ? "bg-white/10 text-white" : "text-[#cccccc]"
          )}
          style={{ paddingLeft: 14 + depth * 12 }}
        >
          {isMd ? (
            <FileText size={14} className="text-[#519aba]" />
          ) : (
            <FileCode2 size={14} className="text-[#519aba]" />
          )}
          {node.name}
        </button>
      );
    });

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-4 bg-[#333333] py-3 text-[#858585]">
          <Files size={24} className="text-white" />
          <Search size={24} />
          <GitBranch size={24} />
          <Bug size={24} />
          <Blocks size={24} />
        </div>

        {/* Explorer */}
        <div className="w-56 shrink-0 overflow-y-auto bg-[#252526] os-scroll">
          <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
            Explorer
          </div>
          {renderTree(FILE_TREE)}
        </div>

        {/* Editor area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* tabs */}
          <div className="flex h-9 shrink-0 items-stretch bg-[#252526] text-[13px]">
            {openTabs.map((path) => (
              <div
                key={path}
                onClick={() => setActive(path)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border-r border-black/30 px-3",
                  active === path
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#2d2d2d] text-[#969696]"
                )}
              >
                <FileCode2 size={13} className="text-[#519aba]" />
                {path}
                <button
                  onClick={(e) => closeTab(path, e)}
                  className="rounded p-0.5 hover:bg-white/10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* breadcrumb */}
          <div className="flex h-6 shrink-0 items-center gap-1 border-b border-black/30 px-4 text-[12px] text-[#969696]">
            <span>ishan-portfolio</span>
            <span className="opacity-50">›</span>
            <span>src</span>
            <span className="opacity-50">›</span>
            <span className="text-[#cccccc]">{active}</span>
          </div>

          {/* code + minimap */}
          <div className="relative flex min-h-0 flex-1">
            <div className="os-scroll selectable flex-1 overflow-auto font-mono text-[13px] leading-[1.5]">
              {file ? (
                <table className="border-collapse">
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={i}>
                        <td className="select-none whitespace-nowrap pl-3 pr-4 text-right text-[#6e7681]">
                          {i + 1}
                        </td>
                        <td className="whitespace-pre pr-6">
                          {highlightLine(line, file.language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-[#858585]">No file open</div>
              )}
            </div>
            {/* minimap */}
            <div className="hidden w-16 shrink-0 overflow-hidden border-l border-black/30 bg-[#1e1e1e] p-1 md:block">
              {lines.slice(0, 80).map((line, i) => (
                <div
                  key={i}
                  className="mb-[1px] h-[2px] rounded-sm bg-[#3a3a3a]"
                  style={{ width: `${Math.min(100, (line.trim().length / 40) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          {/* bottom panel */}
          <div className="h-28 shrink-0 border-t border-black/40 bg-[#181818]">
            <div className="flex h-7 items-center gap-4 border-b border-black/30 px-4 text-[11px] uppercase tracking-wide">
              <span className="border-b border-white pb-1 text-white">Terminal</span>
              <span className="text-[#858585]">Problems</span>
              <span className="text-[#858585]">Output</span>
            </div>
            <div className="os-scroll h-[76px] overflow-y-auto p-2 font-mono text-[12px] leading-relaxed text-[#37e07a]">
              <div className="text-[#858585]">ishan@ishan-os portfolio %</div>
              <div>$ next build</div>
              <div className="text-[#cccccc]">✓ Compiled successfully</div>
              <div className="text-[#cccccc]">✓ Generating static pages</div>
              <div className="text-[#858585]">ishan@ishan-os portfolio %</div>
            </div>
          </div>
        </div>
      </div>

      {/* status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between bg-[#007acc] px-3 text-[11px] text-white">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <GitBranch size={12} /> main
          </span>
          <span>Ishan OS</span>
          <a
            href="https://vscode.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 opacity-90 hover:opacity-100"
            title="Open the real VS Code for the Web"
          >
            <Globe size={12} /> vscode.dev
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>{file?.language === "markdown" ? "Markdown" : "TypeScript"}</span>
          <span>UTF-8</span>
          <span>Ln {lines.length}</span>
        </div>
      </div>
    </div>
  );
}
