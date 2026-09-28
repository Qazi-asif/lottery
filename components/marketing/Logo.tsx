import Link from "next/link";

/**
 * Five-point star, computed rather than hand-written so the points are actually
 * regular. Alternating outer and inner radius, starting at twelve o'clock.
 */
function starPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? r * 0.45 : r;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(
      cy +
      radius * Math.sin(angle)
    ).toFixed(2)}`;
  }).join(" ");
}

/** A scratch ticket: card, perforation, gold star where the prize is printed. */
function TicketMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8 shrink-0 text-flag"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="6" width="30" height="20" rx="3" fill="currentColor" />
      <path
        d="M10 7.5v17"
        stroke="rgb(255 255 255 / 0.5)"
        strokeWidth="1.5"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
      />
      <polygon points={starPoints(20.5, 16, 6)} fill="white" />
    </svg>
  );
}

export function Logo({
  className = "",
  tone = "ink",
}: {
  className?: string;
  /** `paper` for the ink footer and CTA blocks. */
  tone?: "ink" | "paper";
}) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <TicketMark />
      <span
        className={`wonk font-display text-[19px] font-semibold tracking-tight ${
          "text-ink"
        }`}
      >
        Scratch<span className="text-flag">Crest</span>
      </span>
    </Link>
  );
}
