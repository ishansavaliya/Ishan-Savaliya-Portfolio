/**
 * Shared scalloped wave bottom edge for the navbar — many small repeating
 * scallops with NO flat straight line after them. Used by the landing navbar
 * and the crawlable /(site) layout so both match.
 *
 * Path is built across a fixed 1440 viewBox and rendered with
 * preserveAspectRatio="none" so it stretches to any width while each scallop
 * stays small.
 */
// Fill path: closed shape from the top edge down through the scallops.
function buildFill(count: number, width = 1440, dip = 13) {
  const step = width / count;
  let d = `M0 0 H${width} V1`;
  for (let i = 0; i < count; i++) {
    const next = width - (i + 1) * step;
    const ctrlX = next + step / 2;
    d += ` Q${ctrlX} ${dip} ${next} 1`;
  }
  return d + " Z";
}

// Edge path: just the scalloped bottom line (left→right), for a visible stroke.
function buildEdge(count: number, width = 1440, dip = 13) {
  const step = width / count;
  let d = `M0 1`;
  for (let i = 0; i < count; i++) {
    const next = (i + 1) * step;
    const ctrlX = next - step / 2;
    d += ` Q${ctrlX} ${dip} ${next} 1`;
  }
  return d;
}

const FILL_PATH = buildFill(28);
const EDGE_PATH = buildEdge(28);

export function NavWave({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute left-0 top-full w-full ${className}`}
      style={{ height: 15 }}
      viewBox="0 0 1440 15"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={FILL_PATH} fill="var(--glass-bg-strong)" />
      {/* visible scallop edge — reads in dark mode where the fill blends in */}
      <path
        d={EDGE_PATH}
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
