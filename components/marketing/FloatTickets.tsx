/**
 * Small printed tickets that drift behind the hero board. Decorative only —
 * hidden from assistive tech and from anyone who asked for less motion.
 */
const TICKETS = [
  { fill: "#F03D14", tilt: "-12deg", className: "top-[8%] right-[6%]", delay: "0s" },
  { fill: "#C4920A", tilt: "9deg", className: "top-[38%] right-[-1%]", delay: "1.1s" },
  { fill: "#0C8F5E", tilt: "-7deg", className: "bottom-[18%] right-[14%]", delay: "0.55s" },
  { fill: "#1B3A6B", tilt: "14deg", className: "top-[18%] right-[22%]", delay: "1.8s" },
];

export function FloatTickets() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
      aria-hidden
    >
      {TICKETS.map((ticket) => (
        <span
          key={ticket.fill + ticket.delay}
          className={`motion-float absolute ${ticket.className}`}
          style={{
            ["--tilt" as string]: ticket.tilt,
            animationDelay: ticket.delay,
          }}
        >
          <svg width="78" height="48" viewBox="0 0 78 48" fill="none">
            <rect
              x="1"
              y="1"
              width="76"
              height="46"
              rx="7"
              fill={ticket.fill}
            />
            <path
              d="M24 4v40"
              stroke="white"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
            <circle cx="24" cy="1" r="4" fill="#FFF8EE" />
            <circle cx="24" cy="47" r="4" fill="#FFF8EE" />
            <path
              d="M48 16l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L48 32.4 41.5 36l1.3-7.2-5.3-5.1 7.3-1L48 16z"
              fill="#F2D08A"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
