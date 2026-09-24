import { Button } from "@/components/marketing/Button";
import { CompareSection } from "@/components/marketing/CompareSection";
import { FaqAccordion, type FaqItem } from "@/components/marketing/FaqAccordion";
import { FeatureCard, type FeatureTone, type TicketHue } from "@/components/marketing/FeatureCard";
import { FloatTickets } from "@/components/marketing/FloatTickets";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Marquee } from "@/components/marketing/Marquee";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { PhotoFrame } from "@/components/marketing/PhotoFrame";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { ProfitCalculator } from "@/components/marketing/ProfitCalculator";
import { ProofBar } from "@/components/marketing/ProofBar";
import { Reveal } from "@/components/marketing/Reveal";
import { ScratchCard } from "@/components/marketing/ScratchCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { StatsBar } from "@/components/marketing/StatsBar";
import { Testimonials } from "@/components/marketing/Testimonials";
import { ThemeGallery } from "@/components/marketing/ThemeGallery";
import { TicketWall } from "@/components/marketing/TicketWall";
import { Underline } from "@/components/marketing/Underline";
import { SAMPLE_GAMES } from "@/lib/marketing/display-themes";
import { formatCents } from "@/lib/format";

const pillars: {
  index: string;
  title: string;
  description: string;
  tone: FeatureTone;
  hue: TicketHue;
  invert?: boolean;
  tilt: string;
}[] = [
  {
    index: "01",
    title: "Inventory you can trust",
    description:
      "Receive a pack, activate once, and every ticket barcode is generated for you. Live counts at every location — no clipboards, no guessing at close.",
    tone: "inventory",
    hue: "crimson",
    tilt: "-rotate-[0.7deg]",
  },
  {
    index: "02",
    title: "Commission that settles itself",
    description:
      "Every scan writes a sale with the commission locked in at that moment. Month-end matches the register because nothing was reconstructed later.",
    tone: "inventory",
    hue: "gold",
    invert: true,
    tilt: "rotate-[0.5deg]",
  },
  {
    index: "03",
    title: "A board that sells for you",
    description:
      "Swap plastic dispensers for a clean digital board of games, prices, and what's nearly gone. English, Spanish, or both.",
    tone: "display",
    hue: "emerald",
    tilt: "-rotate-[0.3deg]",
  },
  {
    index: "04",
    title: "Shifts that reconcile",
    description:
      "Open and close a shift in seconds. Cash, scans, and payouts line up, and you see the gap the moment it appears — not next week.",
    tone: "operations",
    hue: "navy",
    invert: true,
    tilt: "rotate-[0.6deg]",
  },
  {
    index: "05",
    title: "Roles that protect you",
    description:
      "Cashiers get the scan screen and nothing else. Managers get their stores. You get billing, team, and every report.",
    tone: "operations",
    hue: "violet",
    tilt: "-rotate-[0.5deg]",
  },
  {
    index: "06",
    title: "Low-stock alerts",
    description:
      "Find out a hot $10 game is down to its last few tickets while you can still reorder, instead of when a customer asks.",
    tone: "operations",
    hue: "teal",
    invert: true,
    tilt: "rotate-[0.4deg]",
  },
];

/** Board data for the crawl — the same invented games the preview renders. */
const TICKER = SAMPLE_GAMES.slice(0, 8).map(
  (game) =>
    `${game.name} · ${formatCents(game.priceCents)} · Top ${formatCents(
      game.topPrizeCents,
    )}`,
);

const FAQS: FaqItem[] = [
  {
    question: "Do I have to buy your hardware?",
    answer:
      "No. Use any TV for the display page and any USB or Bluetooth barcode scanner at the register. We don't sell refurbished computers or Fire Stick kits, and there's nothing to ship.",
  },
  {
    question: "How fast can I go live?",
    answer:
      "Sign up, pay on Stripe Checkout, then set your password from a one-time secure link. Add a location, receive a pack, activate it, and start scanning. Most stores are running the same day — no install appointment.",
  },
  {
    question: "Will the TV show official lottery artwork?",
    answer:
      "Not by default. The display renders in a generic, plain-text mode until your account has artwork licensing approved. That's a legal requirement rather than a missing feature, and the display mode you pick controls the look in the meantime.",
  },
  {
    question: "Can my cashiers see my numbers?",
    answer:
      "No. Cashiers only get the scan-to-sell screen. Location managers see inventory and reports for the stores you assign them. Only you as owner see billing, the team, and every location.",
  },
  {
    question: "What if I run more than one store?",
    answer:
      "One account covers all of them. Each location gets its own display, its own inventory, and its own reports, and you can compare them side by side or move a pack between stores with a transfer.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No. It's a month-to-month subscription you can cancel from the Stripe customer portal at any time. Annual billing is available if you'd rather pay less per month.",
  },
];

