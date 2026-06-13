import { Fragment } from "react";

/**
 * Minimal, dependency-free Markdown renderer for blog bodies.
 * Supports: # headings, ``` code blocks, - lists, 1. ordered lists,
 * **bold**, `inline code`, and paragraphs. Server-renderable.
 */
export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "ul" | "ol"; items: string[] };

function parseBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: "code", lang, text: buf.join("\n") });
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    // paragraph: gather until blank line
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }
  return blocks;
}

/** Inline formatting: **bold** and `code`. */
function inline(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[4])
      parts.push(
        <code
          key={key++}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-pink"
        >
          {m[4]}
        </code>
      );
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-8 text-2xl font-bold tracking-tight text-os-fg">
          {inline(block.text)}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 text-xl font-semibold tracking-tight text-os-fg">
          {inline(block.text)}
        </h3>
      );
    case "p":
      return (
        <p className="text-[16px] leading-relaxed text-os-fg/85">
          {inline(block.text)}
        </p>
      );
    case "code":
      return (
        <pre className="os-scroll overflow-x-auto rounded-xl bg-[#0c0e13] p-4 ring-1 ring-white/10">
          <code className="font-mono text-[13px] leading-relaxed text-[#d6dbe3]">
            {block.text}
          </code>
        </pre>
      );
    case "ul":
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2 text-[16px] text-os-fg/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-1.5 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2 text-[16px] text-os-fg/85">
              <span className="font-semibold text-accent">{i + 1}.</span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}
