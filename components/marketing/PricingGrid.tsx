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
      "Single-location inventory and scan-to-sell for retailers getting started.",
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
      <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div
          className="inline-flex rounded-lg border border-border p-1"
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-5 py-2 text-small font-medium transition-colors ${
              billing === "monthly"
                ? "bg-ink text-bg"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            className={`rounded-md px-5 py-2 text-small font-medium transition-colors ${
              billing === "annual"
                ? "bg-ink text-bg"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Annual
          </button>
        </div>
        {maxSavings > 0 ? (
          <p className="text-small text-ink-soft">
            Save up to {maxSavings}% with annual billing
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
