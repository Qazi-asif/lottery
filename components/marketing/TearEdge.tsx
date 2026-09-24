/**
 * Toothed bottom edge for receipt tape.
 *
 * Built as an SVG polygon rather than a CSS mask: a mask would have to be
 * composited against whatever sits behind the card, whereas this just fills the
 * teeth in the card's own colour (`text-sheet`) directly below it. Stretches to
 * any width via `preserveAspectRatio="none"`.
 */
export function TearEdge({
  className = "",
  teeth = 48,
}: {
  className?: string;
  teeth?: number;
}) {
  const points = ["0,0"];
  for (let i = 0; i < teeth; i++) {
    points.push(`${i * 2 + 1},2.6`, `${i * 2 + 2},0`);
  }

  return (
    <svg
      viewBox={`0 0 ${teeth * 2} 2.6`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <polygon points={points.join(" ")} fill="currentColor" />
    </svg>
  );
}
