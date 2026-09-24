/**
 * Hand-drawn underline for the one word in a headline that carries the claim.
 *
 * Two passes, because a real pen doesn't land a mark in a single stroke: a heavy
 * sweep, then a lighter one a beat later, slightly offset. `pathLength={1}`
 * normalises the dash maths so the draw timing is independent of the curve's
 * actual length.
 */
export function Underline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 20"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 12.5C58 6 112 3.5 166 4.5c38 .7 76 3 150 7"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={1}
        className="motion-draw"
      />
      <path
        d="M14 18C72 12.5 130 10.5 188 11.5c32 .6 62 2 116 4.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
        pathLength={1}
        className="motion-draw"
        style={{ animationDelay: "0.66s" }}
      />
    </svg>
  );
}
