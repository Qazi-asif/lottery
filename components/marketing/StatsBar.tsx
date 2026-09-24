import { CountUp } from "@/components/marketing/CountUp";

/**
 * PLACEHOLDER FIGURES — replace with verified numbers before launch.
 * See "Still off-limits" in instructions/06_DESIGN_SYSTEM.md.
 *
 * These are the only figures on the site that animate. They are marketing
 * claims, not readings: nothing here comes off a pack, a shift, or the board.
 */
type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
  tone: string;
  static?: boolean;
};

const STATS: Stat[] = [
  {
    value: 30,
    suffix: "%",
    label: "Average scratch sales lift",
    note: "reported by pilot stores",
    tone: "text-flag",
  },
  {
    value: 1.2,
    decimals: 1,
    suffix: "s",
    label: "Scan to recorded sale",
    note: "median, single scan",
    tone: "text-ink",
  },
  {
    value: 100,
    suffix: "%",
    label: "Of your commission tracked",
    note: "every pack, every shift",
    tone: "text-money",
  },
  {
    // Nothing to count toward, so it renders flat.
    value: 0,
    prefix: "$",
    label: "Hardware you have to buy",
    note: "use the TV you own",
    tone: "text-ink",
    static: true,
  },
];

export function StatsBar() {
  return (
    <section className="dots border-b border-rule bg-paper-2">
      <div className="mx-auto max-w-marketing px-6 py-12">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-2 sm:px-6 ${
                i % 2 !== 0 ? "border-l border-dashed border-rule-strong" : ""
              } ${i > 0 ? "lg:border-l lg:border-dashed lg:border-rule-strong" : ""}`}
            >
              <p
                className={`font-mono text-[clamp(2rem,3.4vw,3rem)] font-bold leading-none tracking-[-0.03em] tabular-nums ${stat.tone}`}
              >
                {stat.static ? (
                  <>
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </>
                ) : (
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix ?? ""}
                    suffix={stat.suffix ?? ""}
                  />
                )}
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
