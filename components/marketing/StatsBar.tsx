/**
 * Proof strip under the problem section.
 * Do not publish unverified lift or speed figures here.
 */
const STATS = [
  {
    display: "Live",
    label: "Inventory visibility",
    note: "ticket-level counts",
    tone: "text-flag",
  },
  {
    display: "Instant",
    label: "Board updates",
    note: "as soon as you sell",
    tone: "text-ink",
  },
  {
    display: "Full",
    label: "Sales tracking",
    note: "every pack, every shift",
    tone: "text-flag",
  },
  {
    display: "$0",
    label: "Hardware kit",
    note: "use the TV you own",
    tone: "text-ink",
  },
];

export function StatsBar() {
  return (
    <section className="dots border-b border-rule bg-paper-2">
      <div className="mx-auto max-w-marketing px-6 py-12">
        <p className="mb-8 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
          The numbers that matter at the counter
        </p>
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-2 sm:px-6 ${
                i % 2 !== 0 ? "border-l border-dashed border-rule-strong" : ""
              } ${i > 0 ? "lg:border-l lg:border-dashed lg:border-rule-strong" : ""}`}
            >
              <p
                className={`font-mono text-[clamp(2rem,3.4vw,3rem)] font-bold leading-none tracking-[-0.03em] ${stat.tone}`}
              >
                {stat.display}
              </p>
              <p className="mt-3 text-[14px] font-semibold leading-snug text-ink">
                {stat.label}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
