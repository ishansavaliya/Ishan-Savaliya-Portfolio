"use client";

/**
 * High-quality SVG recreations of macOS Tahoe app icons.
 * Each glyph is drawn inside a 1024x1024 viewBox as a rounded square (macOS
 * geometry) with gradient, top highlight and inner content.
 *
 * Gradient/clip ids are made unique per-instance via useId so multiple icons
 * on screen never collide in the shared SVG <defs> namespace.
 */

import { useId } from "react";

const INSET = 96;
const SIZE = 1024 - INSET * 2;
const RADIUS = SIZE * 0.225;

interface GlyphProps {
  /** [fromColor, toColor] vertical background gradient. */
  bg: [string, string];
  /** Optional radial background instead of linear. */
  radial?: boolean;
  rim?: boolean;
  children: (uid: string) => React.ReactNode;
}

function Glyph({ bg, radial, rim = true, children }: GlyphProps) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const bgId = `bg-${uid}`;
  const hiId = `hi-${uid}`;
  const clipId = `cl-${uid}`;

  return (
    <svg viewBox="0 0 1024 1024" className="h-full w-full" aria-hidden>
      <defs>
        {radial ? (
          <radialGradient id={bgId} cx="0.5" cy="0.32" r="0.85">
            <stop offset="0" stopColor={bg[0]} />
            <stop offset="1" stopColor={bg[1]} />
          </radialGradient>
        ) : (
          <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={bg[0]} />
            <stop offset="1" stopColor={bg[1]} />
          </linearGradient>
        )}
        <linearGradient id={hiId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={INSET} y={INSET} width={SIZE} height={SIZE} rx={RADIUS} ry={RADIUS} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x={INSET} y={INSET} width={SIZE} height={SIZE} fill={`url(#${bgId})`} />
        {children(uid)}
        <rect x={INSET} y={INSET} width={SIZE} height={SIZE} fill={`url(#${hiId})`} />
      </g>
      {rim && (
        <rect
          x={INSET}
          y={INSET}
          width={SIZE}
          height={SIZE}
          rx={RADIUS}
          ry={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={3}
        />
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- Finder */
export function FinderGlyph() {
  // Authentic macOS Finder: the smiling Mac face fills the icon, split into a
  // darker-blue left half and a white right half, with eyes and a smile.
  return (
    <Glyph bg={["#3aa0ff", "#1373e6"]}>
      {() => (
        <g>
          {/* left (darker) half of the face */}
          <path d="M512 192H192v640h320z" fill="#1c6fd6" />
          {/* right (white) half */}
          <path d="M512 192h320v640H512z" fill="#f4f8ff" />
          {/* eyes */}
          <rect x="408" y="360" width="26" height="120" rx="13" fill="#1a2330" />
          <rect x="590" y="360" width="26" height="120" rx="13" fill="#1a2330" />
          {/* smile */}
          <path
            d="M396 600c70 78 162 78 232 0"
            fill="none"
            stroke="#1a2330"
            strokeWidth={30}
            strokeLinecap="round"
          />
        </g>
      )}
    </Glyph>
  );
}

/* -------------------------------------------------------------- Terminal */
export function TerminalGlyph() {
  return (
    <Glyph bg={["#3a3f47", "#15181d"]}>
      {() => (
        <g>
          <rect x="210" y="280" width="604" height="464" rx="34" fill="#0a0c10" />
          <path
            d="M300 420l116 92-116 92"
            fill="none"
            stroke="#37e07a"
            strokeWidth={40}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="470" y="582" width="220" height="38" rx="19" fill="#e9edf2" />
        </g>
      )}
    </Glyph>
  );
}

/* ---------------------------------------------------------------- VS Code */
export function VSCodeGlyph() {
  const grad = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Glyph bg={["#1b9df2", "#0f7cd6"]}>
      {() => (
        <g>
          <defs>
            <linearGradient id={`vs${grad}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#cfe9ff" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            d="M690 250v524L398 540l-78 60-60-40 150-110-150-110 60-40 78 60 292-260z"
            fill={`url(#vs${grad})`}
          />
        </g>
      )}
    </Glyph>
  );
}

/* ----------------------------------------------------------- Browser/Safari */
export function BrowserGlyph() {
  return (
    <Glyph bg={["#eaf4ff", "#bcd6f2"]} radial>
      {() => (
        <g>
          <circle cx="512" cy="512" r="296" fill="#1f6fe0" />
          <path d="M512 300l46 166-166 46z" fill="#ffffff" />
          <path d="M512 724l-46-166 166-46z" fill="#ff5f57" />
          <circle cx="512" cy="512" r="20" fill="#fff" />
        </g>
      )}
    </Glyph>
  );
}

/* ------------------------------------------------------------------- Mail */
export function MailGlyph() {
  return (
    <Glyph bg={["#36b9ff", "#1f7be0"]}>
      {() => (
        <g>
          <rect x="210" y="312" width="604" height="400" rx="50" fill="#ffffff" />
          <path
            d="M244 350l268 212 268-212"
            fill="none"
            stroke="#1f7be0"
            strokeWidth={38}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </Glyph>
  );
}

/* ----------------------------------------------------------- AI Assistant */
export function AIGlyph() {
  return (
    <Glyph bg={["#bd7bff", "#6a2bd6"]}>
      {() => (
        <g fill="#ffffff">
          <path d="M500 250c18 116 56 154 172 172-116 18-154 56-172 172-18-116-56-154-172-172 116-18 154-56 172-172Z" />
          <path d="M730 300c9 50 27 68 77 77-50 9-68 27-77 77-9-50-27-68-77-77 50-9 68-27 77-77Z" opacity="0.92" />
        </g>
      )}
    </Glyph>
  );
}

/* ------------------------------------------------------------------ Music */
export function MusicGlyph() {
  return (
    <Glyph bg={["#fb5b6b", "#f5333f"]}>
      {() => (
        <g fill="#ffffff">
          <path d="M636 296l-268 62v316a86 66 0 1 1-46-58V452l176-40v196a86 66 0 1 1-46-58V296h184z" />
        </g>
      )}
    </Glyph>
  );
}

/* ------------------------------------------------------------------ Notes */
export function NotesGlyph() {
  return (
    <Glyph bg={["#ffd84d", "#ffce3a"]}>
      {() => (
        <g>
          <rect x="220" y="240" width="584" height="110" fill="#ffffff" opacity="0.95" />
          <g stroke="#b9962e" strokeWidth={24} strokeLinecap="round">
            <line x1="300" y1="470" x2="724" y2="470" />
            <line x1="300" y1="566" x2="724" y2="566" />
            <line x1="300" y1="662" x2="560" y2="662" />
          </g>
        </g>
      )}
    </Glyph>
  );
}

/* ---------------------------------------------------------------- Settings */
export function SettingsGlyph() {
  return (
    <Glyph bg={["#9aa0a8", "#6d727a"]}>
      {() => (
        <g fill="#f2f4f7">
          <path d="M512 320a192 192 0 1 0 0 384 192 192 0 0 0 0-384Zm0 96a96 96 0 1 1 0 192 96 96 0 0 1 0-192Z" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x = 512 + Math.cos(a) * 248;
            const y = 512 + Math.sin(a) * 248;
            return (
              <rect
                key={i}
                x={x - 28}
                y={y - 28}
                width={56}
                height={56}
                rx={14}
                transform={`rotate(${i * 45} ${x} ${y})`}
              />
            );
          })}
        </g>
      )}
    </Glyph>
  );
}

/* -------------------------------------------------------------- Launchpad */
export function LaunchpadGlyph() {
  const colors = [
    "#ff5f57", "#ffbd2e", "#28c840",
    "#2aa9ff", "#b06bff", "#ff7ab8",
    "#2dd4bf", "#ffd84d", "#fb5b6b",
  ];
  return (
    <Glyph bg={["#7c8794", "#4b525c"]}>
      {() => (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={300 + c * 152}
                y={300 + r * 152}
                width={104}
                height={104}
                rx={26}
                fill={colors[r * 3 + c]}
              />
            ))
          )}
        </g>
      )}
    </Glyph>
  );
}

/* ----------------------------------------------------------------- Resume */
export function ResumeGlyph() {
  return (
    <Glyph bg={["#ff7a6b", "#f5333f"]}>
      {() => (
        <g>
          <rect x="290" y="250" width="444" height="524" rx="40" fill="#ffffff" />
          <g stroke="#f5333f" strokeWidth={24} strokeLinecap="round">
            <line x1="356" y1="368" x2="668" y2="368" />
            <line x1="356" y1="458" x2="668" y2="458" />
            <line x1="356" y1="548" x2="668" y2="548" />
            <line x1="356" y1="638" x2="560" y2="638" />
          </g>
        </g>
      )}
    </Glyph>
  );
}
