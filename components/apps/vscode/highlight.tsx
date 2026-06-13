"use client";

import { Fragment } from "react";

const KEYWORDS = /\b(export|const|let|var|function|return|import|from|as|interface|type|true|false|null|undefined)\b/;

/** Minimal TS/MD syntax highlighter — good enough for read-only display. */
export function highlightLine(line: string, lang: string) {
  if (lang === "markdown") return highlightMarkdown(line);
  return highlightTs(line);
}

function highlightTs(line: string) {
  // Comments
  if (line.trim().startsWith("//")) {
    return <span className="text-[#6a9955]">{line}</span>;
  }
  // Tokenize on strings, keywords, numbers, property keys.
  const parts: React.ReactNode[] = [];
  const regex =
    /("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?%?\b)|([A-Za-z_$][\w$]*)(\s*:)|([A-Za-z_$][\w$]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <span key={key++} className="text-[#ce9178]">
          {m[1]}
        </span>
      );
    } else if (m[2]) {
      parts.push(
        <span key={key++} className="text-[#b5cea8]">
          {m[2]}
        </span>
      );
    } else if (m[3]) {
      parts.push(
        <Fragment key={key++}>
          <span className="text-[#9cdcfe]">{m[3]}</span>
          <span className="text-[#d4d4d4]">{m[4]}</span>
        </Fragment>
      );
    } else if (m[5]) {
      const word = m[5];
      if (KEYWORDS.test(word)) {
        parts.push(
          <span key={key++} className="text-[#569cd6]">
            {word}
          </span>
        );
      } else if (/^[A-Z]/.test(word)) {
        parts.push(
          <span key={key++} className="text-[#4ec9b0]">
            {word}
          </span>
        );
      } else {
        parts.push(word);
      }
    }
    last = regex.lastIndex;
  }
  if (last < line.length) parts.push(line.slice(last));
  return <>{parts}</>;
}

function highlightMarkdown(line: string) {
  if (line.startsWith("#"))
    return <span className="font-semibold text-[#569cd6]">{line}</span>;
  if (line.startsWith(">"))
    return <span className="italic text-[#6a9955]">{line}</span>;
  if (line.trim().startsWith("-"))
    return <span className="text-[#ce9178]">{line}</span>;
  return <span className="text-[#d4d4d4]">{line}</span>;
}
