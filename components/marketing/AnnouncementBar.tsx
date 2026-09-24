"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Top strip. Vermilion, one line, dismissible — the page's loudest element and
 * the only place a full-bleed flag fill is allowed.
 *
 * The jackpot ticker that used to live here has moved onto the board preview
 * where it belongs: it is illustrative draw-game data and reads as chrome
 * anywhere else. There is still no draw-game feed in the product.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-flag text-white">
      <div className="mx-auto flex h-9 max-w-marketing items-center gap-3 px-6">
        <span
          className="motion-live h-1.5 w-1.5 shrink-0 rounded-full bg-white"
          aria-hidden
        />

        <p className="min-w-0 flex-1 truncate text-[13px]">
          Refer a store — you both get{" "}
          <span className="font-mono font-semibold tabular-nums">$50</span>
          <span className="hidden sm:inline">
            . No hardware kit, live in under 20 minutes.
          </span>
        </p>

        <Link
          href="/signup"
          className="hidden shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white sm:inline-block"
        >
          Start free
        </Link>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="-mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M1 1l8 8M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
