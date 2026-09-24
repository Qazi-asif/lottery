import type { PlanFeatures } from "@/lib/plan-features";
import { FEATURE_LABELS, enabledFeatures } from "@/lib/plan-features";
import { formatCents } from "@/lib/format";
import { Button } from "@/components/marketing/Button";

export type PricingPlan = {
  id: string;
  name: string;
  priceMonthlyCents: number;
  priceAnnualCents: number;
  features: PlanFeatures;
};

type PricingCardProps = {
  plan: PricingPlan;
  billing: "monthly" | "annual";
  highlighted?: boolean;
  description: string;
  extraBullets?: string[];
};

export function PricingCard({
  plan,
  billing,
  highlighted = false,
  description,
  extraBullets = [],
}: PricingCardProps) {
  const price =
    billing === "monthly"
      ? plan.priceMonthlyCents
      : Math.round(plan.priceAnnualCents / 12);

  const features = enabledFeatures(plan.features);

  return (
    <article
      className={`lift flex h-full flex-col rounded-lg border-t-4 p-6 ${
        highlighted
          ? "ticket -rotate-[0.4deg] border-t-flag bg-flag text-white lg:-translate-y-3"
          : "sheet border-t-rule-strong"
      }`}
    >
      <div className="flex-1">
        <div className="flex h-6 items-center">
          {highlighted ? (
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${
                highlighted
                  ? "bg-white/20 text-white"
                  : "bg-flag text-white"
              }`}
            >
              Most popular
            </span>
          ) : null}
        </div>

        <h3
          className={`wonk mt-4 font-display text-[22px] font-semibold tracking-tight ${
            highlighted ? "text-white" : "text-ink"
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`mt-2 min-h-[3.5rem] text-[13.5px] leading-relaxed ${
            highlighted ? "text-white/80" : "text-ink-soft"
          }`}
        >
          {description}
        </p>

        <div
          className={`mt-5 border-b border-dashed pb-5 ${
            highlighted ? "border-white/25" : "border-rule-strong"
          }`}
        >
          <p
            className={`font-mono text-[2.5rem] font-bold leading-none tracking-[-0.04em] tabular-nums ${
              highlighted ? "text-white" : "text-ink"
            }`}
          >
            {formatCents(price)}
            <span
              className={`font-sans text-sm font-medium ${
                highlighted ? "text-white/70" : "text-ink-faint"
              }`}
            >
              /mo
            </span>
          </p>
          {billing === "annual" ? (
            <p
              className={`mt-2 font-mono text-[12.5px] tabular-nums ${
                highlighted ? "text-white/65" : "text-ink-faint"
              }`}
            >
              {formatCents(plan.priceAnnualCents)} billed annually
            </p>
          ) : null}
        </div>

        <ul className="mt-5 space-y-3">
          {[...features.map((key) => FEATURE_LABELS[key]), ...extraBullets].map(
            (label) => (
              <li
                key={label}
                className={`flex items-start gap-2.5 text-[13.5px] leading-relaxed ${
                  highlighted ? "text-white/85" : "text-ink-soft"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                    highlighted ? "bg-white/20" : "bg-money"
                  }`}
                  aria-hidden
                >
                  <svg className="h-2 w-2 text-white" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1.5 6.5l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {label}
              </li>
            ),
          )}
        </ul>
      </div>

      <Button
        href={`/signup?plan=${encodeURIComponent(plan.name.toLowerCase())}&billing=${billing}`}
        variant={highlighted ? "inverse" : "secondary"}
        className="mt-8 w-full"
      >
        Choose {plan.name}
      </Button>
    </article>
  );
}
