import { Reveal } from "@/components/marketing/Reveal";

const STEPS = [
  {
    index: "01",
    title: "Pick a plan",
    body: "Lite through Premium, paid on Stripe Checkout. Card details never touch our servers.",
    disc: "bg-flag text-white",
  },
  {
    index: "02",
    title: "Set your password",
    body: "A one-time secure link lands in your inbox. Nothing is ever emailed in plaintext.",
    disc: "bg-foil text-ink",
  },
  {
    index: "03",
    title: "Receive a pack",
    body: "Activate once. Every ticket barcode is generated for you and counts stay live as they sell.",
    disc: "bg-money text-white",
  },
  {
    index: "04",
    title: "Scan and go live",
    body: "Your scanner sells the ticket. Open the display URL on any TV and the board comes up.",
    disc: "bg-navy text-white",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-marketing px-6">
        <Reveal>
          <p className="flex items-center gap-3">
            <span className="h-0.5 w-6 bg-flag" aria-hidden />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
              Signup to first scan
            </span>
          </p>
          <h2 className="wonk mt-4 max-w-2xl font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
            Live before the afternoon rush. Nothing gets mailed to you.
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* The connector, not four boxes in a row. It draws itself left to
              right behind the discs; the discs sit on the paper colour so the
              rule appears to pass through them. */}
          <Reveal
            variant="mask"
            className="absolute left-0 right-0 top-6 hidden lg:block"
          >
            <div
              className="h-px bg-[repeating-linear-gradient(to_right,var(--color-rule-strong)_0_6px,transparent_6px_12px)]"
              aria-hidden
            />
          </Reveal>

          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.index} className="lg:pr-6">
                <Reveal delay={i * 90}>
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full ring-4 ring-paper ${step.disc}`}
                  >
                    <span className="font-mono text-[13px] font-bold tabular-nums">
                      {step.index}
                    </span>
                  </span>
                  <h3 className="wonk mt-5 font-display text-[20px] font-semibold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
