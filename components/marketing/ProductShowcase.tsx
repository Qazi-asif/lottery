"use client";

import { useEffect, useState } from "react";

const SCANS = [
  { name: "Lone Star Gold", ticket: "047", price: "$10.00", stock: 128, sold: 34, commission: "$17" },
  { name: "Triple Cash Bar", ticket: "112", price: "$5.00", stock: 127, sold: 35, commission: "$19" },
  { name: "Neon Nights", ticket: "008", price: "$2.00", stock: 126, sold: 36, commission: "$22" },
];

export function ProductShowcase({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const scan = SCANS[index];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % SCANS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`sheet flex h-full flex-col rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-dashed border-rule-strong pb-4">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Smart POS
          </p>
          <p className="wonk mt-1 font-display text-[19px] font-semibold tracking-tight text-ink">
            Main St Store
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-money-wash px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-money">
          <span className="motion-live h-1.5 w-1.5 rounded-full bg-money" aria-hidden />
          Live
        </span>
      </div>

      <div className="mt-5 border-l-2 border-l-flag pl-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          Last sale
        </p>
        <p className="wonk mt-1.5 font-display text-[24px] font-semibold tracking-tight text-ink">
          {scan.name}
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="font-mono text-[13px] tabular-nums text-ink-soft">
            Ticket {scan.ticket} ·{" "}
            <span className="font-bold text-ink">{scan.price}</span>
          </p>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-money">
            Sold
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg">
        {[
          ["In stock", scan.stock],
          ["Sold today", scan.sold],
          ["Commission", scan.commission],
        ].map(([label, value], i) => (
          <div
            key={String(label)}
            className={`well px-4 py-3.5 ${
              i > 0 ? "border-l border-dashed border-rule-strong" : ""
            }`}
          >
            <dt className="text-[11px] text-ink-faint">{label}</dt>
            <dd className="mt-1.5 font-mono text-[19px] font-bold tabular-nums text-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-auto pt-4 text-[13px] text-ink-faint">
        Tap a game on the grid · already-sold tickets blocked
      </p>
    </div>
  );
}
