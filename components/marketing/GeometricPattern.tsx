/** Abstract geometric motif — no stock photography per design system */
export function GeometricPattern({
  className = "",
  variant = "grid",
}: {
  className?: string;
  variant?: "grid" | "radial";
}) {
  if (variant === "radial") {
    return (
      <svg
        className={className}
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="160" stroke="#E5E3DD" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" stroke="#E5E3DD" strokeWidth="1" />
        <circle cx="200" cy="200" r="80" stroke="#D9C48B" strokeWidth="1" />
        <rect
          x="140"
          y="140"
          width="120"
          height="120"
          stroke="#B8912F"
          strokeWidth="1"
          transform="rotate(45 200 200)"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 10 }).map((__, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 40 + 4}
            y={row * 36 + 4}
            width="32"
            height="28"
            stroke={col % 3 === 0 ? "#D9C48B" : "#E5E3DD"}
            strokeWidth="1"
            fill="none"
          />
        )),
      )}
    </svg>
  );
}
