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
      className={`flex h-full flex-col rounded-lg border p-8 ${
        highlighted
          ? "border-gold bg-bg"
          : "border-border bg-bg-secondary"
      }`}
    >
      {highlighted ? (
        <p className="mb-4 text-small font-medium uppercase tracking-[0.15em] text-gold">
          Most popular
        </p>
      ) : (
        <div className="mb-4 h-5" aria-hidden />
      )}

      <h3 className="font-serif text-h3 font-semibold text-ink">{plan.name}</h3>
      <p className="mt-2 min-h-[3rem] text-small leading-relaxed text-ink-soft">
        {description}
      </p>

      <div className="mt-6 border-b border-border pb-6">
        <p className="font-serif text-h2 font-semibold text-ink">
          {formatCents(price)}
          <span className="font-sans text-small font-normal text-ink-soft">
            /mo
          </span>
        </p>
        {billing === "annual" ? (
          <p className="mt-1 text-small text-ink-soft">
            {formatCents(plan.priceAnnualCents)} billed annually
          </p>
        ) : null}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((key) => (
          <li
            key={key}
            className="flex items-start gap-3 text-small text-ink-soft"
          >
            <span className="mt-0.5 text-gold" aria-hidden>
              —
            </span>
            {FEATURE_LABELS[key]}
          </li>
        ))}
        {extraBullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-small text-ink-soft"
          >
            <span className="mt-0.5 text-gold" aria-hidden>
              —
            </span>
            {bullet}
          </li>
        ))}
      </ul>

      <Button
        href={`/signup?plan=${encodeURIComponent(plan.name.toLowerCase())}&billing=${billing}`}
        variant={highlighted ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        Choose {plan.name}
      </Button>
    </article>
  );
}
