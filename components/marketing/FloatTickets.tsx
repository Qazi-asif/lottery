/**
 * Small printed tickets that drift behind the hero board. Decorative only —
 * hidden from assistive tech and from anyone who asked for less motion.
 */
const TICKETS = [
  { fill: "#F11112", star: "#000000", notch: "#000000", tilt: "-12deg", className: "top-[8%] right-[6%]", delay: "0s" },
  { fill: "#000000", star: "#FFFFFF", notch: "#F11112", tilt: "9deg", className: "top-[38%] right-[-1%]", delay: "1.1s" },
  { fill: "#F11112", star: "#000000", notch: "#000000", tilt: "-7deg", className: "bottom-[18%] right-[14%]", delay: "0.55s" },
  { fill: "#000000", star: "#FFFFFF", notch: "#F11112", tilt: "14deg", className: "top-[18%] right-[22%]", delay: "1.8s" },
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
              stroke="#F11112"
              strokeWidth="1"
            />
            <path
              d="M24 4v40"
              stroke="#F11112"
              strokeOpacity="0.7"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
            <circle cx="24" cy="1" r="4" fill={ticket.notch} />
            <circle cx="24" cy="47" r="4" fill={ticket.notch} />
            <path
              d="M48 16l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L48 32.4 41.5 36l1.3-7.2-5.3-5.1 7.3-1L48 16z"
              fill={ticket.star}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
