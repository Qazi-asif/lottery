import type { Metadata } from "next";
import { Button } from "@/components/marketing/Button";
import { FaqAccordion, type FaqItem } from "@/components/marketing/FaqAccordion";
import { PhotoFrame } from "@/components/marketing/PhotoFrame";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { ProfitCalculator } from "@/components/marketing/ProfitCalculator";
import { ProofBar } from "@/components/marketing/ProofBar";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Underline } from "@/components/marketing/Underline";
import { getDatabaseUrl } from "@/lib/prisma";
import { getActivePlans } from "@/lib/plans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Software-only plans for Texas lottery retailers. No hardware kit, no sales call. Start on Stripe today.",
};

const FAQS: FaqItem[] = [
  {
    question: "Is there anything else to buy?",
    answer:
      "No. Bring a TV for the display and a touch screen or tablet for the smart POS. We don't sell refurbished computers, Fire Sticks, or non-refundable kits, and hosting and updates are included in the plan.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, from the Stripe customer portal. Proration is handled there, and the features you can use update as soon as the plan changes — nothing is hardcoded to a tier name.",
  },
  {
    question: "How does the $50 referral work?",
    answer:
      "Share your referral code with another retailer. When they subscribe, credit posts to both accounts. You can track referrals from your dashboard.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Cancel any time from the Stripe portal and you keep access through the end of the paid period. Your data stays available for export while the account is open.",
  },
  {
    question: "Do you charge per location?",
    answer:
      "Multi-location support is a plan feature rather than a per-store surcharge. Smart and Premium cover multiple locations under one subscription.",
  },
];

const ASSURANCES = [
  {
    index: "01",
    title: "No kit",
    copy: "Bring your TV and a touch screen. We never sell you a computer.",
    fill: "bg-money text-white",
  },
  {
    index: "02",
    title: "Stripe Checkout",
    copy: "Cards stay with Stripe. Change or cancel from the customer portal.",
    fill: "bg-flag text-white",
  },
  {
    index: "03",
    title: "Most stores pick Smart",
    copy: "Display, multi-location, shifts, and pack transfer in one tier.",
    fill: "bg-flag text-white",
  },
];

const BILLING_POINTS = [
  "Monthly or annual billing",
  "Proration handled in the Stripe portal",
  "Password set from a one-time link — never emailed in plaintext",
  "Refer a store and you both get $50",
];

export default async function PricingPage() {
  const plans = await getActivePlans();
  const databaseConfigured = Boolean(getDatabaseUrl());

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section>
        <div className="mx-auto max-w-marketing px-6 pb-16 pt-14 text-center lg:pb-20 lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-flag px-3 py-1.5 text-white shadow-[0_8px_20px_-8px_rgb(240_61_20/0.7)]">
            <span
              className="motion-live h-1.5 w-1.5 rounded-full bg-white"
              aria-hidden
            />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] tabular-nums">
              Software only — $0 hardware
            </span>
          </span>

          <h1 className="wonk mx-auto mt-7 max-w-3xl font-display text-h1 font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
            Four tiers.{" "}
            <span className="relative inline-block whitespace-nowrap text-flag">
              No kit in the mail.
              <Underline className="absolute -bottom-1 left-0 h-[0.3em] w-full text-flag" />
            </span>{" "}
            Live this afternoon.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17.5px] leading-relaxed text-ink-soft">
            Their $25 screen still wants a $150–$500 box. Ours runs on the TV in
            your break room. Hosting and updates are included, and what you can use
            is a flag on the plan — upgrade from billing whenever you are ready.
          </p>
        </div>
      </section>

      <ProofBar />

      {/* ---------------- Plans ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          {plans.length === 0 ? (
            <div className="sheet rounded-lg px-8 py-16 text-center">
              <p className="wonk font-display text-[20px] font-semibold text-ink">
                Plans are not loaded yet
              </p>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                {databaseConfigured
                  ? "Run npm run db:seed so Lite, Essential, Smart, and Premium render from the plans table."
                  : "Add a real DATABASE_URL to .env, restart the server, then run npm run db:seed."}
              </p>
            </div>
          ) : (
            <PricingGrid plans={plans} />
          )}

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {ASSURANCES.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} variant="pop">
                <div
                  className={`ticket stub stub-light lift h-full rounded-lg p-6 ${item.fill} ${
                    i === 1 ? "rotate-[0.5deg]" : "-rotate-[0.4deg]"
                  }`}
                  style={{
                    ["--stub" as string]: "1.6rem",
                    ["--notch" as string]: "var(--color-paper)",
                  }}
                >
                  <div className="pl-4">
                    <span className="font-mono text-[11px] font-bold tabular-nums opacity-70">
                      {item.index}
                    </span>
                    <p className="wonk mt-3 font-display text-[19px] font-semibold tracking-tight">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[14.5px] leading-relaxed opacity-85">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Calculator ---------------- */}
      <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Does it pay for itself?"
              title="Check your profit potential before you subscribe."
              description="You keep 5% commission on scratch sales. Move the sliders to see what a lift on that number looks like next to the plan price."
              align="center"
              className="mb-14"
            />
          </Reveal>
          <Reveal delay={80}>
            <ProfitCalculator />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Billing ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <PhotoFrame
                file="dashboard-vivid.png"
                alt="Billing and operations dashboard on a monitor"
                tilt="-rotate-[0.8deg]"
              />
            </Reveal>
            <Reveal delay={90}>
              <SectionHeading
                eyebrow="Billing"
                title="Card details never touch our servers."
                description="Checkout and the customer portal run on Stripe. Change or cancel there. Google Pay and Apple Pay appear automatically once you enable them in your Stripe Dashboard."
              />
              <ul className="mt-8 space-y-3.5">
                {BILLING_POINTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-soft"
                  >
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-money"
                      aria-hidden
                    >
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1.5 6.5l3 3 6-6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button href="/signup" className="mt-9">
                Book a demo
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t border-rule bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="Straight answers before you pay."
                description="Nothing here needs a phone call to explain."
              />
            </Reveal>
            <Reveal delay={80}>
              <FaqAccordion items={FAQS} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
