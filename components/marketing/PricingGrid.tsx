"use client";

import { useState } from "react";
import type { PricingPlan } from "@/components/marketing/PricingCard";
import { PricingCard } from "@/components/marketing/PricingCard";
import { annualSavingsPercent } from "@/lib/format";

const TIER_COPY: Record<
  string,
  { description: string; extraBullets?: string[]; highlighted?: boolean }
> = {
  Lite: {
    description:
      "Single-location inventory and a touch POS for retailers getting started.",
  },
  Essential: {
    description:
      "Full inventory plus commission tracking — the foundation for daily operations.",
  },
  Smart: {
    description:
      "Multi-location inventory, in-store display, and reporting in one platform.",
    highlighted: true,
  },
  Premium: {
    description:
      "Everything in Smart, with white-glove onboarding for growing retail groups.",
    extraBullets: ["Dedicated onboarding", "Priority email support"],
  },
};

type PricingGridProps = {
  plans: PricingPlan[];
};

export function PricingGrid({ plans }: PricingGridProps) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const maxSavings = plans.reduce((max, plan) => {
    const savings = annualSavingsPercent(
      plan.priceMonthlyCents,
      plan.priceAnnualCents,
    );
    return Math.max(max, savings);
  }, 0);

  return (
    <div>
      <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div
          className="inline-flex rounded-full border border-rule-strong bg-sheet p-1"
          role="group"
          aria-label="Billing period"
        >
          {(["monthly", "annual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              aria-pressed={billing === option}
              className={`rounded-full px-6 py-2 text-[13.5px] font-medium capitalize transition-colors ${
                billing === option
                  ? "bg-flag text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {maxSavings > 0 ? (
          <p className="rounded-full bg-money-wash px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums text-money">
            Save up to {maxSavings}% annually
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const copy = TIER_COPY[plan.name] ?? {
            description: `${plan.name} plan for your retail operation.`,
          };

          return (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              description={copy.description}
              extraBullets={copy.extraBullets}
              highlighted={copy.highlighted}
            />
          );
        })}
      </div>
    </div>
  );
}
