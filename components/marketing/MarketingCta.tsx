import { Button } from "@/components/marketing/Button";
import { TicketWall } from "@/components/marketing/TicketWall";

/**
 * The closing ink block. One of two deliberate dark surfaces on the site (this
 * and the footer) — they bookend the paper and let the board sit inside a
 * matched value instead of glaring off the stock.
 */
export function MarketingCta({
  eyebrow = "Now launching in Texas",
  title = "Put a smarter scratch ticket experience on your wall.",
  description = "Give your customers a clearer view of what is available — and give your team better information to work with. Start with ScratchCrest and build a more organized, more visible lottery counter.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="hatch relative overflow-hidden bg-ink-deep px-6 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-flag/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-foil/15 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-marketing">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="flex items-center gap-3">
              <span className="h-0.5 w-6 bg-flag" aria-hidden />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
                {eyebrow}
              </span>
            </p>
            <h2 className="wonk mt-4 font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              {description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup">Book a demo</Button>
              <Button href="#display" variant="inverse">
                See ScratchCrest in action
              </Button>
            </div>
            <p className="mt-6 text-[13px] text-ink-faint">
              Cancel anytime · Refer a store and you both get{" "}
              <span className="font-mono tabular-nums text-flag">$50</span>
            </p>
          </div>

          <TicketWall count={9} />
        </div>
      </div>
    </section>
  );
}
