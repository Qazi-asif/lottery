"use client";

import { useEffect, useMemo, useState } from "react";
import type { DisplayThemeId } from "@/lib/display-style";
import { JackpotTicker } from "@/components/marketing/JackpotTicker";
import { SAMPLE_GAMES, SAMPLE_JACKPOTS } from "@/lib/marketing/display-themes";
import { formatCents } from "@/lib/format";

/** Landing-only faces: red or black. Does not change the live TV board. */
function landingFace(index: number): string {
  return index % 2 === 0
    ? "bg-[#f11112] text-white"
    : "bg-black text-white ring-1 ring-[#f11112]";
}

type TicketWallProps = {
  themeId?: DisplayThemeId;
  /** Tile count. 8 reads better in a narrow column, 12 fills a wide one. */
  count?: number;
  lang?: "en" | "es";
  /** Mirrors display_configs.layout. */
  layout?: "landscape" | "portrait";
  className?: string;
};

/**
 * A printed pack laid on stock. Same faces, theme ids, and spotlight loop
 * as the live `/display` board — the screenshot a retailer sees here is
 * the screen they get in the store.
 */

const STAMP: Record<string, string> = {
  hot: "HOT",
  ending: "LAST",
  new: "NEW",
};

const TILT = [
  "-rotate-[0.6deg]",
  "rotate-[0.45deg]",
  "-rotate-[0.25deg]",
  "rotate-[0.7deg]",
  "-rotate-[0.4deg]",
  "rotate-[0.3deg]",
];

export function TicketWall({
  themeId: _themeId = "plain",
  count = 12,
  lang = "en",
  layout = "landscape",
  className = "",
}: TicketWallProps) {
  const games = useMemo(() => SAMPLE_GAMES.slice(0, count), [count]);
  const [spotlight, setSpotlight] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setSpotlight((prev) => (prev + 1) % games.length);
    }, 2200);

    return () => window.clearInterval(id);
  }, [games.length]);

  return (
    // White print on the stock, kraft tray inside — same object language as
    // PhotoFrame and the feature tickets. min-w-0 keeps the ticker from
    // stretching the page past a phone viewport.
    <div
      className={`sheet lift min-w-0 rounded-lg p-2.5 pb-3 transition-transform hover:rotate-0 -rotate-[0.4deg] ${className}`}
    >
      <div
        className="rounded-md bg-black px-4 py-4 ring-1 ring-[#f11112]/40"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-dashed border-rule-strong pb-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Eastside Food Mart
            </p>
            <p className="wonk mt-0.5 truncate font-display text-base font-semibold tracking-tight text-ink">
              Main St Store
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="motion-live h-1.5 w-1.5 rounded-full bg-flag" aria-hidden />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-flag">
                Live
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              {lang === "es" ? "Texto" : "Plain text"}
            </span>
          </div>
        </div>

        <JackpotTicker jackpots={SAMPLE_JACKPOTS} className="mt-3" />

        <div
          className={`mt-3 grid gap-2.5 ${
            layout === "portrait"
              ? "grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]"
              : "grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]"
          }`}
        >
          {games.map((game, i) => {
            const active = i === spotlight;
            const low = game.remaining <= 10;
            const stamp = game.badge ? STAMP[game.badge] : null;

            return (
              <article
                key={game.gameNumber}
                className={`ticket relative flex flex-col rounded-md px-2.5 py-2.5 transition-transform duration-300 ${landingFace(
                  i,
                )} ${TILT[i % TILT.length]} ${
                  active ? "z-10 scale-[1.04] rotate-0" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-[1.35rem] font-bold leading-none tabular-nums tracking-tight">
                    {formatCents(game.priceCents)}
                  </p>
                  <span className="flex flex-col items-end gap-1">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-wider tabular-nums opacity-70">
                      #{game.gameNumber}
                    </span>
                    <svg width="11" height="11" viewBox="0 0 12 12" className="opacity-80" aria-hidden>
                      <path
                        d="M6 0.7l1.5 3.1 3.4.5-2.45 2.4.6 3.4L6 8.5 2.95 10.1l.6-3.4L1.1 4.3l3.4-.5L6 0.7z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>

                <div className="ticket-perf my-2" aria-hidden />

                <p className="wonk font-display text-[14px] font-semibold leading-snug tracking-tight">
                  {game.name}
                </p>

                <div className="mt-auto pt-3">
                  <p className="font-sans text-[9px] font-medium uppercase tracking-[0.14em] opacity-65">
                    {lang === "es" ? "Premio mayor" : "Top prize"}
                  </p>
                  <p className="font-mono text-[13px] font-bold leading-tight tabular-nums">
                    {formatCents(game.topPrizeCents)}
                  </p>
                </div>

                <div className="mt-2 flex items-end justify-between gap-2">
                  <p
                    className={`font-mono text-[10px] font-bold uppercase tabular-nums ${
                      low ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {game.remaining} {lang === "es" ? "quedan" : "left"}
                  </p>
                  {stamp ? (
                    <span className="wonk font-display text-[11px] font-semibold tracking-wide opacity-80">
                      {stamp}
                    </span>
                  ) : game.bin ? (
                    <span className="font-mono text-[9px] uppercase tracking-wider opacity-50">
                      Bin {game.bin}
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 border-t border-dashed border-rule-strong pt-3">
          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {lang === "es"
              ? "Se actualiza al vender"
              : "Updates automatically as you sell"}
          </p>
          <p className="shrink-0 font-mono text-[10px] font-bold tracking-wider text-ink-faint">
            18+
          </p>
        </div>
      </div>
    </div>
  );
}
