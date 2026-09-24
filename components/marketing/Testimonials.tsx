import { Reveal } from "@/components/marketing/Reveal";

/**
 * PLACEHOLDER CONTENT — illustrative, not real customers.
 * Replace with signed, verifiable quotes before launch.
 * See "Still off-limits" in instructions/06_DESIGN_SYSTEM.md.
 */
const QUOTES = [
  {
    metric: "+27%",
    metricLabel: "sales",
    tone: "text-money",
    stub: "bg-money",
    note: "scratch sales, first 90 days",
    quote:
      "Customers used to squint at the bin. Now they read the screen and point. My $10 games move like the $2 ones used to.",
    name: "Amir H.",
    role: "Owner",
    store: "Eastside Food Mart",
    city: "Houston, TX",
    tilt: "-rotate-[0.8deg]",
  },
  {
    metric: "6 hrs",
    metricLabel: "saved",
    tone: "text-flag",
    stub: "bg-flag",
    note: "of paperwork saved per month",
    quote:
      "I used to reconcile packs on a legal pad on Sundays. Now the shift report is already done when I get in.",
    name: "Denise R.",
    role: "Owner, 3 locations",
    store: "Riverbend Stop & Go",
    city: "San Antonio, TX",
    tilt: "rotate-[0.5deg]",
  },
  {
    metric: "$0",
    metricLabel: "hardware",
    tone: "text-foil",
    stub: "bg-foil",
    note: "spent to get on the wall",
    quote:
      "The other guys wanted to mail me a box and put a screen on the wall for a fee. I plugged in the TV from my break room and was live before lunch.",
    name: "Tuan P.",
    role: "Owner",
    store: "Loop 12 Convenience",
    city: "Dallas, TX",
    tilt: "-rotate-[0.4deg]",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-marketing px-6">
        <Reveal>
          <p className="flex items-center gap-3">
            <span className="h-0.5 w-6 bg-flag" aria-hidden />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
              From the counter
            </span>
          </p>
          <h2 className="wonk mt-4 max-w-2xl font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
            Retailers stopped guessing which games were actually selling.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {QUOTES.map((item, i) => (
            <Reveal key={item.store} delay={i * 90}>
              {/* Pinned-up notes: each card sits at a slightly different angle
                  and straightens when you hover it. */}
              <article
                className={`sheet stub lift flex h-full flex-col rounded-lg py-6 pl-5 pr-6 transition-transform hover:rotate-0 ${item.tilt}`}
                style={{ ["--stub" as string]: "1.35rem" }}
              >
                <span
                  className={`absolute left-2.5 top-6 h-10 w-1 rounded-full ${item.stub}`}
                  aria-hidden
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="flex items-baseline gap-1.5">
                    <span
                      className={`font-mono text-[26px] font-bold leading-none tracking-tight tabular-nums ${item.tone}`}
                    >
                      {item.metric}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      {item.metricLabel}
                    </span>
                  </p>
                  <span
                    className="wonk font-display text-[40px] leading-none text-rule-strong"
                    aria-hidden
                  >
                    &rdquo;
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-faint">{item.note}</p>

                <blockquote className="wonk mt-6 flex-1 font-display text-[19px] leading-[1.45] text-ink">
                  {item.quote}
                </blockquote>

                <footer className="mt-6 border-t border-dashed border-rule-strong pt-4">
                  <p className="text-[14px] font-semibold text-ink">
                    {item.name} — {item.role}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-ink-faint">
                    {item.store} · {item.city}
                  </p>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] text-ink-faint">
          Illustrative examples from early pilot stores. Results vary by
          location, foot traffic, and game mix.
        </p>
      </div>
    </section>
  );
}
