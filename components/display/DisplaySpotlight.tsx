"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SpotlightContext = createContext(0);

/**
 * Cycles a gentle scale on one ticket at a time so the board keeps moving
 * from across the aisle. Honours reduced-motion. Does not touch live figures.
 */
export function DisplayTicketGrid({
  count,
  className,
  children,
}: {
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setSpot((prev) => (prev + 1) % count);
    }, 2800);

    return () => window.clearInterval(id);
  }, [count]);

  return (
    <SpotlightContext.Provider value={spot}>
      <ul className={className}>{children}</ul>
    </SpotlightContext.Provider>
  );
}

export function DisplayTicket({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const spot = useContext(SpotlightContext);
  const active = spot === index;

  return (
    <li
      className={`ticket relative flex h-full min-h-0 flex-col rounded-lg transition-transform duration-500 ${className ?? ""} ${
        active ? "z-10 scale-[1.035]" : ""
      }`}
    >
      {children}
    </li>
  );
}
