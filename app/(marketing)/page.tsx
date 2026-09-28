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
    title: "Track what is available",
    description:
      "Keep ticket information organized and easy to review — live counts at every location, no clipboards at close.",
    tone: "inventory",
    hue: "crimson",
    tilt: "-rotate-[0.7deg]",
  },
  {
    index: "02",
    title: "See what is moving",
    description:
      "Identify sales activity without digging through scattered records. Every sale is logged the moment it happens.",
    tone: "inventory",
    hue: "crimson",
    invert: true,
    tilt: "rotate-[0.5deg]",
  },
  {
    index: "03",
    title: "Keep displays current",
    description:
      "Put relevant ticket information in front of customers. Prices, hot games, and what's nearly gone update as you sell.",
    tone: "display",
    hue: "crimson",
    tilt: "-rotate-[0.3deg]",
  },
  {
    index: "04",
    title: "Reduce manual work",
    description:
      "Spend less time maintaining paper lists and manual updates. Open and close a shift in seconds.",
    tone: "operations",
    hue: "crimson",
    invert: true,
    tilt: "rotate-[0.6deg]",
  },
  {
    index: "05",
    title: "Compare store activity",
    description:
      "Understand performance across products or locations. One account, many stores, side-by-side reports.",
    tone: "operations",
    hue: "crimson",
    tilt: "-rotate-[0.5deg]",
  },
  {
    index: "06",
    title: "Act on better information",
    description:
      "Turn everyday sales data into practical next steps — low stock, what's selling, and when to reorder.",
    tone: "operations",
    hue: "crimson",
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
    question: "What is ScratchCrest?",
    answer:
      "ScratchCrest is software for Texas lottery retailers. It gives you a live scratch-ticket board on any TV, a touch-screen smart POS at the counter, and inventory, sales, and commission in one login. We do not sell hardware kits, computers, or Fire Sticks.",
  },
  {
    question: "How does ScratchCrest work?",
    answer:
      "You receive a pack in the dashboard, activate it, and every ticket is tracked. Cashiers sell from a touch grid: tap a game, set quantity, confirm. The sale is recorded, stock drops, and the TV board updates. Owners and managers see reports. Cashiers only see Sell.",
  },
  {
    question: "Is this just a TV screen?",
    answer:
      "No. A display can show information. ScratchCrest also runs the counter: ticket-level inventory, a smart POS, commission locked in at sale time, shifts, alerts, and roles. The wall and the register stay in sync.",
  },
  {
    question: "Do cashiers scan barcodes?",
    answer:
      "No. ScratchCrest is a touch-display smart POS, not a scan-to-sell system. The cashier taps a live game, chooses how many tickets, and confirms. The same ticket still cannot sell twice.",
  },
  {
    question: "Do I need special hardware?",
    answer:
      "No. Use any TV that can open a web page for the in-store board, and a touch screen or tablet for the POS. We don't sell refurbished PCs, Fire Stick kits, or anything to ship. Hosting and updates are included in the plan.",
  },
  {
    question: "How do I put the board on my TV?",
    answer:
      "Each store gets a display URL. Open it in the TV's browser (or any device plugged into HDMI). Pick a mode, English and/or Spanish, and landscape or portrait. Counts update as you sell. No special media player is required.",
  },
  {
    question: "Will the TV show official lottery artwork?",
    answer:
      "Not by default. The board runs in generic, plain-text mode until your account has artwork licensing approved. That is a legal requirement. Game names on the marketing preview are samples, not official titles.",
  },
  {
    question: "How do packs and inventory work?",
    answer:
      "A pack is one book of tickets for one game at one store. Receive it when it arrives, then activate it. Activation puts the game on the Sell grid and on the TV. Remaining counts are live. You can transfer a pack to another store when a game runs hot.",
  },
  {
    question: "Can the same ticket sell twice?",
    answer:
      "No. Inventory is ticket-level. Once a ticket is sold, it is locked. A second sale of that ticket is rejected in the database, not only on the screen.",
  },
  {
    question: "What does a cashier actually do?",
    answer:
      "They open Sell, tap a game, set quantity (it starts at zero until they pick one), and confirm. They do not see billing, team, or owner reports.",
  },
  {
    question: "Can my cashiers see my numbers?",
    answer:
      "No. Cashiers only get the Sell screen. Location managers see inventory and reports for the stores you assign them. Only you as owner see billing, the team, and every location.",
  },
  {
    question: "Can I manage more than one store?",
    answer:
      "Yes. One account covers all of them. Each location gets its own display, inventory, and reports. You can compare stores side by side. Multi-location is a plan feature, not a per-store surcharge — Smart and Premium include it.",
  },
  {
    question: "What shows up in sales and reports?",
    answer:
      "Every sale logs when it happened, the game, pack, store, tickets, price, commission, and who sold it. You can filter by store and date. Commission is stored at sale time, so a later plan change never rewrites history. Shifts let you open and close the drawer against those sales.",
  },
  {
    question: "What about winning tickets I cash for a customer?",
    answer:
      "That is a prize payout, not a sale. ScratchCrest records payouts separately so you do not mix cashing a winner with selling a ticket. Cashing bonus is stored on the payout.",
  },
  {
    question: "How do I get started?",
    answer:
      "Pick a plan, pay on Stripe Checkout (we never see your card number), then set your password from a one-time link in email. Add a location, receive a pack, activate it, and open Sell. There is no install visit.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No. It is month-to-month. Cancel any time from the Stripe customer portal and you keep access through the end of the paid period. Annual billing is available if you would rather pay less per month.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, from the Stripe portal. Proration is handled there. Features follow flags on the plan — what a tier includes can change in billing without a sales call.",
  },
  {
    question: "How does the $50 referral work?",
    answer:
      "Share your referral with another retailer. When they subscribe, credit posts to both accounts. You can track referrals from the dashboard.",
  },
  {
    question: "Do you guarantee 30% more sales?",
    answer:
      "No. We do not publish a sales-lift percentage until we have verified evidence. ScratchCrest is built to make the wall clearer and the counter faster. Results depend on your store, traffic, and game mix.",
  },
];

