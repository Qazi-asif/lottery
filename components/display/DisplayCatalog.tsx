"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { type ArtworkTicket } from "@/lib/display-artwork";
import { formatCents } from "@/lib/format";

function sortByPrice(tickets: ArtworkTicket[]) {
  return [...tickets].sort((a, b) => {
    if (a.priceCents !== b.priceCents) return a.priceCents - b.priceCents;
    return a.gameNumber.localeCompare(b.gameNumber, undefined, { numeric: true });
  });
}

type WallLayout = {
  cols: number;
  rows: number;
  cardW: number;
  cardH: number;
  gap: number;
};

/** Square-ish ticket cards + air between them, sized to the live TV box. */
function fitWall(width: number, height: number, count: number): WallLayout {
  const short = Math.min(width, height);
  const gap = Math.round(Math.max(14, Math.min(40, short * 0.022)));
  const padX = Math.round(Math.max(24, width * 0.05));
  const padY = Math.round(Math.max(16, height * 0.035));
  const innerW = Math.max(1, width - padX * 2);
  const innerH = Math.max(1, height - padY * 2);
  const portrait = height > width * 1.08;
  const lo = portrait ? 5 : 8;
  const hi = Math.min(count, portrait ? 9 : 14);
  const cardRatio = 1.18;
  const cap = short * 0.2;

  let best: WallLayout = {
    cols: lo,
    rows: Math.max(1, Math.ceil(count / lo)),
    cardW: 80,
    cardH: 80 * cardRatio,
    gap,
  };

  for (let cols = lo; cols <= hi; cols += 1) {
    const rows = Math.max(1, Math.ceil(count / cols));
    const maxW = (innerW - gap * (cols - 1)) / cols;
    const maxH = (innerH - gap * (rows - 1)) / rows;
    const cardW = Math.floor(Math.min(maxW, maxH / cardRatio, cap));
    if (cardW > best.cardW) {
      best = { cols, rows, cardW, cardH: Math.round(cardW * cardRatio), gap };
    }
  }

  return best;
}

export function DisplayCatalog({
  tickets,
}: {
  tickets: ArtworkTicket[];
  portrait?: boolean;
}) {
  const ordered = useMemo(() => sortByPrice(tickets), [tickets]);
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1920, h: 980 });

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBox({ w: rect.width, h: rect.height });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wall = fitWall(box.w, box.h, ordered.length);
  const type = Math.max(10, Math.round(wall.cardW * 0.11));

  return (
    <div ref={frameRef} className="flex h-full min-h-0 w-full items-center justify-center">
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${wall.cols}, ${wall.cardW}px)`,
          gridAutoRows: `${wall.cardH}px`,
          gap: wall.gap,
        }}
      >
        {ordered.map((ticket) => (
          <li
            key={ticket.src}
            className="flex overflow-hidden rounded-[4px] bg-white shadow-[0_2px_10px_rgba(8,4,16,0.35)]"
          >
            <article className="flex h-full w-full flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.src}
                  alt={`Game ${ticket.gameNumber}`}
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute right-0 top-0 bg-white px-[0.35em] font-mono font-bold leading-tight tabular-nums text-black"
                  style={{ fontSize: type }}
                >
                  {ticket.gameNumber}
                </span>
              </div>
              <div
                className="flex shrink-0 items-center justify-between bg-flag px-[0.4em] py-[0.18em]"
                style={{ fontSize: Math.round(type * 1.05) }}
              >
                <span className="font-mono font-bold tabular-nums text-white">
                  {formatCents(ticket.priceCents)}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
