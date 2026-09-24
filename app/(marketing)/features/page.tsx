import type { Metadata } from "next";
import { Button } from "@/components/marketing/Button";
import { FeatureCard, type FeatureTone, type TicketHue } from "@/components/marketing/FeatureCard";
import { FloatTickets } from "@/components/marketing/FloatTickets";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { PhotoFrame } from "@/components/marketing/PhotoFrame";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { ProofBar } from "@/components/marketing/ProofBar";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { StatsBar } from "@/components/marketing/StatsBar";
import { ThemeGallery } from "@/components/marketing/ThemeGallery";
import { TicketWall } from "@/components/marketing/TicketWall";
import { Underline } from "@/components/marketing/Underline";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Inventory, scan-to-sell, commission, shifts, alerts, bilingual in-store display, and role-based access for Texas lottery retailers.",
};

type Feature = {
  index: string;
  title: string;
  description: string;
  tone: FeatureTone;
  hue: TicketHue;
  invert?: boolean;
  tilt: string;
};

const coreFeatures: Feature[] = [
  {
    index: "01",
    title: "Pack and ticket tracking",
    description:
      "Receive by location and game. Activate once and every barcode is generated for you. Remaining counts stay live as tickets sell.",
    tone: "inventory",
    hue: "crimson",
    tilt: "-rotate-[0.6deg]",
  },
  {
    index: "02",
    title: "Built for a wedge scanner",
    description:
      "USB and Bluetooth scanners type a barcode and press Enter. A locked database row stops the same ticket from selling twice.",
    tone: "inventory",
    hue: "gold",
    invert: true,
    tilt: "rotate-[0.4deg]",
  },
  {
    index: "03",
    title: "Commission, snapshotted",
    description:
      "Commission and cashing bonus are stored at the moment of the sale or payout. Reports show what you earned, not a later estimate.",
    tone: "inventory",
    hue: "emerald",
    tilt: "-rotate-[0.3deg]",
  },
  {
    index: "04",
    title: "In-store display, no plastic",
    description:
      "A public TV page lists live games and prices in English, Spanish, or both. Generic art by default; official artwork only once licensing is approved.",
    tone: "display",
    hue: "navy",
    invert: true,
    tilt: "rotate-[0.5deg]",
  },
  {
    index: "05",
    title: "One account, many stores",
    description:
      "Owners see the group. Managers and cashiers only see assigned locations. Transfer a pack between stores when a game runs hot.",
    tone: "operations",
    hue: "violet",
    tilt: "-rotate-[0.4deg]",
  },
  {
    index: "06",
    title: "Access that matches the job",
    description:
      "Owners handle billing and the team. Managers run inventory and reports. Cashiers stay on the scan screen and see nothing else.",
    tone: "operations",
    hue: "teal",
    invert: true,
    tilt: "rotate-[0.3deg]",
  },
];

const operations: Feature[] = [
  {
    index: "07",
    title: "Cash that closes",
    description:
      "Open a drawer, sell through the shift, count out. Expected against actual, with the variance on the record instead of in someone's memory.",
    tone: "operations",
    hue: "crimson",
    invert: true,
    tilt: "-rotate-[0.5deg]",
  },
  {
    index: "08",
    title: "Before the bin is empty",
    description:
      "Low stock based on real sell-through, games past their official close date, and unusual scan patterns by employee.",
    tone: "operations",
    hue: "gold",
    tilt: "rotate-[0.4deg]",
  },
  {
    index: "09",
    title: "Fifty dollars, on the books",
    description:
      "Invite another retailer and credit posts when they subscribe — the same referral offer the market already knows, inside a cleaner product.",
    tone: "operations",
    hue: "emerald",
    invert: true,
    tilt: "-rotate-[0.3deg]",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <FloatTickets />
        <div className="relative mx-auto max-w-marketing px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
          {/* The board needs the wider column: below roughly 520px of inner
              width its auto-fill grid drops from three slots to two and the
              preview turns into a tall ladder beside short copy. */}
          <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="flex items-center gap-3">
                <span className="h-0.5 w-6 bg-flag" aria-hidden />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
                  Features
                </span>
              </p>
              <h1 className="wonk mt-5 font-display text-h1 font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
                Built around the{" "}
                <span className="relative inline-block whitespace-nowrap text-flag">
                  path of a pack
                  <Underline className="absolute -bottom-1 left-0 h-[0.3em] w-full text-foil" />
                </span>{" "}
                — not a wall of tickets.
              </h1>
              <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ink-soft">
                From the delivery at your back door to the commission report you
                run at month-end. One system, the scanner you already own, and no
                extra box from us.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/signup">Start free</Button>
                <Button href="/pricing" variant="secondary">
                  Compare plans
                </Button>
              </div>
            </div>

            {/* 9 fills three rows cleanly at the widths this column resolves to. */}
            <TicketWall count={9} />
          </div>
        </div>
      </section>

      <ProofBar />
      <StatsBar />

      {/* ---------------- Inventory ---------------- */}
      <section id="inventory" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Inventory"
                title="See what's left without opening a drawer."
                description="Activate a pack once and every barcode is generated. Counts fall as cashiers scan, across every location on the account. Move a pack to the store that needs it with a transfer."
              />
            </Reveal>
            <Reveal delay={90}>
              <PhotoFrame
                file="dashboard-vivid.png"
                alt="Inventory and commission dashboard on a monitor"
                tilt="rotate-[0.7deg]"
              />
              <div className="mt-6">
                <ProductShowcase />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Core platform ---------------- */}
      <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Core platform"
              title="Six capabilities. One ledger."
              align="center"
              className="mb-14"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature, i) => (
              <Reveal key={feature.index} delay={(i % 3) * 80} variant="pop">
                <FeatureCard {...feature} notch="var(--color-paper-2)" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Display ---------------- */}
      <section id="display" className="scroll-mt-24 bg-ink py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              tone="paper"
              eyebrow="Display"
              title="A wall customers actually look at."
              description="The in-store page is public and read-only. It lists active games and prices, refreshes as packs sell down, and speaks English, Spanish, or both. Pick a mode and see it change."
              className="mb-12"
            />
          </Reveal>

          <Reveal delay={80}>
            <ThemeGallery surface="ink" />
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal>
              <PhotoFrame
                file="display-vivid.png"
                alt="Tall digital signage screens beside a store checkout"
                caption="Portrait screens beside the register"
                tilt="-rotate-[0.9deg]"
              />
            </Reveal>
            <Reveal delay={80}>
              <PhotoFrame
                file="hero-vivid.png"
                alt="Wall-mounted digital lottery board above a store counter"
                caption="One big board above the counter"
                tilt="rotate-[0.6deg]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Operations ---------------- */}
      <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Operations"
              title="The work display-only tools skip."
              description="Shifts, alerts, and referrals are in the product — not on a “coming soon” slide."
              className="mb-14"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {operations.map((feature, i) => (
              <Reveal key={feature.index} delay={i * 80} variant="pop">
                <FeatureCard {...feature} notch="var(--color-paper-2)" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MarketingCta
        eyebrow="Plans"
        title="Feature access follows your plan, not a hardcoded name."
        description="Inventory, display, multi-location, and commission reports are flags on each plan. What a tier includes changes in billing — never in a sales conversation."
      />
    </>
  );
}
