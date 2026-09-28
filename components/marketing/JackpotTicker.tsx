import type { SampleJackpot } from "@/lib/marketing/display-themes";

/**
 * Draw-game figures on the marketing preview. Illustrative only — there is no
 * jackpot feed in the product, and the live board does not render this strip.
 */

function formatJackpot(amountCents: number) {
  const millions = amountCents / 100 / 1_000_000;
  return `$${millions.toFixed(0)}M`;
}

export function JackpotTicker({
  jackpots,
  className = "",
}: {
  jackpots: SampleJackpot[];
  className?: string;
}) {
  return (
    <div
      className={`@container flex flex-wrap items-baseline gap-x-6 gap-y-1 border-y border-dashed border-rule-strong py-2 ${className}`}
    >
      {jackpots.map((jackpot) => (
        <p key={jackpot.game} className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {jackpot.game}
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-white">
            {formatJackpot(jackpot.amountCents)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {jackpot.drawLabel}
          </span>
        </p>
      ))}
    </div>
  );
}
