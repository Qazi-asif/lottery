import { Button } from "@/components/marketing/Button";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const pillars = [
  {
    index: "01",
    title: "Inventory you can trust",
    description:
      "Receive packs, activate once, and every ticket barcode is generated for you. Real-time counts at every location — no clipboards, no guesswork at close.",
  },
  {
    index: "02",
    title: "Sales that settle themselves",
    description:
      "Each scan writes a sale with commission stored at that moment. Month-end reports match the register, because the numbers were never reconstructed later.",
  },
  {
    index: "03",
    title: "A counter that looks the part",
    description:
      "Replace plastic dispensers with a calm digital display of games and prices. The same professional standard you already hold for the rest of the store.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <MarketingPhoto
            file="store-counter.png"
            alt="A quiet, premium store counter with a register and barcode scanner"
            priority
            className="opacity-70"
          />
          <div className="absolute inset-0 bg-ink/55" />
        </div>
        <div className="relative mx-auto grid max-w-marketing items-end gap-12 px-6 pb-16 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-36">
          <div>
            <p className="text-small font-medium uppercase tracking-[0.22em] text-gold">
              Texas lottery retail, elevated
            </p>
            <h1 className="mt-6 font-serif text-h1 font-semibold leading-tight text-bg">
              Run your scratch counter like a private firm — not a plastic bin.
            </h1>
            <p className="mt-6 max-w-lg text-body leading-relaxed text-white/75">
              ScratchCrest is the subscription platform for convenience stores and
              gas stations: inventory, scan-to-sell, commission, and in-store
              display — one tenant account, as many locations as you operate.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/signup" variant="inverse">
                Start a subscription
              </Button>
              <Button href="/features" variant="ghost">
                See the platform
              </Button>
            </div>
          </div>
          <div className="border border-white/15">
            <ProductShowcase />
          </div>
        </div>
        <div className="relative border-t border-white/15 bg-ink/80">
          <div className="mx-auto grid max-w-marketing grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
            {[
              ["Scan-to-sell", "USB scanner ready"],
              ["Multi-location", "One account"],
              ["Commission", "Stored at sale"],
              ["Display", "Plain-text by default"],
            ].map(([label, detail]) => (
              <div key={label}>
                <p className="font-serif text-body text-bg">{label}</p>
                <p className="mt-1 text-small text-white/45">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="overflow-hidden rounded-lg border border-border">
              <MarketingPhoto
                file="scan-register.png"
                alt="Cashier scanning at a modern register"
                className="aspect-[4/3]"
              />
            </div>
            <SectionHeading
              eyebrow="At the register"
              title="A scanner you already own. A ledger that finally keeps up."
              description="USB and Bluetooth wedges type the barcode and press Enter. ScratchCrest confirms the sale, writes commission, and blocks a second scan of the same ticket."
            />
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <SectionHeading
            eyebrow="Platform"
            title="Three systems. One crest."
            description="Built for operators who take inventory, people, and presentation seriously."
            align="center"
            className="mb-16"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <FeatureCard key={pillar.index} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              eyebrow="In-store"
              title="The wall does the selling. You keep the numbers."
              description="A public display page for the TV above the counter. Generic, plain-text presentation by default — no official artwork unless licensing is approved."
            />
            <div className="overflow-hidden rounded-lg border border-border">
              <MarketingPhoto
                file="instore-display.png"
                alt="In-store television showing a plain-text games and prices board"
                className="aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-white/10">
              <MarketingPhoto
                file="laptop-dashboard.png"
                alt="ScratchCrest dashboard open on a laptop at the back office"
                className="aspect-video"
              />
            </div>
            <SectionHeading
              eyebrow="Back office"
              title="Owners see the business. Cashiers see the scan."
              description="Role-based access from the same account. Scale from one store to a chain without changing platforms."
              tone="dark"
            />
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["Tenant owner", "Billing, locations, team, every report"],
              ["Location manager", "Inventory and commission for assigned stores"],
              ["Cashier", "Scan-to-sell screen — nothing more"],
            ].map(([role, copy]) => (
              <div
                key={role}
                className="rounded-lg border border-white/10 px-6 py-8"
              >
                <p className="font-serif text-h3 text-bg">{role}</p>
                <p className="mt-3 text-body text-white/55">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-marketing px-6">
          <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-h-[280px]">
              <MarketingPhoto
                file="geometric-panel.png"
                alt=""
                className="min-h-[280px]"
              />
            </div>
            <div className="bg-bg-secondary px-8 py-16 lg:px-14 lg:py-20">
              <p className="text-small uppercase tracking-[0.2em] text-gold">
                Next step
              </p>
              <h2 className="mt-4 font-serif text-h2 font-semibold text-ink">
                Put a quieter, more precise counter in place.
              </h2>
              <p className="mt-5 max-w-xl text-body leading-relaxed text-ink-soft">
                Choose a plan. Pay through Stripe. Set a password from a one-time
                link. The scanner you already own is enough.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/pricing">See plans</Button>
                <Button href="/signup" variant="secondary">
                  Get started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
