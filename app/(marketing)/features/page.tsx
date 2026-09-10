import type { Metadata } from "next";
import { Button } from "@/components/marketing/Button";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Inventory management, scan-to-sell, commission tracking, multi-location support, and in-store digital display for lottery retailers.",
};

const coreFeatures = [
  {
    index: "01  Inventory",
    title: "Pack and ticket tracking",
    description:
      "Receive by location and game. Activate once to bulk-generate barcodes. Remaining counts stay live as tickets sell.",
  },
  {
    index: "02  Scan-to-sell",
    title: "Built for a wedge scanner",
    description:
      "USB and Bluetooth scanners type a barcode and send Enter. A locked database row stops the same ticket selling twice.",
  },
  {
    index: "03  Commission",
    title: "Revenue, snapshotted",
    description:
      "Commission and cashing bonus are stored at the sale or payout. Reports show what you earned — not a later estimate.",
  },
  {
    index: "04  Display",
    title: "In-store, without the plastic",
    description:
      "A public TV page lists available games and prices. Generic by default. Official artwork only if licensing is approved.",
  },
  {
    index: "05  Multi-location",
    title: "One account, many stores",
    description:
      "Owners see the group. Managers and cashiers only see assigned locations. Add stores as the business grows.",
  },
  {
    index: "06  Roles",
    title: "Access that matches the job",
    description:
      "Owners handle billing and the team. Managers run inventory and reports. Cashiers stay on the scan screen.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <MarketingPhoto
            file="scan-register.png"
            alt="Scanning at the register"
            priority
            className="opacity-45"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-marketing px-6 py-28 lg:py-36">
          <p className="text-small font-medium uppercase tracking-[0.22em] text-gold">
            Features
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-h1 font-semibold leading-tight text-bg">
            Designed around the actual path of a pack.
          </h1>
          <p className="mt-6 max-w-lg text-body leading-relaxed text-white/70">
            From delivery at the back door to the commission report you run at
            month-end — one system, no extra hardware beyond a scanner.
          </p>
          <Button href="/pricing" variant="inverse" className="mt-10">
            Compare plans
          </Button>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-border">
              <MarketingPhoto
                file="laptop-dashboard.png"
                alt="Inventory dashboard on a laptop"
                className="aspect-video"
              />
            </div>
            <SectionHeading
              eyebrow="Inventory"
              title="See remaining tickets without opening a drawer"
              description="Activate a pack once. Every barcode is generated. Counts fall as cashiers scan — across every location on the account."
            />
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <SectionHeading
            eyebrow="Core platform"
            title="Six capabilities. One ledger."
            align="center"
            className="mx-auto mb-16"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <FeatureCard key={feature.index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Display"
              title="A wall customers actually look at"
              description="The in-store page is public and read-only. It lists active games and prices, and refreshes as packs sell out."
            />
            <div className="overflow-hidden rounded-lg border border-border">
              <MarketingPhoto
                file="instore-display.png"
                alt="Wall-mounted store display listing games and prices"
                className="aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-ink py-24">
        <div className="mx-auto max-w-marketing px-6 text-center">
          <h2 className="font-serif text-h2 font-semibold text-bg">
            Feature access follows the plan — not hardcoded names.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-body text-white/60">
            Inventory, display, multi-location, and commission reports are flags
            on each plan. Change what a tier includes in the database, not in
            code.
          </p>
          <Button href="/pricing" variant="inverse" className="mt-10">
            View pricing
          </Button>
        </div>
      </section>
    </>
  );
}
