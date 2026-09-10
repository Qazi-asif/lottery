import type { Metadata } from "next";
import { Button } from "@/components/marketing/Button";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { getDatabaseUrl } from "@/lib/prisma";
import { getActivePlans } from "@/lib/plans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Texas lottery scratch-ticket retailers. Plans from Lite to Premium.",
};

export default async function PricingPage() {
  const plans = await getActivePlans();
  const databaseConfigured = Boolean(getDatabaseUrl());

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <MarketingPhoto
            file="store-counter.png"
            alt="Premium store counter"
            priority
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-marketing px-6 py-24 text-center lg:py-32">
          <p className="text-small font-medium uppercase tracking-[0.22em] text-gold">
            Pricing
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-h1 font-semibold leading-tight text-bg">
            Four tiers. The same quiet standard.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body leading-relaxed text-white/70">
            Hosting and updates are included. What you can use is controlled by
            feature flags on the plan — upgrade from billing whenever you are
            ready.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-marketing px-6">
          {plans.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg-secondary px-8 py-16 text-center">
              <p className="font-serif text-h3 text-ink">Plans are not loaded yet</p>
              <p className="mx-auto mt-4 max-w-lg text-body text-ink-soft">
                {databaseConfigured
                  ? "Run npm run db:seed so Lite, Essential, Smart, and Premium render from the plans table."
                  : "Add a real DATABASE_URL to .env, restart the server, then run npm run db:seed."}
              </p>
            </div>
          ) : (
            <PricingGrid plans={plans} />
          )}
        </div>
      </section>

      <section className="border-t border-border bg-bg-secondary py-24">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-lg border border-border">
              <MarketingPhoto
                file="laptop-dashboard.png"
                alt="Billing and operations dashboard on a laptop"
                className="aspect-video"
              />
            </div>
            <div>
              <p className="text-small uppercase tracking-[0.2em] text-gold">
                Billing
              </p>
              <h2 className="mt-4 font-serif text-h2 text-ink">
                Card details never touch our servers.
              </h2>
              <p className="mt-4 text-body leading-relaxed text-ink-soft">
                Checkout and the customer portal run on Stripe. Cancel or change
                plans there. Google Pay and Apple Pay appear automatically when
                enabled in your Stripe Dashboard.
              </p>
              <ul className="mt-8 space-y-4 text-body text-ink-soft">
                <li className="flex gap-3">
                  <span className="text-gold">—</span>
                  Monthly or annual billing
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">—</span>
                  Proration handled in the Stripe portal
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">—</span>
                  Password set from a one-time email link, never sent in plaintext
                </li>
              </ul>
              <Button href="/signup" className="mt-8">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
