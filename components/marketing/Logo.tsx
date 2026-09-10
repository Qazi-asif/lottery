import Link from "next/link";

function SealMark({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? "#D9C48B" : "#B8912F";
  const fill = inverted ? "#0B0B0C" : "#0B0B0C";

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="34" height="34" rx="8" fill={fill} stroke={stroke} />
      <path
        d="M10 12.5h16v11H10z"
        stroke={stroke}
        strokeWidth="1.25"
      />
      <path d="M10 16.5h16M14 12.5v11" stroke={stroke} strokeWidth="1.25" />
    </svg>
  );
}

export function Logo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`}>
      <SealMark inverted={inverted} />
      <span
        className={`font-serif text-xl font-semibold tracking-tight ${
          inverted ? "text-bg" : "text-ink"
        }`}
      >
        ScratchCrest
      </span>
    </Link>
  );
}
