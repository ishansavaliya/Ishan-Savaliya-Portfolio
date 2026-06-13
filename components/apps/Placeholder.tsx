"use client";

/** Temporary app body used until each real app is built in later phases. */
export function makePlaceholder(label: string, phase: string) {
  function Placeholder() {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <div className="text-2xl font-semibold tracking-tight">{label}</div>
        <p className="text-sm text-os-muted">
          Coming in {phase}. The window shell, dragging, resizing and dock are
          all live — this app&apos;s content lands next.
        </p>
      </div>
    );
  }
  Placeholder.displayName = `Placeholder(${label})`;
  return Placeholder;
}
