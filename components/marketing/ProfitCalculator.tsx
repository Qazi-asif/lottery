"use client";

import { useMemo, useState } from "react";
import { formatCents } from "@/lib/format";
import { Button } from "@/components/marketing/Button";
import { TearEdge } from "@/components/marketing/TearEdge";

/**
 * Marketing estimator only — nothing here is persisted. All math is in integer
 * cents per the money rule in .cursorrules / instructions.
 *
 * The 5% figure is the standard Texas retailer commission on scratch sales.
 * The lift range is a modelling assumption the operator chooses, not a promise.
 */
const COMMISSION_BASIS_POINTS = 500; // 5.00%
const DAYS_PER_MONTH = 30;

const DAILY_MIN = 100;
const DAILY_MAX = 4000;
const LIFT_MIN = 0;
const LIFT_MAX = 30;

function commissionOf(cents: number) {
  return Math.round((cents * COMMISSION_BASIS_POINTS) / 10_000);
}

/** Feeds the CSS custom property that fills the slider track up to the thumb. */
function progress(value: number, min: number, max: number) {
  return `${((value - min) / (max - min)) * 100}%`;
}

export function ProfitCalculator({ planPriceCents = 4900 }: { planPriceCents?: number }) {
  const [dailySalesDollars, setDailySalesDollars] = useState(600);
  const [liftPercent, setLiftPercent] = useState(15);

  const result = useMemo(() => {
    const monthlySalesCents = dailySalesDollars * 100 * DAYS_PER_MONTH;
    const baseCommissionCents = commissionOf(monthlySalesCents);

    const addedSalesCents = Math.round((monthlySalesCents * liftPercent) / 100);
    const addedCommissionCents = commissionOf(addedSalesCents);

    const netCents = addedCommissionCents - planPriceCents;

    return {
      monthlySalesCents,
      baseCommissionCents,
      addedSalesCents,
      addedCommissionCents,
      netCents,
      annualNetCents: netCents * 12,
    };
  }, [dailySalesDollars, liftPercent, planPriceCents]);

  const positive = result.netCents > 0;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.75fr]">
      {/* ---- Controls ---- */}
      <div className="sheet rounded-lg p-7 sm:p-9">
        <p className="flex items-center gap-3">
          <span className="h-0.5 w-6 bg-flag" aria-hidden />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
            Profit potential
          </span>
        </p>
        <h3 className="wonk mt-4 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">
          Move two sliders. See what a busier ticket wall is worth.
        </h3>

        <div className="mt-10 space-y-9">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor="daily-sales"
                className="text-[14.5px] font-medium text-ink-soft"
              >
                Scratch ticket sales per day
              </label>
              <span className="font-mono text-2xl font-bold tabular-nums text-ink">
                {formatCents(dailySalesDollars * 100)}
              </span>
            </div>
            <input
              id="daily-sales"
              type="range"
              min={DAILY_MIN}
              max={DAILY_MAX}
              step={50}
              value={dailySalesDollars}
              onChange={(e) => setDailySalesDollars(Number(e.target.value))}
              style={{
                ["--range-progress" as string]: progress(
                  dailySalesDollars,
                  DAILY_MIN,
                  DAILY_MAX,
                ),
              }}
              className="mt-4 w-full"
            />
            <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-ink-faint">
              <span>$100</span>
              <span>$4,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="lift" className="text-[14.5px] font-medium text-ink-soft">
                Sales lift from a live display
              </label>
              <span className="font-mono text-2xl font-bold tabular-nums text-ink">
                {liftPercent}%
              </span>
            </div>
            <input
              id="lift"
              type="range"
              min={LIFT_MIN}
              max={LIFT_MAX}
              step={1}
              value={liftPercent}
              onChange={(e) => setLiftPercent(Number(e.target.value))}
              style={{
                ["--range-progress" as string]: progress(
                  liftPercent,
                  LIFT_MIN,
                  LIFT_MAX,
                ),
              }}
              className="mt-4 w-full"
            />
            <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              <span>0% — no change</span>
              <span>30% — best case</span>
            </div>
          </div>
        </div>

        <p className="mt-9 border-t border-dashed border-rule-strong pt-5 text-[12.5px] leading-relaxed text-ink-faint">
          Assumes the standard 5% Texas retailer commission, 30 days a month, and
          a {formatCents(planPriceCents)}/mo plan. This is an estimate you
          control — not a guarantee of results.
        </p>
      </div>

      {/* ---- Readout: receipt tape off the register ---- */}
      <div className="mx-auto w-full max-w-sm lg:mx-0">
        <div className="receipt px-6 pb-7 pt-6">
          <div className="flex items-center justify-between gap-3 border-b border-dashed border-rule-strong pb-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Your estimate
            </p>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="motion-live h-1.5 w-1.5 rounded-full bg-money"
                aria-hidden
              />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-money">
                Live
              </span>
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 font-mono text-[13px] tabular-nums">
            {[
              ["Monthly sales", formatCents(result.monthlySalesCents), "text-ink"],
              [
                "Commission today",
                formatCents(result.baseCommissionCents),
                "text-ink",
              ],
              [
                `Extra sales @ ${liftPercent}%`,
                `+${formatCents(result.addedSalesCents)}`,
                "text-foil",
              ],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="font-sans text-[12px] uppercase tracking-[0.1em] text-ink-faint">
                  {label}
                </dt>
                <dd className={`font-bold ${tone}`}>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-dashed border-rule-strong pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Extra commission / month
            </p>
            <p className="mt-2 font-mono text-[2.75rem] font-bold leading-none tracking-[-0.04em] tabular-nums text-ink">
              +{formatCents(result.addedCommissionCents)}
            </p>
          </div>

          <div
            className={`mt-6 border-l-2 pl-4 ${
              positive ? "border-l-money" : "border-l-rule-strong"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Net of the {formatCents(planPriceCents)}/mo plan
            </p>
            <p
              className={`mt-1 font-mono text-[28px] font-bold tabular-nums ${
                positive ? "text-money" : "text-ink-faint"
              }`}
            >
              {positive ? "+" : ""}
              {formatCents(result.netCents)}
              <span className="font-sans text-[13px] font-medium text-ink-faint">
                /mo
              </span>
            </p>
            {positive ? (
              <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-faint">
                ≈ {formatCents(result.annualNetCents)} / year
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-ink-faint">
                Drag the lift slider up to see the upside.
              </p>
            )}
          </div>
        </div>

        {/* Torn off the roll. Fills in the sheet colour, directly below the tape. */}
        <TearEdge className="block h-2.5 w-full text-sheet" />

        <Button href="/signup" className="mt-6 w-full">
          Start free — see it on your TV
        </Button>
      </div>
    </div>
  );
}
