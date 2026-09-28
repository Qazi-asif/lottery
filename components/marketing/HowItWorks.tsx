import { Reveal } from "@/components/marketing/Reveal";

const STEPS = [
  {
    index: "01",
    title: "Update",
    body: "Receive a pack, activate it, and ticket counts go live on the POS and the TV.",
    disc: "bg-flag text-white",
  },
  {
    index: "02",
    title: "Review",
    body: "See what is on the wall, what is left, and what needs attention before the rush.",
    disc: "bg-flag text-white",
  },
  {
    index: "03",
    title: "Act",
    body: "Tap a game on the smart POS, set quantity, and confirm. The sale is recorded immediately.",
    disc: "bg-flag text-white",
  },
  {
    index: "04",
    title: "Record",
    body: "Commission, stock, and the customer board stay in sync — ready for the next customer.",
    disc: "bg-flag text-white",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-marketing px-6">
        <Reveal>
          <p className="flex items-center gap-3">
            <span className="h-0.5 w-6 bg-flag" aria-hidden />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
              Live activity
            </span>
          </p>
          <h2 className="wonk mt-4 max-w-2xl font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
            Know what is happening before the rush starts.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
            ScratchCrest brings important ticket activity into one live view,
            helping your team stay aware of changes throughout the day. Check the
            board, spot what needs attention, and keep the store ready for the
            next customer.
          </p>
        </Reveal>

        <div className="relative mt-14">
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