const HERO_METRICS = [
  { value: "$0", label: "Hardware to buy", fill: "bg-foil text-ink" },
  { value: "20 min", label: "To go live", fill: "bg-flag text-white" },
  { value: "1 scan", label: "Per sale", fill: "bg-money text-white" },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <FloatTickets />
        <div className="relative mx-auto max-w-marketing px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-flag px-3 py-1.5 text-white shadow-[0_8px_20px_-8px_rgb(240_61_20/0.7)]">
                <span
                  className="motion-live h-1.5 w-1.5 rounded-full bg-white"
                  aria-hidden
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Now launching for Texas retailers
                </span>
              </span>

              <h1 className="wonk mt-6 font-display text-hero font-semibold leading-[0.98] tracking-[-0.025em] text-ink">
                Sell up to{" "}
                {/* The claim gets the pen mark — the one drawn element on the page. */}
                <span className="relative inline-block whitespace-nowrap text-flag">
                  30% more
                  <Underline className="absolute -bottom-1 left-0 h-[0.34em] w-full text-foil" />
                </span>{" "}
                scratch tickets.
              </h1>

              <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ink-soft">
                Turn any TV in your store into a live scratch-game board, sell a
                ticket with one scan, and watch your commission land in real time.
                Set it up yourself in about 20 minutes — no hardware kit, no sales
                call.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/signup">Start free</Button>
                <Button href="/pricing" variant="secondary">
                  See plans &amp; pricing
                </Button>
              </div>

              {/* Three torn-off stubs, each carrying one figure. */}
              <ul className="mt-9 grid gap-3 sm:grid-cols-3">
                {HERO_METRICS.map((item) => (
                  <li
                    key={item.label}
                    className={`ticket stub stub-light lift rounded-lg px-4 py-3 ${item.fill}`}
                    style={{
                      ["--stub" as string]: "1.6rem",
                      ["--notch" as string]: "var(--color-paper)",
                    }}
                  >
                    <div className="pl-5">
                      <p className="font-mono text-[16px] font-bold leading-none tabular-nums">
                        {item.value}
                      </p>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[0.1em] opacity-75">
                        {item.label}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* 9 keeps the board's height close to the copy beside it; 12 left
                  the column overhanging the headline by most of a row. */}
              <TicketWall count={9} />
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Live preview — the pack that goes on your TV
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Ticker crawl ---------------- */}
      <Marquee items={TICKER} className="py-3.5" />

      <ProofBar />

      {/* ---------------- Scratch reveal ---------------- */}
      <section className="bg-bronze py-16 sm:py-20">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <SectionHeading
                tone="paper"
                eyebrow="The part nobody shows you"
                title="A busier wall is worth a number. Here's the number."
                description="Most display vendors sell you a screen and stop there. The reason to put one up is what it does to the 5% you keep on every scratch ticket that leaves the store."
              />
              <p className="mt-6 max-w-lg text-[14.5px] leading-relaxed text-paper-2/70">
                The panel on the right is one store's month at{" "}
                <span className="font-mono font-semibold tabular-nums text-foil-light">
                  $600
                </span>{" "}
                a day in scratch sales, with the lift our pilot stores reported.
                Scratch it off, then run your own numbers further down the page.
              </p>
            </Reveal>

            <Reveal delay={90} variant="scale">
              <ScratchCard
                label="Scratch to reveal"
                tone="paper"
                className="mx-auto max-w-sm"
              >
                {/* Under the latex. Every figure here is the same arithmetic the
                    calculator below runs: $600/day → $18,000/mo, a 15% lift adds
                    $2,700 in sales, which is $135 of commission at 5%. */}
                <div className="flex aspect-[5/3] flex-col justify-center bg-ink px-7 py-6 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-2/50">
                    Extra scratch sales / month
                  </p>
                  <p className="mt-2 font-mono text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-none tracking-[-0.04em] tabular-nums text-foil-light">
                    +$2,700
                  </p>
                  <p className="mt-4 border-t border-dashed border-white/15 pt-3 font-mono text-[11px] tabular-nums text-paper-2/65">
                    ≈ +$135 commission · +$86 after a $49 plan
                  </p>
                </div>
              </ScratchCard>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* ---------------- Pillars ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Everything in one account"
              title="Six jobs your store does badly on paper."
              description="ScratchCrest isn't a screen with a subscription attached. It's the software that runs the lottery side of your counter."
              align="center"
              className="mb-14"
            />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.index} delay={(i % 3) * 80} variant="pop">
                <FeatureCard {...pillar} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Display modes ---------------- */}
      <section id="display" className="bg-ink py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              tone="paper"
              eyebrow="Pick your mode"
              title="Three display modes. One URL. Any TV in the store."
              description="Choose a mode, a language, and landscape or portrait, then open the display link on the TV you already own. Prices, hot games, and what's nearly sold out update themselves as your team scans."
              className="mb-12"
            />
          </Reveal>

          <Reveal delay={80}>
            <ThemeGallery surface="ink" />
          </Reveal>

          <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-paper-2/45">
            Game names shown here are our own. Official Texas Lottery artwork only
            appears once your account has licensing approved.
          </p>
        </div>
      </section>

      {/* ---------------- Scan ---------------- */}
      <section id="inventory" className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="At the register"
              title="One scan. One second. Sale recorded."
              description="Any USB or Bluetooth wedge scanner types the barcode and hits Enter. ScratchCrest confirms the sale, writes the commission, drops the count on the TV, and refuses to sell the same ticket twice."
            />
          </Reveal>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <PhotoFrame
                file="scan-vivid.png"
                alt="Barcode scanner and tablet confirming a ticket sale"
                tilt="-rotate-[0.6deg]"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={80} className="h-full">
              <ProductShowcase />
            </Reveal>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Locked rows", "A second scan of the same ticket is rejected at the database, not just in the UI.", "bg-flag"],
              ["Commission at sale time", "The rate is stored on the sale, so a later plan change never rewrites history.", "bg-foil"],
              ["Resilient to bad Wi-Fi", "Scans queue and confirm — a flaky store connection doesn't lose a sale.", "bg-money"],
            ].map(([title, body, rule], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="sheet h-full rounded-lg p-5">
                  <span className={`block h-0.5 w-8 ${rule}`} aria-hidden />
                  <dt className="wonk mt-3 font-display text-[17px] font-semibold text-ink">
                    {title}
                  </dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                    {body}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <HowItWorks />

      <CompareSection />

      {/* ---------------- Calculator ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Run the numbers"
              title="What is a busier ticket wall actually worth to you?"
              description="Your commission is 5% of scratch sales. Move the sliders to see what a lift on that number looks like next to the price of the software."
              align="center"
              className="mb-14"
            />
          </Reveal>
          <Reveal delay={80}>
            <ProfitCalculator />
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* ---------------- Gallery ---------------- */}
      <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="In the store"
              title="The screen does the talking. You keep the ledger."
              align="center"
              className="mb-14"
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            <Reveal>
              <PhotoFrame
                file="display-vivid.png"
                alt="Digital signage screens beside a store checkout"
                caption="Display — bilingual, license-safe"
                tilt="-rotate-[1.2deg]"
              />
            </Reveal>
            <Reveal delay={80}>
              <PhotoFrame
                file="hero-vivid.png"
                alt="Wall-mounted digital lottery board above a store counter"
                caption="Counter — the board customers point at"
                tilt="rotate-[0.8deg]"
              />
            </Reveal>
            <Reveal delay={160}>
              <PhotoFrame
                file="dashboard-vivid.png"
                alt="Back-office monitor showing inventory and commission analytics"
                caption="Office — owners see the business"
                tilt="-rotate-[0.5deg]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
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

      <MarketingCta />
    </>
  );
}