const HERO_METRICS = [
  { value: "Live", label: "Ticket board", fill: "bg-[#f11112] text-white" },
  { value: "Touch", label: "Smart POS", fill: "bg-black text-white ring-1 ring-[#f11112]" },
  { value: "$0", label: "Hardware kit", fill: "bg-[#f11112] text-white" },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,_rgba(241,17,18,0.32),_transparent_58%)]"
          aria-hidden
        />
        <FloatTickets />
        <div className="relative mx-auto max-w-marketing px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f11112] px-3 py-1.5 text-white">
                <span
                  className="motion-live h-1.5 w-1.5 rounded-full bg-white"
                  aria-hidden
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Now launching for Texas retailers
                </span>
              </span>

              <h1 className="wonk mt-6 font-display text-hero font-semibold leading-[0.98] tracking-[-0.025em] text-ink">
                Turn your scratch ticket wall into a{" "}
                <span className="relative inline-block whitespace-nowrap text-[#f11112]">
                  smarter sales tool.
                  <Underline className="absolute -bottom-1 left-0 h-[0.34em] w-full text-[#f11112]" />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ink-soft">
                ScratchCrest helps lottery retailers organize, promote, and monitor
                scratch ticket inventory from one clear digital workspace. Give
                customers better visibility, help staff make faster decisions, and
                keep your ticket wall working harder.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="#display">View the live board</Button>
                <Button
                  href="#how-it-works"
                  variant="secondary"
                  className="border-[#f11112] bg-black text-white hover:border-[#f11112] hover:bg-[#f11112] hover:text-white"
                >
                  See how it works
                </Button>
              </div>

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
              <TicketWall count={9} />
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Live preview — the board customers see on your TV
              </p>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={TICKER} className="py-3.5" />

      <ProofBar />

      {/* ---------------- Buyer wall / core problem ---------------- */}
      <section className="bg-bronze py-16 sm:py-20">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <SectionHeading
                tone="paper"
                eyebrow="The counter problem"
                title="A busy ticket wall should give you more than a busy counter."
                description="When dozens of scratch games compete for attention, it is easy to lose track of what is moving, what needs attention, and what customers are actually choosing. ScratchCrest turns that clutter into a clear, organized view so retailers can see the bigger picture at a glance."
              />
              <div className="mt-8">
                <Button href="#inventory">See your inventory clearly</Button>
              </div>
            </Reveal>

            <Reveal delay={90} variant="scale">
              <ScratchCard
                label="Scratch to reveal"
                tone="paper"
                className="mx-auto max-w-sm"
              >
                <div className="flex aspect-[5/3] flex-col justify-center bg-ink-deep px-7 py-6 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                    What the wall should tell you
                  </p>
                  <p className="mt-3 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-semibold leading-snug tracking-tight text-white">
                    What is on the wall. What is left. What to restock.
                  </p>
                  <p className="mt-4 border-t border-dashed border-white/15 pt-3 font-mono text-[11px] text-ink-soft">
                    Demo preview — not a sales-lift claim
                  </p>
                </div>
              </ScratchCard>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* ---------------- Six tasks ---------------- */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Everything in one account"
              title="Six tasks ScratchCrest makes easier."
              description="ScratchCrest is not just a screen. It is a smarter way to manage and present scratch ticket inventory."
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

          <div className="mt-12 flex justify-center">
            <Button href="/features">Explore features</Button>
          </div>
        </div>
      </section>

      {/* ---------------- Display modes ---------------- */}
      <section id="display" className="scroll-mt-24 bg-ink-deep py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              tone="paper"
              eyebrow="In-store display"
              title="One system. Multiple displays. One clear view."
              description="Run ScratchCrest on the TV you already own. Open a browser, pick a mode, language, and layout. Highlight available tickets and give customers a cleaner way to browse what is on offer. Official Texas Lottery artwork stays off until your account is licensed."
              className="mb-12"
            />
          </Reveal>

          <Reveal delay={80}>
            <ThemeGallery surface="ink" />
          </Reveal>

          <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-ink-faint">
            Game names shown here are our own. Any modern TV or display that can
            open a web page can run the board — no special media player required.
          </p>
        </div>
      </section>

      {/* ---------------- Smart POS ---------------- */}
      <section id="inventory" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="At the counter"
              title="From ticket selection to sale record — without the extra steps."
              description="Keep the customer journey simple. Tap a game on the smart POS, choose quantity, and confirm. ScratchCrest records the sale, drops the count, updates the TV, and blocks the same ticket from selling twice."
            />
          </Reveal>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <PhotoFrame
                file="scan-vivid.png"
                alt="Touch-screen smart POS at a store counter"
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
              ["Ticket selection", "Cashiers tap a live game on the touch grid instead of hunting through bins and paper lists.", "bg-[#f11112]"],
              ["Sale recorded", "Commission is locked in at sale time, so a later plan change never rewrites history.", "bg-[#f11112]"],
              ["Board stays current", "The customer-facing TV follows the POS — prices, stock, and almost-gone games update themselves.", "bg-[#f11112]"],
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

          <div className="mt-10">
            <Button href="#how-it-works">See the workflow</Button>
          </div>
        </div>
      </section>

      <HowItWorks />

      <CompareSection />

      {/* ---------------- Store insight ---------------- */}
      <section id="reporting" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Store insight"
              title="Turn daily ticket activity into useful store insight."
              description="See the information behind your scratch ticket sales in a format that is easy to understand. The estimator below is labeled demo data — move the sliders to model commission next to plan cost. It is not a published sales-lift claim."
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
              eyebrow="See it in the store"
              title="See ScratchCrest in action."
              description="Explore the different ways ScratchCrest can support the modern lottery counter — from customer-facing displays to store-level monitoring and performance views."
              align="center"
              className="mb-14"
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            <Reveal>
              <PhotoFrame
                file="display-vivid.png"
                alt="Customer-facing digital ticket board in a store"
                caption="Customer display"
                tilt="-rotate-[1.2deg]"
              />
            </Reveal>
            <Reveal delay={80}>
              <PhotoFrame
                file="dashboard-vivid.png"
                alt="Store dashboard showing inventory and performance"
                caption="Store dashboard"
                tilt="rotate-[0.8deg]"
              />
            </Reveal>
            <Reveal delay={160}>
              <PhotoFrame
                file="hero-vivid.png"
                alt="Sales and inventory view at the lottery counter"
                caption="Sales & inventory view"
                tilt="-rotate-[0.5deg]"
              />
            </Reveal>
          </div>

          <div className="mt-12 flex justify-center">
            <Button href="/features">Explore the platform</Button>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="Questions? Start here."
                description="A full Q&A on the product as it works today — touch POS, live board, inventory, roles, and billing."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/signup">Get a demo</Button>
                <Button href="/signup" variant="secondary">
                  Contact ScratchCrest
                </Button>
              </div>
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
