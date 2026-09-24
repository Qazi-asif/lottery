/**
 * Ticker crawl — the lottery news band under the hero.
 *
 * The track is rendered twice and translated by exactly -50%, so the seam lands
 * where the second copy begins and the loop is invisible. The duplicate is
 * hidden from assistive tech; a screen reader hears the list once.
 */
export function Marquee({
  items,
  className = "",
  tone = "flag",
}: {
  items: string[];
  className?: string;
  tone?: "ink" | "flag";
}) {
  const fade = tone === "flag" ? "from-flag" : "from-ink";

  return (
    <div
      className={`group relative flex overflow-hidden ${
        tone === "flag" ? "bg-flag" : "bg-ink"
      } ${className}`}
    >
      <div className="motion-marquee flex w-max shrink-0 items-center">
        <Track items={items} />
        <Track items={items} aria-hidden />
      </div>

      {/* Feathered ends so items enter and leave instead of being chopped. */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r ${fade} to-transparent`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l ${fade} to-transparent`}
        aria-hidden
      />
    </div>
  );
}

function Track({
  items,
  ...rest
}: {
  items: string[];
} & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="flex shrink-0 items-center" {...rest}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.18em] tabular-nums text-white">
            {item}
          </span>
          <span
            className="mx-6 h-1.5 w-1.5 rotate-45 bg-foil-light"
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );
}
